interface RecoveryEmailParams {
  to: string;
  username: string;
  tempPassword: string;
}

export async function sendRecoveryEmail({
  to,
  username,
  tempPassword,
}: RecoveryEmailParams) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not set in environment variables");
  }

  const senderEmail = process.env.BREVO_FROM_EMAIL || "noreply@academiciq.ink";
  const senderName = process.env.BREVO_FROM_NAME || "AcademicIQ";

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject: "AcademicIQ — Your Account Recovery Credentials",
      htmlContent: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0;">AcademicIQ</h1>
            <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Account Recovery</p>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">
            Hi <strong>${username}</strong>, we received a request to recover your account credentials. Here are your updated login details:
          </p>
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Username</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${username}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Temporary Password</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right; font-family: monospace; letter-spacing: 1px;">${tempPassword}</td>
              </tr>
            </table>
          </div>
          <p style="color: #ef4444; font-size: 13px; line-height: 1.6;">
            ⚠️ For security, please change your password after logging in.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            If you didn't request this, you can safely ignore this email. Your previous password has been changed — if this wasn't you, please contact support.
          </p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Brevo API error:", errorData);
    throw new Error(`Failed to send email: ${response.status}`);
  }

  return response.json();
}
