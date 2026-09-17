const API_BASE = "http://localhost:5000/api";

const Auth = {
  getToken() {
    return localStorage.getItem("cs_token");
  },

  setToken(token) {
    localStorage.setItem("cs_token", token);
  },

  removeToken() {
    localStorage.removeItem("cs_token");
  },

  getCachedUser() {
    const raw = localStorage.getItem("cs_user");
    return raw ? JSON.parse(raw) : null;
  },

  setCachedUser(user) {
    localStorage.setItem("cs_user", JSON.stringify(user));
  },

  clearSession() {
    localStorage.removeItem("cs_token");
    localStorage.removeItem("cs_user");
  },

  showAdminNav(user) {
    const adminNavLink = document.getElementById("adminNavLink");
    if (adminNavLink && user?.role === "admin") {
      adminNavLink.style.display = "";
    }
  },

  async request(path, options = {}) {
    const token = this.getToken();

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  },

  async register(payload) {
    const data = await this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (data.token && data.user) {
      this.setToken(data.token);
      this.setCachedUser(data.user);
    }

    return data;
  },

  async login(payload) {
    const data = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (data.token && data.user) {
      this.setToken(data.token);
      this.setCachedUser(data.user);
    }

    return data;
  },

  async fetchMe() {
    const data = await this.request("/auth/me");
    if (data.user) {
      this.setCachedUser(data.user);
    }
    return data.user;
  },

  async requireAuth() {
    const token = this.getToken();

    if (!token) {
      window.location.href = "login.html";
      return null;
    }

    try {
      const user = await this.fetchMe();
      return user;
    } catch (error) {
      this.clearSession();
      window.location.href = "login.html";
      return null;
    }
  },

  async requireAdmin() {
    const user = await this.requireAuth();
    if (!user) return null;

    if (user.role !== "admin") {
      window.location.href = "user-dashboard.html";
      return null;
    }

    return user;
  },

  logout(redirect = "login.html") {
    this.clearSession();
    window.location.href = redirect;
  },
};