<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "./stores/userStore";
import { useThemeStore } from "./stores/themeStore";
import logoBlack from "./assets/images/htlWW_LogoBlack.png";
import logoWhite from "./assets/images/htlWW_LogoWhite.png";

const userStore = useUserStore();
const themeStore = useThemeStore();
const route = useRoute();
const mobileNavOpen = ref(false);

const showNav = computed(() => userStore.isLoggedIn && route.path !== "/login");
const navLogo = computed(() => (themeStore.dark ? logoWhite : logoBlack));

watch(
  () => route.fullPath,
  () => {
    mobileNavOpen.value = false;
  }
);

onMounted(() => {
  userStore.fetchMe();
});
</script>

<template>
  <nav v-if="showNav" class="nav" :class="{ 'nav--open': mobileNavOpen }">
    <div class="nav-inner">
      <div class="brand">
        <a href="https://htlwienwest.at" class="brand-logo-link" aria-label="HTL Wien West Website">
          <img :src="navLogo" alt="HTL Wien West Logo" class="logo" />
        </a>
        <router-link to="/chapters" class="brand-text">HTL Wien West</router-link>
      </div>

      <div class="nav-links" :class="{ 'nav-links--open': mobileNavOpen }">
        <router-link to="/chapters">Kapitel</router-link>
        <router-link v-if="userStore.isAdmin" to="/users">Benutzerverwaltung</router-link>
      </div>

      <button type="button" class="theme-toggle" :aria-label="themeStore.dark ? 'Light Mode' : 'Dark Mode'"
        @click="themeStore.toggle()">
        <svg v-if="themeStore.dark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>

      <button type="button" class="nav-toggle" :aria-expanded="mobileNavOpen ? 'true' : 'false'"
        aria-label="Navigation umschalten" @click="mobileNavOpen = !mobileNavOpen">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>

  <router-view />
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0 24px;
  background: var(--nav-bg);
  border-bottom: 1px solid var(--nav-border);
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(12px);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 6px 0;
  font-weight: 800;
  color: var(--text);
  margin-right: auto;
}

.brand-logo-link {
  display: inline-flex;
  align-items: center;
}

.brand-text {
  color: inherit;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-links a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.15s ease;
}

.nav-links a:hover {
  color: var(--accent);
  background: var(--accent-bg);
}

.nav-links a.router-link-active {
  color: #fff;
  background: var(--accent);
}

.logo {
  height: 32px;
  width: auto;
  object-fit: contain;
  flex-shrink: 0;
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  min-width: 40px;
  height: 40px;
  min-height: 40px;
  padding: 0;
  border-radius: 10px;
  border: 1px solid var(--border-mid);
  background: var(--bg-card);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.theme-toggle:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--accent-bg);
}

.nav-toggle {
  display: none;
  width: 44px;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  border: 1px solid var(--border-mid);
  border-radius: 10px;
  background: var(--bg-card);
  color: var(--text-secondary);
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 5px;
}

.nav-toggle span {
  width: 18px;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.nav--open .nav-toggle span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.nav--open .nav-toggle span:nth-child(2) {
  opacity: 0;
}

.nav--open .nav-toggle span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

@media (max-width: 720px) {
  .nav {
    padding: 0 14px;
  }

  .nav-inner {
    flex-wrap: wrap;
  }

  .brand {
    min-width: 0;
    gap: 10px;
    min-height: 48px;
    margin-right: auto;
  }

  .brand span {
    font-size: 0.95rem;
    line-height: 1.2;
  }

  .nav-toggle {
    display: inline-flex;
  }

  .nav-links {
    display: none;
    flex-basis: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    padding-bottom: 12px;
  }

  .nav-links--open {
    display: flex;
  }

  .nav-links a {
    width: 100%;
    justify-content: flex-start;
    border-radius: 10px;
  }
}
</style>
