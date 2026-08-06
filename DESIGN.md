# Design System: Alex Shepherd Portfolio

## 1. Current Site Audit

This site is a personal developer portfolio for Alex Shepherd, a Computing and AI student building full-stack tools, AI developer products, analytics dashboards, and web experiences. The current implementation is a React 19, Vite, Tailwind CSS v3 site with Framer Motion available and a strong cosmic interface metaphor: orbit rings, station labels, particle fields, glowing planets, project "constellations", and terminal-like contact language.

The redesign should preserve the core identity of "technical student building real systems" while making the presentation feel more credible, durable, and portfolio-grade. The current direction leans too heavily on common AI-era sci-fi signals: purple/cyan/pink neon, glowing orbital objects, centered hero composition, all-caps micro-labels, typewriter text, scroll prompt, and dark space ambience. These effects create energy, but they compete with the work and make the site feel more like a demo theme than a sharp developer portfolio.

Key issues to correct:

- Tailwind tokens use multiple accents: purple `#cc97ff`, cyan `#00fbfb`, and pink `#ff51fa`. Collapse this to one accent.
- Some tokens use pure black `#000000`. Replace with tinted charcoal surfaces.
- Body font is Inter, while headings mix Space Grotesk and Modern Antiqua. Use a more intentional two-font system.
- Hero uses `h-screen`; full viewport sections should use `min-height: 100dvh`.
- The hero is centered and symmetrical despite the site wanting a technical/editorial identity.
- "Scroll to Explore", typewriter labels, "STATION 01", and fake terminal form language add visual noise.
- Skills are arranged as three equal columns, which reads generic and repetitive.
- Project cards are useful but visually uniform. They need stronger hierarchy, clearer outcomes, and varied layout rhythm.
- The contact form has placeholders like "John Doe" and decorative status symbols. Use specific, plain copy.
- Canvas particles and neon glows should become restrained ambient texture, not the main design event.

## 2. Visual Theme and Atmosphere

Build the redesign around "field notes from a technical builder": quiet, precise, confident, and slightly cosmic without becoming theatrical. The site should feel like an engineer's notebook crossed with a mission console: dense enough to show substance, spacious enough to make the work legible.

- Density: 5/10. Balanced portfolio density with enough white space to make projects feel important.
- Variance: 7/10. Asymmetric, editorial layouts with offset columns and varied project treatments.
- Motion: 5/10. Smooth and deliberate, mostly scroll reveals and small interaction states.
- Texture: subtle star-grid, grain, and faint orbital geometry are allowed, but no neon haze as the primary surface.
- Voice: direct, specific, and human. Avoid sci-fi roleplay in labels and form states.

The first viewport must immediately communicate:

- Alex Shepherd is the person.
- He builds AI tools, developer tools, and data products.
- There are real projects to inspect.
- The site has a technical point of view without hiding behind visual effects.

## 3. Color Palette and Roles

Use a dark graphite system with one muted warm accent. This keeps the cosmic mood while moving away from purple/cyan/pink neon.

- **Deep Graphite** (`#0D0F12`) - Primary page background. Never use pure black.
- **Panel Graphite** (`#15181D`) - Elevated panels, forms, project containers.
- **Raised Graphite** (`#1D2229`) - Hover surfaces, secondary cards, image overlays.
- **Line Steel** (`#2D333C`) - Borders, dividers, orbit lines, input strokes.
- **Soft Steel** (`#8C96A3`) - Secondary copy, metadata, inactive links.
- **Cloud Ink** (`#F3F5F7`) - Primary text on dark surfaces.
- **Muted Ink** (`#C8CED6`) - Body text and captions.
- **Signal Amber** (`#D8A24A`) - Single accent for CTAs, focus rings, active states, and selected metadata.
- **Amber Wash** (`rgba(216, 162, 74, 0.14)`) - Subtle accent background for tags and active states.
- **Error Rust** (`#E26D5A`) - Inline errors only.
- **Success Sage** (`#84B58A`) - Inline success confirmation only.

Rules:

- Use Signal Amber as the only accent. Do not add cyan, pink, blue, or purple accents.
- No neon glows. Accent shadows may use `rgba(216, 162, 74, 0.18)` at most.
- Background texture may use white or amber at 3% to 8% opacity.
- Borders should be visible but quiet: `rgba(140, 150, 163, 0.18)` for default lines.
- Image overlays should be graphite, not pure black.

## 4. Typography Rules

Use typography to make the portfolio feel intentional, not templated.

- **Display:** Satoshi, Cabinet Grotesk, or Space Grotesk. Prefer Satoshi if adding a new font. Use weights 600-800.
- **Body:** Geist or Satoshi. Use 400 for paragraphs, 500 for labels, 600 for emphasis.
- **Mono:** Geist Mono or JetBrains Mono. Use for project metadata, dates, compact stats, and code-adjacent labels.
- **Fallback stack:** `Satoshi, Geist, ui-sans-serif, system-ui, sans-serif`.
- **Body width:** Keep long paragraphs to `60ch` to `68ch`.
- **Line height:** Body `1.65`, large intro copy `1.35`, display `0.92` to `1.05`.
- **Display tracking:** Slightly tight only on large headings: `-0.03em` maximum.
- **Label tracking:** Use `0.08em` to `0.16em`. Avoid the current very wide `0.3em` to `0.5em` tracking.
- **Case:** Prefer sentence case. Reserve uppercase for compact metadata only.
- **Numbers:** Use mono with tabular figures for dates, project stats, and technical counts.

Avoid:

- Inter as the primary body font.
- Modern Antiqua for portfolio body copy.
- Huge all-caps section titles as the only hierarchy.
- Typewriter effects in core identity copy.

## 5. Hero Direction

Replace the centered orbital hero with an asymmetric editorial hero.

Recommended structure:

- Left or upper-left: small metadata line, Alex Shepherd name, and a clear one-sentence positioning statement.
- Right or lower-right: a technical visual object, such as a cropped code-map, project index, subtle node diagram, or portrait/image treatment.
- Bottom band: compact navigation to Work, Stack, About, Contact, and Resume.
- Include one primary CTA: "View selected work" or "Contact Alex".

Hero copy direction:

- Headline: "Alex Shepherd builds AI tools and full-stack products."
- Supporting copy: "Computing and AI student at Queen's University, focused on developer tooling, data-heavy interfaces, and practical systems that ship."
- Metadata: "Elora, Ontario / Queen's University / React, TypeScript, Python"

Hero visual rules:

- No "Scroll to Explore" text.
- No bouncing arrows or decorative scroll prompts.
- No centered sun/orbit composition as the primary layout.
- Keep cosmic motifs as background structure: faint arcs, star-grid, or a single orbital line.
- If using a portrait or image, make it inspectable and intentional, not hidden behind heavy blur or glow.

## 6. Layout Principles

Use a grid-first portfolio architecture.

- Page container: `max-width: 1440px`, with responsive side padding `clamp(1.25rem, 4vw, 4rem)`.
- Section spacing: `clamp(5rem, 12vw, 10rem)` vertical rhythm.
- Full viewport sections: use `min-height: 100dvh`, never `h-screen`.
- Use CSS Grid for major sections. Avoid percentage flex math.
- Prefer asymmetric splits: `5fr 7fr`, `7fr 4fr`, or a 12-column grid.
- Avoid placing every section inside a card. Let page sections breathe.
- Use cards only for projects, form containers, and compact repeated items.
- Replace the three equal skills columns with either:
  - a dense grouped stack index with category dividers, or
  - an asymmetric layout with one featured capability panel and smaller tool rows.
- Project layout should vary by importance:
  - first project is full-width featured case study,
  - next two are split cards,
  - remaining projects are compact rows or smaller cards.

Mobile rules:

- Collapse all multi-column layouts below `768px`.
- No horizontal overflow.
- Minimum tap target: `44px`.
- Headlines use `clamp()` and must not rely on viewport-width-only font sizing.
- Inline metadata should wrap cleanly instead of shrinking below readability.

## 7. Component Stylings

### Buttons and Links

- Primary button: Signal Amber fill, Deep Graphite text, 6px to 8px radius, no pill unless it is a compact icon-only control.
- Secondary button: transparent, Line Steel border, Cloud Ink text.
- Text links: underline offset on hover or a small amber rule reveal.
- Active state: `transform: translateY(1px) scale(0.99)`.
- Focus state: 2px Signal Amber outline with 3px offset.
- Avoid wide letter-spaced button labels for primary actions.

### Project Cards

- Use project cards as case-study surfaces, not generic tiles.
- Each card needs a clear hierarchy:
  - project category,
  - title,
  - one specific outcome or problem,
  - role,
  - stack,
  - links.
- Featured project cards may use larger image areas and stronger typographic contrast.
- Secondary project cards should be quieter and more compact.
- Images should not sit at 40% opacity by default. Let users inspect them; use overlays only for legibility.
- Tags use Raised Graphite with quiet borders. Only one tag per card may use Signal Amber.

### Skills

- Skills should read as capability evidence, not a badge wall.
- Group by capability: "Frontend interfaces", "AI and data systems", "Backend services", "Tooling and deployment".
- Show tools as compact rows or chips with consistent alignment.
- Avoid novelty labels like `FRONTEND_ENGINES` and `SUBSPACE_BACKENDS`.

### About

- Treat About as narrative context, not a separate visual theme.
- Use one strong paragraph and a compact facts rail.
- Keep the sports/music/personal details, but make them secondary.
- Avoid switching to a decorative serif for all About copy.

### Contact Form

- Use plain form language:
  - Name
  - Email
  - Message
  - Send message
- Placeholder examples should be realistic but not generic:
  - "Morgan Lee"
  - "morgan@example.com"
  - "Tell me what you are building or hiring for."
- Loading: "Sending..."
- Success: "Message sent. I will reply when I can."
- Error: "Message failed. Please try again or email me directly."
- Validate required fields and email format before submitting.
- Inline error text sits below the relevant field.

### Footer

- Keep it simple and useful: GitHub, LinkedIn, Email, Resume.
- Remove decorative separators like `||`.
- Add a small availability/status line if true, such as "Open to internships and project collaborations."

## 8. Motion and Interaction

Motion should feel engineered and calm.

- Use Framer Motion for scroll reveals where useful; otherwise CSS transitions are enough.
- Default transition: 180ms to 260ms.
- Default easing: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Spring default for Framer Motion: stiffness `110`, damping `22`, mass `0.8`.
- Animate only `transform` and `opacity`.
- Do not animate `top`, `left`, `width`, or `height`.
- Stagger repeated items by 40ms to 70ms.
- Keep the particle canvas optional and restrained. Consider reducing particle count and opacity.
- Respect `prefers-reduced-motion` for all non-essential animation.

Allowed ambient motion:

- faint grid drift,
- subtle image reveal masks,
- small link underline motion,
- project card lift by 2px,
- very slow orbital line rotation at low opacity.

Banned motion:

- constant glowing pulse around primary content,
- typewriter identity copy,
- bouncing scroll prompt,
- rapidly spinning hero centerpiece,
- cursor-chasing effects that distract from reading.

## 9. Content Strategy

Rewrite the portfolio around evidence.

Each project should answer:

- What problem did it solve?
- What did Alex build?
- What technologies mattered?
- What is the strongest technical detail?
- Where can someone inspect it?

Recommended project card fields:

- Category
- Project name
- One-line result
- Technical note
- Stack
- Live / Source links

Tone:

- Specific, direct, and practical.
- Avoid inflated claims and generic portfolio phrases.
- Prefer "Built a local-first git assistant that answers repository questions through a CLI and MCP server" over "A next-generation AI workflow solution."

Avoid these words and patterns:

- Elevate
- Seamless
- Unleash
- Next-gen
- Game-changing
- Passionate developer
- Cutting-edge
- Tech enthusiast as a primary identity label

## 10. Accessibility and Quality Rules

- Add a skip-to-content link.
- Preserve semantic landmarks: `main`, `section`, `article`, `footer`, and form labels.
- Keep visible focus indicators on every interactive element.
- Do not hide scrollbars globally. Style them subtly or leave browser defaults.
- Ensure meaningful images have descriptive alt text.
- Ensure decorative canvas and ambient visuals are `aria-hidden`.
- Maintain contrast of at least 4.5:1 for normal text.
- All buttons must be keyboard reachable.
- Form status messages should use `aria-live="polite"`.
- External links should communicate destination through text or accessible label.

## 11. Implementation Priorities

1. Replace the color system with the graphite and Signal Amber palette.
2. Replace Inter and Modern Antiqua usage with a focused sans/mono type system.
3. Redesign the hero around clear positioning and asymmetric layout.
4. Rework project cards into a featured case-study layout with inspectable images.
5. Replace the three-column skills layout with grouped capability rows.
6. Simplify contact form language and add inline validation states.
7. Reduce neon glows, particle opacity, and decorative orbit dominance.
8. Add accessibility improvements: skip link, focus rings, no global hidden scrollbars.
9. Tune responsive behavior and replace `h-screen` with `min-height: 100dvh`.
10. Run `npm run build` and inspect desktop and mobile layouts before shipping.

## 12. Anti-Patterns

Never introduce:

- Pure black `#000000`.
- More than one accent color.
- Purple, cyan, or pink neon as primary styling.
- Gradient text on major headings.
- Outer neon glows around buttons or cards.
- Centered hero layout as the default.
- "Scroll to explore" prompts.
- Typewriter effects for primary identity copy.
- Three equal feature-card columns.
- Generic placeholder names like "John Doe".
- Decorative terminal labels that reduce clarity.
- Overlapping content that risks mobile collisions.
- Global hidden scrollbars.
- Unbounded canvas effects that dominate reading.
- Generic portfolio cliches like "passionate", "innovative", or "next-gen".

