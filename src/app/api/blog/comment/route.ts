import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// GET: Fetch all comments for a specific post slug
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Post slug is required." }, { status: 400 });
    }

    const { data: comments, error } = await supabase
      .from("blog_comments")
      .select("id, name, content, created_at")
      .eq("post_slug", slug)
      .eq("is_approved", true)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, comments });
  } catch (err: any) {
    console.error("Error fetching comments:", err);
    return NextResponse.json({ error: "Failed to fetch comments." }, { status: 500 });
  }
}

// POST: Add a new comment and notify admin via Email & Discord Webhook
export async function POST(request: Request) {
  try {
    const { post_slug, name, email, content } = await request.json();

    if (!post_slug || !name || !email || !content) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // 1. Insert comment into Supabase
    const { data: comment, error: insertErr } = await supabase
      .from("blog_comments")
      .insert({
        post_slug,
        name,
        email,
        content,
        is_approved: true // Automatically approve for instant display
      })
      .select()
      .single();

    if (insertErr) {
      throw insertErr;
    }

    // 2. Notify admin via Email (Nodemailer Gmail)
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
          from: `"GoluPDFs Comments" <${smtpUser}>`,
          to: adminEmail,
          subject: `💬 New Blog Comment on /blog/${post_slug}`,
          text: `You have received a new comment on GoluPDFs!\n\nPost: /blog/${post_slug}\nName: ${name}\nEmail: ${email}\nComment:\n${content}\n\nThis is an automated notification.`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #6366f1;">💬 New Blog Comment</h2>
              <p>You have received a new comment on GoluPDFs!</p>
              <table style="border-collapse: collapse; width: 100%; margin-top: 15px;">
                <tr>
                  <td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #eee; width: 120px;">Post Slug</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><code>${post_slug}</code></td>
                </tr>
                <tr>
                  <td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #eee;">Name</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${name}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #eee;">Email</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
                </tr>
              </table>
              <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-left: 4px solid #6366f1; border-radius: 4px;">
                <p style="margin: 0; font-style: italic; white-space: pre-wrap;">"${content}"</p>
              </div>
              <p style="margin-top: 30px; font-size: 11px; color: #9ca3af;">GoluPDFs Automation Hub</p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`[Email Alert] Notification email sent successfully to ${adminEmail}`);
      } catch (mailErr: any) {
        console.warn(`[Email Alert] Failed to send email: ${mailErr.message}. (Set SMTP_PASSWORD in .env.local to activate.)`);
      }
    } else {
      console.log(`[Email Alert] SMTP_PASSWORD is not set. Skipping email notification. Logging submission.`);
    }

    // 3. Notify admin via Discord Webhook (Reliable Backup)
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.startsWith("https://discord.com")) {
      try {
        const discordPayload = {
          embeds: [
            {
              title: "💬 New Blog Comment Submitted",
              url: `https://www.golupdf.online/blog/${post_slug}`,
              color: 3066993, // Green theme for comments
              fields: [
                { name: "👤 Author", value: name, inline: true },
                { name: "✉️ Email", value: email, inline: true },
                { name: "🔗 Post Route", value: `/blog/${post_slug}`, inline: false },
                { name: "📝 Content", value: content.substring(0, 1000), inline: false },
              ],
              timestamp: new Date().toISOString(),
              footer: { text: "GoluPDFs Comments System" },
            },
          ],
        };

        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(discordPayload),
        });
        console.log("[Discord Alert] Webhook sent successfully.");
      } catch (discErr: any) {
        console.warn("[Discord Alert] Failed to send webhook:", discErr.message);
      }
    }

    return NextResponse.json({ success: true, comment });
  } catch (err: any) {
    console.error("Error in comments API route:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
