<script setup>
import { onMounted } from 'vue';
import { useUserStore } from './stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

onMounted(() => {
  userStore.fetchMe();
});

const logout = async () => {
  await userStore.logout();
  router.push('/');
};
</script>

<template>
  <nav class="nav">
    <router-link to="/chapters">📘 Kapitel</router-link>

    <router-link
      v-if="userStore.isSpecial"
      to="/users"
    >
      👥 Benutzer
    </router-link>

    <button v-if="userStore.isLoggedIn" @click="logout">
      Logout
    </button>
  </nav>

  <router-view />
</template>

<style scoped>
.nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f4f4f4;
}

button {
  margin-left: auto;
}
</style>
