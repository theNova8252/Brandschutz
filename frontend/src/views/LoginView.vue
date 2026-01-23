<template>
  <div class="page">
    <div class="background-gradient"></div>
    <div class="background-pattern"></div>

    <div class="card">
      <div class="card-glow"></div>

      <img
        src="../assets/images/logoBrand.png"
        alt="HTL FireCourse Logo"
        class="logo"
      />

      <h2 class="title">Brandschutz Lernplattform</h2>

      <p class="subtitle">Melde dich mit deinem Schul-Google-Konto an.</p>

      <button @click="googleLogin" class="google-btn">
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google Logo"
        />
        <span>Mit Google anmelden</span>
      </button>

      <!--Fehlermeldung falls nicht htlwienwest schüler-->
      <p v-if="error === 'domain'" class="error-msg">
        Nur HTL Wien West Accounts erlaubt.
      </p>
      <p v-else-if="error" class="error-msg">
        Anmeldung fehlgeschlagen. Bitte erneut versuchen.
      </p>

      <div class="footer-text">
        HTL Wien West • Sicher lernen, Wissen schützen
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const error = route.query.error;

const googleLogin = () => {
  // ✅ Hosted Domain Hint: versucht Google-Login auf diese Domain zu beschränken
  // (Design bleibt gleich; nur Redirect-URL wird ergänzt)
  window.location.href = "/api/auth/google";
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0f1e;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.background-gradient {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at 30% 50%,
    rgba(239, 68, 68, 0.15) 0%,
    rgba(249, 115, 22, 0.1) 25%,
    transparent 50%
  );
  animation: gradientShift 15s ease infinite;
}

.background-pattern {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.03) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.3;
}

@keyframes gradientShift {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }

  50% {
    transform: translate(-10%, 10%) rotate(5deg);
  }
}

.card {
  background: linear-gradient(
    135deg,
    rgba(17, 24, 39, 0.95) 0%,
    rgba(31, 41, 55, 0.9) 100%
  );
  backdrop-filter: blur(20px);
  padding: 56px 48px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 100px rgba(239, 68, 68, 0.1);
  color: #e5e7eb;
  max-width: 480px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 1;
  animation: cardEntry 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes cardEntry {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.card-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.3),
    rgba(249, 115, 22, 0.3)
  );
  border-radius: 24px;
  opacity: 0;
  filter: blur(20px);
  z-index: -1;
  transition: opacity 0.5s;
}

.card:hover .card-glow {
  opacity: 1;
}

.logo {
  width: 200px;
  height: auto;
  margin: 0 auto 36px;
  display: block;
  filter: drop-shadow(0 12px 28px rgba(239, 68, 68, 0.6));
  animation: logoFloat 4s ease-in-out infinite;
  transition: transform 0.4s ease;
}

@keyframes logoFloat {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.logo:hover {
  transform: scale(1.08);
}

.brand-title {
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 20px rgba(239, 68, 68, 0.3));
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #d1d5db;
  letter-spacing: 0.3px;
}

.subtitle {
  font-size: 1.05rem;
  color: #9ca3af;
  margin-bottom: 36px;
  font-weight: 400;
}

.google-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 28px;
  width: 100%;
  max-width: 300px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #fff;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
  position: relative;
  overflow: hidden;
}

.google-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.google-btn:hover::before {
  opacity: 1;
}

.google-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
}

.google-btn:active {
  transform: translateY(0);
}

.google-btn img {
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  padding: 3px;
  position: relative;
  z-index: 1;
}

.google-btn span {
  position: relative;
  z-index: 1;
}

.footer-text {
  margin-top: 32px;
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
  letter-spacing: 0.3px;
}

@media (max-width: 600px) {
  .card {
    padding: 40px 32px;
  }

  .logo {
    width: 160px;
  }

  .brand-title {
    font-size: 2.2rem;
  }

  .title {
    font-size: 1.3rem;
  }
}

.error-msg {
  margin-top: 16px;
  color: #f87171;
  font-size: 0.95rem;
  font-weight: 600;
}
</style>
