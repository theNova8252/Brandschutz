<script setup>
import api from '../api';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

import { useChapterStore } from '../stores/chapterStore';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const chapterStore = useChapterStore();
const userStore = useUserStore();

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
    // ✅ wichtiger Fix: über Pinia Store ausloggen (setzt user = null)
    await userStore.logout();
  } catch (e) {
    console.error('Logout error:', e);
  } finally {
    router.push('/login');
  }
};

// User-Daten laden
const fetchMe = async () => {
  try {
    // Erst versuchen: Store (falls App.vue schon fetchMe macht)
    if (userStore.user) {
      userName.value =
        userStore.user?.name ||
        userStore.user?.username ||
        userStore.user?.email ||
        'User';
      return;
    }

    // Fallback: Backend fragen (ändert Design nicht)
    const { data } = await api.get('/auth/me', { withCredentials: true });
    userName.value = data?.name || data?.username || data?.email || 'User';
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
    <h1 class="page-title">Schulung Brandschutzverordnung</h1>

    <p v-if="chapterStore.listLoading || loadingProgress" class="info">
      Lade Kapitel und Fortschritt…
    </p>
    <p v-else-if="chapterStore.listError || progressError" class="info error">
      {{ chapterStore.listError || progressError }}
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
  background: var(--bg);
  padding: 64px 24px 120px;
  color: var(--text);
  position: relative;
}

.page-title {
  font-size: 2.75rem;
  font-weight: 800;
  margin-bottom: 12px;
  text-align: center;
  color: var(--text);
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
  color: var(--text-muted);
  font-size: 1.1rem;
}

.info.error {
  color: #dc2626;
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
    gap: 28px;
  }
}

@media (min-width: 1024px) {
  .chapters-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.chapter-card {
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 0;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 100%;
}

.chapter-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #f97316;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.chapter-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
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
  color: rgba(249, 115, 22, 0.05);
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
  color: var(--text);
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
  background: var(--bg-card-alt);
  color: var(--text-muted);
  border: 1px solid var(--border-mid);
}

.status-in-progress {
  background: var(--accent-bg);
  color: var(--accent);
  border: 1px solid var(--accent-border);
}

.status-done {
  background: var(--success-bg);
  color: var(--success);
  border: 1px solid var(--success-border);
}

.chapter-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-muted);
  margin-bottom: auto;
  flex-grow: 1;
}

.chapter-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  margin-top: auto;
}

.chapter-action {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #f97316;
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
  width: 48px;
  height: 48px;
  border-radius: 999px;
  border: 2px solid #f97316;
  background: var(--bg-card);
  cursor: pointer;
  box-shadow: var(--shadow-md);
}

.user-menu-panel {
  margin-bottom: 8px;
  padding: 12px 14px;
  border-radius: 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-lg);
  min-width: 190px;
  max-width: min(280px, calc(100vw - 32px));
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text);
}

.signout-btn {
  width: 100%;
  min-height: 40px;
  padding: 8px 12px;
  border-radius: 10px;
  border: none;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  background: var(--danger-bg);
  color: var(--danger);
  transition: all 0.15s ease;
}

.signout-btn:hover {
  background: #dc2626;
  color: #fff;
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
  min-height: 48px;
  padding: 14px 24px;
  font-size: 1.1rem;
  background: #f97316;
  color: white;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.certificate-box button:hover {
  background: #ea580c;
}

@media (max-width: 767px) {
  .page {
    padding: 28px 16px 120px;
  }

  .page-logo {
    position: static;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  .logo {
    height: 72px;
  }

  .page-title {
    font-size: clamp(1.9rem, 7vw, 2.4rem);
    margin-bottom: 20px;
  }

  .info {
    margin-top: 20px;
    font-size: 1rem;
  }

  .chapters-grid {
    margin-top: 24px;
    gap: 18px;
  }

  .chapter-card {
    border-radius: 14px;
  }

  .chapter-number {
    top: 14px;
    right: 16px;
    font-size: 4.5rem;
  }

  .chapter-content {
    min-height: auto;
    padding: 24px 18px 20px;
  }

  .chapter-title {
    font-size: 1.25rem;
  }

  .chapter-status {
    white-space: normal;
  }

  .chapter-footer {
    padding-top: 14px;
  }

  .chapter-action {
    line-height: 1.3;
  }

  .certificate-box {
    margin-top: 28px;
  }

  .certificate-box button {
    width: 100%;
    max-width: 420px;
    font-size: 1rem;
  }

  .user-menu {
    bottom: 16px;
    right: 16px;
  }
}
</style>
