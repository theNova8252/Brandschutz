<template>
  <div class="page">
    <h1>Kapitelübersicht</h1>

    <Swiper class="chapters-swiper" :space-between="16" :slides-per-view="1" :centered-slides="true" grab-cursor>
      <SwiperSlide v-for="chap in chapters" :key="chap.id">
        <div class="chapter-card">
          <h2>{{ chap.title }}</h2>
          <button @click="openChapter(chap.id)">Kapitel starten</button>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

const chapters = ref([]);

onMounted(async () => {
  const res = await fetch('http://localhost:5000/api/chapters', {
    credentials: 'include',
  });
  chapters.value = await res.json();
});

const openChapter = (id) => {
  // später: router.push(`/chapters/${id}`)
  console.log('Kapitel öffnen', id);
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  background: #020617;
}

h1 {
  font-size: 2.5rem;
  margin: 0;
}

.chapters-swiper {
  width: 100%;
  max-width: 500px;
}

.chapter-card {
  background: #020617;
  border-radius: 18px;
  border: 1px solid #1f2937;
  padding: 24px 20px;
  text-align: center;
}

.chapter-card h2 {
  font-size: 1.2rem;
  margin-bottom: 16px;
}

.chapter-card button {
  padding: 10px 18px;
  border-radius: 999px;
  border: none;
  background: #f97316;
  color: white;
  cursor: pointer;
}
</style>
