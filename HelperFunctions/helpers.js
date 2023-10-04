import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmailTo = async (userEmail, reset_code) => {
  const info = await transporter.sendMail({
    from: `"Chat app" <${process.env.EMAIL_NAME}>`,
    to: userEmail,
    subject: "Chat app password reset confirmation code",
    text: "Password reset confirmation code",
    html: `<H2>Code: </H2>
            <p>${reset_code}</p>`,
  });
  return info;
};

export { sendEmailTo };
