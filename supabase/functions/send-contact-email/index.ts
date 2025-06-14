
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

    // For now, we'll log the submission.
    // The next step would be to integrate an email service like Resend to send emails.
    console.log("New Waitlist Submission:", {
      name,
      email,
      linkedin,
      currentTool,
      reason,
      timestamp: new Date().toISOString()
    });

    // The previous implementation created a 'mailto:' link, which can be unreliable.
    // This version simply confirms the submission was received.
    return new Response(JSON.stringify({
      success: true,
      message: "Your submission has been received! We'll be in touch soon.",
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
