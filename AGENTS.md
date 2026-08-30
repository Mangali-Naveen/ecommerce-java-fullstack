# AI Agent Customization Guide - E-Commerce Java Full Stack

## Project Overview

This is a **Java Full Stack E-Commerce Application** with a React frontend and Spring Boot backend. The application manages products, shopping carts, orders, user authentication, and an admin dashboard.

**Tech Stack:**
- **Backend:** Spring Boot 4.0.6, Java 21, MySQL, Spring Security, JWT Authentication, Spring Data JPA/Hibernate
- **Frontend:** React 18.3.1, Redux Toolkit, Vite, React Router, Tailwind CSS, Axios
- **Key Port:** Backend runs on `8181` (frontend dev: `5173`)

---

## Critical Development Guidelines

⚠️ **These are non-negotiable principles for ALL work on this codebase:**

1. **Inspect Before Modifying** - Always examine existing implementation thoroughly before making changes. Run `grep` searches to understand how components are used.

2. **Explain Root Causes** - Before proposing any fix, explain the exact root cause. Include console logs, error messages, or code flow analysis that proves the root cause.

3. **Minimal Changes** - Make the smallest possible change to fix an issue. Avoid refactoring or redesigning working code.

4. **Preserve Architecture** - Do not refactor or redesign the existing project structure. Work within the established patterns (MVC backend, Redux slices for frontend).

5. **No Feature Creep** - Implement only what is explicitly requested. Do not add "nice-to-have" features or improvements.

6. **No Code Duplication** - Never create duplicate methods or duplicate business logic. Extract to shared services/utilities when needed.

7. **Verify API Contracts First** - When frontend-backend integration is involved, verify the API endpoint contract (URL, HTTP method, request/response structure) before implementation.

8. **Run Builds After Changes** - After modifying code, run the appropriate build/test commands:
   - **Backend:** `mvn clean install` (in `ecommerce-backend/`)
   - **Frontend:** `npm run build` (in `client/`)

9. **Report All Modifications** - When changes are complete, provide a table of exactly which files were modified and why each one needed modification.

10. **Single Scope per Change** - Each code change addresses exactly one requested feature or fix. Do not combine unrelated changes.

11. **Explain Multi-File Changes** - If a change affects multiple files, explain why each file needs modification before making any changes.

---

## Architecture & Key Patterns

### Backend Structure

```
ecommerce-backend/src/main/java/com/example/demo/
├── EcommerceBackendApplication.java      # Spring Boot entry point
├── controller/                            # REST API endpoints
├── service/                               # Business logic
├── repository/                            # Database access (JPA)
├── entity/                                # JPA entity models
├── dto/                                   # Data transfer objects
├── security/                              # JWT & authentication
└── config/                                # Configuration classes
```

**Key Principle:** Service → Repository pattern (controllers call services, services call repositories)

### Frontend Structure

```
client/src/
├── main.jsx                 # React entry point with Redux Provider
├── App.jsx                  # Route definitions
├── pages/                   # Page components (organized by feature)
│   ├── admin-view/          # Admin dashboard pages
│   ├── auth/                # Login/register pages
│   └── shopping-view/       # User-facing pages
├── components/              # Reusable UI components
├── store/                   # Redux state management
│   ├── store.js             # Redux store configuration
│   ├── admin/               # Admin slices
│   ├── auth-slice/          # Authentication state
│   ├── common-slice/        # Global state (features, etc)
│   └── shop/                # Shopping cart, products, orders
└── config/index.js          # Form definitions, constants
```

**Key Principle:** Redux slices manage state by feature area (auth, shop, admin, common)

### API Authentication

- **JWT Tokens** stored in `localStorage` with key `"token"`
- **Requests** include token in `Authorization` header (handled by axios interceptors)
- **Roles:** `ADMIN` and `USER` (checked in SecurityConfig.java)
- **Public endpoints:** `/api/auth/**` and `/api/shop/**` for product browsing

---

## API Endpoint Conventions

### URL Structure
```
/api/{role}/{resource}/{action}
  ├── /api/auth/**           → User registration, login (PUBLIC)
  ├── /api/shop/**           → Product browsing, search (PUBLIC)
  ├── /api/admin/**          → Admin operations (ADMIN-only)
  ├── /api/cart/**           → Shopping cart (AUTHENTICATED)
  ├── /api/order/**          → Orders (AUTHENTICATED)
  ├── /api/address/**        → Saved addresses (AUTHENTICATED)
  ├── /api/wishlist/**       → Wishlist (AUTHENTICATED)
  └── /api/common/**         → Global features (mixed auth)
```

### Important Endpoints

**Products (Read):**
- `GET /api/shop/products/get` → All products (PUBLIC) [Frontend calls this]
- `GET /api/shop/products/{id}` → Single product (PUBLIC)
- `GET /api/admin/products/get` → All products (ADMIN-only) [Admin dashboard]

**Products (Write):**
- `POST /api/admin/products/add` → Create product (ADMIN-only)
- `PUT /api/admin/products/update/{id}` → Update product (ADMIN-only)
- `DELETE /api/admin/products/delete/{id}` → Delete product (ADMIN-only)

**Cart:**
- `POST /api/cart/add` → Add to cart
- `PUT /api/cart/update` → Update cart item
- `DELETE /api/cart/delete/{id}` → Remove from cart

**Orders:**
- `POST /api/order/create` → Create order
- `GET /api/order/get/{id}` → Get order details
- `PUT /api/order/update/{id}` → Update order status

---

## Common Gotchas & Known Issues

### Frontend ↔ Backend ID Mismatch

⚠️ **Critical:** Backend uses Java Long `id` field, not MongoDB `_id`

- **Wrong:** `item._id` or `item?._id`
- **Correct:** `item.id` or `item?.id`

This affects: Addresses, Orders, Products, Cart items

### Product Visibility Issues

If products don't show on shopping pages:
1. Check Redux action is calling `/api/shop/products/get` (not `/api/admin/products`)
2. Check Redux reducer extracts `action.payload?.data` (data is nested in response envelope)
3. Check browser console for error messages and Redux state
4. Check backend console for SQL queries and data counts

See [PRODUCT_VISIBILITY_FIX_REPORT.md](./PRODUCT_VISIBILITY_FIX_REPORT.md) for detailed analysis.

### Console Logging for Debugging

The codebase uses extensive `console.log()` statements marked with prefixes:
- `[ShoppingListing]`, `[ShoppingHome]` (frontend pages)
- `[Redux Shop]`, `[Redux Admin]`, `[Redux Auth]` (Redux slices)
- `[ProductController]`, `[ProductService]` (backend)

These help trace data flow. Preserve them during debugging.

### Address Component Issues

The Address component has known quirks with form state. Always:
- Test address add, edit, delete operations
- Check both Redux state AND localStorage persistence
- Verify IDs are extracted correctly before API calls

---

## Build & Test Commands

### Backend
```bash
cd ecommerce-backend/

# Build and run tests
mvn clean install

# Run the application
mvn spring-boot:run

# Run tests only
mvn test
```

**Default Port:** `8181`

### Frontend
```bash
cd client/

# Install dependencies (if needed)
npm install

# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm lint
```

**Default Port:** `5173`

---

## Database & Entity Relationships

Backend uses Spring Data JPA with MySQL. Key entities:
- **User** - authentication and roles
- **Product** - item catalog
- **Cart/CartItem** - shopping cart
- **Order/OrderItem** - purchase orders
- **Address** - saved shipping addresses
- **Wishlist** - favorited products
- **Feature** - site-wide features (banners, etc)

All entities use `@Data` (Lombok) for getters/setters.

---

## Redux State Shape

Key Redux slices and their structure:

**auth-slice:**
```javascript
{
  user: { id, email, role, ... },
  isAuthenticated: boolean,
  isLoading: boolean
}
```

**shop/products:**
```javascript
{
  productList: [],
  productDetails: {},
  isLoading: boolean
}
```

**shop/cart:**
```javascript
{
  cartItems: [],
  cartCount: number
}
```

**shop/order:**
```javascript
{
  orderList: [],
  orderDetails: {}
}
```

---

## How to Approach Common Tasks

### Adding a New Product Field

1. **Backend:** Add property to Product entity with `@Column` annotation
2. **Update DTO** if separate from entity
3. **Update ProductController** to include field in response
4. **Frontend:** Update Redux slice to include field in `productList`
5. **Update UI components** to display/edit the field
6. **No duplicate getters/setters** - use Lombok `@Data`

### Fixing an API Integration Issue

1. **Check SecurityConfig.java** - Is the endpoint secured correctly?
2. **Check backend controller** - Does it exist and return the right data shape?
3. **Check Redux action** - Is it calling the correct endpoint URL?
4. **Check Redux reducer** - Is it extracting data from the response correctly?
5. **Check browser console** - What does the actual HTTP response look like?
6. **Check backend console** - Are queries executing? How many results?

### Debugging State Flow

Enable Redux DevTools (already configured) and trace:
1. Action dispatched → Action type and payload
2. Previous state → Current state after reducer
3. Diff → What changed in state
4. Follow forward to UI rendering

---

## Project-Specific Conventions

### Naming Conventions
- **Backend methods:** `getAllProducts()`, `getProductById()`, `addProduct()`, `updateProduct()`, `deleteProduct()`
- **Redux thunks:** `fetchAllFilteredProducts`, `addToCart`, `createOrder`
- **Component files:** kebab-case (e.g., `product-tile.jsx`, `order-details.jsx`)

### Response Format
Backend always returns:
```json
{
  "success": true/false,
  "data": { ... } or [...],
  "message": "error message if applicable"
}
```

Frontend Redux reducers expect `action.payload?.data` structure.

### Error Handling
- Backend throws custom exceptions with meaningful messages
- Frontend catches axios errors and logs with component prefix
- No silent failures - always log errors to browser console

---

## References & Documentation

- Backend README: [ecommerce-backend/README.md.txt](./ecommerce-backend/README.md.txt)
- Frontend README: [client/README.md](./client/README.md)
- Product Visibility Fix Details: [PRODUCT_VISIBILITY_FIX_REPORT.md](./PRODUCT_VISIBILITY_FIX_REPORT.md)
- Step 3 Changes: [STEP3_CHANGES_SUMMARY.md](./STEP3_CHANGES_SUMMARY.md)

---

## Tips for Agents Working on This Codebase

✅ **DO:**
- Read existing code patterns before writing new code
- Check if similar functionality already exists elsewhere
- Use `grep` to find usage patterns and prevent duplication
- Preserve console logging statements for debugging
- Test both backend and frontend after changes
- Report exactly which files were modified and why

❌ **DON'T:**
- Create new utility functions if one exists elsewhere
- Modify database schema without understanding all related entities
- Change authentication/security config without comprehensive testing
- Redesign components that are already working
- Add TypeScript or major framework upgrades
- Ignore the 11 critical guidelines listed at the top

---

**Last Updated:** 2026-08-17  
**Project Status:** Active Development - Focus on stability and minimal changes
