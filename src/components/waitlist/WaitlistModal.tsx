
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
      // Process the form data through our edge function
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      })

      if (error) {
        throw error
      }
      
      console.log("Form data processed:", data)
      
      // Create email content for Gmail
      const emailSubject = `New Risk Pro Technology Contact Submission - ${formData.name}`
      const emailBody = `
New Risk Pro Technology Contact Submission:

Name: ${formData.name}
Email: ${formData.email}
LinkedIn: ${formData.linkedin}
Current Tool: ${formData.currentTool}
Reason for Interest: ${formData.reason}

Submitted at: ${new Date().toLocaleString()}
      `

      // Open mailto link to Gmail
      const mailtoLink = `mailto:604riskpro@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
      window.open(mailtoLink, '_blank')
      
      toast.success("Thank you for contacting us! An email has been prepared for you to send to our team.", {
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
      console.error("Form submission failed:", error)
      
      // Fallback: direct mailto
      const emailBody = `
New Risk Pro Technology Contact Submission:

Name: ${formData.name}
Email: ${formData.email}
LinkedIn: ${formData.linkedin}
Current Tool: ${formData.currentTool}
Reason for Interest: ${formData.reason}

Submitted at: ${new Date().toLocaleString()}
      `

      const mailtoLink = `mailto:604riskpro@gmail.com?subject=New Contact Submission - ${formData.name}&body=${encodeURIComponent(emailBody)}`
      window.open(mailtoLink, '_blank')
      
      toast.warning("Please send the email that opened in your email client to complete your submission.", {
        duration: 7000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
          <DialogDescription>
            Help us understand your risk management needs and get early access to Risk Pro Technology.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                className="pl-10"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
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
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="currentTool">Current Risk Management Tool</Label>
            <select
              id="currentTool"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
              value={formData.currentTool}
              onChange={(e) => setFormData({ ...formData, currentTool: e.target.value })}
              required
              disabled={isSubmitting}
            >
              <option value="">Select a tool</option>
              {TOOL_OPTIONS.map((tool) => (
                <option key={tool} value={tool}>
                  {tool}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reason">Why are you interested in Risk Pro Technology?</Label>
            <textarea
              id="reason"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <Check className="mr-2 h-4 w-4" /> 
            {isSubmitting ? "Preparing Email..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
