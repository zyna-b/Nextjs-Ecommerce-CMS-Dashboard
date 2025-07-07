# 🛍️ E-commerce Admin Dashboard

A modern, full-stack e-commerce admin dashboard built with Next.js 15, featuring authentication, database management, and a beautiful UI.

## 🚀 Features

- **🔐 Authentication**: Complete auth system with Clerk (sign-in/sign-up)
- **🏪 Store Management**: Create and manage multiple stores
- **🎨 Modern UI**: Beautiful components built with shadcn/ui and Tailwind CSS
- **📱 Responsive Design**: Works seamlessly across all devices
- **🗄️ Database**: PostgreSQL with Prisma ORM
- **🔄 Real-time**: Toast notifications and state management with Zustand
- **🛡️ Type Safety**: Full TypeScript implementation
- **⚡ Performance**: Built with Next.js 15 and Turbopack

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### Backend & Database
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Robust relational database

### Authentication & State
- **Clerk** - Complete authentication solution
- **Zustand** - Lightweight state management
- **React Hot Toast** - Toast notifications

## 📦 Project Structure

```
ecommerce-admin/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   │   ├── layout.tsx     # Auth layout wrapper
│   │   └── (routes)/      # Auth pages
│   ├── (root)/            # Main application routes
│   │   └── page.tsx       # Dashboard home
│   ├── api/               # API routes
│   │   └── stores/        # Store management API
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── modals/           # Modal components
│   └── ui/               # UI components (Button, Dialog, etc.)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── providers/            # Context providers
├── prisma/              # Database schema and migrations
└── middleware.ts        # Next.js middleware for auth
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Clerk account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ecommerce-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_admin"
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🗄️ Database Schema

### Store Model
```prisma
model Store {
  id        String   @id @default(cuid())
  name      String
  userID    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🔐 Authentication Flow

1. **Protected Routes**: All routes except sign-in/sign-up require authentication
2. **Middleware Protection**: Custom middleware handles route protection
3. **Clerk Integration**: Seamless authentication with social providers
4. **Session Management**: Automatic session handling and token refresh

## 🎨 UI Components

The project uses a design system built on:
- **shadcn/ui** - Beautiful, accessible components built on Radix UI primitives
- **Tailwind CSS** - Utility-first styling
- **Custom components** - Reusable UI elements with consistent design

### Key Components
- `Modal` - Reusable modal wrapper
- `Button` - Various button styles and states
- `Form` - Form components with validation
- `Toast` - Notification system

## 📱 State Management

### Zustand Stores
- **Store Modal**: Manages store creation modal state
  ```typescript
  interface useStoreModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  }
  ```

## 🛡️ Security Features

- **Route Protection**: Middleware-based authentication
- **Input Validation**: Zod schemas for form validation
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **Environment Variables**: Secure configuration management

## 📚 API Endpoints

### Stores
- `POST /api/stores` - Create a new store
  - **Auth Required**: Yes
  - **Body**: `{ name: string }`
  - **Response**: Store object

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Clerk](https://clerk.dev/) - Authentication solution
- [Prisma](https://prisma.io/) - Database toolkit
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

**Built with ❤️ using modern web technologies**
