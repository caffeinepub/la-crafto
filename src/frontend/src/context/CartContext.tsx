import type { CartItem, Product } from "@/backend.d";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

export interface CartItemWithProduct extends CartItem {
  product?: Product;
  engravingText?: string;
}

interface CartContextValue {
  items: CartItemWithProduct[];
  addItem: (
    productId: string,
    quantity: bigint,
    product?: Product,
    engravingText?: string,
  ) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: bigint) => void;
  clearItems: () => void;
  totalCount: number;
  totalAmount: bigint;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemWithProduct[]>([]);

  const addItem = useCallback(
    (
      productId: string,
      quantity: bigint,
      product?: Product,
      engravingText?: string,
    ) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === productId);
        if (existing) {
          return prev.map((i) =>
            i.productId === productId
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          );
        }
        return [...prev, { productId, quantity, product, engravingText }];
      });
    },
    [],
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: bigint) => {
    if (quantity <= 0n) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
      );
    }
  }, []);

  const clearItems = useCallback(() => setItems([]), []);

  const totalCount = items.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  const totalAmount = items.reduce(
    (sum, item) => sum + (item.product?.priceInCents ?? 0n) * item.quantity,
    0n,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearItems,
        totalCount,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
