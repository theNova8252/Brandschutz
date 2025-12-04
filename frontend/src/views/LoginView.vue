<template>
  <div class="page">
    <div class="card">
      <h1>Brandschutz Lernplattform</h1>
      <p>Bitte melde dich mit deinem Schul-Google-Konto an.</p>

      <button @click="googleLogin" class="google-btn">
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" />
        Mit Google anmelden
      </button>
    </div>
  </div>
</template>

<script setup>
const googleLogin = () => {
  window.location.href = 'http://localhost:5000/api/auth/google';
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
}

.card {
  background: #111827;
  padding: 32px 40px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  color: #e5e7eb;
  max-width: 420px;
  width: 100%;
  text-align: center;
}

h1 {
  margin-bottom: 8px;
}

p {
  margin-bottom: 24px;
  color: #9ca3af;
}

.google-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-radius: 999px;
  border: none;
  background: #4285f4;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
}

.google-btn img {
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  padding: 2px;
}
</style>
