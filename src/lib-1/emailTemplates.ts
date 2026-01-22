export const welcomeTemplate = (userName: string) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color: #2563eb;">Welcome to Kalvium, ${userName}! 🚀</h2>
    <p>We are thrilled to have you onboard.</p>
    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0;"><strong>Your account is now active.</strong></p>
      <p style="margin: 0;">Start building amazing projects today!</p>
    </div>
    <a href="https://kalvium.community" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a>
    <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;"/>
    <small style="color: #666;">This is an automated transactional email.</small>
  </div>
`;