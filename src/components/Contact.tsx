import { TbArrowDownRight, TbArrowUpRight } from "react-icons/tb";
import { useReveal } from "../hooks/useReveal";

export default function Contact() {
  const { ref, isVisible } = useReveal();
  return (
    <section id="contact" className="contact-section wrap section-space">
      <div
        ref={ref}
        className={`reveal-group${isVisible ? " visible" : ""}`}
      >
        <span className="eyebrow">Contact</span>
        <h2>Say hello.</h2>
        <p className="contact-lede">Email is the fastest way to reach me.</p>
        <a className="contact-email" href="mailto:alshe0644@gmail.com">
          alshe0644@gmail.com
        </a>
        <div className="contact-links">
          <a
            className="text-link"
            href="/assets/Alex_Shepherd_Resume_2026.pdf"
            download
          >
            Download resume <TbArrowDownRight aria-hidden />
          </a>
          <a
            className="text-link"
            href="https://linkedin.com/in/7shep"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn <TbArrowUpRight aria-hidden />
          </a>
          <a
            className="text-link"
            href="https://github.com/7shep"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <TbArrowUpRight aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
