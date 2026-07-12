# CRAFT BAZAAR — How to Run

## Requirements

- **Node.js** — Download from https://nodejs.org (install LTS version)
- **MongoDB** — Either:
  - Cloud (easier): Free at https://cloud.mongodb.com (MongoDB Atlas)
  - Local: Download from https://www.mongodb.com/try/download/community

---

## Step-by-Step Setup

### Step 1 — Install Node.js
Download and install from https://nodejs.org (choose the LTS version).

---

### Step 2 — Set Up MongoDB

**Option A — MongoDB Atlas (Cloud, Recommended):**
1. Go to https://cloud.mongodb.com
2. Create a free account → Create a free cluster
3. Click **Connect** → **Drivers** → Copy the connection string
4. Open `backend/.env` in Notepad
5. Replace the `MONGODB_URI` value with your Atlas connection string

**Option B — Local MongoDB:**
1. Install MongoDB Community from https://www.mongodb.com
2. It runs automatically in the background — no changes needed to `.env`

---

### Step 3 — Configure Environment Variables

Open `backend/.env` in Notepad and fill in your values:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:5501
PORT=5000
NODE_ENV=development
```

> If you don't have Razorpay keys, you can leave them blank for now — only the payment feature will not work.

---

### Step 4 — First Time Setup

Double-click **`SETUP-FIRST-TIME.bat`**

This will:
- Install all backend dependencies
- Connect to your database

Run this only once (or after a fresh clone).

---

### Step 5 — Start the Server

Double-click **`START-BACKEND.bat`**

Keep this window open while using the website.
The backend runs at: `http://localhost:5000`

---

### Step 6 — Open the Website

Open `frontend/index.html` in your browser (Chrome recommended).

---

## Admin Panel

- **URL:** `frontend/pages/admin.html`
- Set up your own admin account via the register page, then manually update the user's role to `admin` in MongoDB Atlas.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot connect to server" | Make sure `START-BACKEND.bat` is running |
| "Invalid JSON" error in console | Backend is not running — start it first |
| Products not loading | Check `MONGODB_URI` in `.env` is correct |
| Payment not working | Add valid Razorpay test keys in `.env` |
| Port already in use | Change `PORT` in `.env` to `5001` or restart your PC |
