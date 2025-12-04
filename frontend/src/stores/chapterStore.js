import { defineStore } from 'pinia';
import api from '../api'; // dein axios-instance

export const useChapterStore = defineStore('chapters', {
  state: () => ({
    list: [],
    listLoading: false,
    listError: null,

    currentChapter: null,
    chapterLoading: false,
    chapterError: null,
  }),

  actions: {
    async fetchChapters() {
      this.listLoading = true;
      this.listError = null;
      try {
        const { data } = await api.get('/chapters');
        this.list = data;
      } catch (err) {
        this.listError = err.response?.data?.message || err.message;
      } finally {
        this.listLoading = false;
      }
    },

    async fetchChapter(slug) {
      this.chapterLoading = true;
      this.chapterError = null;
      this.currentChapter = null;
      try {
        const { data } = await api.get(`/chapters/${slug}`);
        this.currentChapter = data;
      } catch (err) {
        this.chapterError = err.response?.data?.message || err.message;
      } finally {
        this.chapterLoading = false;
      }
    },
  },
});
