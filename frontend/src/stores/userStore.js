// frontend/src/stores/userStore.js
import { defineStore } from "pinia";
import api from "../api";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: null,
    users: [],
    loading: false,
    error: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) =>
      state.user?.roles?.includes("ADMIN") ?? false,
  },

  actions: {
    async fetchMe() {
      try {
        const res = await api.get("/auth/me");
        this.user = res.data;
        return res.data;
      } catch {
        this.user = null;
        return null;
      }
    },

    async fetchUsers() {
      this.loading = true;
      try {
        const res = await api.get("/users");
        this.users = res.data;
      } catch (e) {
        this.error =
          e?.response?.data?.message ||
          "Users konnten nicht geladen werden";
      } finally {
        this.loading = false;
      }
    },

    async grantRole(emails, role) {
      return api.post("/users/roles", {
        emails,
        role,
        action: "add",
      });
    },

    async removeRole(emails, role) {
      return api.post("/users/roles", {
        emails,
        role,
        action: "remove",
      });
    },

    async logout() {
      await api.post("/auth/logout");
      this.user = null;
    },
  },
});
