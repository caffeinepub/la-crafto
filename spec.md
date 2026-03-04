# LA Crafto

## Current State
New project. No existing backend or frontend code.

## Requested Changes (Diff)

### Add
- Full e-commerce website for brand "LA Crafto" based in Ladakh, India
- Himalayan/Buddhist-inspired design with earth tones, golden accents, prayer flags animation
- Homepage: hero section, featured collections grid, brand story section, spiritual symbols section
- Product catalog with categories: Sacred Wall Art, 3D Printed Buddhist Symbols, Custom Name Plates, Himalayan Inspired Decor
- Product detail pages with engraving option (text field), "Blessing Inspired Craft" badge, story behind design
- Brand philosophy section with lotus divider and mandala separator
- Cultural authenticity: Ladakh map illustration, monastery silhouette in footer, footer quote
- Stripe payment integration / checkout flow
- Contact form
- WhatsApp contact link (simple href link)
- Scroll fade-in animations, golden hover effects, mandala animation on logo hover
- SEO meta tags for "Himalayan decor", "Buddhist wall art India", "Ladakh handmade craft"

### Modify
- None

### Remove
- None

## Implementation Plan
1. Backend: Products store (id, name, description, price, category, imageUrl, story, engravingAvailable), Orders store, Contact message store
2. Backend APIs: getProducts, getProductById, getProductsByCategory, createOrder, submitContact
3. Frontend: App shell with navigation (Home, Collections, About, Contact)
4. Home page: Hero, Collections grid, Story section, Spiritual Symbols section, Philosophy section
5. Collections page: Category filter + product grid
6. Product detail page: Image, description, engraving input, add to cart, Stripe checkout
7. About/Story page
8. Contact page with form + WhatsApp link
9. Footer with monastery silhouette and quote
10. CSS animations: prayer flags, fade-in on scroll, golden hover, mandala on logo hover
