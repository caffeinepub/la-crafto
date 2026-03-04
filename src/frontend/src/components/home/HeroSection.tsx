import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";
import { Link } from "@tanstack/react-router";

const PARTICLES = [
  { top: "20%", left: "10%", size: 5, delay: "0s", duration: "4s" },
  { top: "35%", left: "25%", size: 3, delay: "1s", duration: "5s" },
  { top: "60%", left: "15%", size: 4, delay: "2s", duration: "3.5s" },
  { top: "25%", left: "80%", size: 3, delay: "0.5s", duration: "4.5s" },
  { top: "50%", left: "88%", size: 5, delay: "1.5s", duration: "5s" },
  { top: "70%", left: "75%", size: 3, delay: "2.5s", duration: "4s" },
  { top: "80%", left: "40%", size: 4, delay: "0.8s", duration: "3.8s" },
  { top: "15%", left: "55%", size: 3, delay: "1.8s", duration: "4.2s" },
];

export function HeroSection() {
  const contentRef = useFadeInOnScroll<HTMLDivElement>();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/assets/generated/hero-himalaya.dim_1920x1080.jpg')`,
        }}
      />

      {/* Layered overlays for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, oklch(18% 0.012 250 / 0.55) 0%, oklch(20% 0.01 60 / 0.4) 40%, oklch(15% 0.008 60 / 0.6) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center bottom, oklch(var(--monk-maroon) / 0.3) 0%, transparent 70%)",
        }}
      />

      {/* Gold particles */}
      {PARTICLES.map((p) => (
        <div
          key={`particle-${p.top}-${p.left}`}
          className="gold-particle"
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        {/* Small tagline */}
        <p
          className="text-xs md:text-sm uppercase tracking-[0.35em] mb-6 font-medium"
          style={{ color: "oklch(var(--gold) / 0.9)" }}
        >
          ✦ From the Heart of Ladakh ✦
        </p>

        {/* Main headline */}
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
          Crafted in the{" "}
          <span
            className="relative inline-block"
            style={{
              color: "oklch(var(--gold))",
              textShadow: "0 0 30px oklch(var(--gold) / 0.4)",
            }}
          >
            Himalayas.
          </span>
          <br />
          <span className="text-white/90">Inspired by Spirit.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="font-serif-body text-lg md:text-xl italic leading-relaxed mb-10 max-w-2xl mx-auto"
          style={{ color: "oklch(88% 0.01 80)" }}
        >
          Handcrafted Buddhist art from the heart of Ladakh — where mountains
          meet the sky and tradition meets innovation.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/collections">
            <button
              type="button"
              className="btn-gold px-8 py-3 text-sm font-semibold tracking-widest uppercase rounded-sm"
              data-ocid="hero.primary_button"
            >
              Explore Creations
            </button>
          </Link>
          <Link to="/about">
            <button
              type="button"
              className="px-8 py-3 text-sm font-medium tracking-wide rounded-sm transition-all duration-200"
              style={{
                color: "oklch(88% 0.01 80)",
                border: "1px solid oklch(80% 0.01 80 / 0.35)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "oklch(100% 0 0 / 0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
              }}
            >
              Our Story
            </button>
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center gap-2">
          <div
            className="w-px h-12 animate-pulse"
            style={{
              background:
                "linear-gradient(to bottom, oklch(var(--gold) / 0.6), transparent)",
            }}
          />
          <p
            className="text-xs uppercase tracking-widest"
            style={{ color: "oklch(var(--gold) / 0.6)" }}
          >
            Scroll
          </p>
        </div>
      </div>
    </section>
  );
}
