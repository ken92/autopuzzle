export interface ReaderTextDocument {
  kind: 'text';
  name: string;
  text: string;
}

export interface ReaderPdfDocument {
  kind: 'pdf';
  name: string;
  url: string;
}

export type ReaderDocument = ReaderTextDocument | ReaderPdfDocument;
