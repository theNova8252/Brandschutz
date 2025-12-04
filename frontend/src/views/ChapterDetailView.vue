<template>
  <div class="page" v-if="chapterStore.currentChapter">
    <header class="chapter-header">
      <div class="chapter-meta">
        <p class="chapter-label">Kapitel {{ chapterStore.currentChapter.order }}</p>
        <h1>{{ chapterStore.currentChapter.title }}</h1>
      </div>

      <div class="header-right">
        <img class="hero-image" alt="Kapitelbild" src="../assets/images/logoBrand.png" />

        <button class="back-btn" @click="goBackToChapters">
          ← Zur Kapitelübersicht
        </button>
      </div>
    </header>

    <Swiper class="slides-swiper" :space-between="24" :slides-per-view="1" :centered-slides="true" grab-cursor
      @slideChange="onSlideChange" @swiper="onSwiperInit" :allowSlideNext="canGoNext" :allowSlidePrev="true">
      <SwiperSlide v-for="(slide, index) in chapterStore.currentChapter.slides" :key="slide.id">
        <div class="slide-card">
          <p class="slide-type">
            {{ labelForType(slide.type) }}
          </p>
          <h2 class="slide-title">{{ slide.title }}</h2>

          <!-- Video-Slide -->
          <div v-if="slide.type === 'video'" class="video-wrapper">
            <!-- Lokale Videodatei: Eigene Custom Controls ohne Seekbar -->
            <div v-if="isFileVideo(slide.videoUrl)" class="custom-video-container">
              <video ref="videoPlayer" :src="slide.videoUrl" @timeupdate="onVideoTimeUpdate($event, slide.id)"
                @seeking="onVideoSeeking($event, slide.id)" @ended="onVideoEnded(slide.id)"
                @loadedmetadata="onVideoLoaded($event, slide.id)" @click="togglePlay(slide.id)"></video>

              <div class="custom-controls">
                <button class="play-btn" @click="togglePlay(slide.id)">
                  <svg v-if="!isPlaying[slide.id]" width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                </button>

                <div class="time-display">
                  {{ formatTime(currentTime[slide.id] || 0) }} / {{ formatTime(videoDurations[slide.id] || 0) }}
                </div>

                <button class="volume-btn" @click="toggleMute(slide.id)">
                  <svg v-if="!isMuted[slide.id]" width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                  </svg>
                  <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path
                      d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- YouTube: Steuerleiste/Kb-Skip deaktiviert über Embed-Parameter -->
            <iframe v-else :src="youtubeEmbed(slide.videoUrl)" frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen @load="onYouTubeLoad(slide.id)"></iframe>

            <p v-if="slide.body" class="slide-body">
              <span v-for="(line, idx) in splitLines(slide.body)" :key="idx">
                {{ line }}<br />
              </span>
            </p>

            <!-- Video-Fortschrittsanzeige -->
            <div v-if="!videoCompleted[slide.id]" class="progress-hint warning">
              <svg class="progress-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5zm0 11.75c-2.9 0-5.25-2.35-5.25-5.25S5.1 2.75 8 2.75s5.25 2.35 5.25 5.25-2.35 5.25-5.25 5.25z"
                  fill="currentColor" />
                <path d="M8 4.5v4l3 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
              ⚠️ Du musst das Video bis zum Ende ansehen, bevor du weiterkommst
            </div>
            <div v-else class="progress-hint completed">
              <svg class="progress-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 4L6 11.5L2.5 8" stroke="#16a34a" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
              Video vollständig angesehen
            </div>
          </div>

          <!-- Normale Content-/Summary-Slide -->
          <div v-else class="slide-content">
            <p class="slide-body">
              <span v-for="(line, idx) in splitLines(slide.body)" :key="idx">
                {{ line }}<br />
              </span>
            </p>

            <img v-if="slide.imageUrl" :src="slide.imageUrl" alt="Illustration" class="slide-image" />

            <!-- Text gelesen Bestätigung -->
            <div v-if="visitedSlides[slide.id]" class="progress-hint completed">
              <svg class="progress-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 4L6 11.5L2.5 8" stroke="#16a34a" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
              Gelesen
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- Fortschrittsanzeige -->
    <div class="overall-progress">
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <p class="progress-text">
        {{ completedSlidesCount }} von {{ totalSlidesCount }} Abschnitten abgeschlossen
      </p>
    </div>

    <!-- Button nur anzeigen, wenn alle Slides fertig sind -->
    <button v-if="allSlidesCompleted" class="finish-btn" @click="finishChapter">
      Kapitel abschließen
    </button>
    <div v-else class="finish-hint">
      Bitte schließe alle Lerneinheiten ab, um das Kapitel abzuschließen
    </div>
  </div>

  <div v-else class="page page-center">
    <p v-if="chapterStore.chapterLoading">Kapitel wird geladen …</p>
    <p v-else-if="chapterStore.chapterError">{{ chapterStore.chapterError }}</p>
    <p v-else>Kein Kapitel gefunden.</p>
  </div>
</template>

<script setup>
import api from "../api";
import { onMounted, ref, computed, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

import { useChapterStore } from '../stores/chapterStore';

const chapterStore = useChapterStore();
const route = useRoute();
const router = useRouter();

// Fortschritt-Tracking
const visitedSlides = ref({});      // Text-Slides "gelesen"
const videoCompleted = ref({});     // Video bis zum Ende geschaut
const watchedDurations = ref({});   // bisher maximal geschauter Zeitpunkt pro Video
const videoDurations = ref({});     // Gesamtlänge der Videos
const activeIndex = ref(0);
const isPlaying = ref({});          // Play/Pause Status pro Video
const isMuted = ref({});            // Mute Status pro Video
const currentTime = ref({});        // Aktuelle Zeit pro Video
const progressRecord = ref(null);
let swiperInstance = null;

// Kapitel laden
onMounted(async () => {
  await chapterStore.fetchChapter(route.params.slug);

  const chapter = chapterStore.currentChapter;
  if (chapter) {
    try {
      await api.post(`/progress/start/${chapter.id}`, {}, { withCredentials: true });
    } catch (e) {
      console.warn('Konnte Start-Fortschritt nicht speichern:', e);
    }
  }
});


// Swiper-Instanz speichern
const onSwiperInit = (swiper) => {
  swiperInstance = swiper;
  updateSwiperNavigation();
};

const goBackToChapters = () => {
  router.push('/chapters');
};
const loadProgressForChapter = async (chapter) => {
  try {
    const { data } = await api.get(`/progress/${chapter.id}`);
    progressRecord.value = data;

    let startIndex = 0;
    if (data && typeof data.lastSlideIndex === 'number') {
      startIndex = data.lastSlideIndex;
    }

    activeIndex.value = startIndex;

    // Alle Slides bis dahin als "gesehen" markieren (außer Videos, da regelst du eh per completed/videoCompleted)
    chapter.slides.forEach((slide, idx) => {
      if (idx <= startIndex && slide.type !== 'video') {
        visitedSlides.value[slide.id] = true;
      }
    });

    // Swiper nach initialem Render auf die gespeicherte Slide springen
    await nextTick();
    if (swiperInstance) {
      swiperInstance.slideTo(startIndex, 0);
      updateSwiperNavigation();
    }
  } catch (err) {
    console.error('Error loading chapter progress:', err);
  }
};
// Wenn Kapitel/Slides geladen sind, Progress zurücksetzen
watch(
  () => chapterStore.currentChapter,
  async (chapter) => {
    // State resetten
    visitedSlides.value = {};
    videoCompleted.value = {};
    watchedDurations.value = {};
    videoDurations.value = {};
    isPlaying.value = {};
    isMuted.value = {};
    currentTime.value = {};
    activeIndex.value = 0;
    progressRecord.value = null;

    if (chapter && chapter.slides && chapter.slides.length > 0) {
      // erst Progress aus DB holen und Swiper positionieren
      await loadProgressForChapter(chapter);
    }

    // Navigation aktualisieren
    setTimeout(() => {
      updateSwiperNavigation();
    }, 100);
  },
  { immediate: true }
);


const splitLines = (text) => (text ? text.split('\n') : []);

const labelForType = (type) => {
  if (type === 'video') return 'Lernvideo';
  if (type === 'summary') return 'Zusammenfassung';
  return 'Lerneinheit';
};

const isFileVideo = (url) =>
  url && !url.includes('youtube.com') && !url.includes('youtu.be');

// YouTube-Embed ohne Skip-Kontrollen / Tastatur-Skip
const youtubeEmbed = (url) => {
  if (!url) return '';
  let embed = url
    .replace('watch?v=', 'embed/')
    .replace('youtu.be/', 'www.youtube.com/embed/');
  const sep = embed.includes('?') ? '&' : '?';
  embed = `${embed}${sep}controls=0&disablekb=1&rel=0&modestbranding=1&fs=0`;
  return embed;
};

// Swiper Slide-Wechsel -> Text-Slides als "gesehen" markieren
const onSlideChange = (swiper) => {
  const chapter = chapterStore.currentChapter;
  if (!chapter || !chapter.slides) return;

  const prevIndex = activeIndex.value;
  const prevSlide = chapter.slides[prevIndex];

  if (prevSlide && prevSlide.type === 'video' && !videoCompleted.value[prevSlide.id]) {
    swiper.slideTo(prevIndex, 0);
    return;
  }

  if (prevSlide && prevSlide.type !== 'video') {
    visitedSlides.value[prevSlide.id] = true;
  }

  activeIndex.value = swiper.activeIndex;
  const currentSlide = chapter.slides[swiper.activeIndex];
  if (currentSlide && currentSlide.type !== 'video') {
    visitedSlides.value[currentSlide.id] = true;
  }

  updateSwiperNavigation();

  // neu: Fortschritt speichern (nur wenn wir vorwärts gehen könnte man optional prüfen)
  saveProgress();
};


// Navigation-Status aktualisieren
const updateSwiperNavigation = () => {
  if (!swiperInstance) return;

  const chapter = chapterStore.currentChapter;
  if (!chapter || !chapter.slides) return;

  const currentSlide = chapter.slides[activeIndex.value];

  // Wenn aktuelle Slide ein Video ist und nicht fertig -> Navigation blockieren
  if (currentSlide && currentSlide.type === 'video' && !videoCompleted.value[currentSlide.id]) {
    swiperInstance.allowSlideNext = false;
  } else {
    swiperInstance.allowSlideNext = true;
  }

  swiperInstance.update();
};

// Video geladen - Dauer speichern
const onVideoLoaded = (event, slideId) => {
  const video = event.target;
  videoDurations.value[slideId] = video.duration;
  watchedDurations.value[slideId] = 0;
};

// YouTube geladen - für YouTube Videos können wir die Dauer nicht direkt abrufen
// Daher markieren wir sie als "muss bis Ende geschaut werden"
const onYouTubeLoad = (slideId) => {
  // YouTube-Videos haben keine direkte Dauer-Abfrage
  // Wir setzen einen hohen Wert, damit der Nutzer bis zum Ende schauen muss
  videoDurations.value[slideId] = 9999;
  watchedDurations.value[slideId] = 0;
};

// Video-Events: Skippen verhindern & Fortschritt speichern
const onVideoTimeUpdate = (event, slideId) => {
  const video = event.target;
  const current = video.currentTime;
  const prevMax = watchedDurations.value[slideId] ?? 0;

  // Aktuelle Zeit speichern für Anzeige
  currentTime.value[slideId] = current;

  // Nur vorwärts erlauben (mit kleinem Buffer für Ladezeiten)
  if (current > prevMax + 0.5) {
    watchedDurations.value[slideId] = current;
  }
};

const onVideoSeeking = (event, slideId) => {
  const video = event.target;
  const max = watchedDurations.value[slideId] ?? 0;

  // Wenn vorwärts gesprungen wird -> zurück auf max erlaubte Zeit
  if (video.currentTime > max + 0.5) {
    video.currentTime = max;
  }
};

const onVideoEnded = (slideId) => {
  videoCompleted.value[slideId] = true;
  isPlaying.value[slideId] = false;
  updateSwiperNavigation();
  saveProgress();
};


// Custom Video Controls
const togglePlay = (slideId) => {
  const chapter = chapterStore.currentChapter;
  if (!chapter || !chapter.slides) return;

  const slide = chapter.slides.find(s => s.id === slideId);
  if (!slide) return;

  // Video-Element finden
  const videoElements = document.querySelectorAll('video');
  let targetVideo = null;

  videoElements.forEach(video => {
    if (video.src.includes(slide.videoUrl) || video.src === slide.videoUrl) {
      targetVideo = video;
    }
  });

  if (!targetVideo) return;

  if (targetVideo.paused) {
    targetVideo.play();
    isPlaying.value[slideId] = true;
  } else {
    targetVideo.pause();
    isPlaying.value[slideId] = false;
  }
};

const toggleMute = (slideId) => {
  const chapter = chapterStore.currentChapter;
  if (!chapter || !chapter.slides) return;

  const slide = chapter.slides.find(s => s.id === slideId);
  if (!slide) return;

  const videoElements = document.querySelectorAll('video');
  let targetVideo = null;

  videoElements.forEach(video => {
    if (video.src.includes(slide.videoUrl) || video.src === slide.videoUrl) {
      targetVideo = video;
    }
  });

  if (!targetVideo) return;

  targetVideo.muted = !targetVideo.muted;
  isMuted.value[slideId] = targetVideo.muted;
};

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// computed: Gesamtanzahl Slides
const totalSlidesCount = computed(() => {
  const chapter = chapterStore.currentChapter;
  return chapter?.slides?.length || 0;
});

// computed: Anzahl abgeschlossener Slides
const completedSlidesCount = computed(() => {
  const chapter = chapterStore.currentChapter;
  if (!chapter || !chapter.slides) return 0;

  return chapter.slides.filter((slide) => {
    if (slide.type === 'video') {
      return !!videoCompleted.value[slide.id];
    }
    return !!visitedSlides.value[slide.id];
  }).length;
});

// computed: Fortschritt in Prozent
const progressPercentage = computed(() => {
  if (totalSlidesCount.value === 0) return 0;
  return Math.round((completedSlidesCount.value / totalSlidesCount.value) * 100);
});

// computed: sind alle Slides fertig?
const allSlidesCompleted = computed(() => {
  const chapter = chapterStore.currentChapter;
  if (!chapter || !chapter.slides || !chapter.slides.length) return false;

  return chapter.slides.every((slide) => {
    if (slide.type === 'video') {
      return !!videoCompleted.value[slide.id];
    }
    return !!visitedSlides.value[slide.id];
  });
});

// computed: Kann zur nächsten Slide navigiert werden?
const canGoNext = computed(() => {
  const chapter = chapterStore.currentChapter;
  if (!chapter || !chapter.slides) return true;

  const currentSlide = chapter.slides[activeIndex.value];
  if (!currentSlide) return true;

  // Wenn aktuelle Slide ein Video ist -> nur weiter wenn Video fertig
  if (currentSlide.type === 'video') {
    return !!videoCompleted.value[currentSlide.id];
  }

  return true;
});

const finishChapter = async () => {
  if (!allSlidesCompleted.value) return;

  const chapterId = chapterStore.currentChapter.id;

  try {
    await api.post(`/progress/complete/${chapterId}`);
    alert("Kapitel erfolgreich abgeschlossen!");
    router.push("/chapters");
  } catch (error) {
    console.error("Fehler beim Abschließen des Kapitels:", error);
    alert("Es gab einen Fehler beim Abschließen des Kapitels. Bitte versuche es erneut.");
  }
};

const saveProgress = async () => {
  const chapter = chapterStore.currentChapter;
  if (!chapter) return;

  try {
    await api.post(`/progress/update/${chapter.id}`, {
      lastSlideIndex: activeIndex.value,
    });
  } catch (err) {
    console.error('Error saving progress:', err);
  }
};

</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 32px 16px 40px;
  background: #020617;
  color: #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-center {
  justify-content: center;
}
.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.back-btn {
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid #374151;
  background: #020617;
  color: #e5e7eb;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.1s;
}

.back-btn:hover {
  background: #111827;
  border-color: #4b5563;
  transform: translateY(-1px);
}

.back-btn.secondary {
  margin-top: 12px;
  align-self: center;
}

.chapter-header {
  width: 100%;
  max-width: 900px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.chapter-meta h1 {
  margin: 4px 0 0;
  font-size: 2rem;
}

.chapter-label {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
}

.hero-image {
  max-width: 260px;
  border-radius: 16px;
  object-fit: cover;
}

.slides-swiper {
  width: 100%;
  max-width: 900px;
}

.slide-card {
  background: #020617;
  border-radius: 18px;
  border: 1px solid #1f2937;
  padding: 22px 20px 24px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55);
}

.slide-type {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #f97316;
  margin-bottom: 6px;
}

.slide-title {
  font-size: 1.4rem;
  margin-bottom: 12px;
}

.slide-body {
  font-size: 0.98rem;
  line-height: 1.55;
  color: #d1d5db;
}

.slide-image {
  margin-top: 18px;
  max-width: 100%;
  border-radius: 12px;
}

.video-wrapper video,
.video-wrapper iframe {
  width: 100%;
  border-radius: 14px;
  margin: 12px 0 16px;
  background: black;
}

.custom-video-container {
  position: relative;
  width: 100%;
}

.custom-video-container video {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 14px;
  background: black;
  cursor: pointer;
  margin: 12px 0 0;
}

.custom-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 0 0 14px 14px;
  margin: 0 0 16px;
}

.play-btn,
.volume-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.play-btn:hover,
.volume-btn:hover {
  transform: scale(1.1);
}

.play-btn {
  width: 40px;
  height: 40px;
}

.volume-btn {
  width: 32px;
  height: 32px;
  margin-left: auto;
}

.time-display {
  font-size: 0.9rem;
  color: white;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
  user-select: none;
}

.video-wrapper video {
  aspect-ratio: 16/9;
}

.video-wrapper iframe {
  aspect-ratio: 16/9;
  height: 100%;
}

.progress-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 14px;
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.3);
  border-radius: 8px;
  font-size: 0.9rem;
  color: #f97316;
}

.progress-hint.warning {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.4);
  color: #ef4444;
  font-weight: 500;
}

.progress-hint.completed {
  background: rgba(22, 163, 74, 0.1);
  border-color: rgba(22, 163, 74, 0.3);
  color: #16a34a;
}

.progress-icon {
  flex-shrink: 0;
}

.overall-progress {
  width: 100%;
  max-width: 900px;
  margin-top: 24px;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: #1f2937;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #f97316, #ea580c);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: #9ca3af;
  text-align: center;
}

@media (max-width: 768px) {
  .chapter-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-image {
    max-width: 100%;
    width: 100%;
  }
}

.finish-btn {
  margin-top: 20px;
  padding: 14px 24px;
  border-radius: 12px;
  background: #16a34a;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  max-width: 350px;
  border: none;
  transition: background 0.2s ease;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
}

.finish-btn:hover {
  background: #15803d;
}

.finish-hint {
  margin-top: 20px;
  padding: 14px 24px;
  border-radius: 12px;
  background: rgba(107, 114, 128, 0.1);
  border: 1px solid #374151;
  color: #9ca3af;
  font-size: 0.95rem;
  text-align: center;
  width: 100%;
  max-width: 350px;
}
</style>