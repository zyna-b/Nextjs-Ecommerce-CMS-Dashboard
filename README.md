# 🚀 Next.js E-commerce CMS Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Stripe](https://img.shields.io/badge/Stripe-API-blue?style=for-the-badge&logo=stripe)](https://stripe.com/docs)
[![shadcn/ui](https://img.shields.io/badge/shadcn-ui-38B2AC?style=for-the-badge&logo=shadcn)](https://ui.shadcn.com/)

A powerful, modern, and feature-rich **e-commerce content management system (CMS)** built with **Next.js 15**, **TypeScript**, and **Prisma**. This admin dashboard provides complete control over your online store with an intuitive interface, robust API, and beautiful UI.

---

## ✨ Features

### 🏪 Store Management
- Multi-store support
- Store switching
- Store settings and branding

### 📋 Billboard Management
- Create/manage promotional banners
- Cloudinary image upload
- Responsive billboard display

### 🏷️ Category Management
- Hierarchical categories
- Billboard linking
- SEO-friendly URLs

### 📏 Product Attributes
- Sizes and colors management
- Attribute relationships
- Visual color swatches

### 🛍️ Product Management
- Multiple image uploads per product
- Image preview gallery
- Product variants (size, color)
- Inventory tracking
- SEO fields
- Rich text descriptions

### 📦 Order Management
- Order tracking and status
- Customer info display
- Order history and analytics
- Payment and shipping management

### 🎨 Modern UI/UX
- Responsive design (mobile, tablet, desktop)
- Dark/Light mode support
- shadcn/ui components
- Data tables with sorting/filtering/pagination
- Toast notifications and skeleton loading

### 🔐 Authentication & Security
- Clerk authentication
- Role-based access control
- API route protection
- Middleware security

---

## 🛠️ Tech Stack

| Technology      | Purpose                | Version   |
|-----------------|------------------------|-----------|
| Next.js         | React Framework        | 15.0+     |
| TypeScript      | Type Safety            | 5.0+      |
| Prisma          | Database ORM           | 5.0+      |
| PostgreSQL      | Database               | Latest    |
| Clerk           | Authentication         | Latest    |
| Cloudinary      | Image Management       | Latest    |
| Tailwind CSS    | Styling                | 3.4+      |
| shadcn/ui       | UI Components          | Latest    |
| React Hook Form | Form Management        | Latest    |
| Zod             | Schema Validation      | Latest    |
| Axios           | HTTP Client            | Latest    |

---

## 📁 Project Structure

```
nextjs-ecommerce-cms-dashboard/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   │   └── [storeId]/
│   │       ├── (routes)/
│   │       │   ├── billboards/
│   │       │   │   ├── components/
│   │       │   │   ├── [billboardId]/
│   │       │   │   └── page.tsx
│   │       │   ├── categories/
│   │       │   │   ├── components/
│   │       │   │   ├── [categoryId]/
│   │       │   │   └── page.tsx
│   │       │   ├── colors/
│   │       │   │   ├── components/
│   │       │   │   ├── [colorId]/
│   │       │   │   └── page.tsx
│   │       │   ├── orders/
│   │       │   │   └── page.tsx
│   │       │   ├── products/
│   │       │   │   ├── components/
│   │       │   │   ├── [productId]/
│   │       │   │   │   ├── components/
│   │       │   │   │   └── page.tsx
│   │       │   │   └── page.tsx
│   │       │   ├── settings/
│   │       │   │   ├── components/
│   │       │   │   └── page.tsx
│   │       │   ├── sizes/
│   │       │   │   ├── components/
│   │       │   │   ├── [sizeId]/
│   │       │   │   └── page.tsx
│   │       └── layout.tsx
│   ├── api/
│   │   ├── [storeId]/
│   │   │   ├── billboards/
│   │   │   │   ├── [billboardId]/
│   │   │   │   └── route.ts
│   │   │   ├── categories/
│   │   │   │   ├── [categoryId]/
│   │   │   │   └── route.ts
│   │   │   ├── colors/
│   │   │   │   ├── [colorId]/
│   │   │   │   └── route.ts
│   │   │   ├── products/
│   │   │   │   ├── [productId]/
│   │   │   │   └── route.ts
│   │   │   ├── sizes/
│   │   │   │   ├── [sizeId]/
│   │   │   │   └── route.ts
│   │   │   ├── checkout/
│   │   │   │   └── route.ts
│   │   ├── stores/
│   │   │   └── [storeId]/
│   │   │   │   └── route.ts
│   │   ├── webhook/
│   │   │   └── route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── main-nav.tsx
│   ├── modals/
│   │   ├── alert-modal.tsx
│   │   └── store-modal.tsx
│   ├── navbar.tsx
│   ├── overview.tsx
│   ├── store-switcher.tsx
│   ├── theme-toggle.tsx
│   └── ui/
│       ├── alert.tsx
│       ├── api-alert.tsx
│       ├── api-list.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── command.tsx
│       ├── data-table.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── heading.tsx
│       ├── image-upload.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── modal.tsx
│       ├── popover.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── table.tsx
├── hooks/
│   ├── use-origin.tsx
│   └── use-store-modal.tsx
├── lib/
│   ├── prismadb.ts
│   ├── stripe.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── providers/
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── .env
├── .gitignore
├── eslint.config.mjs
├── middleware.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0+
- npm or yarn
- PostgreSQL database
- Cloudinary account
- Clerk account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zyna-b/nextjs-ecommerce-cms-dashboard.git
   cd nextjs-ecommerce-cms-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   FRONTEND_STORE_URL=http://localhost:3001
   ```

5. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed # optional
   ```

6. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

---

## 🔧 API Endpoints

### Stores
- `GET /api/stores` - Get all stores
- `POST /api/stores` - Create a new store
- `PATCH /api/stores/[storeId]` - Update store
- `DELETE /api/stores/[storeId]` - Delete store

### Billboards
- `GET /api/[storeId]/billboards` - Get all billboards
- `POST /api/[storeId]/billboards` - Create billboard
- `PATCH /api/[storeId]/billboards/[billboardId]` - Update billboard
- `DELETE /api/[storeId]/billboards/[billboardId]` - Delete billboard

### Categories
- `GET /api/[storeId]/categories` - Get all categories
- `POST /api/[storeId]/categories` - Create category
- `PATCH /api/[storeId]/categories/[categoryId]` - Update category
- `DELETE /api/[storeId]/categories/[categoryId]` - Delete category

### Products
- `GET /api/[storeId]/products` - Get all products
- `POST /api/[storeId]/products` - Create product
- `PATCH /api/[storeId]/products/[productId]` - Update product
- `DELETE /api/[storeId]/products/[productId]` - Delete product

### Sizes & Colors
- `GET /api/[storeId]/sizes` - Get all sizes
- `POST /api/[storeId]/sizes` - Create size
- `GET /api/[storeId]/colors` - Get all colors
- `POST /api/[storeId]/colors` - Create color

---

## 🎨 UI Components

- Data Tables (sortable, filterable)
- Forms (React Hook Form + Zod)
- Modals (confirmation dialogs, forms)
- Navigation (sidebar, navbar)
- Buttons (various styles)
- Input Fields (text, select, textarea, file)
- Toast Notifications (success/error)
- Loading States (skeletons, spinners)

---

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Manual Deployment
1. Build the application
   ```bash
   npm run build
   ```
2. Start the production server
   ```bash
   npm start
   ```

---

## 🔐 Environment Variables

| Variable                        | Description                  | Required |
|----------------------------------|------------------------------|----------|
| `DATABASE_URL`                   | PostgreSQL connection string | ✅       |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key           | ✅       |
| `CLERK_SECRET_KEY`               | Clerk secret key             | ✅       |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name      | ✅       |
| `FRONTEND_STORE_URL`             | Frontend store URL           | ✅       |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- shadcn for the beautiful UI components
- Clerk for authentication solution
- Prisma for the excellent ORM

---

## 📧 Support

If you have any questions or need help with setup, please open an issue or contact:

- **GitHub Issues**: [Create an issue](https://github.com/zyna-b/nextjs-ecommerce-cms-dashboard/issues)
- **Email**: zainabhamid2468@example.com

---

<div align="center">

**⭐ Don't forget to star this repository if you found it helpful! ⭐**

Made with ❤️ by [zyna-b](https://github.com/zyna-b)

</div>

---

**SEO Keywords:**  
Next.js e-commerce CMS, admin dashboard, online store management, product management, order tracking, Next.js 15, Prisma, shadcn/ui, Clerk authentication, Cloudinary image upload, TypeScript, PostgreSQL, modern e-commerce platform
