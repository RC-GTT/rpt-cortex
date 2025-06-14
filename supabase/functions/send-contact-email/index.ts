
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  linkedin: string;
  currentTool: string;
  reason: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, linkedin, currentTool, reason }: ContactRequest = await req.json();

    console.log("Processing new waitlist submission for:", email);

    const notificationEmailHtml = `
      <h1>New Waitlist Submission</h1>
      <p>A new user has joined the waitlist for Risk Pro Technology.</p>
      <h2>User Details:</h2>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>LinkedIn:</strong> <a href="${linkedin}">${linkedin || 'N/A'}</a></li>
        <li><strong>Current Tool:</strong> ${currentTool}</li>
        <li><strong>Reason:</strong></li>
        <li style="white-space: pre-wrap;">${reason}</li>
      </ul>
    `;
    
    const confirmationEmailHtml = `
      <h1>Thank you for joining our waitlist!</h1>
      <p>Hi ${name},</p>
      <p>We've received your submission to join the waitlist for Risk Pro Technology. We're excited to have you on board!</p>
      <p>We'll be in touch with updates and early access information soon.</p>
      <br/>
      <p>Best regards,</p>
      <p>The Risk Pro Technology Team</p>
    `;

    // Send notification email to admin
    const notificationResponse = await resend.emails.send({
      from: "Risk Pro Waitlist <onboarding@resend.dev>",
      to: ["604riskpro@gmail.com"],
      subject: `New Waitlist Submission from ${name}`,
      html: notificationEmailHtml,
      reply_to: email,
    });
    
    if (notificationResponse.error) {
      console.error("Resend notification error:", notificationResponse.error);
      throw new Error(`Failed to send notification email: ${notificationResponse.error.message}`);
    }
    console.log("Admin notification email sent:", notificationResponse.data);

    // Send confirmation email to user
    const confirmationResponse = await resend.emails.send({
      from: "Risk Pro Technology <onboarding@resend.dev>",
      to: [email],
      subject: "You're on the waitlist for Risk Pro Technology!",
      html: confirmationEmailHtml,
    });
    
    if (confirmationResponse.error) {
        console.error("Resend confirmation error:", confirmationResponse.error);
        // We don't throw an error here, as the admin email is more critical
    } else {
        console.log("User confirmation email sent:", confirmationResponse.data);
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: "Your submission has been received! We'll be in touch soon.",
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error processing waitlist submission:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to process waitlist submission",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
