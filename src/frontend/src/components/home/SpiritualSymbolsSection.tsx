import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";

const SYMBOLS = [
  {
    symbol: "☸",
    name: "Dharma Wheel",
    description:
      "The wheel of life, representing the Noble Eightfold Path to enlightenment. Eight spokes symbolize eight principles of right living — the foundation of Buddhist practice.",
    color: "oklch(var(--gold))",
  },
  {
    symbol: "🪷",
    name: "Lotus",
    description:
      "Purity rising from muddy waters — the lotus symbolizes spiritual awakening and the journey from ignorance to enlightenment. Beauty born from struggle.",
    color: "oklch(var(--monk-maroon))",
  },
  {
    symbol: "∞",
    name: "Endless Knot",
    description:
      "The interconnectedness of all things — wisdom and compassion intertwined. Eternal love, wisdom, and the dependent nature of all phenomena.",
    color: "oklch(var(--sky-blue))",
  },
  {
    symbol: "🙏",
    name: "Buddha Statues",
    description:
      "An embodiment of peace, compassion and inner enlightenment. Not mere decoration — each posture carries specific blessings and teachings for daily life.",
    color: "oklch(55% 0.12 145)",
  },
];

export function SpiritualSymbolsSection() {
  const sectionRef = useFadeInOnScroll<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="py-20 px-6"
      style={{ background: "oklch(94% 0.02 80)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-3 font-medium"
            style={{ color: "oklch(var(--monk-maroon))" }}
          >
            Sacred Symbols
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">
            Symbols of the{" "}
            <span style={{ color: "oklch(var(--gold))" }}>Path</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
            Each symbol in our craft carries centuries of wisdom. Understanding
            their meaning transforms decoration into devotion.
          </p>
        </div>

        {/* Symbol cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {SYMBOLS.map((sym) => (
            <div
              key={sym.name}
              className="group rounded-sm p-6 text-center product-card-hover cursor-default"
              style={{
                background: "oklch(98% 0.01 80)",
                border: "1px solid oklch(var(--border))",
              }}
            >
              {/* Symbol */}
              <div
                className="text-5xl mb-5 block transition-transform duration-300 group-hover:scale-110"
                style={{
                  filter: `drop-shadow(0 0 8px ${sym.color} / 0.3)`,
                }}
              >
                {sym.symbol}
              </div>

              {/* Name */}
              <h3 className="font-serif text-lg font-bold mb-3 text-foreground">
                {sym.name}
              </h3>

              {/* Decorative divider */}
              <div
                className="w-8 h-0.5 mx-auto mb-3 transition-all duration-300 group-hover:w-16"
                style={{ background: sym.color }}
              />

              {/* Description */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                {sym.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
