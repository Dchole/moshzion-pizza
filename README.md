# 🍕 Moshzion - Pizza Restaurant E-Commerce Website

A modern, responsive pizza restaurant e-commerce website built with **Next.js 16**, **Tailwind CSS 4**, and **TypeScript**. Features a complete ordering system with shopping cart functionality, multiple payment options, and server-side rendering for optimal performance.

![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## ✨ Features

### 🎨 User Interface

- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Modern UI**: Beautiful beige/tan color scheme with brown accents
- **Smooth Animations**: Transitions and hover effects throughout
- **Dynamic Watermarks**: Responsive pizza name watermarks on product pages
- **Logo Variants**: Separate logos for landing and app sections
- **Real-time Updates**: Custom event system for instant cart synchronization
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation support
- **SEO Optimized**: Static generation, proper meta tags, and semantic structure

### 🏠 Pages & Features

1. **Homepage**
   - Hero section with call-to-action
   - Featured pizzas showcase
   - Delivery service information
   - "Why Buy From Us" section with icons
   - Customer testimonials carousel
   - Newsletter subscription

2. **Store/Product Listing**
   - Grid view of all pizzas
   - Real-time search functionality
   - Filter by category (New, Vegan, Hot, Promo)
   - Responsive product cards

3. **Product Detail**
   - Server-side rendering with static generation
   - SEO-optimized metadata per product
   - Size selection (Small, Medium, Large, Mega)
   - Customizable toppings
   - Dynamic price calculation
   - Responsive watermark effect
   - Add to cart & direct checkout options

4. **Shopping Cart**
   - Cart item management
   - Quantity controls
   - Size modification
   - Empty cart state with illustration
   - Order summary sidebar

5. **Checkout**
   - Multiple payment methods (Credit Card, Mobile Money, Cash on Delivery)
   - Order summary
   - Zod schema validation for all payment methods
   - Card validation (16 digits, expiry, CVC)
   - Phone number validation for mobile money
   - Responsive multi-step design

## 🚀 Getting Started

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

- **app/** - Next.js 16 App Router pages and Server Actions
- **components/** - Reusable React components
- **lib/** - Utilities, data, and constants
- **types/** - TypeScript definitions
- **public/assets/** - Static images, logos, and icons

## 🎨 Design System

**Colors:**

- Primary Beige: #E5D4C1
- Brown Dark: #5D3A1A
- Brown Medium: #8B5A2B

**Fonts:**

- Display: Lobster (headings)
- Body: Open Sans
- Captions/Labels: Rubik

## 🛠 Tech Stack

- **Next.js 16** with App Router
- **React 19** with Server Components
- **TypeScript 5** for type safety
- **Tailwind CSS 4** for styling
- **Zod** for runtime validation
- **Server Actions** for cart management (cookies-based)
- **Custom Events** for real-time UI synchronization

## 📝 Available Scripts

```bash
npm run dev      # Development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🏗️ Architecture Highlights

### Server-Side Rendering

- **Server Components**: Store and product pages rendered on server
- **Static Generation**: Product pages pre-generated with `generateStaticParams`
- **Dynamic Metadata**: SEO-optimized meta tags per product using `generateMetadata`

### State Management

- **Server Actions**: Cart operations handled via secure server-side functions
- **Cookie-based Storage**: Cart persisted across sessions
- **Custom Events**: `cart-updated` events for real-time UI synchronization
- **URL State**: Search and filters managed through searchParams

### Code Quality

- **Constants Management**: Centralized timing and threshold values
- **Secure IDs**: `crypto.randomUUID()` for stable cart item identifiers
- **Immutable Updates**: Pure functions for cart operations
- **Form Validation**: Zod schemas with refinements for all payment methods

### Performance Optimizations

- **Image Optimization**: Next.js Image component with priority loading
- **Debounced Updates**: Strategic delays for smooth UI transitions
- **Event-based Updates**: Minimal re-renders with targeted notifications
- **Static Assets**: Optimized SVG logos and icons

## 🔮 Next Steps

- Add user authentication and profiles
- Integrate real payment gateway (Stripe/PayPal)
- Connect to backend API for order management
- Implement order tracking system
- Create admin dashboard for order management
- Add email notifications for orders
- Implement reviews and ratings system

## ♿ Accessibility

- Semantic HTML5
- ARIA labels
- Keyboard navigation
- Focus states
- Screen reader friendly

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
