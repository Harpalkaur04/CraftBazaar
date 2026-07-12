# CRAFT BAZAAR — Handmade Products Marketplace

> *Made by hand. Sold through CRAFT BAZAAR.*

A full-stack e-commerce platform connecting India's finest artisans with customers who value authentic, handcrafted products. Every piece on CRAFT BAZAAR carries a story — of patience, skill, and tradition.

🌐 **Live:** [craftbazaar-frontend.onrender.com](https://craftbazaar-frontend.onrender.com)

---

## 📁 Project Structure

```
craftbazaar/
├── backend/
│   ├── config/
│   │   └── db.js                          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js              # JWT auth (register/login)
│   │   ├── productController.js           # Product CRUD
│   │   ├── orderController.js             # Order management
│   │   ├── reviewController.js            # Product reviews & flagging
│   │   └── newsletterController.js        # Newsletter subscribers
│   ├── middleware/
│   │   ├── authMiddleware.js              # JWT protect + role guard
│   │   └── errorMiddleware.js             # Global error handler
│   ├── models/
│   │   ├── User.js                        # User schema + bcrypt
│   │   ├── Product.js                     # Product schema + Verified Handmade badge
│   │   ├── Order.js                       # Order schema
│   │   ├── Review.js                      # Review schema + flag support
│   │   └── NewsletterSubscriber.js        # Newsletter subscriber schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── newsletterRoutes.js
│   │   └── userRoutes.js
│   ├── server.js                          # Express entry point
│   ├── .env                               # Environment variables (not committed)
│   └── package.json
├── frontend/
│   ├── assets/
│   │   ├── artisan-feature.svg
│   │   ├── loginimagebidri.png
│   │   └── placeholder.svg
│   ├── css/
│   │   └── style.css                      # Complete design system
│   ├── js/
│   │   └── utils.js                       # Shared utilities
│   ├── pages/
│   │   ├── about.html                     # About CRAFT BAZAAR
│   │   ├── admin.html                     # Admin panel
│   │   ├── artisans.html                  # Artisan directory
│   │   ├── cart.html                      # Cart + checkout
│   │   ├── categories.html                # Browse by category
│   │   ├── dashboard.html                 # User dashboard
│   │   ├── explore.html                   # Explore all crafts
│   │   ├── login.html                     # Login + Register
│   │   ├── product.html                   # Single product detail
│   │   ├── products.html                  # Product listing + filters
│   │   ├── profile.html                   # User profile
│   │   └── states.html                    # Browse by Indian state
│   ├── index.html                         # Home page
│   ├── server.js                          # Frontend static server
│   └── package.json
├── dev.js                                 # Dev runner — starts both servers together
└── package.json                           # Root scripts
```

---

## ✨ Key Features

### For Customers
- Browse and purchase authentic handcrafted products from Indian artisans
- Explore crafts by category, price range, and Indian state
- Shopping cart and secure checkout
- Razorpay payment gateway integration
- Product reviews and ratings
- Report suspicious or fake listings
- Newsletter subscription

### For Artisans
- Dedicated artisan directory and profiles
- **Verified Handmade Badge** — displayed on approved artisan products
- **Craft Story field** — artisans share the story behind each product

### For Admins
- Full dashboard with platform statistics
- Manage products, orders, users, and reviews
- Review flagged listings

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB (local) or MongoDB Atlas (cloud, recommended)

### 1. Clone & Install

```bash
git clone https://github.com/harpalkaur04/craft-bazaar.git
cd craftbazaar
cd backend && npm install
```

### 2. Configure Environment

Create a `.env` file inside the `backend/` folder:

```env
MONGODB_URI=mongodb://localhost:27017/craftbazaar
JWT_SECRET=your_strong_jwt_secret_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:5501
NODE_ENV=development
PORT=5000
```

> ⚠️ Never commit `.env` to GitHub. It is already in `.gitignore`.

### 3. Start Both Servers

From the root `craftbazaar/` folder:

```bash
npm run dev
```

This starts both servers simultaneously via `dev.js`:
- **Backend** → `http://localhost:5000`
- **Frontend** → `http://localhost:5501`

Open `http://localhost:5501` in your browser (Chrome recommended).

---

## 🌐 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get profile (auth) |
| PUT | `/api/auth/me` | Update profile (auth) |
| PUT | `/api/auth/change-password` | Change password (auth) |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (filter, search, paginate) |
| GET | `/api/products/:id` | Get single product |
| GET | `/api/products/categories` | Category counts |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

Query params: `?category=pottery&minPrice=100&maxPrice=5000&search=handwoven&sort=price_asc&page=1&limit=12`

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order (auth) |
| GET | `/api/orders/my-orders` | My orders (auth) |
| GET | `/api/orders/:id` | Single order (auth) |
| PUT | `/api/orders/:id/cancel` | Cancel order (auth) |
| GET | `/api/orders` | All orders (admin) |
| PUT | `/api/orders/:id/status` | Update order status (admin) |

### Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews` | Submit review (auth) |
| GET | `/api/reviews/product/:id` | Get product reviews |
| PUT | `/api/reviews/:id/flag` | Flag a review (auth) |
| DELETE | `/api/reviews/:id` | Delete review (admin) |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/create-order` | Create Razorpay order |
| POST | `/api/payment/verify` | Verify payment signature |

### Newsletter

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/newsletter/subscribe` | Subscribe to newsletter |
| GET | `/api/newsletter/subscribers` | All subscribers (admin) |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | All users (admin) |
| PUT | `/api/users/:id/toggle` | Toggle user active status (admin) |

---

## 💳 Razorpay Integration

CRAFT BAZAAR uses Razorpay for secure payment processing (test mode).

**Flow:**
1. Customer places order → backend creates a Razorpay order
2. Frontend opens Razorpay checkout modal
3. On payment success, frontend sends `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature` to backend
4. Backend verifies HMAC signature before confirming the order

**Test card details:**
```
Card Number : 4111 1111 1111 1111
Expiry      : Any future date
CVV         : Any 3 digits
```

---

## 🛡️ Security Features

- ✅ JWT authentication with expiry
- ✅ Password hashing with bcryptjs (salt rounds: 12)
- ✅ Razorpay payment signature verification (HMAC SHA256)
- ✅ CORS with whitelisted frontend origin
- ✅ Mongoose schema-level input validation
- ✅ Role-based route guards (Customer / Admin)
- ✅ Environment variables for all secrets (dotenv)

---

## ☁️ Deployment

Both frontend and backend are deployed on **Render**.

| Service | URL |
|---------|-----|
| Frontend | https://craftbazaar-frontend.onrender.com |
| Backend API | https://craftbazaar-backend.onrender.com |

### Backend — Render (Web Service)

1. Push code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Configure:
   - **Root Directory:** `backend`
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Add environment variables in Render dashboard:

```
MONGODB_URI         = your MongoDB Atlas connection string
JWT_SECRET          = strong random string
RAZORPAY_KEY_ID     = your Razorpay key ID
RAZORPAY_KEY_SECRET = your Razorpay key secret
FRONTEND_URL        = https://craftbazaar-frontend.onrender.com
NODE_ENV            = production
```

### Frontend — Render (Static Site)

1. Create a new **Static Site** on [render.com](https://render.com)
2. Configure:
   - **Root Directory:** `frontend`
   - **Publish Directory:** `.`
3. No build command needed — pure HTML/CSS/JS

### Database — MongoDB Atlas

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Whitelist all IPs (`0.0.0.0/0`) for Render compatibility
3. Copy the connection string into your Render backend environment variables

---

## 💡 Frontend Pages

| Page | Description |
|------|-------------|
| `index.html` | Home — hero, featured products, artisan showcase |
| `products.html` | Full product listing with filters and search |
| `product.html` | Single product detail with reviews and Craft Story |
| `cart.html` | Cart and Razorpay checkout |
| `login.html` | Login and registration |
| `artisans.html` | Browse verified artisans |
| `categories.html` | Browse crafts by category |
| `states.html` | Browse crafts by Indian state |
| `explore.html` | Explore all crafts |
| `dashboard.html` | User order history and profile |
| `profile.html` | Edit profile |
| `admin.html` | Admin panel — products, orders, users, reviews |
| `about.html` | About CRAFT BAZAAR |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| Payments | Razorpay API |
| Security | CORS, dotenv |
| Dev Tools | Nodemon |
| Deployment | Render (frontend + backend), MongoDB Atlas |

---

## 👩‍💻 Author

**Harpal Kaur Virk**
B.Tech Computer Science Engineering — Lovely Professional University
GitHub: [@harpalkaur04](https://github.com/harpalkaur04)

---

*Built with care — for every artisan whose craft deserves to be seen.*
