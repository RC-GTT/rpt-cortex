
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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Check, Mail, User, Link as LinkIcon } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "../ui/textarea"

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
}

const TOOL_OPTIONS = [
  "Excel/Spreadsheets", "Risk Management Software", "Enterprise Software", 
  "Manual Processes", "Custom Solutions", "Third-party Tools", 
  "Legacy Systems", "Others"
]

const waitlistFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  linkedin: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  currentTool: z.string({ required_error: "Please select your current tool." }).min(1, { message: "Please select your current tool." }),
  reason: z.string().min(10, { message: "Please tell us a bit more (at least 10 characters)." })
});

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const form = useForm<z.infer<typeof waitlistFormSchema>>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      name: "",
      email: "",
      linkedin: "",
      currentTool: "",
      reason: ""
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof waitlistFormSchema>) => {
    try {
      console.log("Submitting waitlist form:", values);

      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: values,
      });

      if (error) {
        throw error;
      }
      
      if (data.error) {
        throw new Error(data.details || data.error);
      }

      console.log("Waitlist submission processed:", data);

      toast.success(data.message || "Your submission has been received!", {
        duration: 5000,
      });

      form.reset();
      onClose();
    } catch (error: any) {
      console.error("Waitlist submission failed:", error);
      toast.error(error.message || "Failed to submit form. Please try again.", {
        duration: 7000,
      });
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Your full name" className="pl-10" {...field} disabled={isSubmitting} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="your.email@company.com" className="pl-10" {...field} disabled={isSubmitting} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="https://linkedin.com/in/yourprofile" className="pl-10" {...field} disabled={isSubmitting} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentTool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Risk Management Tool *</FormLabel>
                  <FormControl>
                     <select
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                        disabled={isSubmitting}
                      >
                        <option value="">Select your current tool</option>
                        {TOOL_OPTIONS.map((tool) => (
                          <option key={tool} value={tool}>
                            {tool}
                          </option>
                        ))}
                      </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Why are you interested in Risk Pro Technology? *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your risk management challenges and how Risk Pro Technology could help..."
                      className="resize-none"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <Check className="mr-2 h-4 w-4" /> 
              {isSubmitting ? "Processing..." : "Join Waitlist"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
