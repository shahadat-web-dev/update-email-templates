
const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("../config/logger");

const transport = nodemailer.createTransport(config.email.smtp);

if (config.env !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch(() => {
      logger.warn(
        "Unable to connect to email server. Check SMTP configuration."
      );
    });
}

const APP_URL = (
  process.env.APP_URL || "http://localhost:3000"
).replace(/\/+$/, "");

const BRAND_NAME = "NEXMO TAG";
const LOGO_URL =
  "https://raw.githubusercontent.com/shadat-hossan/Image-server/refs/heads/main/NEXMOTAG.jpeg";

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const emailLayout = ({ preheader, title, message, content, footer }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${escapeHtml(preheader)}
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f3f4f6;">
    <tr>
      <td align="center" style="padding:32px 12px;">

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;">

          <tr>
            <td align="center" style="padding:28px 24px 20px;border-bottom:1px solid #e5e7eb;">
              <img
                src="${LOGO_URL}"
                alt="${BRAND_NAME}"
                width="140"
                style="display:block;width:140px;max-width:100%;height:auto;border:0;"
              >
              <p style="margin:12px 0 0;font-size:12px;letter-spacing:2px;color:#64748b;font-weight:bold;">
                ${BRAND_NAME}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 24px;">
              <h1 style="margin:0 0 16px;font-size:25px;line-height:1.35;text-align:center;color:#111827;">
                ${title}
              </h1>

              <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:#4b5563;">
                ${message}
              </p>

              ${content}

              <p style="margin:28px 0 0;font-size:14px;line-height:1.7;color:#4b5563;">
                ${footer}
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:20px 24px;background-color:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 8px;font-size:12px;color:#6b7280;">
                Need help? Contact our support team.
              </p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                &copy; ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#9ca3af;">
                This is an automated email. Please do not reply directly.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const sendEmail = async (to, subject, html, text) => {
  const msg = {
    from: config.email.from,
    to,
    subject,
    html,
    ...(text ? { text } : {}),
  };

  await transport.sendMail(msg);
};

const sendEmailVerification = async (to, otp) => {
  const safeOtp = escapeHtml(otp);
  const subject = `${BRAND_NAME} - Verify Your Email`;

  const html = emailLayout({
    preheader: "Verify your email address to complete registration.",
    title: "Verify Your Email",
    message:
      "Welcome to NEXMO TAG! Thank you for creating an account. Use the verification code below to verify your email address.",
    content: `
      <div style="margin:0 0 20px;padding:24px 16px;text-align:center;background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;">
        <p style="margin:0 0 12px;font-size:12px;font-weight:bold;letter-spacing:2px;color:#1d4ed8;">
          YOUR VERIFICATION CODE
        </p>
        <p style="margin:0;font-size:32px;font-weight:bold;letter-spacing:8px;color:#1e3a8a;overflow-wrap:anywhere;">
          ${safeOtp}
        </p>
      </div>
      <p style="margin:0;font-size:13px;line-height:1.7;color:#dc2626;text-align:center;">
        This code expires in 3 minutes. Do not share it with anyone.
      </p>
    `,
    footer:
      "If you did not create an account with NEXMO TAG, you can safely ignore this email.",
  });

  const text = `Welcome to ${BRAND_NAME}!\nYour email verification code is: ${otp}\nThis code expires in 3 minutes. Do not share it with anyone.`;

  await sendEmail(to, subject, html, text);
};

const sendResetPasswordEmail = async (to, otp) => {
  const safeOtp = escapeHtml(otp);
  const subject = `${BRAND_NAME} - Password Reset Code`;

  const html = emailLayout({
    preheader: "Use your password reset code to secure your account.",
    title: "Reset Your Password",
    message:
      "We received a request to reset the password associated with your account. Use the code below to continue.",
    content: `
      <div style="margin:0 0 20px;padding:24px 16px;text-align:center;background-color:#fff7ed;border:1px solid #fed7aa;border-radius:8px;">
        <p style="margin:0 0 12px;font-size:12px;font-weight:bold;letter-spacing:2px;color:#c2410c;">
          YOUR RESET CODE
        </p>
        <p style="margin:0;font-size:32px;font-weight:bold;letter-spacing:8px;color:#9a3412;overflow-wrap:anywhere;">
          ${safeOtp}
        </p>
      </div>
      <p style="margin:0;font-size:13px;line-height:1.7;color:#b45309;text-align:center;">
        This code expires in 3 minutes. Never share your reset code with anyone.
      </p>
    `,
    footer:
      "If you did not request a password reset, ignore this email. Your password will not change unless the reset process is completed.",
  });

  const text = `Password reset requested for ${BRAND_NAME}.\nYour reset code is: ${otp}\nThis code expires in 3 minutes. Never share it with anyone.`;

  await sendEmail(to, subject, html, text);
};

const sendVerificationEmail = async (to, token) => {
  const subject = `${BRAND_NAME} - Email Verification`;

  const verificationEmailUrl =
    `${APP_URL}/verify-email?token=${encodeURIComponent(token)}`;

  const safeUrl = escapeHtml(verificationEmailUrl);

  const html = emailLayout({
    preheader: "Confirm your email address to complete registration.",
    title: "Confirm Your Email",
    message:
      "Thank you for joining NEXMO TAG. Click the button below to verify your email address.",
    content: `
      <table role="presentation" align="center" cellspacing="0" cellpadding="0" border="0" style="margin:28px auto;">
        <tr>
          <td align="center" bgcolor="#2563eb" style="border-radius:6px;">
            <a
              href="${safeUrl}"
              target="_blank"
              style="display:inline-block;padding:15px 28px;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:6px;"
            >
              Verify Email Address
            </a>
          </td>
        </tr>
      </table>

      <p style="font-size:12px;line-height:1.7;color:#6b7280;">
        If the button does not work, copy and paste this link into your browser:
      </p>

      <p style="font-size:12px;line-height:1.7;overflow-wrap:anywhere;">
        <a href="${safeUrl}" style="color:#2563eb;">${safeUrl}</a>
      </p>
    `,
    footer:
      "If you did not create an account, you can safely ignore this email.",
  });

  const text = `Verify your ${BRAND_NAME} email address using this link: ${verificationEmailUrl}\nIf you did not create an account, ignore this email.`;

  await sendEmail(to, subject, html, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendEmailVerification,
};
