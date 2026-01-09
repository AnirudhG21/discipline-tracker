const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendTaskEmail = async ({ to, taskName, confirmUrl }) => {
  await transporter.sendMail({
    from: `"Discipline Tracker" <${process.env.SMTP_USER}>`,
    to,
    subject: `Did you complete "${taskName}" today?`,
    html: `
      <h3>${taskName}</h3>
      <p>Did you complete this task today?</p>
      <a href="${confirmUrl}"
         style="padding:10px 15px;background:#22c55e;color:white;text-decoration:none;border-radius:5px;">
         ✅ YES, I DID IT
      </a>
    `,
  });
};
