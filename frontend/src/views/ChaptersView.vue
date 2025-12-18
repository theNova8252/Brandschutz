<script setup>
import api from '../api';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

import { useChapterStore } from '../stores/chapterStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const chapterStore = useChapterStore();

const progress = ref([]);
const loadingProgress = ref(false);
const progressError = ref(null);


// all chapters completed
const allCompleted = computed(() => {
  if (!chapterStore.list.length) return false;

  const completedIds = progress.value
    .filter(p => p.completed)
    .map(p => p.chapterId);

  return chapterStore.list.every(chap =>
    completedIds.includes(chap.id)
  );
});



// --- User / Sign-out ---
const userName = ref('');
const userMenuOpen = ref(false);

// Platzhalter-Avatar, wenn du keinen echten hast
const userAvatar = computed(() => {
  if (!userName.value) {
    return 'https://api.dicebear.com/9.x/identicon/svg?seed=Brandschutz';
  }
  // Initialen-Avatar o. Ä.
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
    userName.value
  )}`;
});

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};

const handleClickOutside = (e) => {
  const menu = document.querySelector('.user-menu');
  if (menu && !menu.contains(e.target)) {
    userMenuOpen.value = false;
  }
};

const signOut = async () => {
  try {
    await api.post('/auth/logout', {}, { withCredentials: true });
  } catch (e) {
    console.error('Logout error:', e);
  } finally {
    router.push('/login');
  }
};

// User-Daten laden (falls du einen /auth/me o.ä. hast)
const fetchMe = async () => {
  try {
    const { data } = await api.get('/auth/me', { withCredentials: true });
    userName.value = data?.name || data?.username || 'User';
  } catch (e) {
    console.warn('Konnte Userdaten nicht laden:', e);
  }
};

// --- Kapitel + Fortschritt ---
const fetchProgress = async () => {
  try {
    loadingProgress.value = true;
    progressError.value = null;

    const { data } = await api.get('/progress', { withCredentials: true });

    progress.value = data || [];
  } catch (err) {
    console.error('Progress-Error:', err);
    progressError.value = 'Fortschritt konnte nicht geladen werden.';
  } finally {
    loadingProgress.value = false;
  }
};

const downloadCertificate = () => {
  window.open('http://localhost:5000/api/progress/certificate', '_blank');
};


onMounted(async () => {
  window.addEventListener('click', handleClickOutside);

  await chapterStore.fetchChapters();
  await fetchProgress();
  await fetchMe();
});

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside);
});

const openChapter = (chap) => {
  if(chap.locked) return;
  router.push({ name: 'chapter-detail', params: { slug: chap.slug } });
};

const chaptersWithProgress = computed(() => {
  const list = chapterStore.list || [];

  return list
    .slice()
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((chap) => {
     const p = progress.value.find((pr) => pr.chapterId === chap.id);

const isCompleted = p?.completed === true;
const isInProgress =
  p &&
  (p.started === true || (p.lastSlideIndex ?? 0) > 0);

let status = 'Nicht begonnen';
let statusClass = 'status-not-started';

if (isCompleted) {
  status = 'Abgeschlossen';
  statusClass = 'status-done';
} else if (isInProgress) {
  status = 'In Bearbeitung';
  statusClass = 'status-in-progress';
}


      return {
        ...chap,
        status,
        statusClass,
        locked: chap.locked === true,
      };
    });

    
});
</script>

<template>
  <div class="page">
    <div class="page-logo">
      <img src="../assets/images/logoBrand.png" alt="HTL FireCourse Logo" class="logo" />
    </div>
    <h1 class="page-title">Kapitelübersicht</h1>

    <p v-if="chapterStore.loading || loadingProgress" class="info">
      Lade Kapitel und Fortschritt…
    </p>
    <p v-else-if="chapterStore.error || progressError" class="info error">
      {{ chapterStore.error || progressError }}
    </p>

    <div v-else class="chapters-grid">
      <div v-for="chap in chaptersWithProgress" :key="chap.id" class="chapter-card" :class="{ locked: chap.locked }" @click="openChapter(chap)">
        <div class="chapter-number">{{ chap.order }}</div>

        <div class="chapter-content">
          <div class="chapter-header">
            <h2 class="chapter-title">{{ chap.title }}</h2>
            <span v-if="chap.locked" class="lock-icon">🔒</span>
            <span class="chapter-status" :class="chap.statusClass">
              <span class="status-dot"></span>
              {{ chap.status }}
            </span>
          </div>

          <p class="chapter-description" v-if="chap.shortDescription">
            {{ chap.shortDescription }}
          </p>

          <div class="chapter-footer">
            <span class="chapter-action">
              {{ chap.status === 'Abgeschlossen' ? 'Erneut durchgehen' : 'Jetzt lernen' }}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>

<div v-if="allCompleted" class="certificate-box">
  <button @click="downloadCertificate">
    📄 Zertifikat herunterladen
  </button>
</div>


    <!-- USER MENU unten rechts -->
    <div class="user-menu" @click.stop="toggleUserMenu">
      <img :src="userAvatar" alt="Profilbild" class="user-avatar" />

      <div v-if="userMenuOpen" class="user-menu-panel" @click.stop>
        <p class="user-name">{{ userName || 'Angemeldeter Benutzer' }}</p>
        <button class="signout-btn" @click="signOut">
          Abmelden
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
  padding: 64px 24px;
  color: #f8fafc;
  position: relative;
}

.page-title {
  font-size: 2.75rem;
  font-weight: 800;
  margin-bottom: 12px;
  text-align: center;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}
.page-logo {
  position: absolute;
  top: 16px;
  left: 24px;
}

.logo {
  height: 80px;
  display: block;
}

.info {
  text-align: center;
  margin-top: 32px;
  color: #94a3b8;
  font-size: 1.1rem;
}

.info.error {
  color: #f87171;
}

.chapters-grid {
  max-width: 1200px;
  margin: 48px auto 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .chapters-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }
}

@media (min-width: 1024px) {
  .chapters-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.chapter-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.1);
  padding: 0;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.chapter-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.chapter-card:hover {
  transform: translateY(-8px);
  border-color: rgba(148, 163, 184, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(96, 165, 250, 0.1);
}

.chapter-card:hover::before {
  opacity: 1;
}

.chapter-number {
  position: absolute;
  top: 16px;
  right: 24px;
  font-size: 6rem;
  font-weight: 900;
  color: rgba(148, 163, 184, 0.04);
  line-height: 1;
  pointer-events: none;
  z-index: 0;
}

.chapter-content {
  position: relative;
  z-index: 1;
  padding: 28px 24px 24px;
  display: flex;
  flex-direction: column;
  min-height: 280px;
}

.chapter-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.chapter-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.chapter-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  align-self: flex-start;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.status-not-started {
  background: rgba(148, 163, 184, 0.1);
  color: #cbd5e1;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.status-in-progress {
  background: rgba(234, 179, 8, 0.1);
  color: #fbbf24;
  border: 1px solid rgba(234, 179, 8, 0.3);
}

.status-done {
  background: rgba(34, 197, 94, 0.1);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.chapter-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #94a3b8;
  margin-bottom: auto;
  flex-grow: 1;
}
.chapter-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid rgba(148, 163, 184, 0.1);
  margin-top: auto;
}

.chapter-action {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #60a5fa;
  transition: gap 0.2s ease;
  line-height: 1;
}
.chapter-card:hover .chapter-action {
  gap: 12px;
}

.chapter-action svg {
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.chapter-card:hover .chapter-action svg {
  transform: translateX(4px);
}

/* USER MENU bottom-right */
.user-menu {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 2px solid #60a5fa;
  background: #020617;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.6);
}

.user-menu-panel {
  margin-bottom: 8px;
  padding: 12px 14px;
  border-radius: 16px;
  background: #020617;
  border: 1px solid rgba(148, 163, 184, 0.4);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.8);
  min-width: 190px;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #e5e7eb;
}

.signout-btn {
  width: 100%;
  padding: 8px 10px;
  border-radius: 999px;
  border: none;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  background: #ef4444;
  color: white;
  transition: background 0.2s ease, transform 0.05s;
}

.signout-btn:hover {
  background: #b91c1c;
  transform: translateY(-1px);
}


.locked {
  opacity: 0.45;
  pointer-events: none;
  filter: grayscale(1);
}

.lock-icon {
  font-size: 1.1rem;
  margin-left: 6px;
}


.certificate-box {
  margin-top: 40px;
  text-align: center;
}

.certificate-box button {
  padding: 14px 24px;
  font-size: 1.1rem;
  background: #22c55e;
  color: white;
  border-radius: 12px;
  border: none;
  cursor: pointer;
}


</style>
