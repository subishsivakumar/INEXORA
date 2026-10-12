# Apple Product — Independent Apple Products Shopping Experience

> **Disclaimer:** *Apple Product is an independent demonstration e-commerce store created for educational, portfolio, and architectural demonstration purposes. This website is not affiliated with, sponsored by, or endorsed by Apple Inc. It does not claim authorized reseller status or official Apple warranties. All Apple product names, logos, and trademarks belong to Apple Inc.*

---

## 1. Project Overview

**Apple Product** is a full-stack, enterprise-grade e-commerce application designed to deliver an ultra-premium consumer technology shopping experience. The platform exclusively showcases and sells verified Apple-branded products with authentic Indian pricing (INR ₹) and official technical specifications sourced directly from Apple India.

The application is built upon a strict **two-colour minimalist aesthetic**:
- **Deep Black (`#0B0B0D`)**
- **Premium White (`#F5F5F7`)**

Typography, glassmorphic navigation, micro-interactions, skeleton loaders, and interactive 3D product previews create an interface inspired by high-end consumer technology storefronts without copying Apple's proprietary graphics.

---

## 2. Technology Stack

### Frontend
- **Framework:** React 18
- **Tooling:** Vite 6
- **Routing:** React Router v7
- **Styling:** Modern Vanilla CSS (CSS Variables, Flexbox, Grid, Glassmorphic effects, prefers-reduced-motion)
- **Icons:** Lucide React
- **3D Graphics:** Three.js / React Three Fiber interactive Canvas with graceful fallback
- **State Management:** React Context API (`AuthContext`, `CartContext`, `WishlistContext`)

### Backend
- **Language:** Java 21 (LTS)
- **Framework:** Spring Boot 3.3.4
- **Security:** Spring Security 6 with BCrypt password hashing, stateless JWT authentication, role-based access control, and CORS protection
- **Data Access:** Spring Data JPA & Hibernate
- **Database Migrations:** Flyway 10
- **API Documentation:** OpenAPI 3 / Swagger UI (`springdoc-openapi-starter-webmvc-ui:2.6.0`)
- **Build Tool:** Apache Maven 3.9.6 (with Maven Wrapper `mvnw.cmd`)

### Database
- **Engine:** MySQL 8.0+ / MariaDB 10.5+
- **Schema:** Fully normalized 3NF schema with foreign keys, decimal price precision (`DECIMAL(12,2)`), unique constraints, and indexes
- **Storage:** Verified seed data containing 10 categories, 32 products, 42 variants, and specifications

---

## 3. Architecture & Directory Structure

```text
apple/
├── backend/
│   ├── src/main/java/com/appleproduct/
│   │   ├── config/              # SecurityConfig, CorsConfig, OpenApiConfig, FlywayConfig
│   │   ├── controller/          # REST Controllers (Auth, Product, Cart, Wishlist, Order, Comparison, Admin)
│   │   ├── dto/                 # Request & Response Data Transfer Objects
│   │   ├── entity/              # JPA Entities (User, Role, Category, Product, Variant, Cart, Order, etc.)
│   │   ├── exception/           # GlobalExceptionHandler & custom exceptions
│   │   ├── repository/          # Spring Data JPA Repositories
│   │   ├── security/            # JwtUtils, JwtAuthenticationFilter, UserDetailsServiceImpl
│   │   └── service/             # Transactional Business Logic & Services
│   ├── src/main/resources/
│   │   ├── application.yml      # Environment-based configuration
│   │   └── db/migration/        # Flyway SQL scripts
│   ├── mvnw.cmd                 # Maven wrapper
│   └── pom.xml                  # Maven dependencies & build configuration
├── database/
│   ├── schema.sql               # Standalone database DDL
│   └── seed_data.sql            # Verified Apple catalog seed data
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components (Navbar, Footer, Modals, 3D Canvas, Cards)
│   │   ├── context/             # AuthContext, CartContext, WishlistContext
│   │   ├── pages/               # HomePage, CatalogPage, ProductDetailPage, ComparisonPage, CartPage, CheckoutPage, Dashboards
│   │   ├── services/            # Axios/Fetch API client and INR currency formatter
│   │   ├── index.css            # Two-colour design system & utility classes
│   │   ├── App.jsx              # Application router & layout structure
│   │   └── main.jsx             # Entry point
│   ├── package.json             # NPM dependencies & scripts
│   └── vite.config.js           # Vite dev server and proxy configuration
├── verify_system.js             # End-to-end automated verification suite (Node.js)
├── verify_system.ps1            # End-to-end automated verification suite (PowerShell)
├── .env.example                 # Environment configuration template
├── .gitignore                   # Version control ignore rules
├── Dockerfile                   # Production multi-stage container
├── render.yaml                  # Render deployment configuration
├── vercel.json                  # Vercel deployment configuration
└── README.md                    # Documentation
```

---

## 4. Local Development Setup

### Prerequisites
- **Java 21 LTS** installed and configured on your `PATH`.
- **Node.js 18+** and **npm 9+** installed.
- **MySQL 8.0+** or **MariaDB 10.5+** running on `localhost:3306` (or fallback to auto H2 in-memory).

### 1. Database Setup
Ensure your MySQL service is running, then create the database:
```sql
CREATE DATABASE IF NOT EXISTS apple_product CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

*(Note: Spring Boot runs migrations and catalog seeders automatically on startup).*

### 2. Backend Startup
Navigate to the `backend` directory and run via the Maven wrapper:
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
The backend will launch on **`http://localhost:8080`**.
- OpenAPI / Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- API Docs JSON: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

### 3. Frontend Startup
Open a separate terminal, navigate to the `frontend` directory, install packages, and start the Vite dev server:
```powershell
cd frontend
npm install
npm run dev
```
The frontend will launch on **`http://localhost:5173`**.

---

## 5. Default Demonstration Accounts

The database comes pre-seeded with tested user accounts:

| Role | Email Address | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@appleproduct.store` | `Customer@Password2026` | Full admin dashboard, analytics, stock editing, order processing |
| **Registered Customer** | `alex@appleproduct.store` | `Customer@Password2026` | Shopping bag, persistent wishlist, order history, profile |
| **Guest Shopper** | *No login required* | *N/A* | Full catalog browsing, side-by-side comparison, guest cart |

---

## 6. Official Apple Product Catalog (10 Categories)

All products are verified real Apple devices with official Apple India pricing (INR ₹):

1. **iPhone:** iPhone 16 Pro Max (₹1,44,900), iPhone 16 Pro (₹1,19,900), iPhone 16 (₹79,900), iPhone 16 Plus (₹89,900), iPhone 15 (₹69,900)
2. **Mac:** MacBook Pro 16" M3 Max (₹3,49,900), MacBook Pro 14" M3 Pro (₹1,99,900), MacBook Air 15" M3 (₹1,34,900), MacBook Air 13" M3 (₹1,14,900), iMac 24" M3 (₹1,34,900), Mac mini M2 Pro (₹1,29,900), Mac Studio M2 Ultra (₹4,19,900), Mac Pro M2 Ultra (₹7,29,900)
3. **iPad:** iPad Pro 13" M4 (₹1,29,900), iPad Pro 11" M4 (₹99,900), iPad Air 13" M2 (₹79,900), iPad Air 11" M2 (₹59,900), iPad 10th Gen (₹34,900), iPad mini (₹49,900)
4. **Apple Watch:** Apple Watch Ultra 2 (₹89,900), Apple Watch Series 10 (₹46,900), Apple Watch SE (₹24,900)
5. **AirPods & Headphones:** AirPods Pro 2nd Gen (₹24,900), AirPods 4 with ANC (₹17,900), AirPods Max USB-C (₹59,900)
6. **Apple Vision:** Apple Vision Pro (₹2,99,900), Apple Vision Pro Travel Case (₹19,900)
7. **Apple TV & Home:** Apple TV 4K 128GB (₹16,900), HomePod 2nd Gen (₹32,900), HomePod mini (₹10,900)
8. **AirTag:** AirTag 1-Pack (₹3,490), AirTag 4-Pack (₹11,900)
9. **Accessories:** Apple Pencil Pro (₹11,900), Magic Keyboard with Touch ID (₹19,500), Magic Mouse (₹9,500), MagSafe Charger (₹4,500)
10. **Displays:** Studio Display (₹1,59,900), Pro Display XDR (₹4,49,900)

---

## 7. Key Features & User Journey

1. **Welcome Experience:** On first visit, a welcome overlay offers *Create Account*, *Login*, or *Continue as Guest*.
2. **Catalog & Filtering:** Instant filter by category, price slider, in-stock status, and sorting (Featured, Price Low to High, Price High to Low, Name A-Z).
3. **Real-Time Search:** Backend-driven search modal querying device models, chips, and generations.
4. **Interactive 3D Product Canvas:** 360-degree interactive 3D viewing on flagship products with OrbitControls and responsive fallback gallery.
5. **Dynamic Variant Selector:** Live switching of storage configurations and official Apple colorways with verified price recalculation.
6. **Shopping Bag:** Guest and authenticated cart persistence, instant quantity increments, server-side validated pricing, and guest cart merging upon login.
7. **Side-by-Side Comparison Matrix:** Compare up to 4 devices side-by-side with automatic specification difference highlighting.
8. **Demonstration Checkout:** Safe transactional demo checkout with Indian address validation and unique order number generation (`AP-YYYYMMDD-XXXXXX`).
9. **User Dashboard:** Dedicated customer portal with profile management, saved addresses, order history, and persistent wishlist.
10. **Admin Control Center:** Protected portal with real-time sales metrics, revenue analytics, inventory editor, and order status updates.

---

## 8. REST API Reference

All responses conform to the standard envelope:
```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

### Public Endpoints
- `GET /api/categories` — List all 10 product categories
- `GET /api/products` — Filterable and paginated product list
- `GET /api/products/search?query={q}` — Search products
- `GET /api/products/{idOrSlug}` — Full product details with variants, specs, and gallery
- `GET /api/products/compare?ids={id1},{id2}` — Side-by-side technical comparison
- `POST /api/auth/register` — Create a new customer account
- `POST /api/auth/login` — Authenticate and receive JWT token

### Customer Endpoints (Authenticated)
- `GET /api/auth/me` — Current user profile
- `GET /api/cart` — Retrieve shopping bag
- `POST /api/cart/items` — Add variant to cart
- `PATCH /api/cart/items/{id}` — Update item quantity
- `DELETE /api/cart/items/{id}` — Remove cart item
- `POST /api/cart/merge` — Merge guest cart into user cart
- `GET /api/wishlist` — Retrieve customer wishlist
- `POST /api/wishlist/{productId}` — Add product to wishlist
- `DELETE /api/wishlist/{productId}` — Remove from wishlist
- `POST /api/orders` — Place demonstration order
- `GET /api/orders` — Customer order history

### Administrator Endpoints (`ROLE_ADMIN`)
- `GET /api/admin/analytics` — Platform revenue, order counts, product metrics
- `GET /api/admin/orders` — Global order processing stream
- `PATCH /api/admin/orders/{id}/status` — Transition order status
- `PATCH /api/admin/variants/{id}` — Update pricing and stock levels
- `DELETE /api/admin/products/{id}` — Archive or delete product

---

## 9. Automated Verification Suite

To verify the entire system end-to-end, execute:
```powershell
node verify_system.js
```

This runs a 12-step verification suite testing:
- Frontend dev server availability (HTTP 200)
- Categories retrieval (10 official categories)
- Product pagination & search
- Product details with real technical specs
- Side-by-side device comparison matrix
- User registration & BCrypt password hashing
- JWT authentication & profile retrieval
- Cart add and quantity update with server recalculation
- Wishlist operations
- Transactional MySQL demonstration checkout
- Customer order history tracking
- Administrator privilege enforcement & analytics
