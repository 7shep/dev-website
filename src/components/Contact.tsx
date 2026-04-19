import { useState } from "react";
import { useReveal } from "../hooks/useReveal";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const { ref, isVisible } = useReveal();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  const disabled = status === "loading" || status === "success";

  return (
    <section id="contact" className="px-6 md:px-24 py-16 md:py-32 flex justify-center">
      <div ref={ref} className={`w-full max-w-2xl bg-surface-container-low border border-secondary/20 rounded-2xl p-8 md:p-10 reveal${isVisible ? " visible" : ""}`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(0,251,251,0.8)] inline-block" />
          <h2 className="font-headline font-bold tracking-[0.25em] text-on-surface text-lg uppercase">
            Contact Me
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* COMM_ID */}
          <div className="space-y-2">
            <label className="font-label text-[9px] tracking-[0.3em] text-on-surface-variant uppercase block">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              autoComplete="off"
              disabled={disabled}
              className="w-full bg-transparent border border-outline-variant rounded-lg px-4 py-3 text-sm font-mono text-on-surface placeholder:text-outline/50 focus:outline-none focus:border-secondary/60 focus:shadow-[0_0_12px_rgba(0,251,251,0.1)] transition-all duration-200 disabled:opacity-50"
            />
          </div>

          {/* SIGNAL_ORIGIN */}
          <div className="space-y-2">
            <label className="font-label text-[9px] tracking-[0.3em] text-on-surface-variant uppercase block">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              autoComplete="off"
              disabled={disabled}
              className="w-full bg-transparent border border-outline-variant rounded-lg px-4 py-3 text-sm font-mono text-on-surface placeholder:text-outline/50 focus:outline-none focus:border-secondary/60 focus:shadow-[0_0_12px_rgba(0,251,251,0.1)] transition-all duration-200 disabled:opacity-50"
            />
          </div>

          {/* ENCRYPTED_MESSAGE */}
          <div className="space-y-2">
            <label className="font-label text-[9px] tracking-[0.3em] text-on-surface-variant uppercase block">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Leave me a message!"
              rows={5}
              disabled={disabled}
              className="w-full bg-transparent border border-outline-variant rounded-lg px-4 py-3 text-sm font-mono text-on-surface placeholder:text-outline/50 focus:outline-none focus:border-secondary/60 transition-colors duration-200 resize-none disabled:opacity-50"
            />
          </div>

          {/* Status messages */}
          {status === "success" && (
            <p className="font-label text-[10px] tracking-widest uppercase text-secondary text-center">
              ✓ Message transmitted successfully
            </p>
          )}
          {status === "error" && (
            <p className="font-label text-[10px] tracking-widest uppercase text-tertiary text-center">
              ✗ Transmission failed — please try again
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={disabled}
            className="w-full border border-secondary/40 rounded-full py-4 font-headline font-bold tracking-[0.3em] text-sm text-on-surface hover:border-secondary hover:shadow-[0_0_20px_rgba(0,251,251,0.15)] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-secondary">▶</span>
            {status === "loading" ? "TRANSMITTING..." : "TRANSMIT"}
          </button>
        </form>
      </div>
    </section>
  );
}
