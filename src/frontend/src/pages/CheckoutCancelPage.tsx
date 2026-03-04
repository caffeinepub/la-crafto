import { Link } from "@tanstack/react-router";
import { XCircle } from "lucide-react";

export function CheckoutCancelPage() {
  return (
    <main className="pt-32 pb-20 px-6 min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-lg mx-auto text-center">
        <div
          className="space-y-6 p-10 rounded-sm"
          style={{
            background: "oklch(var(--card))",
            border: "1px solid oklch(var(--border))",
          }}
        >
          <XCircle
            className="w-16 h-16 mx-auto"
            style={{ color: "oklch(var(--stone-grey))" }}
          />

          <div>
            <p
              className="text-xs uppercase tracking-[0.3em] mb-2 font-medium"
              style={{ color: "oklch(var(--stone-grey))" }}
            >
              Payment Cancelled
            </p>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Order Not Placed
            </h1>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Your order was not completed. Your cart items are still saved — take
            your time and return whenever you're ready.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/cart">
              <button
                type="button"
                className="px-6 py-2.5 text-sm font-semibold uppercase tracking-widest rounded-sm text-white transition-opacity hover:opacity-90"
                style={{ background: "oklch(var(--monk-maroon))" }}
                data-ocid="checkout.primary_button"
              >
                Return to Cart
              </button>
            </Link>
            <Link to="/collections">
              <button
                type="button"
                className="px-6 py-2.5 text-sm font-medium rounded-sm transition-colors hover:bg-muted"
                style={{ border: "1px solid oklch(var(--border))" }}
              >
                Browse Collections
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
