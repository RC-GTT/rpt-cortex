
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Check, Mail, User, Link as LinkIcon } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
}

const TOOL_OPTIONS = [
  "Excel/Spreadsheets", "Risk Management Software", "Enterprise Software", 
  "Manual Processes", "Custom Solutions", "Third-party Tools", 
  "Legacy Systems", "Others"
]

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    linkedin: "",
    currentTool: "",
    reason: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      console.log("Submitting waitlist form:", formData)
      
      // Process the form data through our edge function
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      })

      if (error) {
        console.error("Edge function error:", error)
        throw error
      }
      
      console.log("Waitlist submission processed:", data)
      
      // Create email content for Gmail with better formatting
      const emailSubject = `New Risk Pro Technology Waitlist Submission - ${formData.name}`
      const emailBody = `
New Risk Pro Technology Waitlist Submission:

Contact Information:
Name: ${formData.name}
Email: ${formData.email}
LinkedIn: ${formData.linkedin || 'Not provided'}

Current Risk Management Setup:
Tool/System: ${formData.currentTool}

Interest & Requirements:
${formData.reason}

Submission Details:
Submitted at: ${new Date().toLocaleString()}
Source: Risk Pro Technology Website
Form Type: Waitlist Registration

---
This is an automated submission from the Risk Pro Technology waitlist form.
Please follow up with ${formData.name} at ${formData.email} regarding their interest in Risk Pro Technology.
      `.trim()

      // Open mailto link to send email
      const mailtoLink = data?.mailtoLink || `mailto:604riskpro@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
      
      // Try to open the email client
      if (typeof window !== 'undefined') {
        window.open(mailtoLink, '_blank')
      }
      
      toast.success("Thank you for joining our waitlist! An email has been prepared for you to send to our team.", {
        duration: 5000,
      })
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        linkedin: "",
        currentTool: "",
        reason: ""
      })
      
      onClose()
    } catch (error) {
      console.error("Waitlist submission failed:", error)
      
      // Fallback: direct mailto with comprehensive details
      const fallbackEmailBody = `
New Risk Pro Technology Waitlist Submission:

Contact Information:
Name: ${formData.name}
Email: ${formData.email}
LinkedIn: ${formData.linkedin || 'Not provided'}

Current Risk Management Setup:
Tool/System: ${formData.currentTool}

Interest & Requirements:
${formData.reason}

Submission Details:
Submitted at: ${new Date().toLocaleString()}
Source: Risk Pro Technology Website
Form Type: Waitlist Registration

---
This is a waitlist submission from the Risk Pro Technology website.
Please follow up with ${formData.name} at ${formData.email} regarding their interest in Risk Pro Technology.
      `.trim()

      const fallbackMailtoLink = `mailto:604riskpro@gmail.com?subject=New Waitlist Submission - ${formData.name}&body=${encodeURIComponent(fallbackEmailBody)}`
      
      if (typeof window !== 'undefined') {
        window.open(fallbackMailtoLink, '_blank')
      }
      
      toast.warning("Please send the email that opened in your email client to complete your waitlist submission.", {
        duration: 7000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Join Waitlist</DialogTitle>
          <DialogDescription>
            Help us understand your risk management needs and get early access to Risk Pro Technology.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                className="pl-10"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isSubmitting}
                placeholder="Your full name"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                className="pl-10"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isSubmitting}
                placeholder="your.email@company.com"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="linkedin"
                type="url"
                className="pl-10"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                disabled={isSubmitting}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="currentTool">Current Risk Management Tool *</Label>
            <select
              id="currentTool"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
              value={formData.currentTool}
              onChange={(e) => setFormData({ ...formData, currentTool: e.target.value })}
              required
              disabled={isSubmitting}
            >
              <option value="">Select your current tool</option>
              {TOOL_OPTIONS.map((tool) => (
                <option key={tool} value={tool}>
                  {tool}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reason">Why are you interested in Risk Pro Technology? *</Label>
            <textarea
              id="reason"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
              disabled={isSubmitting}
              placeholder="Tell us about your risk management challenges and how Risk Pro Technology could help..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <Check className="mr-2 h-4 w-4" /> 
            {isSubmitting ? "Processing..." : "Join Waitlist"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
