"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Support");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setStatus("error");
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg("A network error occurred. Please verify your connection.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-primary/10 bg-card/60 p-8 shadow-2xl backdrop-blur-md text-center py-16 transition-all duration-500 animate-in fade-in">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-6">
          <CheckCircle2 className="h-10 w-10 animate-bounce" />
        </div>
        <h3 className="text-2xl font-bold text-foreground font-display">Message Sent!</h3>
        <p className="mt-4 text-muted-foreground max-w-sm mx-auto text-base">
          Thank you, <strong className="text-foreground">{name}</strong>! We have received your message. Our team will review your query and respond to <strong className="text-foreground">{email}</strong> within 24 to 48 business hours.
        </p>
        <button
          onClick={() => {
            setName("");
            setEmail("");
            setSubject("General Support");
            setMessage("");
            setStatus("idle");
          }}
          className="mt-8 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/95 hover:shadow-lg transition-all duration-300"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-primary/10 bg-card/60 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      <h3 className="text-2xl font-bold text-foreground font-display mb-2">Send a Message</h3>
      <p className="text-sm text-muted-foreground mb-6">Fill out the form below and we will get in touch with you shortly.</p>
      
      {status === "error" && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-destructive text-sm animate-in slide-in-from-top duration-300">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Failed to Submit</p>
            <p className="mt-0.5 opacity-90">{errorMsg}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="form-name" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Full Name <span className="text-primary">*</span></label>
          <input
            id="form-name"
            type="text"
            required
            placeholder="Golu Kumar"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={status === "submitting"}
            className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all duration-300 disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="form-email" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Email Address <span className="text-primary">*</span></label>
          <input
            id="form-email"
            type="email"
            required
            placeholder="golu@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "submitting"}
            className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all duration-300 disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="form-subject" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Subject Inquiry</label>
          <select
            id="form-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={status === "submitting"}
            className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all duration-300 disabled:opacity-50"
          >
            <option value="General Support">General Support & Help</option>
            <option value="Feature Request">Feature Request & Suggestion</option>
            <option value="Bug Report">Technical Issue or Bug Report</option>
            <option value="Business Inquiry">Partnership & Collaboration</option>
            <option value="General Feedback">General Feedback & Suggestions</option>
          </select>
        </div>

        <div>
          <label htmlFor="form-message" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Your Message <span className="text-primary">*</span></label>
          <textarea
            id="form-message"
            required
            rows={5}
            placeholder="How can we help you today?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={status === "submitting"}
            className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all duration-300 resize-none disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/95 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 disabled:opacity-60"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending Message...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}
