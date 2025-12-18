import { defineStore } from 'pinia';
import api from '../api';

export const useUserStore = defineStore('user', {
  state: () => ({
    me: null,
    usersOverview: [],
    loading: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.me,
    isSpecial: (state) => state.me?.role === 'SPECIAL',
  },

  actions: {
    async fetchMe() {
      try {
        const res = await api.get('/auth/me');
        this.me = res.data;
      } catch {
        this.me = null;
      }
    },

    async fetchUsersOverview() {
      this.loading = true;
      try {
        const res = await api.get('/users/overview');
        this.usersOverview = res.data;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      await api.post('/auth/logout');
      this.me = null;
      this.usersOverview = [];
    },
  },
});
