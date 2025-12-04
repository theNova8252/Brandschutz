<script setup>
import { onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import { useChapterStore } from '../stores/chapterStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const chapterStore = useChapterStore();

onMounted(() => {
  chapterStore.fetchChapters();
});

const openChapter = (slug) => {
  router.push({ name: 'chapter-detail', params: { slug } });
};
</script>

<template>
  <div class="page">
    <h1>Kapitelübersicht</h1>

    <p v-if="chapterStore.loading">Lade Kapitel…</p>
    <p v-else-if="chapterStore.error">{{ chapterStore.error }}</p>

    <Swiper v-else class="chapters-swiper" :space-between="16" :slides-per-view="1" :centered-slides="true" grab-cursor>
      <SwiperSlide v-for="chap in chapterStore.list" :key="chap.id">
        <div class="chapter-card">
          <h2>{{ chap.title }}</h2>
          <button @click="openChapter(chap.slug)">Kapitel starten</button>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>
