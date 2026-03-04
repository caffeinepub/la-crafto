import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitContactMessage } from "@/hooks/useQueries";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { mutateAsync: submitMessage, isPending } = useSubmitContactMessage();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      await submitMessage({ name, email, message });
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
      toast.success("Message sent! We'll respond within 24 hours.");
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  }

  return (
    <main className="pt-32 pb-20 px-6 min-h-screen bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-3 font-medium"
            style={{ color: "oklch(var(--gold))" }}
          >
            Get in Touch
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Connect With Us
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Whether you have questions about our craft, need custom orders, or
            simply want to say hello — we'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact form */}
          <div
            className="rounded-sm p-8"
            style={{
              background: "oklch(var(--card))",
              border: "1px solid oklch(var(--border))",
            }}
          >
            {submitted ? (
              <div
                className="text-center py-8 space-y-4"
                data-ocid="contact.success_state"
              >
                <CheckCircle2
                  className="w-12 h-12 mx-auto"
                  style={{ color: "oklch(55% 0.15 145)" }}
                />
                <h3 className="font-serif text-xl font-bold text-foreground">
                  Message Received
                </h3>
                <p className="text-sm text-muted-foreground">
                  We'll respond within 24 hours. 🙏
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-sm underline underline-offset-4"
                  style={{ color: "oklch(var(--gold))" }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="contact-name"
                    className="text-xs uppercase tracking-wider font-semibold text-foreground"
                  >
                    Your Name
                  </Label>
                  <Input
                    id="contact-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tenzin Dorje"
                    required
                    data-ocid="contact.input"
                    className="rounded-sm"
                    style={{
                      border: "1px solid oklch(var(--input))",
                      background: "oklch(98% 0.01 80)",
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="contact-email"
                    className="text-xs uppercase tracking-wider font-semibold text-foreground"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@example.com"
                    required
                    data-ocid="contact.input"
                    className="rounded-sm"
                    style={{
                      border: "1px solid oklch(var(--input))",
                      background: "oklch(98% 0.01 80)",
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="contact-message"
                    className="text-xs uppercase tracking-wider font-semibold text-foreground"
                  >
                    Message
                  </Label>
                  <Textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your inquiry, custom order request, or anything on your mind…"
                    required
                    rows={5}
                    data-ocid="contact.textarea"
                    className="rounded-sm resize-none"
                    style={{
                      border: "1px solid oklch(var(--input))",
                      background: "oklch(98% 0.01 80)",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 text-sm font-semibold uppercase tracking-widest rounded-sm text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: "oklch(var(--monk-maroon))" }}
                  data-ocid="contact.submit_button"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="space-y-8">
            {/* WhatsApp */}
            <div
              className="p-6 rounded-sm"
              style={{
                background: "oklch(55% 0.15 145 / 0.08)",
                border: "1px solid oklch(55% 0.15 145 / 0.25)",
              }}
            >
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                WhatsApp Chat
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                For quick queries, custom orders, or a direct conversation with
                our artisans — reach us on WhatsApp.
              </p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "oklch(55% 0.15 145)" }}
                data-ocid="contact.secondary_button"
              >
                <span className="text-base">📱</span>
                Chat on WhatsApp
              </a>
            </div>

            {/* Address & info */}
            <div className="space-y-4">
              {[
                {
                  icon: "📍",
                  title: "Workshop Address",
                  content: "LA Crafto Workshop\nLeh, Ladakh — 194101\nIndia",
                },
                {
                  icon: "⏱",
                  title: "Response Time",
                  content:
                    "We respond to all messages within 24 hours.\nFor urgent orders, please use WhatsApp.",
                },
                {
                  icon: "🌏",
                  title: "International Orders",
                  content:
                    "We ship worldwide. Custom orders welcome.\nMinimum order for international: ₹2,500",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-5 rounded-sm"
                  style={{
                    background: "oklch(var(--card))",
                    border: "1px solid oklch(var(--border))",
                  }}
                >
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-foreground mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quote */}
            <p
              className="text-sm italic font-serif-body text-muted-foreground border-l-2 pl-4"
              style={{ borderColor: "oklch(var(--gold) / 0.5)" }}
            >
              "Every message we receive is a new connection — a thread in the
              vast tapestry that links Ladakh to the world."
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
