# BLANKO — Fashion House E-Commerce Platform

> A full-stack luxury fashion e-commerce application built with **Next.js 14** (frontend) and **Django REST Framework** (backend). Designed for high-end fashion retail with a modern, bilingual-ready architecture.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [API Reference](#api-reference)
8. [Authentication](#authentication)
9. [Product Variants System](#product-variants-system)
10. [Admin Panel](#admin-panel)
11. [Deployment](#deployment)

---

## Overview

BLANKO is a premium fashion e-commerce platform featuring:

- A **customer-facing storefront** with animated product carousels, a hero slider, category browsing, wishlist, cart, and checkout
- A **full admin dashboard** for managing products, orders, customers, coupons, categories, and shipping zones
- A **REST API** backend powering all data, authentication (JWT), and business logic
- **Product Variants** — each product can have multiple colour variants, each with independent size/quantity inventory

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | React framework, SSR, routing |
| TypeScript | Type safety across the codebase |
| Lucide React | Icon system |
| Google Fonts (Inter + Cormorant Garamond) | Typography |
| Context API | Global state (Cart, Auth, Wishlist) |

### Backend
| Technology | Purpose |
|---|---|
| Django 4.x | Web framework |
| Django REST Framework | RESTful API |
| SimpleJWT | JWT-based authentication |
| SQLite (dev) / PostgreSQL (prod) | Database |
| drf-spectacular | OpenAPI schema generation |

---

## Project Structure

```
frontend/
├── app/
│   ├── (admin)/          # Admin dashboard routes
│   │   └── admin/
│   │       ├── page.tsx          # Dashboard overview
│   │       ├── products/         # Product management (list, add, edit, delete)
│   │       ├── orders/           # Order management
│   │       ├── users/            # Customer management
│   │       ├── categories/       # Category management
│   │       ├── coupons/          # Coupon/discount management
│   │       ├── shipping-zones/   # Shipping zone + fee configuration
│   │       └── settings/         # Store settings
│   └── (store)/          # Customer storefront routes
│       ├── page.tsx              # Homepage
│       ├── shop/                 # Product listing & filtering
│       ├── product/[id]/         # Product detail (variants, sizes, colours)
│       ├── cart/                 # Shopping cart
│       ├── checkout/             # Multi-step checkout
│       ├── profile/              # User profile (orders, coupons, wishlist)
│       ├── orders/               # Order history
│       ├── wishlist/             # Saved items
│       ├── login/ & register/    # Authentication pages
│       ├── about-us/             # Brand story
│       └── contact-us/           # Contact form + channels
├── src/
│   ├── context/
│   │   ├── AuthContext.tsx       # Auth state, login/logout/register
│   │   ├── CartContext.tsx       # Cart state, add/remove/update
│   │   └── WishlistContext.tsx   # Wishlist state
│   ├── lib/
│   │   └── api.ts                # All API calls, typed interfaces
│   ├── data/
│   │   └── products.ts           # Static fallback data
│   └── utils/
│       ├── image.ts              # Image URL normalisation
│       └── currency.ts           # Price formatting helpers
└── ui/
    ├── home/                     # Homepage sections
    │   ├── hero.tsx              # Animated 3-slide hero
    │   ├── categories.tsx        # Category grid
    │   ├── featured.tsx          # Auto-scrolling product carousel
    │   ├── trending.tsx          # Trending product carousel
    │   ├── promo-split.tsx       # Promotional banners
    │   ├── testimonials.tsx      # Customer reviews
    │   └── promises.tsx          # Brand guarantees strip
    ├── components/
    │   ├── Navbar.tsx            # Sticky navigation with dropdown
    │   ├── Footer.tsx            # Full footer with links + WhatsApp CTA
    │   └── ProductCard.tsx       # Reusable product card with hover actions
    ├── product/                  # Product detail sub-components
    ├── shop/                     # Shop listing sub-components
    ├── checkout/                 # Checkout step components
    └── admin/                    # Admin-specific UI components
```

---

## Features

### Storefront
- **Hero Slider** — 3 auto-rotating slides with smooth CSS transitions, arrows, and progress dots
- **Product Carousels** — Featured & Trending sections with animated slide-in/out on auto-rotate or manual navigation
- **Category Grid** — 4-column grid with hover overlays
- **Product Detail** — Full variant system: select colour → see available sizes with live stock count badges
- **Cart** — Persistent cart with coupon code support and real-time total calculation
- **Checkout** — Multi-step: shipping info (auto-filled from profile) → payment method → order confirmation
- **Profile** — Tabs for personal info, order history, active coupons (one-click copy), and wishlist
- **Wishlist** — Add/remove from any page, shown in profile
- **Order Success Screen** — Shown after checkout with order number, summary, and next steps

### Admin Dashboard
- **Dashboard** — Sales stats, recent orders, quick actions
- **Products** — Full CRUD with image upload, variants (colour + sizes + quantities), badges
- **Orders** — View all orders, update status, view customer/payment details
- **Customers** — Browse all registered users, view spending history
- **Categories** — Create/edit product categories
- **Coupons** — Create fixed or percentage discount codes with expiry and usage limits
- **Shipping Zones** — Set per-governorate shipping fees
- **Settings** — Store name, WhatsApp number, currency, tax configuration

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- npm or yarn

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/your-org/blanko-frontend.git
cd blanko-frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend Setup

```bash
cd blanko-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed sample data (optional)
python seed_data.py

# Start server
python manage.py runserver
```

API available at [http://localhost:8000/api/](http://localhost:8000/api/)

---

## Environment Variables

Create `.env.local` in the frontend root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_NAME=BLANKO Fashion House
```

---

## API Reference

All endpoints are prefixed with `/api/`.

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register/` | Register new user | Public |
| POST | `/auth/login/` | Login → returns JWT tokens | Public |
| POST | `/auth/refresh/` | Refresh access token | Public |

### Products
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/products/` | List products (filterable) | Public |
| GET | `/products/{id}/` | Product detail | Public |
| GET | `/products/{id}/variants/` | Colour variants with sizes & stock | Public |
| POST | `/products/{id}/variants/update/` | Add/update all variants | Admin |
| POST | `/products/` | Create product | Admin |
| PATCH | `/products/{id}/` | Update product | Admin |
| DELETE | `/products/{id}/` | Delete product | Admin |

**Query params for `/products/`:**
- `featured=true` — featured items
- `trending=true` — trending items
- `category=Women` — by category
- `sort=newest|price_low|price_high`
- `search=keyword`

### Orders
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/orders/` | Create order | Public |
| GET | `/orders/my/` | Current user's orders | User |
| GET | `/orders/` | All orders | Admin |
| PATCH | `/orders/{id}/update_status/` | Update order status | Admin |
| GET | `/orders/dashboard_stats/` | Dashboard statistics | Admin |

### Coupons
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/coupons/active/` | Active coupons for users | User |
| POST | `/coupons/validate/` | Validate a coupon code | Public |
| GET | `/coupons/` | All coupons | Admin |
| POST | `/coupons/` | Create coupon | Admin |

### Cart
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/cart/` | Get user's cart | User |
| POST | `/cart/` | Add item to cart | User |
| DELETE | `/cart/{id}/` | Remove cart item | User |

---

## Authentication

The project uses **JWT (JSON Web Tokens)** via `djangorestframework-simplejwt`.

- **Access token** — valid for 24 hours, sent in `Authorization: Bearer <token>` header
- **Refresh token** — valid for 30 days, used to obtain a new access token
- **Admin detection** — the `is_staff` flag on the user model determines admin access

The frontend stores tokens in `localStorage` via `AuthContext` and attaches them automatically to all authenticated requests through the `request()` helper in `api.ts`.

A custom `SilentJWTAuthentication` class in `api/backends.py` ensures that public (`AllowAny`) endpoints work even when a stale token is present in the request header — rather than returning 401, it silently degrades to anonymous access.

---

## Product Variants System

Each product supports multiple **colour variants**. Each variant has:
- A colour name and hex code
- An optional colour-specific image
- Multiple **sizes**, each with an independent **quantity**

```
Product
└── Variant (Black, #000000, image_black.jpg)
    ├── Size S → qty: 5
    ├── Size M → qty: 3
    └── Size L → qty: 0 (out of stock for this size)
└── Variant (Navy, #1e3a6e, image_navy.jpg)
    ├── Size M → qty: 8
    └── Size XL → qty: 2
```

**Admin flow:** Edit product → Variants section → Add colour → Upload image → Add sizes with quantities → Save.

**Storefront flow:** Product detail page → Select colour (thumbnail updates) → Available sizes shown with stock count badges → Select size → Add to cart.

---

## Admin Panel

Access the admin panel at `/admin` (requires a user with `is_staff=True`).

To create an admin user:
```bash
python manage.py createsuperuser
```

Or promote an existing user via the Django admin at `/django-admin/`.

---

## Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel via GitHub integration or CLI
npx vercel --prod
```

### Backend (Railway / Render / VPS)
```bash
# Set production environment variables
DEBUG=False
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=yourdomain.com

# Collect static files
python manage.py collectstatic

# Run with gunicorn
gunicorn blanko.wsgi:application --bind 0.0.0.0:8000
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

© 2026 BLANKO Fashion House. All rights reserved.

Built with ❤️ in Egypt.
