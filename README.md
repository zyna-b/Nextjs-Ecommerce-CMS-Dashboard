# � Next.js E-commerce CMS Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

A powerful, modern, and feature-rich **e-commerce content management system** built with **Next.js 15**, **TypeScript**, and **Prisma**. This admin dashboard provides complete control over your online store with an intuitive interface and robust functionality.

## ✨ Features

### 🏪 **Store Management**
- **Multi-store support** - Manage multiple stores from one dashboard
- **Store switching** - Seamless navigation between different stores
- **Store settings** - Configure store details, branding, and preferences

### 📋 **Billboard Management**
- Create and manage promotional banners
- Image upload with **Cloudinary** integration
- Responsive billboard display
- Real-time preview functionality

### 🏷️ **Category Management**
- Hierarchical category structure
- Link categories to billboards
- SEO-friendly category URLs
- Bulk category operations

### 📏 **Product Attributes**
- **Sizes management** - Define product dimensions
- **Colors management** - RGB color picker and hex codes
- **Attribute relationships** - Link products to multiple attributes
- **Visual color swatches**

### �️ **Product Management**
- **Multiple image uploads** per product
- **Image preview gallery** with drag & drop
- **Product variants** (size, color combinations)
- **Inventory tracking**
- **SEO optimization** fields
- **Rich text descriptions**

### � **Order Management**
- **Order tracking** and status updates
- **Customer information** display
- **Order history** and analytics
- **Payment status** monitoring
- **Shipping management**

### 🎨 **Modern UI/UX**
- **Responsive design** - Works on all devices
- **Dark/Light mode** support
- **shadcn/ui components** - Beautiful, accessible UI
- **Data tables** with sorting, filtering, and pagination
- **Loading states** and skeleton screens
- **Toast notifications**

### 🔐 **Authentication & Security**
- **Clerk authentication** - Secure user management
- **Role-based access** control
- **API route protection**
- **Middleware security**

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React Framework | 15.0+ |
| **TypeScript** | Type Safety | 5.0+ |
| **Prisma** | Database ORM | 5.0+ |
| **PostgreSQL** | Database | Latest |
| **Clerk** | Authentication | Latest |
| **Cloudinary** | Image Management | Latest |
| **Tailwind CSS** | Styling | 3.4+ |
| **shadcn/ui** | UI Components | Latest |
| **React Hook Form** | Form Management | Latest |
| **Zod** | Schema Validation | Latest |
| **Axios** | HTTP Client | Latest |

## � Project Structure

```
nextjs-ecommerce-cms-dashboard/
├── app/                          # Next.js 13+ App Router
│   ├── (auth)/                   # Authentication routes
│   ├── (dashboard)/              # Protected dashboard routes
│   │   └── [storeId]/           # Dynamic store routes
│   │       ├── (routes)/        # Store-specific pages
│   │       │   ├── billboards/  # Billboard management
│   │       │   ├── categories/  # Category management
│   │       │   ├── sizes/       # Size management
│   │       │   ├── colors/      # Color management
│   │       │   ├── products/    # Product management
│   │       │   ├── orders/      # Order management
│   │       │   └── settings/    # Store settings
│   │       └── layout.tsx       # Dashboard layout
│   ├── api/                     # API routes
│   │   ├── [storeId]/          # Store-specific APIs
│   │   └── stores/             # Store management APIs
│   ├── globals.css             # Global styles
│   └── layout.tsx              # Root layout
├── components/                  # Reusable components
│   ├── modals/                 # Modal components
│   ├── ui/                     # shadcn/ui components
│   └── ...                     # Other components
├── hooks/                      # Custom React hooks
├── lib/                        # Utility functions
├── prisma/                     # Database schema & migrations
└── public/                     # Static assets
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **PostgreSQL** database
- **Cloudinary** account (for image uploads)
- **Clerk** account (for authentication)

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
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# App URL
FRONTEND_STORE_URL=http://localhost:3001
```

5. **Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

6. **Start the development server**
```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

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

## 🎨 UI Components

This project uses **shadcn/ui** components for a consistent and beautiful interface:

- **Data Tables** - Sortable, filterable product/order tables
- **Forms** - React Hook Form with Zod validation
- **Modals** - Confirmation dialogs and forms
- **Navigation** - Responsive sidebar and navbar
- **Buttons** - Various button styles and states
- **Input Fields** - Text, select, textarea, and file inputs
- **Toast Notifications** - Success/error messages
- **Loading States** - Skeleton screens and spinners

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** automatically on every push to main branch

### Manual Deployment

1. **Build the application**
```bash
npm run build
```

2. **Start the production server**
```bash
npm start
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | ✅ |
| `CLERK_SECRET_KEY` | Clerk secret key | ✅ |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ |
| `FRONTEND_STORE_URL` | Frontend store URL | ✅ |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. **Fork the repository**
2. **Create your feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js team** for the amazing framework
- **Vercel** for hosting and deployment
- **shadcn** for the beautiful UI components
- **Clerk** for authentication solution
- **Prisma** for the excellent ORM

## 📧 Support

If you have any questions or need help with setup, please open an issue or contact:

- **GitHub Issues**: [Create an issue](https://github.com/zyna-b/nextjs-ecommerce-cms-dashboard/issues)
- **Email**: your-email@example.com

---

<div align="center">

**⭐ Don't forget to star this repository if you found it helpful! ⭐**

Made with ❤️ by [zyna-b](https://github.com/zyna-b)

</div>
