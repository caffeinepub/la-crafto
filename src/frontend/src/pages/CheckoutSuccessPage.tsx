import { useCart } from "@/context/CartContext";
import { useStripeSessionStatus } from "@/hooks/useQueries";
import { Link, useSearch } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect } from "react";

export function CheckoutSuccessPage() {
  const search = useSearch({ strict: false }) as { session_id?: string };
  const sessionId = search.session_id ?? null;
  const { data: status, isLoading } = useStripeSessionStatus(sessionId);
  const { clearItems } = useCart();

  useEffect(() => {
    if (status?.__kind__ === "completed") {
      clearItems();
    }
  }, [status, clearItems]);

  return (
    <main className="pt-32 pb-20 px-6 min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-lg mx-auto text-center">
        {isLoading ? (
          <div data-ocid="checkout.loading_state" className="space-y-4">
            <Loader2
              className="w-12 h-12 animate-spin mx-auto"
              style={{ color: "oklch(var(--gold))" }}
            />
            <p className="text-muted-foreground">
              Confirming your sacred order…
            </p>
          </div>
        ) : (
          <div
            className="space-y-6 p-10 rounded-sm"
            style={{
              background: "oklch(var(--card))",
              border: "1px solid oklch(var(--gold) / 0.3)",
              boxShadow: "0 0 40px oklch(var(--gold) / 0.08)",
            }}
            data-ocid="checkout.success_state"
          >
            <CheckCircle2
              className="w-16 h-16 mx-auto"
              style={{ color: "oklch(55% 0.15 145)" }}
            />

            <div>
              <p
                className="text-xs uppercase tracking-[0.3em] mb-2 font-medium"
                style={{ color: "oklch(var(--gold))" }}
              >
                Order Confirmed
              </p>
              <h1 className="font-serif text-3xl font-bold text-foreground">
                Thank You for Your Order
              </h1>
            </div>

            <div
              className="h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(var(--gold) / 0.4), transparent)",
              }}
            />

            <p className="font-serif-body text-lg italic text-muted-foreground leading-relaxed">
              "May your new piece from Ladakh bring peace, beauty, and the
              spirit of the Himalayas into your home."
            </p>

            <p className="text-sm text-muted-foreground">
              Our artisans will craft and ship your order with the same devotion
              they put into every creation. You'll receive a confirmation email
              shortly.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/collections">
                <button
                  type="button"
                  className="btn-gold px-6 py-2.5 text-sm font-semibold uppercase tracking-widest rounded-sm"
                >
                  Continue Shopping
                </button>
              </Link>
              <Link to="/">
                <button
                  type="button"
                  className="px-6 py-2.5 text-sm font-medium rounded-sm transition-colors hover:bg-muted"
                  style={{ border: "1px solid oklch(var(--border))" }}
                >
                  Return Home
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
