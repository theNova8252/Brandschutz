<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "./stores/userStore";

const userStore = useUserStore();
const route = useRoute();
const mobileNavOpen = ref(false);

const showNav = computed(() => userStore.isLoggedIn && route.path !== "/login");

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
    <div class="nav-bar">
      <router-link to="/chapters" class="brand">
        <img src="./assets/images/htlWW_Logo.png" alt="HTL Wien West Logo" class="logo" />
        <span>HTL Wien West</span>
      </router-link>

      <button
        type="button"
        class="nav-toggle"
        :aria-expanded="mobileNavOpen ? 'true' : 'false'"
        aria-label="Navigation umschalten"
        @click="mobileNavOpen = !mobileNavOpen"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <div class="nav-links" :class="{ 'nav-links--open': mobileNavOpen }">
      <router-link to="/chapters">Kapitel</router-link>
      <router-link v-if="userStore.isAdmin" to="/users">Benutzerverwaltung</router-link>
    </div>
  </nav>

  <router-view />
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 12px 18px;
  background: rgba(2, 6, 23, 0.84);
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
  backdrop-filter: blur(16px);
}

.nav-bar {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 6px 0;
  font-weight: 800;
  color: #f8fafc;
}

.nav-links {
  max-width: 1200px;
  margin: 8px auto 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.nav-links a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid transparent;
  color: #e5e7eb;
  font-weight: 800;
  line-height: 1.2;
}

.nav-links a.router-link-active,
.brand.router-link-active {
  border-color: rgba(96, 165, 250, 0.55);
  background: rgba(96, 165, 250, 0.12);
}

.logo {
  height: 32px;
  width: auto;
  object-fit: contain;
  flex-shrink: 0;
}

.nav-toggle {
  display: none;
  width: 48px;
  min-width: 48px;
  min-height: 48px;
  padding: 0;
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.9);
  color: #f8fafc;
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
    padding: 10px 14px;
  }

  .brand {
    min-width: 0;
    gap: 10px;
    padding: 4px 0;
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
    margin-top: 12px;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .nav-links--open {
    display: flex;
  }

  .nav-links a {
    width: 100%;
    justify-content: flex-start;
    border-color: rgba(148, 163, 184, 0.16);
    background: rgba(15, 23, 42, 0.75);
  }
}
</style>
