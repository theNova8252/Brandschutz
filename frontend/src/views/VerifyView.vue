<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api';

const route = useRoute();
const result = ref(null);

onMounted(async () => {
  const { data } = await api.get(`/certificate/verify/${route.params.id}`);
  result.value = data;
});
</script>

<template>
  <div class="page page-center">
    <h1>Zertifikatsprüfung</h1>

    <p v-if="!result">Prüfe Zertifikat…</p>

    <div v-else-if="result.valid">
      ✅ <strong>Gültiges Zertifikat</strong><br />
      Name: {{ result.name }}<br />
      Datum: {{ new Date(result.issuedAt).toLocaleDateString('de-AT') }}
    </div>

    <div v-else>
      ❌ Ungültiges Zertifikat
    </div>
  </div>
</template>
