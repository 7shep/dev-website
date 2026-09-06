import { TbArrowUpRight } from "react-icons/tb";
export default function Footer() {
  return (
    <footer className="site-footer wrap">
      <a className="wordmark" href="#home" aria-label="Back to top">
        as<span> /</span>
      </a>
      <p>© {new Date().getFullYear()} Alex Shepherd</p>
      <div>
        <a href="https://github.com/7shep" target="_blank" rel="noreferrer">
          GitHub <TbArrowUpRight aria-hidden />
        </a>
        <a
          href="https://linkedin.com/in/7shep"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn <TbArrowUpRight aria-hidden />
        </a>
      </div>
    </footer>
  );
}
