import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import { AboutPage } from "@/pages/AboutPage";
import { AccountPage } from "@/pages/AccountPage";
import { AdminPage } from "@/pages/AdminPage";
import { CartPage } from "@/pages/CartPage";
import { CheckoutCancelPage } from "@/pages/CheckoutCancelPage";
import { CheckoutSuccessPage } from "@/pages/CheckoutSuccessPage";
import { CollectionsPage } from "@/pages/CollectionsPage";
import { ContactPage } from "@/pages/ContactPage";
import { HomePage } from "@/pages/HomePage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// Root layout component
function RootLayout() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </div>
      <Toaster
        richColors
        position="bottom-right"
        toastOptions={{
          style: {
            background: "oklch(98% 0.01 80)",
            border: "1px solid oklch(var(--gold) / 0.3)",
            color: "oklch(20% 0.012 60)",
            fontFamily: "General Sans, system-ui, sans-serif",
          },
        }}
      />
    </CartProvider>
  );
}

// Routes
const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const collectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/collections",
  component: CollectionsPage,
});

const collectionsCategoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/collections/$category",
  component: CollectionsPage,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$id",
  component: ProductDetailPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const checkoutSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout/success",
  component: CheckoutSuccessPage,
});

const checkoutCancelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout/cancel",
  component: CheckoutCancelPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  component: AccountPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  collectionsRoute,
  collectionsCategoryRoute,
  productRoute,
  cartRoute,
  checkoutSuccessRoute,
  checkoutCancelRoute,
  aboutRoute,
  contactRoute,
  adminRoute,
  accountRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
