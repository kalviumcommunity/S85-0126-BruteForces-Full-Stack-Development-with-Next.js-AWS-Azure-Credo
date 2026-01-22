import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendSendGridEmail(
  to: string,
  subject: string,
  html: string
) {
  return sendgrid.send({
    to,
    from: process.env.SENDGRID_SENDER!,
    subject,
    html,
  });
}
