import type { ShoppingItem } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import { useCreateCheckoutSession, useProducts } from "@/hooks/useQueries";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, Loader2, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

export function ProductDetailPage() {
  const { id } = useParams({ from: "/product/$id" });
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [engravingText, setEngravingText] = useState("");
  const [storyExpanded, setStoryExpanded] = useState(false);
  const { mutateAsync: createCheckout, isPending: checkoutPending } =
    useCreateCheckoutSession();

  const product = products?.find((p) => p.id === id);

  if (isLoading) {
    return (
      <main className="pt-32 pb-20 px-6 min-h-screen bg-background">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton className="w-full aspect-square rounded-sm" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="pt-32 pb-20 px-6 min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">☸</div>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
            Product not found
          </h2>
          <p className="text-muted-foreground mb-6">
            This item may have found its path elsewhere.
          </p>
          <button
            type="button"
            className="btn-gold px-6 py-2 text-sm font-semibold uppercase tracking-wider rounded-sm"
            onClick={() => navigate({ to: "/collections" })}
          >
            Browse Collections
          </button>
        </div>
      </main>
    );
  }

  const imgSrc =
    product.imageUrl ||
    FALLBACK_IMAGES[product.category] ||
    "/assets/generated/product-wall-art.dim_800x800.jpg";

  function handleAddToCart() {
    addItem(product!.id, BigInt(quantity), product, engravingText || undefined);
    toast.success(`${product!.name} added to cart`, {
      description: engravingText ? `Engraving: "${engravingText}"` : undefined,
    });
  }

  async function handleBuyNow() {
    const shoppingItems: ShoppingItem[] = [
      {
        productName: product!.name,
        productDescription: product!.description,
        priceInCents: product!.priceInCents,
        quantity: BigInt(quantity),
        currency: "inr",
      },
    ];
    try {
      const successUrl = `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/checkout/cancel`;
      const url = await createCheckout({
        items: shoppingItems,
        successUrl,
        cancelUrl,
      });
      window.location.href = url;
    } catch {
      toast.error("Failed to create checkout session. Please try again.");
    }
  }

  return (
    <main className="pt-32 pb-20 px-6 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-xs text-muted-foreground mb-8 uppercase tracking-wider"
          aria-label="Breadcrumb"
        >
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="hover:text-foreground transition-colors"
            data-ocid="nav.link"
          >
            Home
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => navigate({ to: "/collections" })}
            className="hover:text-foreground transition-colors"
            data-ocid="nav.link"
          >
            Collections
          </button>
          <span>/</span>
          <span className="text-foreground truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product image */}
          <div
            className="relative rounded-sm overflow-hidden"
            style={{
              border: "1px solid oklch(var(--gold) / 0.2)",
            }}
          >
            <img
              src={imgSrc}
              alt={product.name}
              className="w-full object-cover"
              style={{ aspectRatio: "1/1" }}
            />
            {/* Blessing badge */}
            <div
              className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold"
              style={{
                background: "oklch(var(--gold) / 0.95)",
                color: "oklch(20% 0.01 60)",
              }}
            >
              ✦ Blessing Inspired Craft
            </div>
          </div>

          {/* Product details */}
          <div className="space-y-6">
            {/* Category badge */}
            <Badge
              style={{
                background: "oklch(var(--gold) / 0.15)",
                color: "oklch(var(--monk-maroon))",
                border: "none",
              }}
            >
              {product.category}
            </Badge>

            {/* Name */}
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <p
              className="font-serif text-3xl font-bold"
              style={{ color: "oklch(var(--monk-maroon))" }}
            >
              {priceDisplay(product.priceInCents)}
            </p>

            {/* Description */}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {/* Divider */}
            <div
              className="h-px"
              style={{
                background:
                  "linear-gradient(90deg, oklch(var(--gold) / 0.4), transparent)",
              }}
            />

            {/* Engraving option */}
            {product.engravingAvailable && (
              <div className="space-y-2">
                <Label
                  htmlFor="engraving"
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: "oklch(var(--monk-maroon))" }}
                >
                  ✦ Custom Engraving Text{" "}
                  <span className="text-muted-foreground font-normal normal-case tracking-normal">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="engraving"
                  value={engravingText}
                  onChange={(e) => setEngravingText(e.target.value)}
                  placeholder="Enter name, mantra, or message..."
                  maxLength={50}
                  data-ocid="product.input"
                  className="rounded-sm"
                  style={{
                    border: "1px solid oklch(var(--gold) / 0.4)",
                    background: "oklch(98% 0.01 80)",
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  {engravingText.length}/50 characters — hand-finished by our
                  artisans
                </p>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold uppercase tracking-wider text-foreground">
                Quantity
              </span>
              <div
                className="flex items-center rounded-sm overflow-hidden"
                style={{ border: "1px solid oklch(var(--border))" }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 transition-colors hover:bg-muted"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-4 py-2 text-sm font-medium min-w-10 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="px-3 py-2 transition-colors hover:bg-muted"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn-gold flex-1 px-6 py-3 text-sm font-semibold tracking-widest uppercase rounded-sm"
                data-ocid="product.primary_button"
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={checkoutPending}
                className="flex-1 px-6 py-3 text-sm font-semibold tracking-widest uppercase rounded-sm text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                style={{ background: "oklch(var(--monk-maroon))" }}
                data-ocid="product.secondary_button"
              >
                {checkoutPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing…
                  </span>
                ) : (
                  "Buy Now"
                )}
              </button>
            </div>

            {/* Story section */}
            {product.story && (
              <div
                className="rounded-sm overflow-hidden"
                style={{ border: "1px solid oklch(var(--border))" }}
              >
                <button
                  type="button"
                  onClick={() => setStoryExpanded(!storyExpanded)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-semibold uppercase tracking-wider text-foreground">
                    ✦ Story Behind This Design
                  </span>
                  {storyExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                {storyExpanded && (
                  <div
                    className="px-5 pb-5"
                    style={{ borderTop: "1px solid oklch(var(--border))" }}
                  >
                    <p className="text-sm leading-relaxed text-muted-foreground mt-4 font-serif-body italic">
                      {product.story}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: "🙏", label: "Handcrafted" },
                { icon: "🏔", label: "From Ladakh" },
                { icon: "✦", label: "Blessed with Intent" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="text-center p-3 rounded-sm"
                  style={{
                    background: "oklch(var(--secondary))",
                    border: "1px solid oklch(var(--border))",
                  }}
                >
                  <div className="text-lg mb-1">{badge.icon}</div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {badge.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
