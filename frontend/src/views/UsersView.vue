<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

onMounted(async () => {
  await userStore.fetchMe();

  if (!userStore.isSpecial) {
    router.push('/chapters');
    return;
  }

  await userStore.fetchUsersOverview();
});

const statusColor = (status) => {
  if (status === 'abgeschlossen') return 'green';
  if (status === 'begonnen') return 'orange';
  return 'gray';
};
</script>

<template>
  <div class="users-page">
    <h1>👥 Benutzerübersicht</h1>

    <div v-if="userStore.loading">Lade Benutzer…</div>

    <table v-else>
      <thead>
        <tr>
          <th>Name</th>
          <th>E-Mail</th>
          <th>Rolle</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="u in userStore.usersOverview" :key="u.id">
          <td>{{ u.name }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.role }}</td>
          <td>
            <span :class="['badge', statusColor(u.status)]">
              {{ u.status }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.users-page {
  padding: 2rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th,
td {
  padding: 0.75rem;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

.badge {
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.85rem;
  color: white;
}

.green {
  background: #2ecc71;
}

.orange {
  background: #f39c12;
}

.gray {
  background: #7f8c8d;
}
</style>
