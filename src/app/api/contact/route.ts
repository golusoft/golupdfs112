import { NextResponse } from "next/server";

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

    // Try sending notification to Discord webhook if configured
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.startsWith("https://discord.com")) {
      const discordPayload = {
        embeds: [
          {
            title: "📥 New Contact Form Submission",
            color: 5814783, // Modern indigo / primary blue
            fields: [
              { name: "👤 Name", value: name, inline: true },
              { name: "✉️ Email", value: email, inline: true },
              { name: "🏷️ Subject", value: subject, inline: false },
              { name: "💬 Message", value: message, inline: false },
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
