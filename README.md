<div align="center">

<br/>

```
███╗   ██╗███████╗██╗  ██╗ █████╗ ██████╗ ███╗   ███╗██╗███╗   ██╗
████╗  ██║██╔════╝╚██╗██╔╝██╔══██╗██╔══██╗████╗ ████║██║████╗  ██║
██╔██╗ ██║█████╗   ╚███╔╝ ███████║██║  ██║██╔████╔██║██║██╔██╗ ██║
██║╚██╗██║██╔══╝   ██╔██╗ ██╔══██║██║  ██║██║╚██╔╝██║██║██║╚██╗██║
██║ ╚████║███████╗██╔╝ ██╗██║  ██║██████╔╝██║ ╚═╝ ██║██║██║ ╚████║
╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝
```

### ✦ A stunning full-stack admin dashboard ✦
### Built with Next.js 14 · MUI v5 · Zustand · NextAuth · TypeScript

<br/>

[![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MUI](https://img.shields.io/badge/MUI_v5-0081CB?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![Zustand](https://img.shields.io/badge/Zustand-orange?style=for-the-badge&logo=redux&logoColor=white)](https://zustand-demo.pmnd.rs/)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-purple?style=for-the-badge&logo=next.js&logoColor=white)](https://next-auth.js.org/)
[![DummyJSON](https://img.shields.io/badge/DummyJSON_API-green?style=for-the-badge&logo=json&logoColor=white)](https://dummyjson.com/)

<br/>

---

</div>

## ⚡ Overview

**NexAdmin** is a production-grade admin dashboard built as a technical assessment. It features a sleek dark UI with amber accents, full authentication via NextAuth, real-time search & pagination, and blazing-fast state management with Zustand.

> 🎨 **Design philosophy:** Dark luxury meets data density — inspired by trading terminals and premium SaaS tools. Every pixel is intentional.

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/          # Login page with demo credentials
│   ├── (dashboard)/
│   │   ├── dashboard/      # Overview with stats & recent activity
│   │   ├── users/          # Users list + detail view
│   │   └── products/       # Products grid + detail view
│   ├── api/auth/           # NextAuth API route
│   ├── layout.tsx          # Root layout with providers
│   └── providers.tsx       # ThemeProvider + SessionProvider + SnackbarProvider
├── components/
│   └── layout/
│       └── DashboardShell.tsx   # Responsive sidebar + top bar
├── store/
│   ├── authStore.ts        # Zustand auth state (persisted)
│   ├── usersStore.ts       # Zustand users state + caching
│   └── productsStore.ts    # Zustand products state + caching
├── theme/
│   └── index.ts            # Full MUI dark theme overrides
├── types/
│   └── index.ts            # TypeScript interfaces
└── lib/
    └── useDebounce.ts      # Debounce hook for search
```

---

## ✅ Features

### 🔐 Authentication
- **NextAuth.js** with Credentials provider against DummyJSON auth API
- JWT session strategy with 1-hour expiry
- Token stored in Zustand with localStorage persistence
- **Protected routes** — unauthenticated users redirected to `/login`
- Demo credentials shown on login page for easy testing

### 👥 Users Module
- Paginated users table (`limit` + `skip` API-side pagination)
- Live **search** with 400ms debounce — no API spam
- Full profile detail page with all user fields (contact, address, employment, banking, crypto, physical)

### 📦 Products Module
- **12-column responsive grid** with product cards
- **Search bar** with debounce
- **Category filter** dropdown (fetched from `/products/categories`)
- Product detail page with animated **image carousel**, specs, reviews, stock indicator

### 📊 Dashboard
- Animated stat cards (total users, products, avg rating, portfolio value)
- Recent users list with quick links
- Top products list with rating bars

### 🎨 UI/UX
- Full **dark theme** with amber + cyan accent system
- Custom **Syne + DM Sans + DM Mono** type stack
- **Framer Motion** animations — page entries, card reveals, carousel transitions
- Fully **responsive** — mobile sidebar with hamburger toggle
- Scrollbar styling, gradient orbs, grid textures, hover states throughout

---

## ⚙️ State Management — Why Zustand?

```ts
// Zero boilerplate — just create a store and use it
const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  fetchUsers: async (limit, skip, query) => {
    const cached = get().cache[cacheKey];
    if (cached) { set({ users: cached.users }); return; } // 🔥 instant cache hit
    const { data } = await axios.get(url);
    set({ users: data.users, cache: { ...cache, [key]: data } });
  },
}));
```

| Feature | Zustand | Redux |
|--------|---------|-------|
| Setup | ~10 lines | 50+ lines (actions, reducers, selectors) |
| Bundle | ~1KB | ~20KB |
| Async | Native `async` functions | Thunks/Sagas needed |
| Provider | Not needed | `<Provider store={store}>` required |
| DevTools | ✅ | ✅ |

**Verdict:** Zustand is the clear choice for small–medium apps. Same power, zero ceremony.

---

## 🚀 Caching Strategy

```ts
// Key: "limit-skip-query-category"
// Before every fetch, check the in-memory cache
const cacheKey = `${limit}-${skip}-${query}-${category}`;
if (get().cache[cacheKey]) {
  set({ products: cached.products }); // instant — no network
  return;
}
```

- **In-memory cache** (Zustand state) — holds fetched pages for the session
- **Zero repeat calls** when paginating back and forth
- **Categories list cached permanently** — fetched once, never again
- **Search results cached per query** — same search re-typed? Instant.
- Auth token persisted to **localStorage** via Zustand `persist` middleware

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js **18+**
- npm / yarn / pnpm

### 1. Clone the repo
```bash
git clone https://github.com/dharan0808/nexadmin.git
cd nexadmin
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root:
```env
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

> ⚠️ `NEXTAUTH_SECRET` must be set. Generate one with: `openssl rand -base64 32`

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production
```bash
npm run build
npm start
```

---

## 🔑 Demo Login Credentials

| Username | Password | Role |
|----------|----------|------|
| `emilys` | `emilyspass` | Admin |
| `michaelw` | `michaelwpass` | Moderator |

> These are provided by [DummyJSON](https://dummyjson.com/docs/auth). Credentials are shown directly on the login page — just click to fill.

---

## 🌐 API Reference

| Endpoint | Usage |
|----------|-------|
| `POST /auth/login` | Authenticate user |
| `GET /users?limit=&skip=` | Paginated users list |
| `GET /users/search?q=` | Search users |
| `GET /users/{id}` | Single user detail |
| `GET /products?limit=&skip=` | Paginated products |
| `GET /products/search?q=` | Search products |
| `GET /products/category/{cat}` | Filter by category |
| `GET /products/{id}` | Single product detail |
| `GET /products/categories` | All categories |

All data from [dummyjson.com](https://dummyjson.com) 🙌

---

## 📋 Evaluation Checklist

| Requirement | Status |
|-------------|--------|
| Next.js 14 project | ✅ |
| MUI v5 components throughout | ✅ |
| Zustand state management | ✅ |
| NextAuth authentication | ✅ |
| Login page with DummyJSON auth | ✅ |
| Token stored in Zustand + localStorage | ✅ |
| Protected dashboard routes | ✅ |
| Users list with pagination + search | ✅ |
| Single user detail page | ✅ |
| Products grid with pagination | ✅ |
| Products search + category filter | ✅ |
| Single product detail + image carousel | ✅ |
| Async Zustand actions for API calls | ✅ |
| Zustand explanation comments | ✅ |
| Responsive layouts (mobile + desktop) | ✅ |
| React.memo for performance | ✅ |
| useCallback / useMemo optimization | ✅ |
| API-side pagination (limit + skip) | ✅ |
| Client-side caching with comments | ✅ |
| Debounced search | ✅ |
| TypeScript throughout | ✅ |
| Clean folder structure | ✅ |

---

<div align="center">

Made with ❤️ by **Dharan** · Powered by [DummyJSON](https://dummyjson.com) · Built on [Next.js](https://nextjs.org)

</div>
