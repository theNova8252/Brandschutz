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

    <!-- Firefly Companion -->
    <div class="firefly-companion">
      <div class="firefly-speech-bubble">
        {{ getCurrentFireflyMessage() }}
      </div>
      <img
        :src="activeIndex === 0 ? fireflyWelcome : fireflyNormal"
        alt="Firefly Begleiter"
        class="firefly-image"
        :class="{ 'firefly-bounce': true }"
      />
    </div>

    <Swiper
      class="slides-swiper"
      :space-between="24"
      :slides-per-view="1"
      :centered-slides="true"
      grab-cursor
      @slideChange="onSlideChange"
      @swiper="onSwiperInit"
      :allowSlideNext="canGoNext"
      :allowSlidePrev="true"
       :noSwiping="true"
  noSwipingClass="swiper-no-swiping"
    >
      <SwiperSlide v-for="(slide, index) in chapterStore.currentChapter.slides" :key="slide.id">
        <div class="slide-card">
          <p class="slide-type">{{ labelForType(slide.type) }}</p>
          <h2 class="slide-title">{{ slide.title }}</h2>

          <!-- Video-Slide -->
          <div v-if="slide.type === 'video'">
            <div class="video-wrapper">
              <!-- Lokale Videodatei: Eigene Custom Controls ohne Seekbar -->
              <div v-if="isFileVideo(slide.videoUrl)" class="custom-video-container">
                <video
                  ref="videoPlayer"
                  :src="slide.videoUrl"
                  @timeupdate="onVideoTimeUpdate($event, slide.id)"
                  @seeking="onVideoSeeking($event, slide.id)"
                  @ended="onVideoEnded(slide.id)"
                  @loadedmetadata="onVideoLoaded($event, slide.id)"
                  @click="togglePlay(slide.id)"
                ></video>

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
                      <path
                        d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"
                      />
                    </svg>
                    <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path
                        d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- YouTube -->
              <iframe
                v-else
                :src="youtubeEmbed(slide.videoUrl)"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                @load="onYouTubeLoad(slide.id)"
              ></iframe>
            </div>

            <!-- Video Text (modern) -->
            <div class="rich-body" v-if="slide.body">
              <template v-for="(block, bIdx) in parseBody(slide.body)" :key="bIdx">
                <p v-if="block.type === 'p'" class="rich-p">{{ block.text }}</p>

                <ul v-else-if="block.type === 'ul'" class="rich-ul">
                  <li v-for="(item, iIdx) in block.items" :key="iIdx">{{ item }}</li>
                </ul>

                <div v-else-if="block.type === 'warn'" class="rich-warn">
                  <strong>⚠️ Achtung:</strong> {{ block.text }}
                </div>

                <div v-else-if="block.type === 'check'" class="rich-check">
                  <strong>✅ Merke:</strong> {{ block.text }}
                </div>
              </template>
            </div>

            <!-- Video-Fortschrittsanzeige -->
            <div v-if="!videoCompleted[slide.id]" class="progress-hint warning">
              <svg class="progress-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5zm0 11.75c-2.9 0-5.25-2.35-5.25-5.25S5.1 2.75 8 2.75s5.25 2.35 5.25 5.25-2.35 5.25-5.25 5.25z"
                  fill="currentColor"
                />
                <path d="M8 4.5v4l3 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
              Du musst das Video bis zum Ende ansehen, bevor du weiterkommst!
            </div>

            <div v-else class="progress-hint completed">
              <svg class="progress-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M13.5 4L6 11.5L2.5 8"
                  stroke="#16a34a"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Video vollständig angesehen
            </div>
          </div>

          <!-- Interaktive Slides (Kapitel 1) -->
          <div v-else-if="interactiveFor(slide)" class="slide-content">
            <div class="rich-body" v-if="slide.body">
              <template v-for="(block, bIdx) in parseBody(slide.body)" :key="bIdx">
                <p v-if="block.type === 'p'" class="rich-p">{{ block.text }}</p>

                <ul v-else-if="block.type === 'ul'" class="rich-ul">
                  <li v-for="(item, iIdx) in block.items" :key="iIdx">{{ item }}</li>
                </ul>

                <div v-else-if="block.type === 'warn'" class="rich-warn">
                  <strong>⚠️ Achtung:</strong> {{ block.text }}
                </div>

                <div v-else-if="block.type === 'check'" class="rich-check">
                  <strong>✅ Merke:</strong> {{ block.text }}
                </div>
              </template>
            </div>

            <!-- DECISION -->
            <div v-if="interactiveFor(slide).type === 'decision'" class="interactive-box">
              <div class="interactive-grid">
                <button
                  v-for="opt in interactiveFor(slide).options"
                  :key="opt.id"
                  class="interactive-btn"
                  @click="pickDecision(slide.id, opt)"
                >
                  {{ opt.label }}
                </button>
              </div>

              <div
                v-if="interactiveState[slide.id]?.feedback"
                class="interactive-feedback"
                :class="interactiveState[slide.id]?.level"
              >
                <strong>{{ interactiveState[slide.id]?.headline }}</strong>
                <div>{{ interactiveState[slide.id]?.feedback }}</div>
              </div>
            </div>

<!-- MULTISELECT -->
<div v-else-if="interactiveFor(slide).type === 'multiselect'" class="interactive-box">
  <div class="quiz-question">{{ interactiveFor(slide).prompt }}</div>

  <div class="interactive-grid">
    <button
      v-for="opt in interactiveFor(slide).options"
      :key="opt.id"
      class="interactive-btn"
      :class="{ active: interactiveState[slide.id]?.selected?.includes(opt.id) }"
      @click="toggleMulti(slide.id, opt)"
    >
      {{ opt.label }}
    </button>
  </div>

  <div
    v-if="interactiveState[slide.id]?.feedback"
    class="interactive-feedback"
    :class="interactiveState[slide.id]?.level"
  >
    <strong>{{ interactiveState[slide.id]?.headline }}</strong>
    <div>{{ interactiveState[slide.id]?.feedback }}</div>
  </div>
</div>


<!-- DRAG & DROP -->
<div v-else-if="interactiveFor(slide).type === 'dragdrop'" class="interactive-box swiper-no-swiping">
  <div class="quiz-question">{{ interactiveFor(slide).prompt }}</div>

  <!-- Items zum Ziehen -->
  <div class="drag-items">
    <div
      v-for="it in getDragItems(slide.id).unassigned"
      :key="it.id"
      class="drag-item"
      draggable="true"
      @dragstart="onDragStart(slide.id, it.id, $event)"
      @pointerdown.stop
  @mousedown.stop
  @touchstart.stop.prevent
    >
      <img v-if="it.image" :src="it.image" :alt="it.label" />
      <div class="drag-label">{{ it.label }}</div>
    </div>
  </div>

<!-- Drop-Zonen (dynamisch) -->
<div class="dropzones">
  <div
    v-for="b in interactiveFor(slide).buckets"
    :key="b.id"
    class="dropzone"
    @dragover.prevent
    @drop="onDrop(slide.id, b.id)"
  >
    <div class="dropzone-title">{{ b.title }}</div>

    <div class="dropzone-items">
      <div
        v-for="it in getDragItems(slide.id).buckets[b.id]"
        :key="it.id"
        class="drag-item small"
        draggable="true"
        @dragstart="onDragStart(slide.id, it.id, $event)"
      >
        <img v-if="it.image" :src="it.image" :alt="it.label" />
        <div class="drag-label">{{ it.label }}</div>
      </div>
    </div>
  </div>
</div>


  <div class="drag-actions">
    <button class="interactive-btn" @click="evaluateDragDrop(slide.id)">
      Prüfen
    </button>
    <button class="interactive-btn ghost" @click="resetDragDrop(slide.id)">
      Zurücksetzen
    </button>
  </div>

  <div
    v-if="interactiveState[slide.id]?.feedback"
    class="interactive-feedback"
    :class="interactiveState[slide.id]?.level"
  >
    <strong>{{ interactiveState[slide.id]?.headline }}</strong>
    <div>{{ interactiveState[slide.id]?.feedback }}</div>
  </div>
</div>


            <!-- QUIZ -->
            <div v-else-if="interactiveFor(slide).type === 'quiz'" class="interactive-box">
              <div v-for="q in interactiveFor(slide).questions" :key="q.id" class="quiz-card">
                <div class="quiz-question">{{ q.question }}</div>
                <div class="interactive-grid">
                  <button
                    v-for="opt in q.options"
                    :key="opt.id"
                    class="interactive-btn"
                    @click="pickQuiz(slide.id, q.id, opt)"
                  >
                    {{ opt.label }}
                  </button>
                </div>

                <div
                  v-if="interactiveState[slide.id]?.quiz?.[q.id]?.feedback"
                  class="interactive-feedback"
                  :class="interactiveState[slide.id]?.quiz?.[q.id]?.level"
                >
                  <strong>{{ interactiveState[slide.id]?.quiz?.[q.id]?.headline }}</strong>
                  <div>{{ interactiveState[slide.id]?.quiz?.[q.id]?.feedback }}</div>
                </div>
              </div>
            </div>

            <img v-if="slide.imageUrl" :src="slide.imageUrl" alt="Illustration" class="slide-image" :class="{ bigImage: slide.title === '4.1 Fluchtwege freihalten' }"/>

            <div v-if="interactiveState[slide.id]?.done" class="progress-hint completed" style="margin-top: 12px">
              <svg class="progress-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M13.5 4L6 11.5L2.5 8"
                  stroke="#16a34a"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Interaktion abgeschlossen
            </div>
          </div>

          <!-- Normale Content-/Summary-Slide -->
         <div v-else class="slide-content">
  <div
    class="content-layout"
    :class="{ 'content-layout--side': slide.imageUrl && isSideImageSlide(slide, index) }"
  >
    <div class="content-text">
      <div class="rich-body" v-if="slide.body">
        <template v-for="(block, bIdx) in parseBody(slide.body)" :key="bIdx">
          <p v-if="block.type === 'p'" class="rich-p">{{ block.text }}</p>

          <ul v-else-if="block.type === 'ul'" class="rich-ul">
            <li v-for="(item, iIdx) in block.items" :key="iIdx">{{ item }}</li>
          </ul>

          <div v-else-if="block.type === 'warn'" class="rich-warn">
            <strong>⚠️ Achtung:</strong> {{ block.text }}
          </div>

          <div v-else-if="block.type === 'check'" class="rich-check">
            <strong>✅ Merke:</strong> {{ block.text }}
          </div>
        </template>
      </div>
    </div>

    <div v-if="slide.imageUrl" class="content-media">
      <img :src="slide.imageUrl" alt="Illustration" class="slide-image side"   :class="{ side: isSideImageSlide(slide, index),
    bigCompare: slide.title === '4.1 Fluchtwege freihalten' }"/>
    </div>
  </div>

  <!-- Gelesen -->
  <div v-if="visitedSlides[slide.id]" class="progress-hint completed">
    <svg class="progress-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13.5 4L6 11.5L2.5 8" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
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
      <p class="progress-text">{{ completedSlidesCount }} von {{ totalSlidesCount }} Abschnitten abgeschlossen</p>
    </div>

    <button v-if="allSlidesCompleted" class="finish-btn" @click="finishChapter">
      Kapitel abschließen
    </button>
    <div v-else class="finish-hint">
      Bitte schließe alle Lerneinheiten ab, um das Kapitel abzuschließen
    </div>
  </div>

  <div v-else class="page page-center">
    <p v-if="chapterStore.chapterLoading">Kapitel wird geladen …</p>
    <p v-else-if="chapterStore.chapterError" class="error-box">
      {{ chapterStore.chapterError }}
      <br />
      <button class="back-btn secondary" @click="goBackToChapters">Zur Kapitelübersicht</button>
    </p>
  </div>

  <Transition name="celebration">
    <div v-if="showCelebration" class="celebration-overlay" @click="closeCelebration">
      <div class="celebration-modal" @click.stop>
        <div class="celebration-content">
          <div class="celebration-icon">🎉</div>
          <h2 class="celebration-title">Kapitel abgeschlossen!</h2>
          <p class="celebration-message">
            Glückwunsch! Du hast <strong>{{ chapterStore.currentChapter.title }}</strong> erfolgreich abgeschlossen.
          </p>
          <button class="celebration-btn" @click="closeCelebration">
            Weiter zur Übersicht
          </button>
        </div>
      </div>
      <canvas ref="confettiCanvas" class="confetti-canvas"></canvas>
    </div>
  </Transition>
</template>

<script setup>
import api from "../api";
import { onMounted, ref, computed, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

import { useChapterStore } from "../stores/chapterStore";
import fireflyNormal from "../assets/images/firefly-normal.png";
import fireflyWelcome from "../assets/images/firefly-welcome.png";

const INTERACTIVES = {
  "Interaktiv: Brand entdeckt": {
    type: "decision",
    options: [
      { id: "alarm", label: "Alarm auslösen / Hilfe holen", correct: true, level: "good", headline: "Richtig ✅", feedback: "Perfekt. Erst melden/Alarm auslösen – dann geordnet reagieren." },
      { id: "filmen", label: "Filmen und anderen schicken", correct: false, level: "bad", headline: "Falsch ❌", feedback: "Zeitverlust. Bei Brand zählt: melden & evakuieren – nicht filmen." },
      { id: "loeschen", label: "Sofort löschen (ohne zu melden)", correct: false, level: "danger", headline: "Gefährlich ⚠️", feedback: "Kann dich in Gefahr bringen. Erst melden, dann nur bei kleinem Brand löschen." },
      { id: "weglaufen", label: "Weglaufen ohne jemanden zu warnen", correct: false, level: "bad", headline: "Nicht gut ❌", feedback: "Andere könnten nichts merken. Warnen und melden ist entscheidend." },
    ],
  },

  "Interaktiv: Brandmeldung absetzen": {
    type: "quiz",
    questions: [
      {
        id: "was",
        question: "1) Was ist passiert?",
        options: [
          { id: "a", label: "„Keine Ahnung, irgendwas…“", correct: false, level: "bad", headline: "Zu ungenau ❌", feedback: "Sag klar: Brand/Rauch/Explosion." },
          { id: "b", label: "„Brand mit Rauchentwicklung“", correct: true, level: "good", headline: "Gut ✅", feedback: "Kurz und eindeutig – genau so." },
          { id: "c", label: "„Vielleicht nur Wasserdampf“", correct: false, level: "bad", headline: "Riskant ❌", feedback: "Nicht herunterspielen – klar melden." },
        ],
      },
      {
        id: "wo",
        question: "2) Wo brennt es?",
        options: [
          { id: "a", label: "„In der Schule“", correct: false, level: "bad", headline: "Zu ungenau ❌", feedback: "Gib Gebäude/Stock/Raum an." },
          { id: "b", label: "„Gebäude A, 2. Stock, Raum 2.14“", correct: true, level: "good", headline: "Perfekt ✅", feedback: "Genau so findet man den Brand schnell." },
          { id: "c", label: "„Irgendwo im Gang“", correct: false, level: "bad", headline: "Zu ungenau ❌", feedback: "So genau wie möglich sein." },
        ],
      },
      {
        id: "verletzt",
        question: "3) Gibt es Verletzte?",
        options: [
          { id: "a", label: "„Weiß nicht“", correct: false, level: "bad", headline: "Besser prüfen ❌", feedback: "Wenn möglich kurz schauen/fragen." },
          { id: "b", label: "Soll ich nachschauen?", correct: false, level: "good", headline: "Riskant ❌", feedback: "Du verschwendest Zeit." },
          { id: "c", label: "„Ja, 1 Person verletzt“", correct: true, level: "good", headline: "Wichtig ✅", feedback: "Verletzte immer sofort nennen." },
        ],
      },
    ],
  },

  "Interaktiv: Richtig evakuieren": {
    type: "quiz",
    questions: [
      {
        id: "fenster",
        question: "Fenster öffnen?",
        options: [
          { id: "a", label: "Ja, damit Rauch raus kann", correct:false, level: "bad", headline: "Falsch ❌", feedback: "Kann Feuer/Rauch anfachen. Lieber raus." },
          { id: "b", label: "Nein, evakuieren",correct:true, level: "good", headline: "Richtig ✅", feedback: "Schnell und geordnet raus ist wichtiger." },
        ],
      },
      {
        id: "tuere",
        question: "Tür schließen?",
        options: [
          { id: "a", label: "Ja, aber nicht versperren",correct:true, level: "good", headline: "Richtig ✅", feedback: "Bremst Rauch/Feuer und bleibt zugänglich." },
          { id: "b", label: "Nein, offen lassen",correct:false, level: "bad", headline: "Falsch ❌", feedback: "Offene Türen lassen Rauch schneller ausbreiten." },
        ],
      },
      {
        id: "lift",
        question: "Aufzug benutzen?",
        options: [
          { id: "a", label: "Ja, schneller",correct:false, level: "danger", headline: "Gefährlich ⚠️", feedback: "Nie! Stromausfall/Rauch kann lebensgefährlich sein." },
          { id: "b", label: "Nein, Stiegenhaus",correct:true, level: "good", headline: "Richtig ✅", feedback: "Stiegenhaus ist der sichere Weg." },
        ],
      },
      {
        id: "mitnehmen",
        question: "Was nimmst du mit?",
        options: [
          { id: "a", label: "Jacke, Tasche, Laptop",correct:false, level: "bad", headline: "Zeitverlust ❌", feedback: "Nichts sammeln – raus! Jede Sekunde zählt." },
          { id: "b", label: "Trinkflasche, falls ich damit potentiell was löschen könnte",correct:false, level: "good", headline: "Dumm ❌", feedback: "Nur wenn es sofort geht – sonst weglassen." },
          { id: "c", label: "Gar nichts – sofort raus",correct:true, level: "good", headline: "Sehr gut ✅", feedback: "Schnell raus ist am sichersten." },
        ],
      },
    ],
  },

  "Interaktiv: Löschen oder flüchten?": {
    type: "quiz",
    questions: [
      {
        id: "papierkorb",
        question: "Papierkorb brennt klein, Rauch wenig.",
        options: [
          { id: "a", label: "Löschen", correct:true, level: "good", headline: "Kann passen ✅", feedback: "Nur wenn Rückzug frei ist und du sicher bist." },
          { id: "b", label: "Flüchten", correct:true, level: "good", headline: "Auch ok ✅", feedback: "Sicherheit geht immer vor – melden nicht vergessen." },
        ],
      },
      {
        id: "fettbrand",
        question: "Fettbrand (z.B. in Küche).",
        options: [
          { id: "a", label: "Löschen", correct:false, level: "danger", headline: "Gefährlich ⚠️", feedback: "Fettbrand nie mit Wasser! Lieber flüchten & melden." },
          { id: "b", label: "Flüchten", correct:true, level: "good", headline: "Richtig ✅", feedback: "Melden und Abstand halten." },
        ],
      },
      {
        id: "elektro",
        question: "Elektrogerät brennt / Steckdose schmort.",
        options: [
          { id: "a", label: "Löschen", correct:false, level: "bad", headline: "Nur mit Wissen ❌", feedback: "Elektrik ist riskant. Besser: Strom weg, melden, flüchten." },
          { id: "b", label: "Flüchten", correct:true, level: "good", headline: "Richtig ✅", feedback: "Melden und Bereich räumen." },
        ],
      },
    ],
  },

  "Interaktiv: Gefahren erkennen": {
  type: "multiselect",
  prompt: "Wähle alle Brandgefahren aus:",
  options: [
    { id: "kippe", label: "Glühende Zigarette / Kippe", correct: true },
    { id: "muell", label: "Müll/ Papier in der Nähe", correct: true },
    { id: "wind", label: "Wind (Funkenflug)", correct: true },
    { id: "asche", label: "Asche auf dem Boden", correct: true },

    { id: "regen", label: "Regenwetter", correct: false },
    { id: "jacke", label: "Jemand trägt eine Jacke", correct: false },
  ],
},

  "Interaktiv: Risiko richtig einschätzen": {
    type: "quiz",
    questions: [
      {
        id: "stufe1",
        question: "Akku normal, nicht heiß, keine Schäden.",
        options: [
          { id: "gruen", label: "🟢 Grün (normal)", correct: true, level: "good", headline: "Richtig ✅", feedback: "Normalzustand. Trotzdem: Regeln einhalten." },
          { id: "gelb", label: "🟡 Gelb (Warnung)", correct: false, level: "bad", headline: "Zu streng ❌", feedback: "Gelb ist erst bei Hitze/Schäden." },
          { id: "rot",  label: "🔴 Rot (Gefahr)", correct: false, level: "danger", headline: "Zu dramatisch ⚠️", feedback: "Rot ist Rauch, Zischen, Geruch." },
        ],
      },
      {
        id: "stufe2",
        question: "Akku wird beim Laden sehr heiß / ist aufgebläht.",
        options: [
          { id: "gruen", label: "🟢 Grün (normal)", correct: false, level: "bad", headline: "Falsch ❌", feedback: "Hitze/Aufblähen ist Warnsignal." },
          { id: "gelb", label: "🟡 Gelb (Warnung)", correct: true, level: "good", headline: "Richtig ✅", feedback: "Warnung: ausstecken (wenn sicher), Abstand, melden." },
          { id: "rot",  label: "🔴 Rot (Gefahr)", correct: false, level: "danger", headline: "Fast…", feedback: "Rot ist eher Rauch/Zischen/Brandgeruch." },
        ],
      },
      {
        id: "stufe3",
        question: "Rauch, Zischen oder chemischer Geruch aus dem Akku.",
        options: [
          { id: "gruen", label: "🟢 Grün (normal)", correct: false, level: "bad", headline: "Nein ❌", feedback: "Das ist nicht normal." },
          { id: "gelb", label: "🟡 Gelb (Warnung)", correct: false, level: "bad", headline: "Zu niedrig ❌", feedback: "Das ist akute Gefahr." },
          { id: "rot",  label: "🔴 Rot (Gefahr)", correct: true, level: "danger", headline: "Richtig ⚠️", feedback: "Abstand halten, melden, evakuieren – nicht experimentieren." },
        ],
      },
    ],
  },

  "Interaktiv: Wo Roller abstellen?": {
    type: "multiselect",
    prompt: "Wähle alle sicheren Abstellorte aus:",
    options: [
      { id: "draussen_platz", label: "Draußen am vorgesehenen Stellplatz", correct: true },
      { id: "draussen_ueberdacht", label: "Draußen überdacht (nicht im Fluchtweg)", correct: true },
      { id: "gang", label: "Im Gang neben Klassenräumen", correct: false },
      { id: "stiegenhaus", label: "Im Stiegenhaus", correct: false },
      { id: "notausgang", label: "Direkt vor dem Notausgang", correct: false },
      { id: "keller", label: "Im Keller/Abstellraum im Gebäude", correct: false },
    ],
  },

  "Interaktiv: Was darf NICHT geladen werden?": {
    type: "multiselect",
    prompt: "Wähle ALLE Dinge aus, die nicht geladen werden dürfen:",
    options: [
      { id: "escooter", label: "E-Scooter / E-Bike Akku", correct: true },
      { id: "powerbank", label: "Powerbank", correct: true },
      { id: "vape", label: "E-Zigarette / Vape", correct: true },
      { id: "handy", label: "Handy", correct: false },
      { id: "laptop", label: "Laptop", correct: false },
    ],
  },

  "Abschlussfrage: Akku wird heiß": {
    type: "decision",
    options: [
      { id: "richtig", label: "Ausstecken (wenn sicher), Abstand, melden", correct: true, level: "good", headline: "Perfekt ✅", feedback: "Genau so. Nicht weiterladen und nicht herumprobieren." },
      { id: "falsch1", label: "Weiterladen – wird schon wieder kühler", correct: false, level: "danger", headline: "Gefährlich ⚠️", feedback: "Überhitzung kann eskalieren. Sofort reagieren." },
      { id: "falsch2", label: "Mit Wasser kühlen", correct: false, level: "danger", headline: "Sehr gefährlich ⚠️", feedback: "Elektrik + Wasser = Risiko. Abstand halten und melden." },
    ],
  },

  "Interaktiv: Was ist das Risiko?": {
    type: "multiselect",
    prompt: "Wähle alle typischen Risiken aus:",
    options: [
      { id: "billig", label: "Billig-/No-Name-Netzteil", correct: true },
      { id: "kabel", label: "Kabel beschädigt / geknickt", correct: true },
      { id: "steckdose", label: "Mehrfachsteckdose komplett überlastet", correct: true },
      { id: "waerme", label: "Netzteil wird sehr heiß", correct: true },
      { id: "marke", label: "Originalnetzteil (geprüft)", correct: false },
      { id: "ordnung", label: "Kabel ordentlich verlegt, keine Quetschung", correct: false },
    ],
  },

    "Übung: Wo darf ich abstellen?": {
    type: "multiselect",
    prompt: "Wähle 4 richtige Abstellorte aus:",
    options: [
      { id: "aussen_ständer", label: "Draußen beim Fahrradständer", correct: true },
      { id: "markiert", label: "Markierter Außenbereich", correct: true },
      { id: "ueberdacht", label: "Draußen (überdacht) – Fluchtwege frei", correct: true },
      { id: "weit_weg", label: "Draußen – nicht vor Eingängen", correct: true },

      { id: "stiegenhaus", label: "Im Stiegenhaus", correct: false },
      { id: "gang", label: "Im Gang neben Klassenzimmern", correct: false },
    ],
  },

  "Übung: Laden in der Schule – darf / darf nicht": {
    type: "dragdrop",
    prompt: "Ziehe jeden Gegenstand in die richtige Box:",
    buckets: [
      { id: "darf", title: "Darf (in der Schule laden)" },
      { id: "darfNicht", title: "Darf NICHT (in der Schule laden)" },
    ],
    items: [
      // DARF
      { id: "schul_laptop", label: "Schul-Laptop", image: "/media/images/schul_laptop.png", correctBucket: "darf" },
      { id: "schul_tablet", label: "Schul-Tablet", image: "/media/images/schul_tablet.png", correctBucket: "darf" },

      // DARF NICHT
      { id: "powerbank", label: "Powerbank (privat)", image: "/media/images/powerbank.png", correctBucket: "darfNicht" },
      { id: "e_scooter_akku", label: "E-Scooter Akku", image: "/media/images/e_scooter_akku.png", correctBucket: "darfNicht" },
      { id: "werkzeug_akku", label: "Werkzeug-Akku", image: "/media/images/werkzeug_akku.png", correctBucket: "darfNicht" },
      { id: "vape", label: "Vape / E-Zigarette", image: "/media/images/vape.png", correctBucket: "darfNicht" },
    ],
  },


  "Miniquiz: Vorbereitung – richtig oder falsch?": {
  type: "quiz",
  questions: [
    {
      id: "q1",
      question: "Kartons kurz im Gang lagern ist ok, solange es „nur 10 Minuten“ sind.",
      options: [
        { id: "t", label: "Richtig", correct: false, level: "danger", headline: "Falsch ❌", feedback: "Fluchtwege müssen immer frei sein – auch kurzzeitig." },
        { id: "f", label: "Falsch", correct: true,  level: "good",   headline: "Richtig ✅", feedback: "Genau: nichts in Gänge/Stiegenhäuser stellen." },
      ],
    },
    {
      id: "q2",
      question: "Kabel quer über den Weg sind gefährlich (Stolperfallen).",
      options: [
        { id: "t", label: "Richtig", correct: true,  level: "good", headline: "Richtig ✅", feedback: "Kabel sichern oder umleiten – Wege müssen sicher bleiben." },
        { id: "f", label: "Falsch",  correct: false, level: "bad",  headline: "Falsch ❌", feedback: "Das ist eine typische Stolperfalle." },
      ],
    },
    {
      id: "q3",
      question: "Notausgänge darf man mit Deko zustellen, wenn es schöner aussieht.",
      options: [
        { id: "t", label: "Richtig", correct: false, level: "danger", headline: "Gefährlich ❌", feedback: "Notausgänge dürfen nie blockiert oder verdeckt sein." },
        { id: "f", label: "Falsch",  correct: true,  level: "good",   headline: "Richtig ✅", feedback: "Sicherheit geht vor Deko." },
      ],
    },
    {
      id: "q4",
      question: "Feuerlöscher müssen zugänglich bleiben (nicht zustellen).",
      options: [
        { id: "t", label: "Richtig", correct: true,  level: "good", headline: "Richtig ✅", feedback: "Im Ernstfall muss man sofort hinkommen." },
        { id: "f", label: "Falsch",  correct: false, level: "bad",  headline: "Falsch ❌", feedback: "Zustellen kostet Zeit und ist gefährlich." },
      ],
    },
  ],
},


"Übung: Evakuierung – richtige Reihenfolge": {
  type: "dragdrop",
  prompt: "Ordne die Schritte in die richtige Reihenfolge (1 → 6):",
  buckets: [
    { id: "s1", title: "1" },
    { id: "s2", title: "2" },
    { id: "s3", title: "3" },
    { id: "s4", title: "4" },
    { id: "s5", title: "5" },
    { id: "s6", title: "6" },
  ],
  items: [
    { id: "a", label: "Ruhe bewahren – Alarm ernst nehmen", image: null, correctBucket: "s1" },
    { id: "b", label: "Anweisungen der Lehrperson befolgen", image: null, correctBucket: "s2" },
    { id: "c", label: "Fluchtweg-Schildern folgen", image: null, correctBucket: "s3" },
    { id: "d", label: "Nicht drängeln – nicht zurücklaufen", image: null, correctBucket: "s4" },
    { id: "e", label: "Zum Sammelplatz gehen", image: null, correctBucket: "s5" },
    { id: "f", label: "Warten auf weitere Infos", image: null, correctBucket: "s6" },
  ],
},


};

// Kapitel 1: Firefly Texte (über Slide-Titel)
const FIREFLY_BY_TITLE = {
  "Überblick: Melden – Flüchten – Löschen": "Die Reihenfolge ist: Melden 🔔 – Flüchten 🏃 – Löschen 🧯",
  "Interaktiv: Brand entdeckt": "Okay, du bist dran: Was machst du als Erstes? 👇",
  "Merksatz": "Merke: Eigenschutz zuerst. 💡",
  "Video: Verhalten im Brandfall (Schule)": "Schau das Video fertig — danach üben wir’s interaktiv. 🎬",
  "1.1 Brand melden": "Beim Melden gilt: kurz, klar, genau. Keine Panik! ☎️",
  "Interaktiv: Brandmeldung absetzen": "Wie beim echten Notruf: Was? Wo? Verletzte? Wer? ✅",
  "Checkliste: Brandmeldung": "Speicher dir die 5 Punkte — die sind Gold wert ✅",
  "1.2 In Sicherheit bringen": "Evakuieren: geordnet raus, Türen zu, Lift nie. 🚫",
  "Interaktiv: Richtig evakuieren": "Schnelle Entscheidungen — aber richtig 😉",
  "1.3 Löschversuch unternehmen": "Nur löschen, wenn’s klein ist UND du sicher rauskommst. 🧯",
  "Interaktiv: Löschen oder flüchten?": "Check die Situation: Löschen oder sofort raus? 👇",

  // Kapitel 2: Brandverhütung (brandverhuetung)
  "Warum Brandverhütung wichtig ist": "Brandverhütung heißt: Brände gar nicht erst entstehen lassen. 🔥✅",
  "Übersicht: Wichtige Verbote": "Das sind die wichtigsten Regeln – die sind nicht zum Spaß da. 👀",
  "Typische Brandverursacher": "Kleine Fehler, große Wirkung. Das sind die Klassiker. ⚡🔥",
  "2.1 Rauchverbot": "Glut + Wind + Müll = Brandgefahr. Darum gilt Rauchverbot am ganzen Gelände. 🚭",
  "Interaktiv: Gefahren erkennen": "Markiere ALLE Brandgefahren – keine falschen, sonst bleibst du hier. 👇",
  "2.2 Umgang mit Feuer & offenen Flammen": "Offene Flammen sind im Gebäude tabu – außer mit Aufsicht. 🔥",
  "Was ist erlaubt – was nicht?": "Hier siehst du klar: was erlaubt ist (mit Aufsicht) und was nicht. ✅🚫",
  "Wenn eine Flamme reicht": "Mini-Szenario: So schnell kann’s eskalieren. ⚠️",
  "Abschluss": "Fazit: Regeln einhalten, Gefahren melden, keine Experimente. ✅",

  // Kapitel 3: Elektrische Geräte & Akkus (elektrische-geraete)
  "Überblick: Warum Elektrik ein Risiko ist": "Akkus speichern Energie – wenn’s schiefgeht, wird’s schnell gefährlich. ⚡🔋",
  "Elektrik = Risiko (Mini-Fazit)": "Wenn unsicher: ausstecken, Abstand, Lehrperson informieren. ✅",
  "3.1 E-Bikes & E-Roller": "Die Akkus sind groß – deswegen dürfen sie nicht ins Gebäude. 🛴⚠️",
  "Risikostufen: Akku-Check": "Denk an Ampel: Grün = ok, Gelb = Warnung, Rot = Gefahr. 🟢🟡🔴",
  "Interaktiv: Risiko richtig einschätzen": "Wähl die richtige Stufe – nur dann geht’s weiter. 👇",
  "Interaktiv: Wo Roller abstellen?": "Wähle ALLE sicheren Abstellorte – sonst bleibt’s gesperrt. 👇",
  "3.2 Akkus & Ladeverbot": "Laden ist oft der kritischste Moment: Hitze + Akku = Risiko. 🔌🔥",
  "Interaktiv: Was darf NICHT geladen werden?": "Klick alles an, was NICHT geladen werden darf. 👇",
  "Abschlussfrage: Akku wird heiß": "Akku wird heiß + Geruch? Sofort richtig reagieren. 👀",
  "3.3 Private Elektrogeräte": "Privatgeräte sind nicht geprüft – Schulgeräte schon. ✅⚠️",
  "Interaktiv: Was ist das Risiko?": "Finde die typischen Risiken: Kabel, Netzteil, Überlastung. 👇",
  "Fazit: Elektrik = Risiko": "Merke: AUSSTECKEN + MELDEN ist besser als abwarten. ✅",
};


const chapterStore = useChapterStore();
const route = useRoute();
const router = useRouter();

// Fortschritt-Tracking
const visitedSlides = ref({});
const videoCompleted = ref({});
const watchedDurations = ref({});
const videoDurations = ref({});
const activeIndex = ref(0);
const isPlaying = ref({});
const isMuted = ref({});
const currentTime = ref({});
const progressRecord = ref(null);
const showCelebration = ref(false);
const confettiCanvas = ref(null);
let swiperInstance = null;


// nur erste Slide seitlich
const isSideImageSlide = (slide, index) => {
  const chapterOrder = chapterStore.currentChapter?.order;
  // Kapitel 4: Vergleichsbild soll NICHT side-layout sein
if (slide?.title === "4.1 Fluchtwege freihalten") return false;


  // ✅ Kapitel 2: Nur diese Slides sollen Bild rechts (side layout) haben
  if (chapterOrder === 2) {
    return index === 1 || index === 3 || index === 6;
  }

  // (deine bisherigen Regeln für andere Kapitel)
  if (index === 0 || index === 3 || index === 7 || index === 15 || index === 17 || index === 20) return true;

  const t = (slide?.title || "").toLowerCase();
  if (t.startsWith("überblick")) return true;
  if (t.startsWith("1.1")) return true;
  if (t.startsWith("2.")) return true;
  if (t.startsWith("3.")) return true;

  return false;
};





// Kapitel laden
onMounted(async () => {
  await chapterStore.fetchChapter(route.params.slug);

  const chapter = chapterStore.currentChapter;
  if (chapter) {
    try {
      await api.post(`/progress/start/${chapter.id}`, {}, { withCredentials: true });
    } catch (e) {
      console.warn("Konnte Start-Fortschritt nicht speichern:", e);
    }
  }
});

const getFireflyMessage = (slide, index) => {
  if (!slide) return "Ich bin da 👋";
  if (slide.title && FIREFLY_BY_TITLE[slide.title]) return FIREFLY_BY_TITLE[slide.title];

  if (index === 0) return "Hallo! Ich begleite dich durch dieses Kapitel! 🔥";
  if (slide.type === "video") return videoCompleted.value[slide.id] ? "Video geschafft! 🎉" : "Video bis zum Ende ansehen 👀";
  if (slide.type === "summary") return "Nice — Zusammenfassung! 📌";
  return "Weiter geht’s — du schaffst das 💪";
};

const getCurrentFireflyMessage = () => {
  const chapter = chapterStore.currentChapter;
  if (!chapter || !chapter.slides) return "Ich bin da 👋";
  const currentSlide = chapter.slides[activeIndex.value];
  if (!currentSlide) return "Ich bin da 👋";
  return getFireflyMessage(currentSlide, activeIndex.value);
};

const onSwiperInit = (swiper) => {
  swiperInstance = swiper;
  updateSwiperNavigation();
};

const goBackToChapters = () => {
  router.push("/chapters");
};

const loadProgressForChapter = async (chapter) => {
  try {
    const { data } = await api.get(`/progress/${chapter.id}`);
    progressRecord.value = data;

    let startIndex = 0;
    if (data && typeof data.lastSlideIndex === "number") startIndex = data.lastSlideIndex;

    activeIndex.value = startIndex;

    chapter.slides.forEach((slide, idx) => {
  if (idx <= startIndex) {
    if (slide.type === "video") {
      videoCompleted.value[slide.id] = true;
    } else {
      visitedSlides.value[slide.id] = true;
    }
  }
});


    await nextTick();
    if (swiperInstance) {
      swiperInstance.slideTo(startIndex, 0);
      updateSwiperNavigation();
    }
  } catch (err) {
    console.error("Error loading chapter progress:", err);
  }
};

watch(
  () => chapterStore.currentChapter,
  async (chapter) => {
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
      await loadProgressForChapter(chapter);
    }

    setTimeout(() => updateSwiperNavigation(), 100);
  },
  { immediate: true }
);

const parseBody = (text) => {
  const lines = (text || "").split("\n").map((l) => l.trim()).filter(Boolean);

  const blocks = [];
  let list = [];

  const flushList = () => {
    if (list.length) {
      blocks.push({ type: "ul", items: list });
      list = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith("- ")) {
      list.push(line.replace("- ", ""));
      continue;
    }
    if (line.startsWith("! ")) {
      flushList();
      blocks.push({ type: "warn", text: line.replace("! ", "") });
      continue;
    }
    if (line.startsWith("✓ ")) {
      flushList();
      blocks.push({ type: "check", text: line.replace("✓ ", "") });
      continue;
    }

    flushList();
    blocks.push({ type: "p", text: line });
  }

  flushList();
  return blocks;
};

const interactiveState = ref({});

const interactiveFor = (slide) => {
  if (!slide?.title) return null;
  return INTERACTIVES[slide.title] || null;
};

const isInteractiveComplete = (slide) => {
  const cfg = interactiveFor(slide);
  if (!cfg) return true; // nicht interaktiv => ok

  const st = interactiveState.value?.[slide.id];
  return !!st?.done; // done bedeutet: richtig abgeschlossen
};


const ensureSlideState = (slideId) => {
  if (!interactiveState.value[slideId]) {
    interactiveState.value[slideId] = {
      done: false,
      feedback: null,
      level: null,
      headline: null,
      quiz: {},
      selected: [],
      dragdrop: null,
    };
  }
  return interactiveState.value[slideId];
};


const pickDecision = (slideId, opt) => {
  const st = ensureSlideState(slideId);

  st.feedback = opt.feedback;
  st.level = opt.level;
  st.headline = opt.headline;

  // NUR wenn richtig -> done
  st.done = !!opt.correct;

  // Gelesen/abgeschlossen nur wenn richtig
  if (st.done){
    visitedSlides.value[slideId] = true;
    nextTick(() => updateSwiperNavigation());
  }
};


const pickQuiz = (slideId, questionId, opt) => {
  const st = ensureSlideState(slideId);
  if (!st.quiz) st.quiz = {};

  st.quiz[questionId] = {
    feedback: opt.feedback,
    level: opt.level,
    headline: opt.headline,
    correct: !!opt.correct
  };

  // Konfiguration dieser Slide holen
  const chapter = chapterStore.currentChapter;
  const current = chapter?.slides?.find(s => s.id === slideId);
  const thisCfg = current ? INTERACTIVES[current.title] : null;

  if (thisCfg?.questions?.length) {
    // Done nur wenn ALLE Fragen beantwortet UND alle richtig sind
    const allAnswered = thisCfg.questions.every(q => st.quiz?.[q.id]);
    const allCorrect  = thisCfg.questions.every(q => st.quiz?.[q.id]?.correct === true);

    st.done = allAnswered && allCorrect;

    if (st.done){ 
      visitedSlides.value[slideId] = true;
      nextTick(() => updateSwiperNavigation());
    }
  }
};

const toggleMulti = (slideId, opt) => {
  const st = ensureSlideState(slideId);

  const idx = st.selected.indexOf(opt.id);
  if (idx >= 0) st.selected.splice(idx, 1);
  else st.selected.push(opt.id);

  const slide = chapterStore.currentChapter?.slides?.find(s => s.id === slideId);
  const iCfg = slide ? INTERACTIVES[slide.title] : null;
  if (!iCfg) return;

  const correctIds = iCfg.options.filter(o => o.correct).map(o => o.id);
  const wrongIds   = iCfg.options.filter(o => !o.correct).map(o => o.id);

  const hasWrong = st.selected.some(id => wrongIds.includes(id));
  const missing = correctIds.filter(id => !st.selected.includes(id));

  if (hasWrong) {
    st.done = false;
    st.level = "danger";
    st.headline = "Nicht ganz ❌";
    st.feedback = "Du hast mindestens 1 falsches Feld gewählt. Entferne es.";
    return; // ✅ wichtig: sofort raus
  }

  if (missing.length > 0) {
    st.done = false;
    st.level = "bad";
    st.headline = "Fast…";
    st.feedback = `Es fehlen noch ${missing.length} richtige Felder.`;
    return;
  }

  st.done = true;
  st.level = "good";
  st.headline = "Perfekt ✅";
  st.feedback = "Alles richtig – du kannst weiter swipen.";

  visitedSlides.value[slideId] = true;
  nextTick(() => updateSwiperNavigation());
};


const dragPayload = ref({ slideId: null, itemId: null });

const getDragCfg = (slideId) => {
  const slide = chapterStore.currentChapter?.slides?.find(s => s.id === slideId);
  if (!slide) return null;
  return INTERACTIVES[slide.title] || null;
};

const initDragDropStateIfNeeded = (slideId) => {
  const st = ensureSlideState(slideId);
  const cfg = getDragCfg(slideId);

  if (!cfg || cfg.type !== "dragdrop") return;

  if (!st.dragdrop) {
    const bucketsObj = Object.fromEntries((cfg.buckets || []).map(b => [b.id, []]));

    st.dragdrop = {
      unassigned: cfg.items.map(i => i.id),
      buckets: bucketsObj,
    };
  }
};


const getDragItems = (slideId) => {
  initDragDropStateIfNeeded(slideId);

  const cfg = getDragCfg(slideId);
  const st = interactiveState.value[slideId];

  const byId = Object.fromEntries(cfg.items.map(i => [i.id, i]));
  const mapIds = (ids) => ids.map(id => byId[id]).filter(Boolean);

  const buckets = {};
  for (const b of (cfg.buckets || [])) {
    buckets[b.id] = mapIds(st.dragdrop.buckets[b.id] || []);
  }

  return {
    unassigned: mapIds(st.dragdrop.unassigned),
    buckets,
  };
};

const removeFromAllLists = (dd, itemId) => {
  dd.unassigned = dd.unassigned.filter(id => id !== itemId);

  for (const key of Object.keys(dd.buckets || {})) {
    dd.buckets[key] = dd.buckets[key].filter(id => id !== itemId);
  }
};

const setSwiperDragEnabled = (enabled) => {
  // du hast swiperInstance als Variable (kein ref)
  if (!swiperInstance) return;
  swiperInstance.allowTouchMove = enabled;
};



const onDragStart = (slideId, itemId, e) => {
  dragPayload.value = { slideId, itemId };

    e.dataTransfer.setData("text/plain", itemId);
  e.dataTransfer.effectAllowed = "move";

    setSwiperDragEnabled(false);
};

const onDrop = (slideId, bucketId) => {
  initDragDropStateIfNeeded(slideId);

  const st = ensureSlideState(slideId);
  const { itemId } = dragPayload.value;
  if (!itemId) return;

  removeFromAllLists(st.dragdrop, itemId);

  if (st.dragdrop.buckets?.[bucketId]) {
    st.dragdrop.buckets[bucketId].push(itemId);
  } else {
    st.dragdrop.unassigned.push(itemId);
  }

  st.done = false;
  st.feedback = null;
  st.level = null;
  st.headline = null;

  setSwiperDragEnabled(true);
};

const evaluateDragDrop = (slideId) => {
  initDragDropStateIfNeeded(slideId);

  const st = ensureSlideState(slideId);
  const cfg = getDragCfg(slideId);
  if (!cfg) return;

  // muss alles zugeordnet sein
  if (st.dragdrop.unassigned.length > 0) {
    st.done = false;
    st.level = "bad";
    st.headline = "Noch nicht fertig";
    st.feedback = "Ordne zuerst alle Gegenstände zu.";
    return;
  }

 const placed = Object.fromEntries(
  Object.entries(st.dragdrop.buckets).map(([k, ids]) => [k, new Set(ids)])
);


  let wrong = 0;

  for (const it of cfg.items) {
  const correct = !!placed[it.correctBucket]?.has(it.id);
  if(!correct) wrong++;

  }

  if (wrong > 0) {
    st.done = false;
    st.level = "danger";
    st.headline = "Nicht ganz ❌";
    st.feedback = `Es sind noch ${wrong} Zuordnungen falsch. Verschiebe sie und prüfe erneut.`;
    return;
  }

  st.done = true;
  st.level = "good";
  st.headline = "Perfekt ✅";
  st.feedback = "Alles richtig – du kannst weiter swipen.";

  visitedSlides.value[slideId] = true;
  nextTick(() => updateSwiperNavigation());
};

const resetDragDrop = (slideId) => {
  const st = ensureSlideState(slideId);
  const cfg = getDragCfg(slideId);
  if (!cfg) return;

st.dragdrop = {
  unassigned: cfg.items.map(i => i.id),
  buckets: Object.fromEntries((cfg.buckets || []).map(b => [b.id, []])),
};


  st.done = false;
  st.feedback = null;
  st.level = null;
  st.headline = null;

  setSwiperDragEnabled(true);

};



const labelForType = (type) => {
  if (type === "video") return "Lernvideo";
  if (type === "summary") return "Zusammenfassung";
  return "Lerneinheit";
};

const isFileVideo = (url) => url && !url.includes("youtube.com") && !url.includes("youtu.be");

const youtubeEmbed = (url) => {
  if (!url) return "";
  let embed = url.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/");
  const sep = embed.includes("?") ? "&" : "?";
  embed = `${embed}${sep}controls=0&disablekb=1&rel=0&modestbranding=1&fs=0`;
  return embed;
};

const onSlideChange = (swiper) => {
  const chapter = chapterStore.currentChapter;
  if (!chapter || !chapter.slides) return;

  const prevIndex = activeIndex.value;
  const prevSlide = chapter.slides[prevIndex];

  if (prevSlide && prevSlide.type === "video" && !videoCompleted.value[prevSlide.id]) {
    swiper.slideTo(prevIndex, 0);
    return;
  }

  // Wenn vorige Slide interaktiv und NICHT richtig abgeschlossen -> zurück
if (prevSlide && interactiveFor(prevSlide) && !isInteractiveComplete(prevSlide)) {
  swiper.slideTo(prevIndex, 0);
  return;
}
if (prevSlide && prevSlide.type !== "video" && !interactiveFor(prevSlide)) {
  visitedSlides.value[prevSlide.id] = true;
}


  activeIndex.value = swiper.activeIndex;
  const currentSlide = chapter.slides[swiper.activeIndex];
 if (currentSlide && currentSlide.type !== "video" && !interactiveFor(currentSlide)) {
  visitedSlides.value[currentSlide.id] = true;
}


  updateSwiperNavigation();
  saveProgress();
};

const updateSwiperNavigation = () => {
  if (!swiperInstance) return;

  const chapter = chapterStore.currentChapter;
  if (!chapter || !chapter.slides) return;

  const currentSlide = chapter.slides[activeIndex.value];
  if (currentSlide && currentSlide.type === "video" && !videoCompleted.value[currentSlide.id]) {
    swiperInstance.allowSlideNext = false;
  }
  else if (currentSlide && interactiveFor(currentSlide) && !isInteractiveComplete(currentSlide)) {
  swiperInstance.allowSlideNext = false;
}
else {
  swiperInstance.allowSlideNext = true;
}

  swiperInstance.update();
};

const onVideoLoaded = (event, slideId) => {
  const video = event.target;
  videoDurations.value[slideId] = video.duration;
  watchedDurations.value[slideId] = 0;
};

const onYouTubeLoad = (slideId) => {
  videoDurations.value[slideId] = 9999;
  watchedDurations.value[slideId] = 0;
};

const onVideoTimeUpdate = (event, slideId) => {
  const video = event.target;
  const current = video.currentTime;
  const prevMax = watchedDurations.value[slideId] ?? 0;

  currentTime.value[slideId] = current;

  if (current > prevMax + 0.5) watchedDurations.value[slideId] = current;
};

const onVideoSeeking = (event, slideId) => {
  const video = event.target;
  const max = watchedDurations.value[slideId] ?? 0;
  if (video.currentTime > max + 0.5) video.currentTime = max;
};

const onVideoEnded = (slideId) => {
  videoCompleted.value[slideId] = true;
  isPlaying.value[slideId] = false;
  updateSwiperNavigation();
  saveProgress();
};

const togglePlay = (slideId) => {
  const chapter = chapterStore.currentChapter;
  if (!chapter || !chapter.slides) return;

  const slide = chapter.slides.find((s) => s.id === slideId);
  if (!slide) return;

  const videoElements = document.querySelectorAll("video");
  let targetVideo = null;

  videoElements.forEach((video) => {
    if (video.src.includes(slide.videoUrl) || video.src === slide.videoUrl) targetVideo = video;
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

  const slide = chapter.slides.find((s) => s.id === slideId);
  if (!slide) return;

  const videoElements = document.querySelectorAll("video");
  let targetVideo = null;

  videoElements.forEach((video) => {
    if (video.src.includes(slide.videoUrl) || video.src === slide.videoUrl) targetVideo = video;
  });

  if (!targetVideo) return;

  targetVideo.muted = !targetVideo.muted;
  isMuted.value[slideId] = targetVideo.muted;
};

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const totalSlidesCount = computed(() => chapterStore.currentChapter?.slides?.length || 0);

const completedSlidesCount = computed(() => {
  const chapter = chapterStore.currentChapter;
  if (!chapter || !chapter.slides) return 0;

  return chapter.slides.filter((slide) => {
    if (slide.type === "video") return !!videoCompleted.value[slide.id];
    return !!visitedSlides.value[slide.id];
  }).length;
});

const progressPercentage = computed(() => {
  if (totalSlidesCount.value === 0) return 0;
  return Math.round((completedSlidesCount.value / totalSlidesCount.value) * 100);
});

const allSlidesCompleted = computed(() => {
  const chapter = chapterStore.currentChapter;
  if (!chapter || !chapter.slides || !chapter.slides.length) return false;

  return chapter.slides.every((slide) => {
    if (slide.type === "video") return !!videoCompleted.value[slide.id];
    return !!visitedSlides.value[slide.id];
  });
});

const canGoNext = computed(() => {
  const chapter = chapterStore.currentChapter;
  if (!chapter || !chapter.slides) return true;

  const currentSlide = chapter.slides[activeIndex.value];
  if (!currentSlide) return true;

  // Video: nur weiter wenn fertig
  if (currentSlide.type === "video") {
    return !!videoCompleted.value[currentSlide.id];
  }

  // Interaktiv: nur weiter wenn richtig abgeschlossen
  if (interactiveFor(currentSlide)) {
    return isInteractiveComplete(currentSlide);
  }

  return true;
});


const finishChapter = async () => {
  const chapter = chapterStore.currentChapter;
if (chapter?.slides?.length) {
  const currentSlide = chapter.slides[activeIndex.value];
  if (currentSlide) {
    // wenn nicht Video: als gelesen markieren
    if (currentSlide.type !== "video") {
      visitedSlides.value[currentSlide.id] = true;
    }
  }
}

  if (!allSlidesCompleted.value) return;

  const chapterId = chapterStore.currentChapter.id;

  try {
    await api.post(`/progress/complete/${chapterId}`);
    await chapterStore.fetchChapters();

    showCelebration.value = true;
    await nextTick();
    startConfetti();
  } catch (error) {
    console.error("Fehler beim Abschließen des Kapitels:", error);
    alert("Es gab einen Fehler beim Abschließen des Kapitels. Bitte versuche es erneut.");
  }
};

const closeCelebration = () => {
  showCelebration.value = false;
  router.push("/chapters");
};

const startConfetti = () => {
  const canvas = confettiCanvas.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ["#f97316", "#ea580c", "#fb923c", "#fdba74", "#fed7aa", "#16a34a", "#22c55e"];

  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 150 + 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0,
    });
  }

  let animationId;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, index) => {
      ctx.beginPath();
      ctx.lineWidth = p.r / 2;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
      ctx.stroke();

      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
      p.tilt = Math.sin(p.tiltAngle - index / 3) * 15;

      if (p.y > canvas.height) {
        particles[index] = { ...p, x: Math.random() * canvas.width, y: -10 };
      }
    });

    animationId = requestAnimationFrame(draw);
  };

  draw();

  setTimeout(() => cancelAnimationFrame(animationId), 5000);
};

const saveProgress = async () => {
  const chapter = chapterStore.currentChapter;
  if (!chapter) return;

  try {
    await api.post(`/progress/update/${chapter.id}`, { lastSlideIndex: activeIndex.value });
  } catch (err) {
    console.error("Error saving progress:", err);
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
  font-family: "Courier New", monospace;
  letter-spacing: 0.5px;
  user-select: none;
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

.error-box {
  padding: 20px 24px;
  border-radius: 14px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #fca5a5;
  font-size: 1rem;
  text-align: center;
  max-width: 420px;
}

.celebration-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(8px);
}

.celebration-modal {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 24px;
  border: 2px solid #f97316;
  padding: 48px 40px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(249, 115, 22, 0.4);
  animation: modalBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  position: relative;
  z-index: 10000;
}

@keyframes modalBounce {
  0% { transform: scale(0.3) rotate(-10deg); opacity: 0; }
  50% { transform: scale(1.05) rotate(2deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

.celebration-content {
  text-align: center;
}

.celebration-icon {
  font-size: 80px;
  margin-bottom: 20px;
  animation: iconBounce 0.8s ease-in-out infinite alternate;
}

@keyframes iconBounce {
  0% { transform: translateY(0) scale(1); }
  100% { transform: translateY(-10px) scale(1.1); }
}

.celebration-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(90deg, #f97316, #fb923c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  animation: titleGlow 2s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% { filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.6)); }
  50% { filter: drop-shadow(0 0 16px rgba(249, 115, 22, 0.9)); }
}

.celebration-message {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #d1d5db;
  margin-bottom: 32px;
}

.celebration-message strong {
  color: #f97316;
  font-weight: 600;
}

.celebration-btn {
  padding: 14px 32px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.4);
}

.celebration-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(249, 115, 22, 0.6);
}

.celebration-btn:active {
  transform: translateY(0);
}

.confetti-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* Transition */
.celebration-enter-active,
.celebration-leave-active {
  transition: opacity 0.4s ease;
}

.celebration-enter-from,
.celebration-leave-to {
  opacity: 0;
}

.firefly-companion {
  position: fixed;
  bottom: 32px;
  right: 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
  z-index: 100;
  max-width: 320px;
}

.firefly-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(249, 115, 22, 0.4));
  transition: transform 0.3s ease;
}

.firefly-bounce {
  animation: fireflyFloat 3s ease-in-out infinite;
}

@keyframes fireflyFloat {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-12px) rotate(2deg); }
}

.firefly-speech-bubble {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  padding: 14px 20px;
  border-radius: 18px;
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.4;
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.4);
  position: relative;
  max-width: 280px;
  animation: bubblePop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  text-align: right;
}

.firefly-speech-bubble::after {
  content: "";
  position: absolute;
  bottom: -10px;
  right: 50px;
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 12px solid #ea580c;
}

@keyframes bubblePop {
  0% { transform: scale(0.8) translateY(10px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

@media (max-width: 768px) {
  .firefly-companion { bottom: 20px; right: 20px; max-width: 240px; gap: 12px; }
  .firefly-image { width: 90px; height: 90px; }
  .firefly-speech-bubble { font-size: 0.85rem; padding: 12px 16px; max-width: 220px; }
  .firefly-speech-bubble::after { right: 35px; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid #ea580c; bottom: -9px; }
}

.interactive-box {
  margin-top: 16px;
  padding: 14px;
  border: 1px solid #1f2937;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(17, 24, 39, 0.65), rgba(2, 6, 23, 0.65));
}

.interactive-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-top: 12px;
}

@media (min-width: 720px) {
  .interactive-grid { grid-template-columns: 1fr 1fr; }
}

.interactive-btn {
  border: 1px solid #334155;
  background: rgba(2, 6, 23, 0.7);
  color: #e5e7eb;
  padding: 12px 12px;
  border-radius: 14px;
  cursor: pointer;
  transition: transform 0.12s ease, border-color 0.12s ease, background 0.12s ease;
  text-align: left;
  font-size: 0.95rem;
}

.interactive-btn:hover {
  transform: translateY(-1px);
  border-color: #f97316;
  background: rgba(15, 23, 42, 0.9);
}

.interactive-feedback {
  margin-top: 14px;
  padding: 12px 12px;
  border-radius: 14px;
  border: 1px solid #334155;
  background: rgba(2, 6, 23, 0.7);
  color: #e5e7eb;
}

.interactive-feedback.good { border-color: rgba(34, 197, 94, 0.6); }
.interactive-feedback.bad { border-color: rgba(239, 68, 68, 0.6); }
.interactive-feedback.danger { border-color: rgba(245, 158, 11, 0.7); }

.quiz-card {
  padding: 12px;
  border: 1px solid #1f2937;
  border-radius: 14px;
  background: rgba(2, 6, 23, 0.5);
  margin-top: 12px;
}

.quiz-question {
  font-weight: 650;
  color: #f3f4f6;
}

.rich-body { margin-top: 8px; display: grid; gap: 10px; }

.rich-p {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.55;
  font-size: 0.98rem;
}

.rich-ul {
  margin: 0;
  padding-left: 18px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.55;
}

.rich-ul li { margin: 6px 0; }

.rich-warn {
  border: 1px solid rgba(245, 158, 11, 0.55);
  background: rgba(245, 158, 11, 0.12);
  padding: 12px;
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.95);
}

.rich-check {
  border: 1px solid rgba(34, 197, 94, 0.55);
  background: rgba(34, 197, 94, 0.12);
  padding: 12px;
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.95);
}

.content-layout {
  display: block;
}

.content-layout--side {
  display: grid;
  grid-template-columns: 1.35fr 0.65fr;
  gap: 18px;
  align-items: start;
}

.content-text {
  min-width: 0;
}

.content-media {
  display: flex;
  justify-content: flex-end;
}

.slide-image.side {
  margin-top: 0;
  width: 100%;
  max-width: 260px;
  border-radius: 14px;
  object-fit: contain;
}

/* Mobile: wieder untereinander */
@media (max-width: 720px) {
  .content-layout--side {
    grid-template-columns: 1fr;
  }
  .content-media {
    justify-content: flex-start;
  }
  .slide-image.side {
    max-width: 100%;
  }
}

.interactive-btn.active {
  border-color: #f97316;
  background: rgba(249, 115, 22, 0.15);
}





.drag-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin: 12px 0 18px;
}

.drag-item {
  border: 2px solid rgba(255, 255, 255, 0.18);
  border-radius: 14px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: grab;
  user-select: none;
}

.drag-item.small {
  padding: 8px;
}

.drag-item img {
  width: 90px;
  height: 70px;
  object-fit: contain;
}

.drag-label {
  font-size: 0.95rem;
  text-align: center;
  opacity: 0.95;
}

.dropzones {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 12px;
}


.dropzone {
  min-height: 170px;
  border: 2px dashed rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.04);
}

.dropzone-title {
  font-weight: 700;
  margin-bottom: 10px;
}

.dropzone-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.drag-actions {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}

.interactive-btn.ghost {
  opacity: 0.85;
}

.bigImage {
  display: block;
  margin: 24px auto 0 auto;
  width: 100%;
  max-width: 800px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
}


/* NUR für das Vergleichsbild (Kapitel 4.1) */
.bigCompare {
  display: block;
  width: min(820px, 100%);
  max-width: 820px;
  margin: 22px auto 0 auto;
  border-radius: 18px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55);
}

/* wenn bigCompare, dann media-container zentrieren und volle Breite geben */
.content-media:has(.bigCompare) {
  justify-content: center;
}



</style>
