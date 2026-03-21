<div align="center">

# 🛒 CMart — Digital Student Marketplace

**A campus-first e-commerce platform where student vendors sell directly to buyers — all without leaving the platform.**

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?logo=next.js)](https://nextjs.org/)
[![Django](https://img.shields.io/badge/Backend-Django%206-092E20?logo=django)](https://djangoproject.com/)
[![DRF](https://img.shields.io/badge/API-Django%20REST%20Framework-red?logo=django)](https://django-rest-framework.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🏪 **Student Shops** | Vendors create branded storefronts with custom slugs |
| 🛍️ **Product Listings** | Rich product cards with images, pricing, and categories |
| 🔥 **Campus Drops** | "New in last 48h" horizontal carousel with scroll nav |
| 🛒 **Smart Cart** | Add-to-cart with guest prompts and quantity management |
| 💬 **In-App Chat** | Buyer-to-vendor direct messaging |
| 🔔 **Notifications** | Real-time activity feed and alerts |
| 🌗 **Dark Mode** | Full theme toggle with system preference detection |
| 📱 **Mobile-First** | PWA-ready with bottom navigation bar |
| 🔒 **Secure Auth** | JWT authentication with token refresh |
| 🛡️ **Guest Mode** | Browse freely, prompted to login for actions |
| 📊 **API Docs** | Auto-generated Swagger & ReDoc via drf-spectacular |

---

## 🏗️ Architecture

```
CMart/
├── backend/                # Django 6 + DRF
│   ├── core/               # Settings, URLs, WSGI/ASGI
│   ├── users/              # Custom User model, auth endpoints
│   ├── vendors/            # Vendor applications, shops, wallets
│   ├── products/           # Product CRUD, likes, categories
│   ├── orders/             # Order management
│   ├── payments/           # Payment processing
│   ├── chat/               # In-app messaging
│   ├── notifications/      # Activity signals & alerts
│   └── templates/          # Django admin templates
│
├── frontend/               # Next.js 14 (App Router)
│   └── src/
│       ├── app/            # Pages (marketplace, shops, cart, etc.)
│       ├── components/     # Reusable UI (ProductCard, Navbar, etc.)
│       ├── services/       # API client, auth, product, chat services
│       └── hooks/          # Custom hooks (useRequireAuth)
│
├── startup.ps1             # One-click dev launcher (Windows)
└── rules.md                # AI development guidelines
```

---

## 🚀 Quick Start

### Prerequisites

- **Python** 3.11+ with `pip`
- **Node.js** 18+ with `npm`
- **Git**

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/CMart.git
cd CMart
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from example)
cp .env.example .env

# Run migrations and seed data
python manage.py migrate
python manage.py seed_market
python manage.py seed_campus

# Start the backend server
python manage.py runserver 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

# Start the development server
npm run dev
```

### 4. One-Click Launch (Windows)

```powershell
.\startup.ps1
```

This will launch both servers and a log streamer simultaneously.

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| 🏪 Vendor | `tobi@cmart.com` | `password123` |
| 🏪 Vendor | `gadgetgate@cmart.com` | `password123` |
| 🏪 Vendor | `joy@cmart.com` | `password123` |
| 🛒 Buyer | `buyer1@cmart.com` | `password123` |
| 🛒 Buyer | `buyer2@cmart.com` | `password123` |
| 🎓 Student | `student@trinity.edu` | `password123` |

> `tobi@cmart.com` also has staff/admin permissions.

---

## 📡 API Documentation

Once the backend is running:

| Format | URL |
|--------|-----|
| Swagger UI | [http://localhost:8000/api/schema/swagger-ui/](http://localhost:8000/api/schema/swagger-ui/) |
| ReDoc | [http://localhost:8000/api/schema/redoc/](http://localhost:8000/api/schema/redoc/) |
| OpenAPI Schema | [http://localhost:8000/api/schema/](http://localhost:8000/api/schema/) |

### Key Endpoints

```
POST   /api/auth/register/         # Create account
POST   /api/auth/login/            # Get JWT tokens
GET    /api/auth/profile/          # Current user profile

GET    /api/products/              # List all products
POST   /api/products/              # Create product (vendors)
POST   /api/products/{id}/like/    # Toggle like

GET    /api/vendors/shops/         # List approved shops
GET    /api/vendors/shops/{slug}/  # Shop detail
POST   /api/vendors/apply/         # Apply as vendor

GET    /api/orders/                # List orders
POST   /api/payments/              # Process payment

GET    /api/chat/conversations/    # Chat threads
POST   /api/notifications/         # Activity feed
```

---

## 🛡️ Security

- **JWT Authentication** with automatic token refresh
- **CORS** locked to frontend origin (configurable via `.env`)
- **Rate Limiting** — 30 req/min anonymous, 120 req/min authenticated
- **Security Headers** — HSTS, XSS filter, content-type sniffing protection (enabled in production)
- **Password Validation** — Django's built-in validators enforced
- **Guest Mode** — All sensitive actions require authentication

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript, CSS Variables |
| **Backend** | Django 6, Django REST Framework |
| **Auth** | SimpleJWT (access + refresh tokens) |
| **API Docs** | drf-spectacular (OpenAPI 3.0) |
| **Database** | SQLite (dev) / PostgreSQL (production) |
| **State** | React Context (Auth, Cart, Theme, Notifications) |
| **Styling** | Vanilla CSS with CSS variables, glassmorphism |

---

## 📂 Environment Variables

### Backend (`backend/.env`)

```env
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=cmart.example.com,www.cmart.example.com
CORS_ALLOWED_ORIGINS=https://cmart.example.com
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=https://api.cmart.example.com/api
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please read `rules.md` before making changes — it contains coding standards all contributors must follow.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for campus commerce**

[Report Bug](https://github.com/YOUR_USERNAME/CMart/issues) · [Request Feature](https://github.com/YOUR_USERNAME/CMart/issues)

</div>
