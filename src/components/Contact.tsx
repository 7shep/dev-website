import { useState } from "react";
import { TbArrowUpRight, TbCheck } from "react-icons/tb";
import { useReveal } from "../hooks/useReveal";
export default function Contact() {
  const { ref, isVisible } = useReveal();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error("Send failed");
      const result = await response.json();
      if (result.success !== true) throw new Error("Unexpected response");
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }
  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
    if (status !== "loading") setStatus("idle");
  }
  return (
    <section ref={ref} id="contact" className={`contact-section wrap section-space reveal-group${isVisible ? " visible" : ""}`}>
      <div className="contact-heading">
        <span className="eyebrow">Have something in mind?</span>
        <h2>
          Let’s make
          <br />
          it happen<span>.</span>
        </h2>
        <a className="text-link" href="mailto:alshe0644@gmail.com">
          alshe0644@gmail.com <TbArrowUpRight aria-hidden />
        </a>
      </div>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-row">
          <label htmlFor="contact-name">
            Your name
            <input
              id="contact-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              placeholder="Name"
              required
              maxLength={120}
              disabled={status === "loading"}
            />
          </label>
          <label htmlFor="contact-email">
            Email address
            <input
              id="contact-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="you@example.com"
              required
              disabled={status === "loading"}
            />
          </label>
        </div>
        <label htmlFor="contact-message">
          What are you thinking?
          <textarea
            id="contact-message"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="A project, an opportunity, or just a hello…"
            required
            maxLength={5000}
            rows={4}
            disabled={status === "loading"}
          />
        </label>
        <div className="form-bottom">
          <p aria-live="polite">
            {status === "success"
              ? "Thanks! Your message is on its way."
              : status === "error"
                ? "Couldn’t send. Try again or use my email above."
                : "Good things start with a conversation."}
          </p>
          <button
            className="solid-button"
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading"
              ? "Sending…"
              : status === "success"
                ? "Send another"
                : "Send message"}
            {status === "success" ? (
              <TbCheck aria-hidden />
            ) : (
              <TbArrowUpRight aria-hidden />
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
