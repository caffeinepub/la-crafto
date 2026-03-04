import type { Order } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useUserOrders } from "@/hooks/useQueries";
import {
  KeyRound,
  Loader2,
  PackageOpen,
  ShoppingBag,
  User,
} from "lucide-react";

function formatINR(priceInCents: bigint): string {
  const amount = Number(priceInCents) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function truncate(str: string, max = 20): string {
  if (str.length <= max) return str;
  return `${str.slice(0, max)}…`;
}

function OrderStatusBadge({ order }: { order: Order }) {
  const kind = order.orderStatus.__kind__;
  if (kind === "paid") {
    return (
      <Badge
        className="text-xs capitalize"
        style={{
          background: "oklch(55% 0.15 145 / 0.15)",
          color: "oklch(35% 0.15 145)",
          border: "1px solid oklch(55% 0.15 145 / 0.3)",
        }}
      >
        Paid
      </Badge>
    );
  }
  if (kind === "shipped") {
    return (
      <Badge
        className="text-xs capitalize"
        style={{
          background: "oklch(42% 0.12 250 / 0.15)",
          color: "oklch(42% 0.12 250)",
          border: "1px solid oklch(42% 0.12 250 / 0.3)",
        }}
      >
        Shipped
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="text-xs capitalize">
      Pending
    </Badge>
  );
}

function OrderCard({ order, index }: { order: Order; index: number }) {
  return (
    <div
      className="px-5 py-4 rounded-sm bg-card hover:bg-secondary/40 transition-colors"
      style={{ border: "1px solid oklch(var(--border))" }}
      data-ocid={`account.orders.item.${index}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-mono text-muted-foreground mb-1 truncate">
            #{truncate(order.orderId, 24)}
          </p>
          <p className="text-sm font-medium text-foreground">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </p>
          {order.items.length > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {order.items
                .slice(0, 2)
                .map((it) => it.product.name)
                .join(", ")}
              {order.items.length > 2 ? ` +${order.items.length - 2} more` : ""}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 text-right flex flex-col items-end gap-1.5">
          <p
            className="font-serif text-sm font-bold"
            style={{ color: "oklch(var(--monk-maroon))" }}
          >
            {formatINR(order.totalAmount)}
          </p>
          <OrderStatusBadge order={order} />
        </div>
      </div>
    </div>
  );
}

export function AccountPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();
  const principal = identity?.getPrincipal().toString() ?? "";

  const { data: orders, isLoading: ordersLoading } = useUserOrders();

  if (!isLoggedIn) {
    return (
      <main className="pt-32 pb-20 px-6 min-h-screen bg-background flex items-center justify-center">
        <div
          className="text-center p-10 rounded-sm max-w-sm w-full"
          style={{
            border: "1px solid oklch(var(--gold) / 0.3)",
            background: "oklch(var(--card))",
          }}
          data-ocid="account.login_panel"
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "oklch(var(--gold) / 0.1)" }}
          >
            <User className="w-7 h-7" style={{ color: "oklch(var(--gold))" }} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
            My Account
          </h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Sign in with Internet Identity to view your order history and manage
            your account.
          </p>
          <Button
            type="button"
            onClick={login}
            disabled={isLoggingIn}
            className="w-full text-white font-semibold"
            style={{ background: "oklch(var(--monk-maroon))" }}
            data-ocid="account.login.primary_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting…
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4 mr-2" />
                Connect with Internet Identity
              </>
            )}
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 px-6 min-h-screen bg-background">
      <div className="max-w-3xl mx-auto">
        {/* Page header */}
        <div className="mb-10">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-1 font-medium"
            style={{ color: "oklch(var(--gold))" }}
          >
            My Account
          </p>
          <h1 className="font-serif text-4xl font-bold text-foreground mb-3">
            Welcome Back
          </h1>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm"
            style={{
              background: "oklch(var(--muted))",
              border: "1px solid oklch(var(--border))",
            }}
          >
            <User
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: "oklch(var(--gold))" }}
            />
            <span className="text-xs font-mono text-muted-foreground truncate max-w-[280px] sm:max-w-none">
              {principal}
            </span>
          </div>
        </div>

        {/* Mandala divider */}
        <div className="flex items-center gap-4 mb-8 opacity-50">
          <div
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, oklch(var(--gold) / 0.6))",
            }}
          />
          <span className="text-xl" style={{ color: "oklch(var(--gold))" }}>
            ✦
          </span>
          <div
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(to left, transparent, oklch(var(--gold) / 0.6))",
            }}
          />
        </div>

        {/* Orders section */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <ShoppingBag
              className="w-5 h-5"
              style={{ color: "oklch(var(--gold))" }}
            />
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Order History
            </h2>
            {orders && orders.length > 0 && (
              <Badge
                style={{
                  background: "oklch(var(--gold) / 0.15)",
                  color: "oklch(var(--monk-maroon))",
                  border: "none",
                }}
              >
                {orders.length}
              </Badge>
            )}
          </div>

          {ordersLoading ? (
            <div className="space-y-3" data-ocid="account.orders.loading_state">
              {[1, 2, 3].map((n) => (
                <Skeleton
                  key={`order-skel-${n}`}
                  className="h-20 w-full rounded-sm"
                />
              ))}
            </div>
          ) : !orders?.length ? (
            <div
              className="py-16 text-center rounded-sm"
              style={{ border: "1px dashed oklch(var(--border))" }}
              data-ocid="account.orders.empty_state"
            >
              <PackageOpen
                className="w-12 h-12 mx-auto mb-3"
                style={{ color: "oklch(var(--gold) / 0.5)" }}
              />
              <p className="font-serif text-lg text-muted-foreground mb-1">
                No orders yet
              </p>
              <p className="text-sm text-muted-foreground">
                Your order history will appear here after your first purchase.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order, i) => (
                <OrderCard key={order.orderId} order={order} index={i + 1} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
