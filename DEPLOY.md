# Deployment Guide: NEXUS (2027-online-shop)

This guide will help you deploy the NEXUS e-commerce platform to Vercel, the recommended hosting provider for Next.js applications.

## 🚀 Option 1: Vercel (Recommended)

Vercel provides the best performance and zero-configuration deployment for Next.js.

### Prerequisites

- A [Vercel Account](https://vercel.com/signup)
- [Vercel CLI](https://vercel.com/docs/cli) installed (optional, can use UI)

### Steps

1. **Login**:

   ```bash
   npx vercel login
   ```

2. **Deploy**:
   Run the following command in the `apps/web` directory:

   ```bash
   npx vercel
   ```

3. **Configuration**:
   - Vercel will ask a few questions. Press `Enter` to accept defaults.
   - **Link to existing project?** [N]
   - **Link to existing project?** [N]
   - **In which directory is your code located?** ./apps/web (or just press Enter if already in root)
   - **Want to modify these settings?** [N]

4. **Production Push**:
   Once you test the preview deployment, push to production:

   ```bash
   vercel --prod
   ```

## 🌐 Option 2: Netlify

1. Create a `netlify.toml` file in the root:

   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. Drag and drop your project folder to Netlify Drop or connect via Git.

## 🔑 Environment Variables

For the full experience (optional), set these in your Vercel/Netlify dashboard:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe Public Key
- `STRIPE_SECRET_KEY`: Your Stripe Secret Key
- `RESEND_API_KEY`: For email notifications

*Note: The app will run in "Mock Mode" perfectly fine without these keys.*
