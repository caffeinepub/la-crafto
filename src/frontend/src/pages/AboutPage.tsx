import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";
import { Link } from "@tanstack/react-router";

export function AboutPage() {
  const heroRef = useFadeInOnScroll<HTMLDivElement>();
  const storyRef = useFadeInOnScroll<HTMLDivElement>();
  const valuesRef = useFadeInOnScroll<HTMLDivElement>();
  const quoteRef = useFadeInOnScroll<HTMLDivElement>();

  return (
    <main className="pt-32 pb-20 min-h-screen bg-background">
      {/* Hero */}
      <section
        className="relative py-24 px-6 overflow-hidden"
        style={{ background: "oklch(22% 0.015 250)" }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url('/assets/generated/hero-himalaya.dim_1920x1080.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center 60%",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, oklch(22% 0.015 250 / 0.9), oklch(18% 0.01 60 / 0.95))",
          }}
        />

        <div
          ref={heroRef}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <p
            className="text-xs uppercase tracking-[0.3em] mb-4 font-medium"
            style={{ color: "oklch(var(--gold))" }}
          >
            Our Story
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            The Soul of{" "}
            <span style={{ color: "oklch(var(--gold))" }}>LA Crafto</span>
          </h1>
          <p
            className="font-serif-body text-xl italic leading-relaxed"
            style={{ color: "oklch(80% 0.01 80)" }}
          >
            A story born in the mountains, carried by the wind, and crafted with
            devotion.
          </p>
        </div>
      </section>

      {/* Main story */}
      <section className="py-20 px-6">
        <div ref={storyRef} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Workshop image placeholder */}
            <div className="lg:col-span-2">
              <div
                className="rounded-sm overflow-hidden"
                style={{
                  aspectRatio: "3/4",
                  background:
                    "linear-gradient(160deg, oklch(42% 0.12 250 / 0.2), oklch(38% 0.12 20 / 0.15))",
                  border: "1px solid oklch(var(--gold) / 0.3)",
                }}
              >
                <img
                  src="/assets/generated/hero-himalaya.dim_1920x1080.jpg"
                  alt="Ladakh workshop landscape"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            </div>

            {/* Text */}
            <div className="lg:col-span-3 space-y-5">
              <h2 className="font-serif text-3xl font-bold text-foreground">
                Where the Journey Began
              </h2>

              <div className="space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  In 2018, our founder Nawang Dorje set up a small workshop in
                  the heart of Leh — Ladakh's ancient capital — with a single
                  CNC machine and an unwavering belief that the art forms of
                  Buddhist monasteries deserved to be shared with the world.
                </p>
                <p>
                  Growing up surrounded by the frescoes of{" "}
                  <strong className="text-foreground">Thiksey Monastery</strong>{" "}
                  and the vibrant tapestries of{" "}
                  <strong className="text-foreground">Hemis</strong>, Nawang
                  absorbed centuries of sacred artistic tradition. The intricate
                  dharma wheels, the lotus motifs, the endless knots — he
                  understood not just their beauty, but their meaning.
                </p>
                <p>
                  Today, LA Crafto combines precision technology with
                  traditional artistry. Our{" "}
                  <strong className="text-foreground">
                    CNC carving machines
                  </strong>{" "}
                  can reproduce the intricate geometry of a centuries-old
                  mandala with perfect accuracy. Our{" "}
                  <strong className="text-foreground">3D printers</strong> can
                  give form to symbols that would take a traditional craftsman
                  weeks to carve by hand.
                </p>
                <p>
                  But the technology is just the beginning. Every piece is
                  hand-finished by artisans who understand the spiritual
                  significance of what they're creating. The machine may carve
                  the form, but the human hand — and heart — gives it soul.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy quote */}
      <section
        className="py-16 px-6"
        style={{ background: "oklch(95% 0.02 75)" }}
      >
        <div ref={quoteRef} className="max-w-2xl mx-auto text-center">
          <div className="text-3xl mb-6" aria-hidden="true">
            ☸
          </div>
          <blockquote
            className="font-serif-body text-2xl italic leading-relaxed text-foreground"
            style={{ fontWeight: 300 }}
          >
            "In Buddhism, craft is meditation. Each creation is not just a
            product but a reflection of patience, balance, and harmony."
          </blockquote>
          <div
            className="w-16 h-0.5 mx-auto mt-6 mb-4"
            style={{ background: "oklch(var(--gold))" }}
          />
          <p
            className="text-sm uppercase tracking-widest font-medium"
            style={{ color: "oklch(var(--stone-grey))" }}
          >
            — LA Crafto Philosophy
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div ref={valuesRef} className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              What We Stand For
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🏔",
                title: "Rooted in Place",
                description:
                  "Ladakh is not just our home — it's our inspiration. Every design draws from the landscape, architecture, and spiritual heritage of this extraordinary place.",
              },
              {
                icon: "⚙",
                title: "Precision Meets Tradition",
                description:
                  "We embrace modern technology not as a replacement for tradition, but as a tool to honor it — enabling levels of detail and consistency that amplify ancient artistry.",
              },
              {
                icon: "🌿",
                title: "Craft as Practice",
                description:
                  "In Buddhist teaching, the act of creating is itself a form of meditation. We approach every piece as a devotional practice, not merely a commercial product.",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="p-8 rounded-sm text-center"
                style={{
                  background: "oklch(var(--card))",
                  border: "1px solid oklch(var(--border))",
                }}
              >
                <div className="text-4xl mb-5">{value.icon}</div>
                <h3 className="font-serif text-lg font-bold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/collections">
              <button
                type="button"
                className="btn-gold px-8 py-3 text-sm font-semibold uppercase tracking-widest rounded-sm"
              >
                Explore Our Work
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
