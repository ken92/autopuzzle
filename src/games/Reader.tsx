import { Box, Grid, Typography } from '@mui/material';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { GameProps } from '../lib/types';
import Timer from '../lib/Timer';
import type { ReaderDocument } from '../lib/readerTypes';

interface ReaderProps extends GameProps {
  readerDocument: ReaderDocument | null;
  readerScrollPixelsPerSecond: number;
  readerScrollPosition: number;
  onReaderScrollPositionChange: (position: number, source?: string) => void;
  setReaderPositionGetter: (getter: (() => number) | null) => void;
}

const AUTO_SCROLL_TICK_MS = 100;

function Reader({
  secondsLeft,
  readerDocument,
  readerScrollPixelsPerSecond,
  readerScrollPosition,
  onReaderScrollPositionChange,
  setReaderPositionGetter,
}: ReaderProps) {
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const pdfFrameRef = useRef<HTMLIFrameElement | null>(null);
  const onReaderScrollPositionChangeRef = useRef<(position: number, source?: string) => void>(() => {});
  const restoreTargetRef = useRef<number>(0);
  const isRestoringTextRef = useRef<boolean>(false);
  const textRestoreAppliedRef = useRef<boolean>(false);
  const [pdfWindowAccessible, setPdfWindowAccessible] = useState(true);

  useEffect(() => {
    onReaderScrollPositionChangeRef.current = onReaderScrollPositionChange;
  }, [onReaderScrollPositionChange]);

  useEffect(() => {
    setPdfWindowAccessible(true);
    textRestoreAppliedRef.current = false;
  }, [readerDocument]);

  useLayoutEffect(() => {
    if (!readerDocument || readerDocument.kind !== 'text') return;
    if (textRestoreAppliedRef.current) return;
    const container = textContainerRef.current;
    if (!container) return;
    textRestoreAppliedRef.current = true;

    let rafId = 0;
    let attempts = 0;
    const maxAttempts = 60;
    const target = readerScrollPosition;

    const applyRestore = () => {
      attempts += 1;
      const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
      const clampedTarget = Math.min(target, maxScroll);
      container.scrollTop = clampedTarget;
      onReaderScrollPositionChangeRef.current(clampedTarget, 'restore_apply_text');

      if (Math.abs(container.scrollTop - clampedTarget) > 1 && attempts < maxAttempts) {
        rafId = window.requestAnimationFrame(applyRestore);
      }
    };

    rafId = window.requestAnimationFrame(applyRestore);
    return () => window.cancelAnimationFrame(rafId);
  }, [readerDocument, readerScrollPosition]);

  useEffect(() => {
    const getCurrentPosition = () => {
      if (!readerDocument) return 0;
      if (readerDocument.kind === 'text') {
        return textContainerRef.current?.scrollTop || 0;
      }
      if (!pdfWindowAccessible) {
        return readerScrollPosition;
      }
      const frameWindow = pdfFrameRef.current?.contentWindow;
      if (!frameWindow) return readerScrollPosition;
      try {
        return frameWindow.scrollY;
      } catch {
        return readerScrollPosition;
      }
    };

    setReaderPositionGetter(getCurrentPosition);
    return () => setReaderPositionGetter(null);
  }, [pdfWindowAccessible, readerDocument, readerScrollPosition, setReaderPositionGetter]);

  useEffect(() => {
    if (!readerDocument) return;

    const textContainer = textContainerRef.current;
    const pdfFrame = pdfFrameRef.current;
    const scrollIncrement = (readerScrollPixelsPerSecond * AUTO_SCROLL_TICK_MS) / 1000;
    const intervalId = window.setInterval(() => {
      if (readerDocument.kind === 'text') {
        if (!textContainer) return;
        if (isRestoringTextRef.current) return;
        const maxScroll = textContainer.scrollHeight - textContainer.clientHeight;
        const nextScroll = Math.min(maxScroll, textContainer.scrollTop + scrollIncrement);
        if (nextScroll !== textContainer.scrollTop) {
          textContainer.scrollTop = nextScroll;
          onReaderScrollPositionChangeRef.current(nextScroll, 'auto_scroll_text');
        }
        return;
      }

      if (!pdfWindowAccessible) return;
      const frameWindow = pdfFrame?.contentWindow;
      if (!frameWindow) return;

      try {
        const doc = frameWindow.document;
        const maxScroll = Math.max(
          doc.documentElement.scrollHeight,
          doc.body?.scrollHeight || 0,
        ) - frameWindow.innerHeight;
        const nextScroll = Math.min(maxScroll, frameWindow.scrollY + scrollIncrement);
        if (nextScroll !== frameWindow.scrollY) {
          frameWindow.scrollTo({ top: nextScroll });
        }
        onReaderScrollPositionChangeRef.current(nextScroll, 'auto_scroll_pdf');
      } catch {
        setPdfWindowAccessible(false);
      }
    }, AUTO_SCROLL_TICK_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [pdfWindowAccessible, readerDocument, readerScrollPixelsPerSecond]);

  const handleTextScroll = () => {
    const position = textContainerRef.current?.scrollTop || 0;
    if (isRestoringTextRef.current && position < restoreTargetRef.current - 1) {
      return;
    }
    onReaderScrollPositionChangeRef.current(position, 'text_scroll');
  };

  const handlePdfLoad = () => {
    if (!pdfWindowAccessible) return;
    const frameWindow = pdfFrameRef.current?.contentWindow;
    if (!frameWindow) return;
    try {
      frameWindow.scrollTo({ top: readerScrollPosition });
      onReaderScrollPositionChangeRef.current(frameWindow.scrollY, 'pdf_load');
    } catch {
      setPdfWindowAccessible(false);
    }
  };

  if (!readerDocument) {
    return (
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid size={12} component="div">
          <Typography variant="h5">Reader mode selected, but no file is uploaded.</Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container direction="column" spacing={2}>
      <Grid size={12} component="div">
        <Typography variant="h6">{readerDocument.name}</Typography>
      </Grid>

      {readerDocument.kind === 'text' ? (
        <Grid size={12} component="div">
          <Box
            ref={textContainerRef}
            onScroll={handleTextScroll}
            sx={(theme) => ({
              maxHeight: '75vh',
              overflowY: 'auto',
              padding: 2,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
            })}
          >
            <Typography component="pre" sx={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {readerDocument.text}
            </Typography>
          </Box>
        </Grid>
      ) : (
        <Grid size={12} component="div">
          <Box
            sx={(theme) => ({
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              overflow: 'hidden',
              minHeight: '75vh',
              backgroundColor: theme.palette.background.paper,
            })}
          >
            <iframe
              ref={pdfFrameRef}
              src={readerDocument.url}
              title={readerDocument.name}
              style={{ width: '100%', height: '75vh', border: '0' }}
              onLoad={handlePdfLoad}
            />
          </Box>
          {!pdfWindowAccessible ? (
            <Typography variant="body2" sx={{ marginTop: 1 }}>
              Browser PDF sandbox blocked auto-scroll controls. Text files still auto-scroll and resume normally.
            </Typography>
          ) : null}
        </Grid>
      )}
      <Timer secondsLeft={secondsLeft} />
    </Grid>
  );
}

export default Reader;
