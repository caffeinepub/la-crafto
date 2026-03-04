import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="relative overflow-hidden">
      {/* Monastery background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/assets/generated/monastery-footer.dim_1200x300.jpg')`,
        }}
      />
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, oklch(18% 0.01 60 / 0.88), oklch(12% 0.01 60 / 0.95))",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-14">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/mandala-logo-transparent.dim_400x400.png"
                alt="LA Crafto"
                className="w-10 h-10 object-contain opacity-90"
              />
              <div>
                <p className="font-serif text-xl font-bold text-white">
                  LA Crafto
                </p>
                <p
                  className="text-xs tracking-widest uppercase"
                  style={{ color: "oklch(var(--gold) / 0.8)" }}
                >
                  Ladakh, India
                </p>
              </div>
            </div>
            <p
              className="text-sm leading-relaxed font-serif-body italic"
              style={{ color: "oklch(80% 0.01 80)" }}
            >
              "From the mountains of Ladakh, we bring you crafts that carry the
              spirit of the Himalayas."
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: "oklch(var(--gold) / 0.8)" }}
            >
              Navigation
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Home", to: "/" },
                { label: "Collections", to: "/collections" },
                { label: "About", to: "/about" },
                { label: "Contact", to: "/contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "oklch(70% 0.01 80)" }}
                    data-ocid="nav.link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: "oklch(var(--gold) / 0.8)" }}
            >
              Connect
            </h4>
            <div className="space-y-2">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm transition-colors hover:text-white"
                style={{ color: "oklch(70% 0.01 80)" }}
                data-ocid="footer.secondary_button"
              >
                <span className="text-base">📱</span>
                WhatsApp Chat
              </a>
              <p className="text-sm" style={{ color: "oklch(70% 0.01 80)" }}>
                📍 Leh, Ladakh, India — 194101
              </p>
              <p className="text-sm" style={{ color: "oklch(70% 0.01 80)" }}>
                ✉️ hello@lacrafto.in
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px my-6"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(var(--gold) / 0.3), transparent)",
          }}
        />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "oklch(55% 0.01 80)" }}>
            © LA Crafto {year}. Crafted with love in Ladakh. 🙏
          </p>
          <p className="text-xs" style={{ color: "oklch(45% 0.01 80)" }}>
            Built with{" "}
            <Heart
              className="inline w-3 h-3 fill-current"
              style={{ color: "oklch(var(--monk-maroon))" }}
            />{" "}
            using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
