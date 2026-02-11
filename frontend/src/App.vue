<script setup>
import { onMounted } from "vue";
import { useUserStore } from "./stores/userStore";
import { useRouter, useRoute } from "vue-router";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

onMounted(() => {
  userStore.fetchMe();
});
</script>

<template>
  <!-- Nav nur wenn eingeloggt -->
  <nav v-if="userStore.isLoggedIn && route.path !== '/login'" class="nav">
    <img src="./assets/images/htlWW_Logo.png" alt="HTL Wien West Logo" class="logo">
    <router-link to="/chapters">
    <span>HTL Wien West</span>
    </router-link>

    <router-link v-if="userStore.isAdmin" to="/users">
      Benutzerverwaltung
    </router-link>
  </nav>

  <router-view />
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: center;
  padding: 14px 18px;
  background: rgba(2, 6, 23, 0.7);
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
  backdrop-filter: blur(12px);
}

.nav a {
  color: #e5e7eb;
  text-decoration: none;
  font-weight: 800;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid transparent;
}

.nav a.router-link-active {
  border-color: rgba(96, 165, 250, 0.55);
  background: rgba(96, 165, 250, 0.12);
}
.logo{
  height: 28px;
  width: auto;
  object-fit: contain;
}
</style>
