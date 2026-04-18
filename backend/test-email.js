import 'dotenv/config';
import { sendEmail } from './utils/email.js';

console.log("Testing SMTP send...");
console.log("SMTP_USER:", process.env.SMTP_USER);

async function test() {
  const res = await sendEmail(
    process.env.SMTP_USER || 'imamkhan7282@gmail.com', 
    'Test from AI', 
    'This is a test email to verify SMTP configuration.'
  );
  console.log("Result:", res);
}

test();
