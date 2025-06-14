
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, linkedin, currentTool, reason }: ContactRequest = await req.json();

    console.log("Processing waitlist submission:", { name, email, currentTool });

    // Create comprehensive email content for Gmail
    const emailSubject = `New Risk Pro Technology Waitlist Submission - ${name}`;
    const emailBody = `
New Risk Pro Technology Waitlist Submission:

Contact Information:
Name: ${name}
Email: ${email}
LinkedIn: ${linkedin || 'Not provided'}

Current Risk Management Setup:
Tool/System: ${currentTool}

Interest & Requirements:
${reason}

Submission Details:
Submitted at: ${new Date().toLocaleString()}
Source: Risk Pro Technology Website
Form Type: Waitlist Registration

---
This is an automated submission from the Risk Pro Technology waitlist form.
Please follow up with ${name} at ${email} regarding their interest in Risk Pro Technology.
    `.trim();

    // Generate the mailto link
    const mailtoLink = `mailto:604riskpro@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // Return success response with the mailto link
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Waitlist submission processed successfully",
      mailtoLink: mailtoLink,
      data: {
        name,
        email,
        linkedin,
        currentTool,
        reason,
        timestamp: new Date().toISOString()
      }
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
