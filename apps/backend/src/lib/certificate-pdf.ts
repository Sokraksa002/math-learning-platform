import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

interface CertificatePdfInput {
  studentName: string;
  course: string;
  issuedAt: Date;
  certificateCode: string;
}

export function generateCertificatePdf(data: CertificatePdfInput): string {
  const outputDir = path.join(process.cwd(), 'certificates');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const fileName = `certificate-${data.certificateCode}.pdf`;
  const filePath = path.join(outputDir, fileName);

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.pipe(fs.createWriteStream(filePath));

  // Title
  doc.fontSize(28).text('Certificate of Completion', {
    align: 'center',
  });

  doc.moveDown(2);

  // Student name
  doc.fontSize(20).text(data.studentName, {
    align: 'center',
  });

  doc.moveDown();

  doc.fontSize(14).text('has successfully completed the course', { align: 'center' });

  doc.moveDown();

  // Course
  doc.fontSize(18).text(data.course, {
    align: 'center',
  });

  doc.moveDown(2);

  // Date
  doc.fontSize(12).text(`Issued on: ${data.issuedAt.toDateString()}`, { align: 'center' });

  doc.moveDown(2);

  // Certificate code
  doc.fontSize(10).text(`Certificate Code: ${data.certificateCode}`, { align: 'center' });

  doc.end();

  // This is saved in the DB
  return `/certificates/${fileName}`;
}
