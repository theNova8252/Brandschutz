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
        HTL Wien West • Technik · Umwelt · Digitalisierung
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
  background: var(--bg);
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
    rgba(249, 115, 22, 0.06) 0%,
    transparent 50%
  );
  animation: gradientShift 15s ease infinite;
}

.background-pattern {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
      rgba(0, 0, 0, 0.02) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.5;
}

@keyframes gradientShift {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-10%, 10%) rotate(5deg); }
}

.card {
  background: var(--bg-card);
  padding: 56px 48px;
  border-radius: 20px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
  color: var(--text);
  max-width: 480px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 1;
  animation: cardEntry 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes cardEntry {
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.card-glow {
  display: none;
}

.logo {
  width: 200px;
  height: auto;
  margin: 0 auto 36px;
  display: block;
  filter: drop-shadow(0 8px 20px rgba(249, 115, 22, 0.2));
  animation: logoFloat 4s ease-in-out infinite;
  transition: transform 0.4s ease;
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.logo:hover {
  transform: scale(1.08);
}

.brand-title {
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
  color: #f97316;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
}

.subtitle {
  font-size: 1.05rem;
  color: var(--text-muted);
  margin-bottom: 36px;
  font-weight: 400;
}

.google-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 52px;
  padding: 14px 28px;
  width: 100%;
  max-width: 300px;
  border-radius: 12px;
  border: none;
  background: #f97316;
  color: #fff;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
  overflow: hidden;
}

.google-btn::before {
  display: none;
}

.google-btn:hover {
  background: #ea580c;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.3);
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
  color: var(--text-faint);
  font-weight: 500;
  letter-spacing: 0.3px;
  overflow-wrap: anywhere;
}

@media (max-width: 600px) {
  .card {
    padding: 36px 24px;
    border-radius: 16px;
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

  .subtitle {
    font-size: 0.98rem;
    margin-bottom: 28px;
  }

  .google-btn {
    max-width: none;
    padding-inline: 18px;
  }

  .footer-text {
    margin-top: 24px;
    font-size: 0.8rem;
  }
}

.error-msg {
  margin-top: 16px;
  color: var(--danger);
  font-size: 0.95rem;
  font-weight: 600;
}
</style>
