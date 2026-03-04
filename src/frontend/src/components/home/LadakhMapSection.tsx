import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";

export function LadakhMapSection() {
  const sectionRef = useFadeInOnScroll<HTMLElement>();

  return (
    <section ref={sectionRef} className="py-16 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <div
          className="rounded-sm overflow-hidden"
          style={{
            border: "1px solid oklch(var(--gold) / 0.3)",
            background: "oklch(98% 0.01 80)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Map illustration */}
            <div
              className="relative flex items-center justify-center p-10"
              style={{ background: "oklch(38% 0.08 250 / 0.08)" }}
            >
              {/* Stylized India map outline with Ladakh highlighted */}
              <svg
                viewBox="0 0 200 240"
                className="w-full max-w-xs"
                role="img"
                aria-label="Map showing Ladakh region in northern India"
              >
                <title>Map of India with Ladakh region highlighted</title>
                {/* India rough outline */}
                <path
                  d="M70 20 L90 15 L120 25 L140 20 L155 35 L160 60 L165 80 L170 100 L165 120 L155 140 L140 165 L125 185 L115 210 L110 230 L100 240 L90 225 L85 205 L80 180 L65 165 L50 150 L40 130 L35 110 L38 90 L45 70 L55 50 L65 30 Z"
                  fill="oklch(88% 0.015 80)"
                  stroke="oklch(70% 0.01 80)"
                  strokeWidth="1"
                  opacity="0.7"
                />
                {/* Ladakh region highlight */}
                <path
                  d="M80 20 L120 15 L135 25 L145 35 L155 50 L150 65 L135 70 L120 65 L105 70 L90 65 L75 60 L70 45 L72 30 Z"
                  fill="oklch(var(--monk-maroon) / 0.4)"
                  stroke="oklch(var(--monk-maroon))"
                  strokeWidth="1.5"
                />
                {/* Himalayan mountains suggestion */}
                {[
                  "M80 40 L85 28 L90 38",
                  "M95 35 L102 22 L109 35",
                  "M112 38 L119 25 L126 37",
                ].map((d) => (
                  <path
                    key={d}
                    d={d}
                    fill="oklch(96% 0.01 80)"
                    stroke="oklch(70% 0.02 80)"
                    strokeWidth="0.5"
                    opacity="0.8"
                  />
                ))}
                {/* Pin marker */}
                <circle
                  cx="105"
                  cy="50"
                  r="6"
                  fill="oklch(var(--monk-maroon))"
                />
                <circle cx="105" cy="50" r="3" fill="oklch(var(--gold))" />
                <line
                  x1="105"
                  y1="56"
                  x2="105"
                  y2="68"
                  stroke="oklch(var(--monk-maroon))"
                  strokeWidth="1.5"
                />
                {/* Label */}
                <text
                  x="115"
                  y="54"
                  fontSize="8"
                  fill="oklch(var(--monk-maroon))"
                  fontFamily="serif"
                  fontWeight="bold"
                >
                  Ladakh
                </text>
                <text
                  x="115"
                  y="63"
                  fontSize="6"
                  fill="oklch(55% 0.01 80)"
                  fontFamily="serif"
                >
                  3,524m
                </text>
              </svg>
            </div>

            {/* Text content */}
            <div
              className="p-8 flex flex-col justify-center"
              style={{ borderLeft: "1px solid oklch(var(--gold) / 0.2)" }}
            >
              <p
                className="text-xs uppercase tracking-[0.3em] mb-3 font-medium"
                style={{ color: "oklch(var(--gold))" }}
              >
                Our Home
              </p>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                Ladakh, India
              </h3>
              <p
                className="font-serif-body text-base italic mb-4"
                style={{ color: "oklch(var(--monk-maroon))" }}
              >
                "Where mountains meet the sky"
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground mb-6">
                Perched at an average elevation of 3,500 meters in the
                Trans-Himalayan region, Ladakh is one of the world's most
                spectacular landscapes — ancient monasteries, azure skies, and a
                living Buddhist culture spanning over 1,000 years.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Elevation", value: "3,500m avg" },
                  { label: "Monasteries", value: "108+ active" },
                  { label: "Established", value: "2018" },
                  { label: "Pieces crafted", value: "5,000+" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p
                      className="text-xs uppercase tracking-widest"
                      style={{ color: "oklch(var(--stone-grey))" }}
                    >
                      {stat.label}
                    </p>
                    <p className="font-serif text-lg font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
