import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";

export function StorySection() {
  const leftRef = useFadeInOnScroll<HTMLDivElement>();
  const rightRef = useFadeInOnScroll<HTMLDivElement>();

  return (
    <section
      className="py-20 px-6 relative overflow-hidden"
      style={{ background: "oklch(22% 0.015 250)" }}
    >
      {/* Subtle mountain texture overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('/assets/generated/hero-himalaya.dim_1920x1080.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center 70%",
          filter: "blur(2px)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(22% 0.015 250 / 0.95), oklch(18% 0.01 60 / 0.9))",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left — visual */}
          <div ref={leftRef} className="relative">
            {/* Mountain silhouette graphic */}
            <div
              className="rounded-sm overflow-hidden"
              style={{
                background:
                  "linear-gradient(180deg, oklch(35% 0.04 250) 0%, oklch(25% 0.02 60) 100%)",
                aspectRatio: "4/3",
                border: "1px solid oklch(var(--gold) / 0.2)",
              }}
            >
              {/* SVG mountain silhouette */}
              <svg
                viewBox="0 0 400 300"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
              >
                {/* Sky gradient */}
                <defs>
                  <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(42% 0.12 250)" />
                    <stop offset="100%" stopColor="oklch(22% 0.015 250)" />
                  </linearGradient>
                  <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(55% 0.02 80)" />
                    <stop offset="100%" stopColor="oklch(18% 0.01 60)" />
                  </linearGradient>
                </defs>
                <rect width="400" height="300" fill="url(#skyGrad)" />
                {/* Stars */}
                {[
                  [30, 30],
                  [80, 20],
                  [150, 15],
                  [220, 40],
                  [300, 25],
                  [350, 35],
                  [60, 60],
                  [190, 55],
                  [280, 50],
                  [380, 65],
                ].map(([x, y]) => (
                  <circle
                    key={`star-${x}-${y}`}
                    cx={x}
                    cy={y}
                    r={1}
                    fill="white"
                    opacity={0.6}
                  />
                ))}
                {/* Mountains background */}
                <path
                  d="M0 200 L60 100 L120 150 L180 80 L240 130 L300 70 L360 120 L400 90 L400 300 L0 300 Z"
                  fill="oklch(30% 0.02 250)"
                />
                {/* Mountains foreground */}
                <path
                  d="M-20 300 L40 160 L100 220 L160 130 L220 190 L280 110 L340 170 L400 140 L420 300 Z"
                  fill="url(#mountainGrad)"
                />
                {/* Snow caps */}
                <path
                  d="M160 130 L175 155 L145 155 Z"
                  fill="oklch(96% 0.01 80)"
                  opacity="0.9"
                />
                <path
                  d="M280 110 L295 138 L265 138 Z"
                  fill="oklch(96% 0.01 80)"
                  opacity="0.9"
                />
                {/* Monastery silhouette */}
                <rect
                  x="170"
                  y="230"
                  width="60"
                  height="40"
                  fill="oklch(15% 0.01 60)"
                />
                <polygon
                  points="170,230 200,210 230,230"
                  fill="oklch(15% 0.01 60)"
                />
                <rect
                  x="185"
                  y="215"
                  width="8"
                  height="15"
                  fill="oklch(15% 0.01 60)"
                />
                <rect
                  x="207"
                  y="215"
                  width="8"
                  height="15"
                  fill="oklch(15% 0.01 60)"
                />
                {/* Prayer flags */}
                <line
                  x1="155"
                  y1="210"
                  x2="245"
                  y2="200"
                  stroke="oklch(var(--gold) / 0.7)"
                  strokeWidth="0.5"
                />
                {[165, 180, 195, 210, 225].map((x, i) => (
                  <rect
                    key={`flag-${x}`}
                    x={x}
                    y={203 + i * 0.5}
                    width="8"
                    height="10"
                    fill={
                      [
                        "oklch(45% 0.18 25)",
                        "oklch(75% 0.14 85)",
                        "oklch(42% 0.12 250)",
                        "white",
                        "oklch(45% 0.15 155)",
                      ][i % 5]
                    }
                    opacity="0.8"
                  />
                ))}
                {/* Gold horizon glow */}
                <ellipse
                  cx="200"
                  cy="200"
                  rx="200"
                  ry="30"
                  fill="oklch(var(--gold) / 0.06)"
                />
              </svg>
            </div>

            {/* Floating stats */}
            <div
              className="absolute -bottom-4 -right-4 rounded-sm px-5 py-4"
              style={{
                background: "oklch(var(--monk-maroon))",
                boxShadow: "0 8px 30px oklch(0 0 0 / 0.4)",
              }}
            >
              <p
                className="text-xs uppercase tracking-widest mb-1"
                style={{ color: "oklch(var(--gold) / 0.8)" }}
              >
                Since
              </p>
              <p className="font-serif text-2xl font-bold text-white">2018</p>
              <p
                className="text-xs mt-1"
                style={{ color: "oklch(80% 0.01 20)" }}
              >
                Crafting in Ladakh
              </p>
            </div>
          </div>

          {/* Right — text */}
          <div ref={rightRef} className="space-y-6">
            <p
              className="text-xs uppercase tracking-[0.3em] font-medium"
              style={{ color: "oklch(var(--gold))" }}
            >
              Our Story
            </p>

            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight">
              From Ladakh{" "}
              <span style={{ color: "oklch(var(--gold))" }}>to the World</span>
            </h2>

            <div
              className="space-y-4 text-sm leading-7"
              style={{ color: "oklch(78% 0.01 80)" }}
            >
              <p>
                Nestled in a small workshop in the shadow of the Himalayas, LA
                Crafto began as a dream — to bring the spiritual essence of
                Ladakh into every home around the world.
              </p>
              <p>
                Our craftsmen blend{" "}
                <strong className="text-white">CNC carving precision</strong>{" "}
                and{" "}
                <strong className="text-white">3D printing technology</strong>{" "}
                with centuries-old Buddhist artistic traditions. Each piece is
                hand-finished, imbued with intention and care.
              </p>
              <p>
                The mountains of Ladakh teach us patience. The monasteries teach
                us devotion. And the ancient art forms teach us that beauty
                serves a higher purpose — to inspire peace in the hearts of
                those who behold it.
              </p>
            </div>

            {/* Craft pillars */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {[
                {
                  icon: "⚙",
                  title: "CNC Precision",
                  desc: "Computer-guided carving for intricate detail",
                },
                {
                  icon: "🖨",
                  title: "3D Printing",
                  desc: "Modern technology meets ancient symbolism",
                },
                {
                  icon: "🙏",
                  title: "Hand Finished",
                  desc: "Every piece blessed with artisan devotion",
                },
                {
                  icon: "🌿",
                  title: "Sustainable",
                  desc: "Locally sourced Himalayan materials",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-4 rounded-sm"
                  style={{
                    background: "oklch(100% 0 0 / 0.06)",
                    border: "1px solid oklch(var(--gold) / 0.15)",
                  }}
                >
                  <span className="text-xl">{item.icon}</span>
                  <h4 className="font-serif text-sm font-semibold text-white mt-2">
                    {item.title}
                  </h4>
                  <p
                    className="text-xs mt-1 leading-snug"
                    style={{ color: "oklch(65% 0.01 80)" }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
