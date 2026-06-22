// ===================================================
// Email Utility — Nodemailer + Gmail SMTP
// ===================================================
// 
// প্রয়োজনীয় env variables:
//   GMAIL_USER=your-email@gmail.com
//   GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
//
// Gmail App Password তৈরির ধাপ:
//   1. Google Account → Security → 2-Step Verification চালু করুন
//   2. Security → App passwords → "Mail" ও "Other (Custom name)" সিলেক্ট করুন
//   3. Generate করে ১৬ অক্ষরের পাসওয়ার্ড কপি করুন
//   4. .env.local ফাইলে GMAIL_APP_PASSWORD হিসেবে যোগ করুন
// ===================================================

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("[EMAIL] Gmail credentials not configured. Skipping email send.");
    console.warn(`[EMAIL] Would have sent to: ${to}, subject: ${subject}`);
    return { success: false, error: "Email not configured" };
  }

  try {
    const info = await transporter.sendMail({
      from: `"মাদ্রাসা ডিরেক্টরি" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // HTML থেকে plain text fallback
    });

    console.log(`[EMAIL] Sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err: unknown) {
    console.error("[EMAIL] Send failed:", err);
    return { success: false, error: String(err) };
  }
}

// ─── Email Templates ──────────────────────────────

export function passwordResetEmail(resetUrl: string, otp: string): string {
  return `
<!DOCTYPE html>
<html lang="bn" dir="ltr">
<head><meta charset="UTF-8" /></head>
<body style="margin:0; padding:0; background-color:#f5f5f7; font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f7; padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:480px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#047857,#059669); padding:28px 32px; text-align:center;">
            <h1 style="margin:0; color:#ffffff; font-size:20px; font-weight:700;">মাদ্রাসা ডিরেক্টরি</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px; font-size:16px; color:#1a1a1a; font-weight:600;">আসসালামু আলাইকুম,</p>
            <p style="margin:0 0 20px; font-size:14px; color:#555; line-height:1.6;">
              আপনার মাদ্রাসা ডিরেক্টরি অ্যাকাউন্টের পাসওয়ার্ড রিসেট করার অনুরোধ পাওয়া গেছে।
              নিচের OTP ব্যবহার করে অথবা বাটনে ক্লিক করে নতুন পাসওয়ার্ড সেট করুন:
            </p>
            
            <!-- OTP Box -->
            <div style="background:#f8fafc; border:2px dashed #059669; border-radius:12px; padding:24px; text-align:center; margin-bottom:24px;">
              <p style="margin:0 0 12px; font-size:12px; color:#64748b; font-weight:600; text-transform:uppercase; letter-spacing:0.1em;">আপনার ওটিপি (OTP)</p>
              <div style="font-size:36px; font-weight:800; color:#047857; letter-spacing:0.5em; font-family:monospace;">${otp}</div>
              <p style="margin:12px 0 0; font-size:12px; color:#888;">এই OTP টি <strong>১০ মিনিট</strong> পর্যন্ত কার্যকর</p>
            </div>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center" style="padding:8px 0 24px;">
                <a href="${resetUrl}" style="display:inline-block; background:#047857; color:#ffffff; text-decoration:none; padding:14px 36px; border-radius:8px; font-size:15px; font-weight:600; letter-spacing:0.3px;">
                  পাসওয়ার্ড রিসেট করুন
                </a>
              </td></tr>
            </table>
            <p style="margin:0 0 8px; font-size:13px; color:#888; line-height:1.5;">
              লিংকটি <strong>১ ঘণ্টা</strong> পর্যন্ত কার্যকর থাকবে।
            </p>
            <p style="margin:0 0 8px; font-size:13px; color:#888; line-height:1.5;">
              আপনি যদি এই অনুরোধ না করে থাকেন, তাহলে এই ইমেইল উপেক্ষা করুন।
              আপনার অ্যাকাউন্ট সুরক্ষিত আছে।
            </p>
            <hr style="border:none; border-top:1px solid #eee; margin:24px 0;" />
            <p style="margin:0; font-size:12px; color:#aaa; line-height:1.5;">
              বাটন কাজ না করলে এই লিংকটি ব্রাউজারে পেস্ট করুন:<br/>
              <a href="${resetUrl}" style="color:#047857; word-break:break-all; font-size:11px;">${resetUrl}</a>
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#fafafa; padding:16px 32px; text-align:center; border-top:1px solid #f0f0f0;">
            <p style="margin:0; font-size:11px; color:#bbb;">
              © ${new Date().getFullYear()} মাদ্রাসা ডিরেক্টরি। সকল অধিকার সংরক্ষিত।
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function welcomeEmail(name: string, loginUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="bn" dir="ltr">
<head><meta charset="UTF-8" /></head>
<body style="margin:0; padding:0; background-color:#f5f5f7; font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f7; padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:480px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#047857,#059669); padding:28px 32px; text-align:center;">
            <h1 style="margin:0; color:#ffffff; font-size:20px; font-weight:700;">মাদ্রাসা ডিরেক্টরি</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 16px; font-size:16px; color:#1a1a1a; font-weight:600;">
              আসসালামু আলাইকুম${name ? `, ${name}` : ""}!
            </p>
            <p style="margin:0 0 20px; font-size:14px; color:#555; line-height:1.6;">
              মাদ্রাসা ডিরেক্টরিতে আপনাকে স্বাগতম! আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।
            </p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center" style="padding:8px 0 24px;">
                <a href="${loginUrl}" style="display:inline-block; background:#047857; color:#ffffff; text-decoration:none; padding:14px 36px; border-radius:8px; font-size:15px; font-weight:600;">
                  ড্যাশবোর্ডে যান
                </a>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#fafafa; padding:16px 32px; text-align:center; border-top:1px solid #f0f0f0;">
            <p style="margin:0; font-size:11px; color:#bbb;">
              © ${new Date().getFullYear()} মাদ্রাসা ডিরেক্টরি। সকল অধিকার সংরক্ষিত।
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function passwordChangedEmail(): string {
  return `
<!DOCTYPE html>
<html lang="bn" dir="ltr">
<head><meta charset="UTF-8" /></head>
<body style="margin:0; padding:0; background-color:#f5f5f7; font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f7; padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:480px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#047857,#059669); padding:28px 32px; text-align:center;">
            <h1 style="margin:0; color:#ffffff; font-size:20px; font-weight:700;">মাদ্রাসা ডিরেক্টরি</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 16px; font-size:16px; color:#1a1a1a; font-weight:600;">আসসালামু আলাইকুম,</p>
            <p style="margin:0 0 16px; font-size:14px; color:#555; line-height:1.6;">
              আপনার অ্যাকাউন্টের পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।
            </p>
            <p style="margin:0 0 8px; font-size:13px; color:#d32f2f; line-height:1.5;">
              ⚠️ আপনি যদি এই পরিবর্তন না করে থাকেন, অনুগ্রহ করে এখনই আপনার পাসওয়ার্ড রিসেট করুন
              এবং আমাদের সাথে যোগাযোগ করুন।
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#fafafa; padding:16px 32px; text-align:center; border-top:1px solid #f0f0f0;">
            <p style="margin:0; font-size:11px; color:#bbb;">
              © ${new Date().getFullYear()} মাদ্রাসা ডিরেক্টরি। সকল অধিকার সংরক্ষিত।
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
