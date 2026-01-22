import { NextResponse } from "next/server";
import { welcomeTemplate } from "@/app/lib/email/templates";
import { sendSESEmail } from "@/app/lib/email/ses";
// import { sendSendGridEmail } from "@/app/lib/email/sendgrid";

export async function POST(req: Request) {
  try {
    const { to, name } = await req.json();

    if (!to || !name) {
      return NextResponse.json(
        { success: false, message: "Missing email or name" },
        { status: 400 }
      );
    }

    const subject = "Welcome to Kalvium 🚀";
    const html = welcomeTemplate(name);

    // ✅ Choose ONE provider
    const response = await sendSESEmail(to, subject, html);
    // await sendSendGridEmail(to, subject, html);

    console.log("Email sent successfully:", response);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      messageId: (response as any)?.MessageId,
    });
  } catch (error) {
    console.error("Email send failed:", error);

    return NextResponse.json(
      { success: false, message: "Email sending failed" },
      { status: 500 }
    );
  }
}
