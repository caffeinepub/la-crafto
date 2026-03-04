import type { ShoppingItem } from "@/backend.d";
import { useCart } from "@/context/CartContext";
import { useCreateCheckoutSession } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

function priceDisplay(priceInCents: bigint): string {
  const amount = Number(priceInCents) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function CartPage() {
  const { items, removeItem, updateQuantity, clearItems, totalAmount } =
    useCart();
  const navigate = useNavigate();
  const { mutateAsync: createCheckout, isPending } = useCreateCheckoutSession();

  async function handleCheckout() {
    if (items.length === 0) return;
    const shoppingItems: ShoppingItem[] = items
      .filter((item) => item.product)
      .map((item) => ({
        productName: item.product!.name,
        productDescription: item.product!.description,
        priceInCents: item.product!.priceInCents,
        quantity: item.quantity,
        currency: "inr",
      }));
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

  if (items.length === 0) {
    return (
      <main className="pt-32 pb-20 px-6 min-h-screen bg-background flex items-center justify-center">
        <div className="text-center" data-ocid="cart.empty_state">
          <ShoppingBag
            className="w-16 h-16 mx-auto mb-6"
            style={{ color: "oklch(var(--stone-grey))" }}
          />
          <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            Each piece you add carries the spirit of the Himalayas. Start
            exploring our collections.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/collections" })}
            className="btn-gold px-8 py-3 text-sm font-semibold uppercase tracking-widest rounded-sm"
            data-ocid="cart.primary_button"
          >
            Explore Collections
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 px-6 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-2 font-medium"
            style={{ color: "oklch(var(--gold))" }}
          >
            Your Selection
          </p>
          <h1 className="font-serif text-4xl font-bold text-foreground">
            Shopping Cart
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {items.length} item{items.length !== 1 ? "s" : ""} from Ladakh
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => {
              const imgSrc =
                item.product?.imageUrl ||
                "/assets/generated/product-wall-art.dim_800x800.jpg";

              return (
                <div
                  key={item.productId}
                  data-ocid={`cart.item.${i + 1}`}
                  className="flex gap-4 p-4 rounded-sm"
                  style={{
                    background: "oklch(var(--card))",
                    border: "1px solid oklch(var(--border))",
                  }}
                >
                  {/* Image */}
                  <img
                    src={imgSrc}
                    alt={item.product?.name || "Product"}
                    className="w-20 h-20 object-cover rounded-sm flex-shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base font-semibold text-foreground truncate">
                      {item.product?.name || "Handcrafted Item"}
                    </h3>
                    {item.engravingText && (
                      <p
                        className="text-xs mt-0.5 italic"
                        style={{ color: "oklch(var(--gold))" }}
                      >
                        Engraving: "{item.engravingText}"
                      </p>
                    )}
                    <p
                      className="text-sm font-bold mt-1"
                      style={{ color: "oklch(var(--monk-maroon))" }}
                    >
                      {item.product
                        ? priceDisplay(item.product.priceInCents)
                        : ""}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-3">
                      <div
                        className="flex items-center rounded-sm overflow-hidden"
                        style={{ border: "1px solid oklch(var(--border))" }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1n)
                          }
                          className="px-2 py-1 hover:bg-muted transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 text-sm font-medium min-w-8 text-center">
                          {Number(item.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1n)
                          }
                          className="px-2 py-1 hover:bg-muted transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="p-1.5 rounded-sm transition-colors hover:bg-destructive/10"
                        style={{ color: "oklch(var(--destructive))" }}
                        aria-label="Remove item"
                        data-ocid={`cart.delete_button.${i + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="text-right flex-shrink-0">
                    <p
                      className="font-serif text-base font-bold"
                      style={{ color: "oklch(var(--monk-maroon))" }}
                    >
                      {item.product
                        ? priceDisplay(
                            item.product.priceInCents * item.quantity,
                          )
                        : ""}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Clear cart */}
            <button
              type="button"
              onClick={clearItems}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors underline underline-offset-4"
              data-ocid="cart.delete_button"
            >
              Clear all items
            </button>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div
              className="rounded-sm p-6 sticky top-36"
              style={{
                background: "oklch(var(--card))",
                border: "1px solid oklch(var(--border))",
              }}
            >
              <h3 className="font-serif text-lg font-bold text-foreground mb-5">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    Subtotal ({items.length} item
                    {items.length !== 1 ? "s" : ""})
                  </span>
                  <span>{priceDisplay(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div
                className="h-px my-4"
                style={{ background: "oklch(var(--border))" }}
              />

              <div className="flex justify-between font-serif text-lg font-bold text-foreground mb-6">
                <span>Total</span>
                <span style={{ color: "oklch(var(--monk-maroon))" }}>
                  {priceDisplay(totalAmount)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isPending}
                className="w-full py-3 text-sm font-semibold uppercase tracking-widest rounded-sm text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: "oklch(var(--monk-maroon))" }}
                data-ocid="cart.primary_button"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Preparing checkout…
                  </>
                ) : (
                  "Proceed to Checkout"
                )}
              </button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                Secure payment via Stripe 🔒
              </p>

              {/* Trust */}
              <div
                className="mt-5 pt-5 space-y-2 text-xs text-muted-foreground"
                style={{ borderTop: "1px solid oklch(var(--border))" }}
              >
                <p>✦ Handcrafted in Ladakh, India</p>
                <p>✦ International shipping available</p>
                <p>✦ Satisfaction guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
