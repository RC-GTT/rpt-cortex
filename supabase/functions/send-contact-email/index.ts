
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

    // For now, we'll return the data and let the frontend handle the mailto fallback
    // This ensures the form data is properly processed
    const emailData = {
      name,
      email,
      linkedin,
      currentTool,
      reason,
      timestamp: new Date().toLocaleString()
    };

    console.log("Contact form submission received:", emailData);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Contact form data received",
      data: emailData 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
