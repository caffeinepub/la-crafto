import type { Product } from "@/backend.d";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useAddProduct,
  useAllOrders,
  useContactMessages,
  useDeleteProduct,
  useProducts,
  useSeedProducts,
  useUpdateProduct,
} from "@/hooks/useQueries";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  CreditCard,
  Edit2,
  KeyRound,
  Loader2,
  MessageSquare,
  Package,
  PlusCircle,
  ShieldAlert,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Local hook that checks admin status once the actor is ready.
// Fixes React Query v5 bug: when `enabled: false` and no cached data,
// `isPending` is `true`, causing an infinite spinner. We guard against
// that by treating the actor's own fetching state as "not yet loading".
function useAdminStatus() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !actorFetching,
  });

  // While the actor itself is still initialising, suppress the loading state
  // so the UI never gets stuck on a spinner caused by a disabled query.
  return {
    ...query,
    isLoading: actorFetching ? false : query.isLoading,
  };
}

const CATEGORIES = [
  "Sacred Wall Art",
  "3D Printed Buddhist Symbols",
  "Custom Name Plates",
  "Himalayan Inspired Decor",
] as const;

function priceDisplay(priceInCents: bigint): string {
  const amount = Number(priceInCents) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

type ProductFormData = {
  name: string;
  priceInr: string;
  description: string;
  category: string;
  imageUrl: string;
  story: string;
  engravingAvailable: boolean;
};

const EMPTY_FORM: ProductFormData = {
  name: "",
  priceInr: "",
  description: "",
  category: "",
  imageUrl: "",
  story: "",
  engravingAvailable: false,
};

function ProductFormDialog({
  open,
  onOpenChange,
  editingProduct,
  onClose,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editingProduct: Product | null;
  onClose: () => void;
}) {
  const { mutate: addProduct, isPending: isAdding } = useAddProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const isPending = isAdding || isUpdating;

  const [form, setForm] = useState<ProductFormData>(() => {
    if (editingProduct) {
      return {
        name: editingProduct.name,
        priceInr: (Number(editingProduct.priceInCents) / 100).toString(),
        description: editingProduct.description,
        category: editingProduct.category,
        imageUrl: editingProduct.imageUrl,
        story: editingProduct.story,
        engravingAvailable: editingProduct.engravingAvailable,
      };
    }
    return EMPTY_FORM;
  });

  function handleChange(field: keyof ProductFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const priceNum = Number.parseFloat(form.priceInr);
    if (
      !form.name.trim() ||
      Number.isNaN(priceNum) ||
      priceNum <= 0 ||
      !form.category
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const product: Product = {
      id: editingProduct ? editingProduct.id : Date.now().toString(),
      name: form.name.trim(),
      description: form.description.trim(),
      story: form.story.trim(),
      imageUrl: form.imageUrl.trim(),
      category: form.category,
      engravingAvailable: form.engravingAvailable,
      priceInCents: BigInt(Math.round(priceNum * 100)),
    };

    if (editingProduct) {
      updateProduct(product, {
        onSuccess: () => {
          toast.success(`"${product.name}" updated successfully.`);
          onClose();
        },
        onError: () => toast.error("Failed to update product."),
      });
    } else {
      addProduct(product, {
        onSuccess: () => {
          toast.success(`"${product.name}" added successfully.`);
          onClose();
        },
        onError: () => toast.error("Failed to add product."),
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        style={{
          background: "oklch(var(--card))",
          border: "1px solid oklch(var(--border))",
        }}
      >
        <DialogHeader>
          <DialogTitle
            className="font-serif text-xl"
            style={{ color: "oklch(var(--monk-maroon))" }}
          >
            {editingProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="product-name"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Name *
            </Label>
            <Input
              id="product-name"
              data-ocid="admin.product_form.name.input"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Dharma Wheel Wall Art"
              required
              style={{
                background: "oklch(var(--input))",
                border: "1px solid oklch(var(--border))",
              }}
            />
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <Label
              htmlFor="product-price"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Price (INR) *
            </Label>
            <Input
              id="product-price"
              data-ocid="admin.product_form.price.input"
              type="number"
              min="1"
              step="0.01"
              value={form.priceInr}
              onChange={(e) => handleChange("priceInr", e.target.value)}
              placeholder="e.g. 1500"
              required
              style={{
                background: "oklch(var(--input))",
                border: "1px solid oklch(var(--border))",
              }}
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Category *
            </Label>
            <Select
              value={form.category}
              onValueChange={(v) => handleChange("category", v)}
            >
              <SelectTrigger
                data-ocid="admin.product_form.category.select"
                style={{
                  background: "oklch(var(--input))",
                  border: "1px solid oklch(var(--border))",
                }}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent
                style={{
                  background: "oklch(var(--card))",
                  border: "1px solid oklch(var(--border))",
                }}
              >
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image URL */}
          <div className="space-y-1.5">
            <Label
              htmlFor="product-image"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Image URL
            </Label>
            <Input
              id="product-image"
              data-ocid="admin.product_form.imageurl.input"
              value={form.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              placeholder="https://example.com/image.jpg"
              style={{
                background: "oklch(var(--input))",
                border: "1px solid oklch(var(--border))",
              }}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="product-description"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Description
            </Label>
            <Textarea
              id="product-description"
              data-ocid="admin.product_form.description.textarea"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="A brief description of the product…"
              rows={3}
              style={{
                background: "oklch(var(--input))",
                border: "1px solid oklch(var(--border))",
              }}
            />
          </div>

          {/* Story */}
          <div className="space-y-1.5">
            <Label
              htmlFor="product-story"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Story Behind Design
            </Label>
            <Textarea
              id="product-story"
              data-ocid="admin.product_form.story.textarea"
              value={form.story}
              onChange={(e) => handleChange("story", e.target.value)}
              placeholder="The meaning and inspiration behind this piece…"
              rows={3}
              style={{
                background: "oklch(var(--input))",
                border: "1px solid oklch(var(--border))",
              }}
            />
          </div>

          {/* Engraving */}
          <div className="flex items-center gap-3 py-1">
            <Checkbox
              id="product-engraving"
              data-ocid="admin.product_form.engraving.checkbox"
              checked={form.engravingAvailable}
              onCheckedChange={(checked) =>
                handleChange("engravingAvailable", Boolean(checked))
              }
              style={{ borderColor: "oklch(var(--gold))" }}
            />
            <Label
              htmlFor="product-engraving"
              className="text-sm cursor-pointer"
            >
              Engraving Available
            </Label>
          </div>

          <DialogFooter className="mt-6 flex gap-2">
            <Button
              type="button"
              variant="outline"
              data-ocid="admin.product_form.cancel_button"
              onClick={onClose}
              disabled={isPending}
              style={{ border: "1px solid oklch(var(--border))" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="admin.product_form.submit_button"
              disabled={isPending}
              className="text-white"
              style={{ background: "oklch(var(--monk-maroon))" }}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {editingProduct ? "Updating…" : "Adding…"}
                </>
              ) : editingProduct ? (
                "Save Changes"
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ProductsTab() {
  const { data: products, isLoading } = useProducts();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  function openAdd() {
    setEditingProduct(null);
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingProduct(null);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteProduct(deleteTarget.id, {
      onSuccess: () => {
        toast.success(`"${deleteTarget.name}" deleted.`);
        setDeleteTarget(null);
      },
      onError: () => {
        toast.error("Failed to delete product.");
        setDeleteTarget(null);
      },
    });
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package
            className="w-5 h-5"
            style={{ color: "oklch(var(--gold))" }}
          />
          <span className="font-serif text-lg font-semibold text-foreground">
            Product Catalog
          </span>
          {products && (
            <Badge
              style={{
                background: "oklch(var(--gold) / 0.15)",
                color: "oklch(var(--monk-maroon))",
                border: "none",
              }}
            >
              {products.length}
            </Badge>
          )}
        </div>
        <Button
          type="button"
          data-ocid="admin.add_product.open_modal_button"
          onClick={openAdd}
          className="flex items-center gap-2 text-white text-sm font-medium"
          style={{ background: "oklch(var(--monk-maroon))" }}
        >
          <PlusCircle className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3" data-ocid="admin.products.loading_state">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton
              key={`prod-skel-${n}`}
              className="h-16 w-full rounded-sm"
            />
          ))}
        </div>
      ) : !products?.length ? (
        <div
          className="py-16 text-center rounded-sm"
          style={{ border: "1px dashed oklch(var(--border))" }}
          data-ocid="admin.products.empty_state"
        >
          <Package
            className="w-12 h-12 mx-auto mb-3"
            style={{ color: "oklch(var(--gold) / 0.5)" }}
          />
          <p className="font-serif text-lg text-muted-foreground mb-1">
            No products yet
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Add your first product or seed with sample items.
          </p>
          <Button
            type="button"
            onClick={openAdd}
            variant="outline"
            className="text-sm"
            style={{
              border: "1px solid oklch(var(--gold))",
              color: "oklch(var(--gold))",
            }}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add First Product
          </Button>
        </div>
      ) : (
        <div
          className="rounded-sm overflow-hidden"
          style={{ border: "1px solid oklch(var(--border))" }}
        >
          {/* Table header */}
          <div
            className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-2.5 text-xs uppercase tracking-widest text-muted-foreground font-medium"
            style={{
              background: "oklch(var(--muted))",
              borderBottom: "1px solid oklch(var(--border))",
            }}
          >
            <span>Product</span>
            <span className="text-right min-w-[80px]">Price</span>
            <span className="text-center min-w-[90px]">Engraving</span>
            <span className="text-right min-w-[90px]">Actions</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border bg-card">
            {products.map((product, i) => (
              <div
                key={product.id}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-3 items-center hover:bg-secondary/50 transition-colors"
                data-ocid={`admin.products.item.${i + 1}`}
              >
                {/* Name + Category */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {product.category}
                  </p>
                </div>

                {/* Price */}
                <div
                  className="text-right font-serif text-sm font-semibold min-w-[80px]"
                  style={{ color: "oklch(var(--monk-maroon))" }}
                >
                  {priceDisplay(product.priceInCents)}
                </div>

                {/* Engraving badge */}
                <div className="text-center min-w-[90px]">
                  {product.engravingAvailable ? (
                    <Badge
                      className="text-xs"
                      style={{
                        background: "oklch(var(--gold) / 0.15)",
                        color: "oklch(55% 0.12 85)",
                        border: "none",
                      }}
                    >
                      Available
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 justify-end min-w-[90px]">
                  <button
                    type="button"
                    data-ocid={`admin.products.edit_button.${i + 1}`}
                    onClick={() => openEdit(product)}
                    className="p-1.5 rounded-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2"
                    style={{ color: "oklch(var(--sky-blue))" }}
                    title="Edit product"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    data-ocid={`admin.products.delete_button.${i + 1}`}
                    onClick={() => setDeleteTarget(product)}
                    className="p-1.5 rounded-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2"
                    style={{ color: "oklch(var(--destructive))" }}
                    title="Delete product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <ProductFormDialog
        open={formOpen}
        onOpenChange={(v) => {
          if (!v) closeForm();
          setFormOpen(v);
        }}
        editingProduct={editingProduct}
        onClose={closeForm}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => {
          if (!v) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent
          data-ocid="admin.delete_confirm.dialog"
          style={{
            background: "oklch(var(--card))",
            border: "1px solid oklch(var(--border))",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl text-foreground">
              Delete Product?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm">
              This will permanently remove{" "}
              <strong className="text-foreground">
                "{deleteTarget?.name}"
              </strong>{" "}
              from your catalog. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="admin.delete_confirm.cancel_button"
              style={{ border: "1px solid oklch(var(--border))" }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="admin.delete_confirm.confirm_button"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="text-white"
              style={{ background: "oklch(var(--destructive))" }}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function OrdersTab() {
  const { data: orders, isLoading: ordersLoading } = useAllOrders();

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <span className="font-serif text-lg font-semibold text-foreground">
          All Orders
        </span>
        {orders && (
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
        <div className="space-y-3" data-ocid="admin.orders.loading_state">
          {[1, 2, 3].map((n) => (
            <Skeleton
              key={`order-skel-${n}`}
              className="h-16 w-full rounded-sm"
            />
          ))}
        </div>
      ) : !orders?.length ? (
        <div
          className="p-10 text-center text-muted-foreground text-sm rounded-sm"
          style={{ border: "1px dashed oklch(var(--border))" }}
          data-ocid="admin.orders.empty_state"
        >
          No orders yet
        </div>
      ) : (
        <div
          className="rounded-sm overflow-hidden"
          style={{ border: "1px solid oklch(var(--border))" }}
        >
          <div className="divide-y divide-border">
            {orders.map((order, i) => (
              <div
                key={order.orderId}
                className="px-5 py-4 bg-card hover:bg-secondary/40 transition-colors"
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
        </div>
      )}
    </div>
  );
}

function MessagesTab() {
  const { data: messages, isLoading: messagesLoading } = useContactMessages();

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <span className="font-serif text-lg font-semibold text-foreground">
          Contact Messages
        </span>
        {messages && (
          <Badge
            style={{
              background: "oklch(var(--sky-blue) / 0.15)",
              color: "oklch(var(--sky-blue))",
              border: "none",
            }}
          >
            {messages.length}
          </Badge>
        )}
      </div>

      {messagesLoading ? (
        <div className="space-y-3" data-ocid="admin.messages.loading_state">
          {[1, 2, 3].map((n) => (
            <Skeleton
              key={`msg-skel-${n}`}
              className="h-20 w-full rounded-sm"
            />
          ))}
        </div>
      ) : !messages?.length ? (
        <div
          className="p-10 text-center text-muted-foreground text-sm rounded-sm"
          style={{ border: "1px dashed oklch(var(--border))" }}
          data-ocid="admin.messages.empty_state"
        >
          No messages yet
        </div>
      ) : (
        <div
          className="rounded-sm overflow-hidden"
          style={{ border: "1px solid oklch(var(--border))" }}
        >
          <div className="divide-y divide-border">
            {messages.map((msg, i) => (
              <div
                key={`${msg.email}-${i}`}
                className="px-5 py-4 bg-card hover:bg-secondary/40 transition-colors"
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
        </div>
      )}
    </div>
  );
}

function StripeConfigTab() {
  const { actor, isFetching } = useActor();
  const { data: isConfigured, isLoading: configLoading } = useQuery<boolean>({
    queryKey: ["stripeConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });

  const [secretKey, setSecretKey] = useState("");
  const [countries, setCountries] = useState("IN, US, GB, AU, CA");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) {
      toast.error("Actor not ready. Please try again.");
      return;
    }
    if (!secretKey.trim()) {
      toast.error("Please enter a Stripe secret key.");
      return;
    }
    setIsSaving(true);
    try {
      const allowedCountries = countries
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      await actor.setStripeConfiguration({
        secretKey: secretKey.trim(),
        allowedCountries,
      });
      toast.success("Stripe configuration saved successfully.");
      setSecretKey("");
    } catch {
      toast.error("Failed to save Stripe configuration.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard
          className="w-5 h-5"
          style={{ color: "oklch(var(--gold))" }}
        />
        <span className="font-serif text-lg font-semibold text-foreground">
          Stripe Configuration
        </span>
      </div>

      {/* Status banner */}
      {configLoading ? (
        <Skeleton className="h-12 w-full rounded-sm mb-6" />
      ) : isConfigured ? (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-sm mb-6"
          style={{
            background: "oklch(55% 0.15 145 / 0.1)",
            border: "1px solid oklch(55% 0.15 145 / 0.3)",
          }}
          data-ocid="admin.stripe.success_state"
        >
          <CheckCircle2
            className="w-4 h-4 flex-shrink-0"
            style={{ color: "oklch(40% 0.15 145)" }}
          />
          <p
            className="text-sm font-medium"
            style={{ color: "oklch(35% 0.15 145)" }}
          >
            Stripe is configured and ready to accept payments.
          </p>
        </div>
      ) : (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-sm mb-6"
          style={{
            background: "oklch(75% 0.14 85 / 0.1)",
            border: "1px solid oklch(75% 0.14 85 / 0.4)",
          }}
          data-ocid="admin.stripe.error_state"
        >
          <ShieldAlert
            className="w-4 h-4 flex-shrink-0"
            style={{ color: "oklch(50% 0.16 65)" }}
          />
          <p
            className="text-sm font-medium"
            style={{ color: "oklch(40% 0.1 65)" }}
          >
            Stripe is not configured. Add your secret key to enable payments.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Secret key */}
        <div className="space-y-1.5">
          <Label
            htmlFor="stripe-secret"
            className="text-xs uppercase tracking-wider text-muted-foreground"
          >
            Stripe Secret Key *
          </Label>
          <Input
            id="stripe-secret"
            type="password"
            data-ocid="admin.stripe.secretkey.input"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="sk_live_… or sk_test_…"
            autoComplete="off"
            required
            style={{
              background: "oklch(var(--input))",
              border: "1px solid oklch(var(--border))",
            }}
          />
          <p className="text-xs text-muted-foreground">
            Your Stripe secret key from the Stripe Dashboard. Keep this secure.
          </p>
        </div>

        {/* Allowed countries */}
        <div className="space-y-1.5">
          <Label
            htmlFor="stripe-countries"
            className="text-xs uppercase tracking-wider text-muted-foreground"
          >
            Allowed Countries
          </Label>
          <Input
            id="stripe-countries"
            type="text"
            data-ocid="admin.stripe.countries.input"
            value={countries}
            onChange={(e) => setCountries(e.target.value)}
            placeholder="IN, US, GB, AU, CA"
            style={{
              background: "oklch(var(--input))",
              border: "1px solid oklch(var(--border))",
            }}
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated ISO country codes for allowed shipping destinations.
          </p>
        </div>

        <Button
          type="submit"
          data-ocid="admin.stripe.submit_button"
          disabled={isSaving}
          className="text-white font-semibold"
          style={{ background: "oklch(var(--monk-maroon))" }}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving…
            </>
          ) : (
            "Save Stripe Configuration"
          )}
        </Button>
      </form>
    </div>
  );
}

function StatsPanel() {
  const { data: products } = useProducts();
  const { data: orders } = useAllOrders();
  const { data: messages } = useContactMessages();

  const stats = [
    {
      label: "Products",
      value: products?.length ?? 0,
      icon: Package,
      accent: "oklch(var(--gold))",
      bg: "oklch(var(--gold) / 0.08)",
    },
    {
      label: "Orders",
      value: orders?.length ?? 0,
      icon: ShoppingCart,
      accent: "oklch(var(--monk-maroon))",
      bg: "oklch(var(--monk-maroon) / 0.08)",
    },
    {
      label: "Messages",
      value: messages?.length ?? 0,
      icon: MessageSquare,
      accent: "oklch(var(--sky-blue))",
      bg: "oklch(var(--sky-blue) / 0.08)",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-8" data-ocid="admin.stats.panel">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-sm px-5 py-4 flex items-center gap-4"
          style={{
            background: stat.bg,
            border: `1px solid ${stat.accent.replace(")", " / 0.2)")}`,
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: stat.bg }}
          >
            <stat.icon className="w-5 h-5" style={{ color: stat.accent }} />
          </div>
          <div>
            <p
              className="font-serif text-2xl font-bold leading-none"
              style={{ color: stat.accent }}
            >
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminPage() {
  const { isFetching: actorFetching } = useActor();
  const { data: isAdmin, isLoading: adminLoading } = useAdminStatus();
  const { mutate: seedProducts, isPending: seeding } = useSeedProducts();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const queryClient = useQueryClient();

  const [tokenInput, setTokenInput] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [tokenSubmitted, setTokenSubmitted] = useState(false);

  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  function handleSeed() {
    seedProducts(undefined, {
      onSuccess: () => toast.success("Products seeded successfully!"),
      onError: () => toast.error("Failed to seed products."),
    });
  }

  async function handleTokenSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setTokenError("Please enter the admin token.");
      return;
    }
    setTokenError("");
    setIsVerifying(true);

    // Reload the page with the token in the URL so useActor picks it up
    // and calls _initializeAccessControlWithSecret(token) automatically.
    const url = new URL(window.location.href);
    url.searchParams.set("caffeineAdminToken", tokenInput.trim());
    // Invalidate actor cache so it re-initializes with the new token
    await queryClient.invalidateQueries({ queryKey: ["actor"] });
    setTokenSubmitted(true);
    window.location.href = url.toString();
  }

  // Show spinner while the actor itself is initialising OR while isAdmin is
  // being fetched. Both conditions resolve quickly — this replaces the
  // previous infinite-spinner bug caused by React Query v5's behaviour of
  // keeping isPending=true for disabled queries with no cached data.
  if (actorFetching || adminLoading) {
    return (
      <main className="pt-32 pb-20 px-6 min-h-screen bg-background flex items-center justify-center">
        <div
          className="flex flex-col items-center gap-4"
          data-ocid="admin.loading_state"
        >
          <Loader2
            className="w-8 h-8 animate-spin"
            style={{ color: "oklch(var(--gold))" }}
          />
          <p className="text-sm text-muted-foreground">
            {actorFetching
              ? "Connecting to the store…"
              : "Checking admin access…"}
          </p>
        </div>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="pt-32 pb-20 px-6 min-h-screen bg-background flex items-center justify-center">
        <div
          className="text-center p-10 rounded-sm max-w-sm w-full"
          style={{
            border: "1px solid oklch(var(--gold) / 0.3)",
            background: "oklch(var(--card))",
          }}
          data-ocid="admin.login_panel"
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "oklch(var(--gold) / 0.1)" }}
          >
            <KeyRound
              className="w-7 h-7"
              style={{ color: "oklch(var(--gold))" }}
            />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
            Admin Access
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in with Internet Identity to manage your store.
          </p>
          <Button
            type="button"
            onClick={login}
            disabled={isLoggingIn}
            className="w-full text-white font-semibold"
            style={{ background: "oklch(var(--monk-maroon))" }}
            data-ocid="admin.login.primary_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting…
              </>
            ) : (
              "Connect with Internet Identity"
            )}
          </Button>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="pt-32 pb-20 px-6 min-h-screen bg-background flex items-center justify-center">
        <div
          className="p-10 rounded-sm max-w-md w-full"
          style={{
            border: "1px solid oklch(var(--gold) / 0.3)",
            background: "oklch(var(--card))",
          }}
          data-ocid="admin.token_panel"
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "oklch(var(--gold) / 0.1)" }}
          >
            <KeyRound
              className="w-7 h-7"
              style={{ color: "oklch(var(--gold))" }}
            />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2 text-center">
            Admin Access
          </h2>

          {tokenSubmitted ? (
            /* Post-submission confirmation */
            <div
              className="text-center space-y-4"
              data-ocid="admin.token.success_state"
            >
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-sm"
                style={{
                  background: "oklch(55% 0.15 145 / 0.1)",
                  border: "1px solid oklch(55% 0.15 145 / 0.3)",
                }}
              >
                <CheckCircle2
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: "oklch(40% 0.15 145)" }}
                />
                <p
                  className="text-sm font-medium text-left"
                  style={{ color: "oklch(35% 0.15 145)" }}
                >
                  Token submitted. If this was your first login with the correct
                  token, you'll have admin access. The page is reloading…
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                If the page doesn't reload automatically,{" "}
                <button
                  type="button"
                  className="underline underline-offset-2"
                  style={{ color: "oklch(var(--gold))" }}
                  onClick={() => window.location.reload()}
                >
                  click here to refresh
                </button>
                .
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-1 text-center">
                Enter your admin token to claim store owner access.
              </p>
              <p className="text-xs text-muted-foreground mb-6 text-center">
                The token is only required once — the{" "}
                <strong>first person</strong> who submits the correct token
                becomes the permanent admin.
              </p>
              <form onSubmit={handleTokenSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Input
                    type="password"
                    data-ocid="admin.token.input"
                    value={tokenInput}
                    onChange={(e) => {
                      setTokenInput(e.target.value);
                      setTokenError("");
                    }}
                    placeholder="Paste your admin token here"
                    autoComplete="off"
                    style={{
                      background: "oklch(var(--input))",
                      border: tokenError
                        ? "1px solid oklch(var(--destructive))"
                        : "1px solid oklch(var(--border))",
                    }}
                  />
                  {tokenError && (
                    <p
                      className="text-xs"
                      style={{ color: "oklch(var(--destructive))" }}
                      data-ocid="admin.token.error_state"
                    >
                      {tokenError}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  data-ocid="admin.token.submit_button"
                  disabled={isVerifying}
                  className="w-full text-white font-semibold"
                  style={{ background: "oklch(var(--monk-maroon))" }}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    "Claim Admin Access"
                  )}
                </Button>
              </form>

              {/* How-to-find-token guidance */}
              <div
                className="mt-5 p-4 rounded-sm space-y-2"
                style={{
                  background: "oklch(var(--muted))",
                  border: "1px solid oklch(var(--border))",
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  How to find your token
                </p>
                <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Open the Caffeine dashboard and select your project.</li>
                  <li>
                    Go to <strong>Settings → Environment Variables</strong>.
                  </li>
                  <li>
                    Copy the value of{" "}
                    <span className="font-mono bg-background px-1 py-0.5 rounded text-foreground">
                      CAFFEINE_ADMIN_TOKEN
                    </span>
                    .
                  </li>
                  <li>
                    Paste it in the field above and click Claim Admin Access.
                  </li>
                </ol>
              </div>
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 px-6 min-h-screen bg-background">
      <div className="max-w-5xl mx-auto">
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

        {/* Stats Panel */}
        <StatsPanel />

        {/* Tabs */}
        <Tabs defaultValue="products">
          <TabsList
            className="mb-8 h-auto p-1 gap-1 rounded-sm"
            style={{
              background: "oklch(var(--muted))",
              border: "1px solid oklch(var(--border))",
            }}
          >
            <TabsTrigger
              value="products"
              data-ocid="admin.products.tab"
              className="text-sm font-medium px-5 py-2 rounded-sm data-[state=active]:text-white transition-all"
              style={
                {
                  // Active state handled via CSS data attribute
                }
              }
            >
              Products
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              data-ocid="admin.orders.tab"
              className="text-sm font-medium px-5 py-2 rounded-sm data-[state=active]:text-white transition-all"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              data-ocid="admin.messages.tab"
              className="text-sm font-medium px-5 py-2 rounded-sm data-[state=active]:text-white transition-all"
            >
              Messages
            </TabsTrigger>
            <TabsTrigger
              value="stripe"
              data-ocid="admin.stripe.tab"
              className="text-sm font-medium px-5 py-2 rounded-sm data-[state=active]:text-white transition-all"
            >
              Stripe
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesTab />
          </TabsContent>

          <TabsContent value="stripe">
            <StripeConfigTab />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
