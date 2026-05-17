import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendCertificateEmail(
  to: string,
  studentName: string,
  pdfUrl: string
) {
  const pdfPath = path.join(process.cwd(), pdfUrl);

  if (!fs.existsSync(pdfPath)) {
    throw new Error("Certificate PDF not found");
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "🎓 Your Certificate of Completion",
    html: `
      <p>Hello <strong>${studentName}</strong>,</p>
      <p>Congratulations on completing your course!</p>
      <p>Your certificate is attached to this email.</p>
      <p>Best regards,<br/>Math Learning Platform</p>
    `,
    attachments: [
      {
        filename: "certificate.pdf",
        path: pdfPath,
      },
    ],
  });
}