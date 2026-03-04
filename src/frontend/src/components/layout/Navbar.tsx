import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Collections", to: "/collections" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const PRAYER_FLAGS = [
  { id: "f1", color: "bg-[oklch(45%_0.18_25)]" },
  { id: "f2", color: "bg-[oklch(82%_0.2_85)]" },
  { id: "f3", color: "bg-[oklch(42%_0.12_250)]" },
  { id: "f4", color: "bg-[oklch(95%_0.01_80)]" },
  { id: "f5", color: "bg-[oklch(45%_0.15_155)]" },
  { id: "f6", color: "bg-[oklch(45%_0.18_25)]" },
  { id: "f7", color: "bg-[oklch(82%_0.2_85)]" },
  { id: "f8", color: "bg-[oklch(42%_0.12_250)]" },
];

export function Navbar() {
  const { totalCount } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "navbar-glass shadow-sm" : "bg-transparent"
      }`}
    >
      {/* Main navbar */}
      <nav className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group mandala-hover"
          data-ocid="nav.link"
        >
          <div className="relative w-11 h-11">
            <img
              src="/assets/generated/mandala-logo-transparent.dim_400x400.png"
              alt="LA Crafto Mandala"
              className="mandala-img w-full h-full object-contain transition-all duration-500"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-xl font-bold tracking-wide text-foreground">
              LA Crafto
            </span>
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: "oklch(var(--gold))" }}
            >
              Ladakh, India
            </span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium tracking-wide transition-all duration-200 hover:text-foreground relative group ${
                location.pathname === link.to
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
              data-ocid="nav.link"
            >
              {link.label}
              <span
                className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                style={{ background: "oklch(var(--gold))" }}
              />
              {location.pathname === link.to && (
                <span
                  className="absolute -bottom-0.5 left-0 h-px w-full"
                  style={{ background: "oklch(var(--gold))" }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link to="/cart" data-ocid="nav.cart.link">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCount > 0 && (
                <Badge
                  className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full"
                  style={{
                    background: "oklch(var(--monk-maroon))",
                    color: "oklch(var(--parchment))",
                  }}
                >
                  {totalCount > 99 ? "99+" : totalCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Prayer flags strip */}
      <div className="prayer-cord mx-0" />
      <div className="flex justify-center gap-0 px-8 pb-1 bg-transparent">
        <div
          className="flex items-start justify-center gap-2 pt-1"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, oklch(var(--monk-maroon) / 0.4) 1px, transparent 1px)",
            backgroundSize: "100% 4px",
          }}
        >
          {PRAYER_FLAGS.map((flag) => (
            <div
              key={flag.id}
              className={`prayer-flag w-5 h-7 md:w-6 md:h-8 ${flag.color} opacity-80 rounded-b-sm`}
              style={{ transformOrigin: "top center" }}
            />
          ))}
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="md:hidden navbar-glass border-t"
          style={{ borderColor: "oklch(var(--gold) / 0.2)" }}
        >
          <div className="flex flex-col px-6 py-4 gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-base font-medium py-1 border-b transition-colors ${
                  location.pathname === link.to
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
                style={{ borderColor: "oklch(var(--border))" }}
                data-ocid="nav.link"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
