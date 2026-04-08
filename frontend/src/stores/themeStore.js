import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const saved = localStorage.getItem("theme");
  const dark = ref(saved ? saved === "dark" : false);

  const apply = () => {
    document.documentElement.setAttribute("data-theme", dark.value ? "dark" : "light");
  };

  watch(dark, () => {
    localStorage.setItem("theme", dark.value ? "dark" : "light");
    apply();
  });

  // apply on init
  apply();

  const toggle = () => {
    dark.value = !dark.value;
  };

  return { dark, toggle };
});
