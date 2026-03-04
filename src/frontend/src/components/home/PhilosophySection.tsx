import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";

function LotusDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-4">
      <div
        className="h-px flex-1 max-w-24"
        style={{
          background:
            "linear-gradient(to right, transparent, oklch(var(--gold) / 0.5))",
        }}
      />
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        className="lotus-pulse"
        style={{ color: "oklch(var(--gold))" }}
        aria-hidden="true"
      >
        {/* Lotus flower SVG */}
        <g fill="currentColor" opacity="0.8">
          <ellipse cx="16" cy="20" rx="4" ry="8" opacity="0.6" />
          <ellipse
            cx="16"
            cy="20"
            rx="4"
            ry="8"
            transform="rotate(45 16 16)"
            opacity="0.5"
          />
          <ellipse
            cx="16"
            cy="20"
            rx="4"
            ry="8"
            transform="rotate(90 16 16)"
            opacity="0.6"
          />
          <ellipse
            cx="16"
            cy="20"
            rx="4"
            ry="8"
            transform="rotate(135 16 16)"
            opacity="0.5"
          />
          <ellipse
            cx="16"
            cy="20"
            rx="4"
            ry="8"
            transform="rotate(180 16 16)"
            opacity="0.6"
          />
          <ellipse
            cx="16"
            cy="20"
            rx="4"
            ry="8"
            transform="rotate(225 16 16)"
            opacity="0.5"
          />
          <ellipse
            cx="16"
            cy="20"
            rx="4"
            ry="8"
            transform="rotate(270 16 16)"
            opacity="0.6"
          />
          <ellipse
            cx="16"
            cy="20"
            rx="4"
            ry="8"
            transform="rotate(315 16 16)"
            opacity="0.5"
          />
          <circle cx="16" cy="16" r="3" />
        </g>
      </svg>
      <div
        className="h-px flex-1 max-w-24"
        style={{
          background:
            "linear-gradient(to left, transparent, oklch(var(--gold) / 0.5))",
        }}
      />
    </div>
  );
}

function MandalaSeparator() {
  return (
    <div className="flex items-center justify-center my-8">
      <svg
        width="120"
        height="24"
        viewBox="0 0 120 24"
        aria-hidden="true"
        style={{ color: "oklch(var(--gold) / 0.4)" }}
      >
        <line
          x1="0"
          y1="12"
          x2="45"
          y2="12"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <circle
          cx="60"
          cy="12"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <circle
          cx="60"
          cy="12"
          r="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <circle cx="60" cy="12" r="2" fill="currentColor" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1={60 + 5 * Math.cos((angle * Math.PI) / 180)}
            y1={12 + 5 * Math.sin((angle * Math.PI) / 180)}
            x2={60 + 8 * Math.cos((angle * Math.PI) / 180)}
            y2={12 + 8 * Math.sin((angle * Math.PI) / 180)}
            stroke="currentColor"
            strokeWidth="0.8"
          />
        ))}
        <line
          x1="75"
          y1="12"
          x2="120"
          y2="12"
          stroke="currentColor"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}

export function PhilosophySection() {
  const sectionRef = useFadeInOnScroll<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="py-20 px-6"
      style={{ background: "oklch(95% 0.02 75)" }}
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* Top lotus */}
        <LotusDivider />

        <p
          className="text-xs uppercase tracking-[0.3em] mb-6 font-medium"
          style={{ color: "oklch(var(--monk-maroon))" }}
        >
          Brand Philosophy
        </p>

        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-foreground leading-tight">
          The Art of Sacred{" "}
          <span style={{ color: "oklch(var(--monk-maroon))" }}>Creation</span>
        </h2>

        {/* Mandala separator */}
        <MandalaSeparator />

        {/* Philosophy quote */}
        <div
          className="relative px-8 py-10 rounded-sm mx-auto"
          style={{
            background: "oklch(98% 0.01 80)",
            border: "1px solid oklch(var(--gold) / 0.25)",
            boxShadow: "0 8px 40px oklch(var(--gold) / 0.08)",
          }}
        >
          {/* Opening quote mark */}
          <span
            className="absolute -top-5 left-8 font-serif text-7xl leading-none"
            style={{ color: "oklch(var(--gold) / 0.3)" }}
            aria-hidden="true"
          >
            "
          </span>

          <blockquote
            className="font-serif-body text-xl md:text-2xl leading-relaxed text-foreground italic"
            style={{ fontWeight: 300 }}
          >
            In Buddhism, craft is meditation. Each creation is not just a
            product but a reflection of patience, balance, and harmony.
          </blockquote>

          {/* Golden underline */}
          <div
            className="w-24 h-0.5 mx-auto mt-6"
            style={{ background: "oklch(var(--gold))" }}
          />

          <p
            className="mt-4 text-sm tracking-widest uppercase font-medium"
            style={{ color: "oklch(var(--stone-grey))" }}
          >
            — LA Crafto, Ladakh
          </p>
        </div>

        {/* Bottom lotus */}
        <LotusDivider />

        <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto mt-2">
          Every piece from our workshop carries the energy of the Himalayas —
          crafted with devotion, designed for those who seek beauty with
          meaning.
        </p>
      </div>
    </section>
  );
}
