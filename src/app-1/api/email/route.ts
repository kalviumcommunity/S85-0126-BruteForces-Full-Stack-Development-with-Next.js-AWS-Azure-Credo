import { NextResponse } from "next/server";
import sendgrid from "@sendgrid/mail";
import { welcomeTemplate } from "@/lib-1/emailTemplates";

// Initialize SendGrid with your API Key
sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, name } = body;

    if (!to || !name) {
      return NextResponse.json(
        { success: false, error: "Missing 'to' or 'name' fields" },
        { status: 400 }
      );
    }

    // Construct the email object
    const emailData = {
      to: to, // Recipient
      from: process.env.SENDGRID_SENDER as string, // Verified Sender
      subject: `Welcome to the Platform, ${name}!`,
      html: welcomeTemplate(name), // Use our HTML template
    };

    // Send the email
    const info = await sendgrid.send(emailData);

    // Log the success for the assignment screenshot
    console.log("✅ Email sent successfully!");
    console.log("📨 Message ID/Header:", info[0].headers["x-message-id"]);

    return NextResponse.json({ success: true, message: "Email queued successfully" });
  } catch (error) {
    console.error("❌ Email send failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}