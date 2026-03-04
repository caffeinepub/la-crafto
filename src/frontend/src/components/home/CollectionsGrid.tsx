import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";
import { Link } from "@tanstack/react-router";

const CATEGORIES = [
  {
    name: "Sacred Wall Art",
    slug: "sacred-wall-art",
    description: "Hand-carved dharma wheels, mandalas & Buddhist motifs",
    icon: "☸",
    image: "/assets/generated/product-wall-art.dim_800x800.jpg",
    ocid: "collections.item.1",
  },
  {
    name: "3D Printed Buddhist Symbols",
    slug: "3d-printed-buddhist-symbols",
    description: "Precision-crafted sacred geometry & spiritual icons",
    icon: "🪷",
    image: "/assets/generated/product-3d-symbol.dim_800x800.jpg",
    ocid: "collections.item.2",
  },
  {
    name: "Custom Name Plates",
    slug: "custom-name-plates",
    description: "Personalized plaques with Tibetan-inspired borders",
    icon: "✦",
    image: "/assets/generated/product-nameplate.dim_800x800.jpg",
    ocid: "collections.item.3",
  },
  {
    name: "Himalayan Inspired Decor",
    slug: "himalayan-inspired-decor",
    description: "Prayer wheels, prayer flags & mountain spirit pieces",
    icon: "🏔",
    image: "/assets/generated/product-decor.dim_800x800.jpg",
    ocid: "collections.item.4",
  },
];

export function CollectionsGrid() {
  const sectionRef = useFadeInOnScroll<HTMLElement>();

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-3 font-medium"
            style={{ color: "oklch(var(--gold))" }}
          >
            Our Collections
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">
            Curated for the{" "}
            <span style={{ color: "oklch(var(--monk-maroon))" }}>Spirit</span>
          </h2>
        </div>

        {/* 2×2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to="/collections/$category"
              params={{ category: cat.slug }}
              data-ocid={cat.ocid}
            >
              <div
                className="relative group overflow-hidden rounded-sm category-glow cursor-pointer"
                style={{ aspectRatio: "4/3" }}
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${cat.image}')` }}
                />

                {/* Gradient overlay — monk maroon tint */}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(to top, oklch(var(--monk-maroon) / 0.85) 0%, oklch(20% 0.01 60 / 0.4) 60%, transparent 100%)",
                  }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "oklch(var(--gold) / 0.08)",
                  }}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="flex items-start gap-3">
                    <span
                      className="text-3xl leading-none"
                      style={{
                        textShadow: "0 0 10px oklch(var(--gold) / 0.5)",
                      }}
                    >
                      {cat.icon}
                    </span>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white mb-1">
                        {cat.name}
                      </h3>
                      <p
                        className="text-sm leading-snug"
                        style={{ color: "oklch(85% 0.01 80)" }}
                      >
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  {/* View all link */}
                  <div
                    className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    style={{ color: "oklch(var(--gold))" }}
                  >
                    <span>Browse Collection</span>
                    <span>→</span>
                  </div>
                </div>

                {/* Corner accent */}
                <div
                  className="absolute top-4 right-4 w-8 h-8 opacity-60"
                  style={{ color: "oklch(var(--gold))" }}
                >
                  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
                    <path
                      d="M32 0 L32 32 L0 32"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all CTA */}
        <div className="text-center mt-10">
          <Link to="/collections">
            <button
              type="button"
              className="btn-gold px-8 py-3 text-sm font-semibold tracking-widest uppercase rounded-sm"
            >
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
