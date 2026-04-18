import nodemailer from 'nodemailer';

let transporter;

async function initTransporter() {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Generate a test ethereal account if no SMTP provided
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`\n📧 Ethereal Test Email account created: ${testAccount.user}\n`);
  }
}

initTransporter();

export const sendEmail = async (to, subject, text) => {
  if (!transporter) {
    await initTransporter();
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || '"ReviseIt" <noreply@reviseit.com>',
      to,
      subject,
      text,
    });
    
    console.log(`Email sent to ${to}`);
    if (!process.env.SMTP_USER) {
      const url = nodemailer.getTestMessageUrl(info);
      console.log(`\n==============================================`);
      console.log(`🔗 PREVIEW EMAIL URL: ${url}`);
      console.log(`==============================================\n`);
      return { success: true, previewUrl: url };
    }
    return { success: true };
  } catch (err) {
    console.error('Error sending email:', err);
    return { success: false, error: err };
  }
};
