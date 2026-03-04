import type { Product } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts, useSeedProducts } from "@/hooks/useQueries";
import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const CATEGORIES = [
  "All",
  "Sacred Wall Art",
  "3D Printed Buddhist Symbols",
  "Custom Name Plates",
  "Himalayan Inspired Decor",
];

const FALLBACK_IMAGES: Record<string, string> = {
  "Sacred Wall Art": "/assets/generated/product-wall-art.dim_800x800.jpg",
  "3D Printed Buddhist Symbols":
    "/assets/generated/product-3d-symbol.dim_800x800.jpg",
  "Custom Name Plates": "/assets/generated/product-nameplate.dim_800x800.jpg",
  "Himalayan Inspired Decor": "/assets/generated/product-decor.dim_800x800.jpg",
};

function priceDisplay(priceInCents: bigint): string {
  const amount = Number(priceInCents) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const imgSrc =
    product.imageUrl ||
    FALLBACK_IMAGES[product.category] ||
    "/assets/generated/product-wall-art.dim_800x800.jpg";

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      data-ocid={`products.item.${index + 1}`}
    >
      <article
        className="group rounded-sm overflow-hidden product-card-hover cursor-pointer"
        style={{
          background: "oklch(var(--card))",
          border: "1px solid oklch(var(--border))",
        }}
      >
        {/* Image */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: "1/1" }}
        >
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay on hover */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "oklch(20% 0.01 60 / 0.6)" }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-sm"
              style={{
                border: "1px solid oklch(var(--gold))",
                color: "oklch(var(--gold))",
              }}
            >
              View Details
            </span>
          </div>
          {/* Engraving badge */}
          {product.engravingAvailable && (
            <div
              className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded-sm font-medium"
              style={{
                background: "oklch(var(--monk-maroon))",
                color: "oklch(var(--parchment))",
              }}
            >
              ✦ Engravable
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <Badge
            variant="secondary"
            className="text-xs mb-2"
            style={{
              background: "oklch(var(--gold) / 0.12)",
              color: "oklch(var(--monk-maroon))",
              border: "none",
            }}
          >
            {product.category}
          </Badge>
          <h3 className="font-serif text-base font-semibold text-foreground mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span
              className="font-serif text-lg font-bold"
              style={{ color: "oklch(var(--monk-maroon))" }}
            >
              {priceDisplay(product.priceInCents)}
            </span>
            <span
              className="text-xs uppercase tracking-wider font-semibold"
              style={{ color: "oklch(var(--gold))" }}
            >
              View →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function ProductSkeleton() {
  return (
    <div
      className="rounded-sm overflow-hidden"
      style={{ border: "1px solid oklch(var(--border))" }}
    >
      <Skeleton className="w-full aspect-square" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <div className="flex justify-between mt-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

export function CollectionsPage() {
  const { data: products, isLoading } = useProducts();
  const { mutate: seedProducts } = useSeedProducts();
  const params = useParams({ strict: false }) as { category?: string };

  // Map URL slug to display name
  const slugToCategory = (slug: string) => {
    return slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const initialCategory = params.category
    ? slugToCategory(params.category)
    : "All";

  const [activeCategory, setActiveCategory] = useState(
    CATEGORIES.includes(initialCategory) ? initialCategory : "All",
  );

  // Seed if empty
  useEffect(() => {
    if (!isLoading && products && products.length === 0) {
      seedProducts();
    }
  }, [isLoading, products, seedProducts]);

  const filtered =
    activeCategory === "All"
      ? (products ?? [])
      : (products ?? []).filter((p) => p.category === activeCategory);

  return (
    <main className="pt-32 pb-20 px-6 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-2 font-medium"
            style={{ color: "oklch(var(--gold))" }}
          >
            Our Offerings
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Collections
          </h1>
          <p className="mt-3 text-muted-foreground max-w-lg">
            Every piece crafted with intention, inspired by the mountains and
            monasteries of Ladakh.
          </p>
        </div>

        {/* Category tabs */}
        <div
          className="flex flex-wrap gap-2 mb-10 pb-4"
          style={{ borderBottom: "1px solid oklch(var(--border))" }}
        >
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all duration-200"
              data-ocid="collections.tab"
              style={
                activeCategory === cat
                  ? {
                      background: "oklch(var(--monk-maroon))",
                      color: "oklch(var(--parchment))",
                    }
                  : {
                      background: "oklch(var(--secondary))",
                      color: "oklch(var(--muted-foreground))",
                      border: "1px solid oklch(var(--border))",
                    }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="products.loading_state"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <ProductSkeleton key={`skel-${n}`} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20" data-ocid="products.empty_state">
            <div className="text-5xl mb-4">☸</div>
            <h3 className="font-serif text-xl font-bold text-foreground mb-2">
              No products yet
            </h3>
            <p className="text-muted-foreground text-sm">
              Our artisans are crafting something beautiful for this collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
