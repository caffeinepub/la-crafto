import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAllOrders,
  useContactMessages,
  useIsAdmin,
  useSeedProducts,
} from "@/hooks/useQueries";
import { Loader2, ShieldX } from "lucide-react";
import { toast } from "sonner";

function priceDisplay(priceInCents: bigint): string {
  const amount = Number(priceInCents) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function AdminPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: orders, isLoading: ordersLoading } = useAllOrders();
  const { data: messages, isLoading: messagesLoading } = useContactMessages();
  const { mutate: seedProducts, isPending: seeding } = useSeedProducts();

  function handleSeed() {
    seedProducts(undefined, {
      onSuccess: () => toast.success("Products seeded successfully!"),
      onError: () => toast.error("Failed to seed products."),
    });
  }

  if (adminLoading) {
    return (
      <main className="pt-32 pb-20 px-6 min-h-screen bg-background flex items-center justify-center">
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: "oklch(var(--gold))" }}
          data-ocid="admin.loading_state"
        />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="pt-32 pb-20 px-6 min-h-screen bg-background flex items-center justify-center">
        <div
          className="text-center p-10 rounded-sm"
          style={{
            border: "1px solid oklch(var(--destructive) / 0.3)",
            background: "oklch(var(--card))",
          }}
          data-ocid="admin.error_state"
        >
          <ShieldX
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: "oklch(var(--destructive))" }}
          />
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-sm text-muted-foreground">
            You don't have permission to access this area.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 px-6 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p
              className="text-xs uppercase tracking-[0.3em] mb-1 font-medium"
              style={{ color: "oklch(var(--gold))" }}
            >
              Admin Panel
            </p>
            <h1 className="font-serif text-4xl font-bold text-foreground">
              Dashboard
            </h1>
          </div>
          <button
            type="button"
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold uppercase tracking-wider rounded-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "oklch(var(--monk-maroon))" }}
            data-ocid="admin.primary_button"
          >
            {seeding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Seeding…
              </>
            ) : (
              "Seed Products"
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Orders */}
          <div
            className="rounded-sm overflow-hidden"
            style={{ border: "1px solid oklch(var(--border))" }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{
                borderBottom: "1px solid oklch(var(--border))",
                background: "oklch(var(--card))",
              }}
            >
              <h2 className="font-serif text-lg font-bold text-foreground">
                All Orders
              </h2>
              <Badge
                style={{
                  background: "oklch(var(--gold) / 0.15)",
                  color: "oklch(var(--monk-maroon))",
                  border: "none",
                }}
              >
                {orders?.length ?? 0}
              </Badge>
            </div>

            {ordersLoading ? (
              <div className="p-6 space-y-3" data-ocid="admin.loading_state">
                {[1, 2, 3].map((n) => (
                  <Skeleton key={`order-skel-${n}`} className="h-16 w-full" />
                ))}
              </div>
            ) : !orders?.length ? (
              <div
                className="p-8 text-center text-muted-foreground text-sm"
                data-ocid="admin.orders.empty_state"
              >
                No orders yet
              </div>
            ) : (
              <div className="divide-y divide-border">
                {orders.map((order, i) => (
                  <div
                    key={order.orderId}
                    className="px-6 py-4 bg-card"
                    data-ocid={`admin.orders.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-mono text-muted-foreground mb-1 truncate max-w-48">
                          #{order.orderId}
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p
                          className="font-serif text-sm font-bold"
                          style={{ color: "oklch(var(--monk-maroon))" }}
                        >
                          {priceDisplay(order.totalAmount)}
                        </p>
                        <Badge
                          className="text-xs mt-1"
                          variant={
                            order.orderStatus.__kind__ === "paid"
                              ? "default"
                              : "secondary"
                          }
                          style={
                            order.orderStatus.__kind__ === "paid"
                              ? {
                                  background: "oklch(55% 0.15 145 / 0.15)",
                                  color: "oklch(40% 0.15 145)",
                                  border: "none",
                                }
                              : {}
                          }
                        >
                          {order.orderStatus.__kind__}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Messages */}
          <div
            className="rounded-sm overflow-hidden"
            style={{ border: "1px solid oklch(var(--border))" }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{
                borderBottom: "1px solid oklch(var(--border))",
                background: "oklch(var(--card))",
              }}
            >
              <h2 className="font-serif text-lg font-bold text-foreground">
                Contact Messages
              </h2>
              <Badge
                style={{
                  background: "oklch(var(--sky-blue) / 0.15)",
                  color: "oklch(var(--sky-blue))",
                  border: "none",
                }}
              >
                {messages?.length ?? 0}
              </Badge>
            </div>

            {messagesLoading ? (
              <div className="p-6 space-y-3" data-ocid="admin.loading_state">
                {[1, 2, 3].map((n) => (
                  <Skeleton key={`msg-skel-${n}`} className="h-20 w-full" />
                ))}
              </div>
            ) : !messages?.length ? (
              <div
                className="p-8 text-center text-muted-foreground text-sm"
                data-ocid="admin.messages.empty_state"
              >
                No messages yet
              </div>
            ) : (
              <div className="divide-y divide-border">
                {messages.map((msg, i) => (
                  <div
                    key={`${msg.email}-${i}`}
                    className="px-6 py-4 bg-card"
                    data-ocid={`admin.messages.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-semibold text-foreground">
                        {msg.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-36">
                        {msg.email}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
