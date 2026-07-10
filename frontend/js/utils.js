// js/utils.js
// Shared utilities for craftbazaar frontend

const API_BASE = "https://craftbazaar-backend.onrender.com/api";

/* ── Auth Helpers ─────────────────────────────────────────── */
const getToken = () => localStorage.getItem("cb_token");
const getUser = () => JSON.parse(localStorage.getItem("cb_user") || "null");
const isLoggedIn = () => !!getToken();

const saveAuth = (token, user) => {
  localStorage.setItem("cb_token", token);
  localStorage.setItem("cb_user", JSON.stringify(user));
};

const clearAuth = () => {
  localStorage.removeItem("cb_token");
  localStorage.removeItem("cb_user");
};

const logout = () => {
  clearAuth();
  clearCart();
  window.location.href = "/pages/login.html";
};

/* ── API Request Helper ───────────────────────────────────── */
const api = async (endpoint, method = "GET", body = null, auth = false) => {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

/* ── Cart (localStorage) ──────────────────────────────────── */
const getCart = () => JSON.parse(localStorage.getItem("cb_cart") || "[]");

const saveCart = (cart) => {
  localStorage.setItem("cb_cart", JSON.stringify(cart));
  updateCartBadge();
};

const addToCart = (product, quantity = 1) => {
  const cart = getCart();
  const existing = cart.find((item) => item._id === product._id);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, product.stock);
  } else {
    cart.push({ ...product, quantity });
  }
  saveCart(cart);
  showToast("Added to cart!", "success");
};

const removeFromCart = (productId) => {
  const cart = getCart().filter((item) => item._id !== productId);
  saveCart(cart);
};

const updateCartQty = (productId, quantity) => {
  const cart = getCart();
  const item = cart.find((i) => i._id === productId);
  if (item) {
    if (quantity <= 0) return removeFromCart(productId);
    item.quantity = quantity;
    saveCart(cart);
  }
};

const clearCart = () => {
  localStorage.removeItem("cb_cart");
  updateCartBadge();
};

const getCartTotal = () => {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const getCartCount = () => {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
};

const updateCartBadge = () => {
  const badge = document.querySelector(".cart-badge");
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  }
};
/* ── Toast Notification ───────────────────────────────────── */
const showToast = (message, type = "default", duration = 3000) => {
  let toast = document.getElementById("cb-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cb-toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast ${type}`;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add("show"));
  });
  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
};

/* ── Navbar ───────────────────────────────────────────────── */
const initNavbar = () => {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  // Scroll effect
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });

  // Update auth links
  const user = getUser();
  const authLink = document.getElementById("auth-link");
  const profileLink = document.getElementById("profile-link");

  if (user) {
    if (authLink) authLink.style.display = "none";
    if (profileLink) {
      profileLink.style.display = "flex";
      profileLink.href =
        user.role === "artisan"
          ? "/pages/dashboard.html"
          : "/pages/profile.html";
    }
  } else {
    if (authLink) authLink.style.display = "flex";
    if (profileLink) profileLink.style.display = "none";
  }

  // Cart badge
  updateCartBadge();

  // Hamburger
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.style.display =
        navLinks.style.display === "flex" ? "none" : "flex";
      navLinks.style.flexDirection = "column";
      navLinks.style.position = "absolute";
      navLinks.style.top = "100%";
      navLinks.style.left = "0";
      navLinks.style.right = "0";
      navLinks.style.background = "rgba(248,239,227,0.98)";
      navLinks.style.padding = "1.5rem";
      navLinks.style.boxShadow = "0 8px 24px rgba(74,52,40,0.12)";
    });
  }
};

/* ── Scroll Animations ────────────────────────────────────── */
const initScrollAnimations = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
};

/* ── Star Rating HTML ─────────────────────────────────────── */
const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
};

/* ── Format Currency ──────────────────────────────────────── */
const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

/* ── Format Date ──────────────────────────────────────────── */
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/* ── Product Card HTML ────────────────────────────────────── */
const productCardHTML = (p) => `
  <div class="product-card" onclick="window.location.href='/pages/product.html?id=${p._id}'">
    <div class="product-card-img">
      <img src="${p.images?.[0] || "/assets/placeholder.svg"}" alt="${p.title}" loading="lazy">
      ${p.isHandmadeVerified ? '<span class="product-card-badge verified">✓ Verified</span>' : ""}
      <button class="product-wishlist-btn" onclick="event.stopPropagation(); toggleWishlist('${p._id}', this)">♡</button>
    </div>
    <div class="product-card-body">
      <div class="product-card-category">${p.category?.replace("-", " ")}</div>
      <div class="product-card-title">${p.title}</div>
      <div class="product-card-artisan">
        by ${p.artisan?.shopName || p.artisan?.name || "Artisan"} · ${p.state}
      </div>
      <div class="product-card-footer">
        <div class="product-card-price">${formatPrice(p.price)}</div>
        <div class="product-card-rating">
          <span class="stars">${renderStars(p.averageRating || 0)}</span>
          (${p.numReviews || 0})
        </div>
      </div>
    </div>
  </div>
`;
/* ── Wishlist ─────────────────────────────────────────────── */
const getWishlist = () =>
  JSON.parse(localStorage.getItem("cb_wishlist") || "[]");

const toggleWishlist = (id, btn) => {
  const wishlist = getWishlist();
  const idx = wishlist.indexOf(id);

  if (idx === -1) {
    wishlist.push(id);
    if (btn) {
      btn.textContent = "♥";
      btn.classList.add("active");
    }
    showToast("Added to wishlist!", "success");
  } else {
    wishlist.splice(idx, 1);
    if (btn) {
      btn.textContent = "♡";
      btn.classList.remove("active");
    }
    showToast("Removed from wishlist");
  }

  localStorage.setItem("cb_wishlist", JSON.stringify(wishlist));
};

/* ── Zara Navbar (shared across all pages) ────────────── */
const initZaraNav = () => {
  // Scroll effect
  window.addEventListener("scroll", () => {
    const nav = document.getElementById("zara-nav");
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 50);
  });

  // Auth links
  const user = getUser();
  const loginLink = document.getElementById("nav-login-link");
  const profileLink = document.getElementById("nav-profile-link");

  if (user) {
    if (loginLink) loginLink.style.display = "none";

    if (profileLink) {
      profileLink.style.display = "block";
      profileLink.href =
        user.role === "admin"
          ? "/pages/admin.html"
          : user.role === "artisan"
            ? "/pages/dashboard.html"
            : "/pages/profile.html";
    }
  } else {
    if (loginLink) loginLink.style.display = "block";
    if (profileLink) profileLink.style.display = "none";
  }

  updateCartBadge();
};

/* ── Sidebar toggle ───────────────────────────────────── */
const toggleSidebar = () => {
  const sidebar = document.getElementById("sidebar-menu");
  const overlay = document.getElementById("sidebar-overlay");
  const hamburger = document.getElementById("hamburger-btn");

  if (!sidebar) return;

  sidebar.classList.toggle("open");
  overlay.classList.toggle("open");
  hamburger.classList.toggle("open");
};

/* ── Search toggle ────────────────────────────────────── */
const toggleSearch = () => {
  const searchEl = document.getElementById("search-overlay");

  if (!searchEl) return;

  searchEl.classList.toggle("open");

  if (searchEl.classList.contains("open")) {
    const inp = document.getElementById("search-input-overlay");
    if (inp) inp.focus();
  }
};

const doSearch = () => {
  const inp = document.getElementById("search-input-overlay");

  if (!inp) return;

  const keyword = inp.value.trim();

  if (keyword) {
    window.location.href = `/pages/explore.html?keyword=${encodeURIComponent(keyword)}`;
  }
};

/* ── Call on every page load ──────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initNavbar(); // old navbar
  initZaraNav(); // new Zara navbar
  initScrollAnimations();
  updateCartBadge();
});
