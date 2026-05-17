declare module "pdfkit" {
  class PDFDocument {
    constructor(options?: any);
    pipe(stream: any): void;
    fontSize(size: number): this;
    text(content: string, options?: any): this;
    moveDown(lines?: number): this;
    end(): void;
  }

  export = PDFDocument;
}
``