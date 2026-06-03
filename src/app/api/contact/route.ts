import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Basic Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // 1. Notify admin via Email (Nodemailer Gmail)
    const adminEmail = "LGDEMON402LKR@GMAIL.COM";
    const smtpUser = process.env.SMTP_USER || "lgdemon402lkr@gmail.com";
    const smtpPass = process.env.SMTP_PASSWORD || "";

    if (smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        });

        const mailOptions = {
          from: `"GoluPDFs Contact Form" <${smtpUser}>`,
          to: adminEmail,
          subject: `📥 New Contact Form: ${subject}`,
          text: `You have received a new contact form submission!\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage:\n${message}\n\nThis is an automated notification.`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #6366f1;">📥 New Contact Form Submission</h2>
              <p>You have received a new message from the contact form on GoluPDFs.</p>
              <table style="border-collapse: collapse; width: 100%; margin-top: 15px;">
                <tr>
                  <td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #eee; width: 120px;">Name</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${name}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #eee;">Email</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                  <td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #eee;">Subject</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${subject}</td>
                </tr>
              </table>
              <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-left: 4px solid #6366f1; border-radius: 4px;">
                <p style="margin: 0; font-weight: bold; margin-bottom: 8px; color: #4f46e5;">Message:</p>
                <p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.5;">${message}</p>
              </div>
              <p style="margin-top: 30px; font-size: 11px; color: #9ca3af;">GoluPDFs Automation Hub</p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`[Contact Alert] Notification email sent successfully to ${adminEmail}`);
      } catch (mailErr: any) {
        console.warn(`[Contact Alert] Failed to send email: ${mailErr.message}. (Set SMTP_PASSWORD in .env.local to activate.)`);
      }
    } else {
      console.log(`[Contact Alert] SMTP_PASSWORD is not set. Skipping email notification. Logging submission.`);
    }

    // 2. Try sending notification to Discord webhook if configured
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.startsWith("https://discord.com")) {
      try {
        const discordPayload = {
          embeds: [
            {
              title: "📥 New Contact Form Submission",
              color: 5814783, // Modern indigo / primary blue
              fields: [
                { name: "👤 Name", value: name, inline: true },
                { name: "✉️ Email", value: email, inline: true },
                { name: "🏷️ Subject", value: subject, inline: false },
                { name: "💬 Message", value: message.substring(0, 1000), inline: false },
              ],
              timestamp: new Date().toISOString(),
              footer: { text: "GoluPDFs Contact System" },
            },
          ],
        };

        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(discordPayload),
        });
        console.log("[Contact Alert] Discord Webhook sent successfully.");
      } catch (discErr: any) {
        console.warn("[Contact Alert] Failed to send webhook:", discErr.message);
      }
    }

    console.log(`[Contact Form] Submission received: Name=${name}, Email=${email}, Subject=${subject}`);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (err: any) {
    console.error("Error in contact API route:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
