<template>
  <div class="page">
    <div class="header">
      <div>
        <h1 class="title">Benutzerverwaltung</h1>
        <p class="subtitle">Admin-Uebersicht ueber Benutzer, Rollen und Status.</p>
      </div>

      <div class="actions">
        <button type="button" class="btn" @click="downloadCsv">CSV</button>
        <button type="button" class="btn btn-ghost" @click="refresh">Neu laden</button>
      </div>
    </div>

    <div class="toolbar">
      <div class="search">
        <span class="search-icon">Suchen</span>
        <input
          v-model="filter"
          class="search-input"
          placeholder="Suchen nach Name, Email, Rolle oder Status..."
        />
      </div>

      <div class="sort">
        <span class="sort-label">Sortieren:</span>
        <button type="button" class="chip" :class="{ active: sortBy === 'name' }" @click="setSort('name')">
          Name <span class="arrow">{{ sortArrow('name') }}</span>
        </button>
        <button type="button" class="chip" :class="{ active: sortBy === 'email' }" @click="setSort('email')">
          Email <span class="arrow">{{ sortArrow('email') }}</span>
        </button>
        <button type="button" class="chip" :class="{ active: sortBy === 'status' }" @click="setSort('status')">
          Status <span class="arrow">{{ sortArrow('status') }}</span>
        </button>
        <button
          type="button"
          class="chip"
          :class="{ active: sortBy === 'createdAt' }"
          @click="setSort('createdAt')"
        >
          Erstellt <span class="arrow">{{ sortArrow('createdAt') }}</span>
        </button>
      </div>
    </div>

    <p v-if="store.error" class="info error">
      {{ store.error }}
    </p>

    <div class="card">
      <div class="card-head">
        <div class="card-title">
          <span class="dot"></span>
          Benutzerliste
        </div>
        <div class="card-meta">
          <span class="meta-pill">{{ filtered.length }} Benutzer</span>
        </div>
      </div>

      <div v-if="store.loading" class="state">
        <div class="spinner"></div>
        <p>Lade Benutzer...</p>
      </div>

      <div v-else-if="!filtered.length" class="state">
        <p class="state-title">Keine Treffer</p>
        <p class="state-sub">Passe den Filter an oder lade neu.</p>
      </div>

      <div v-else>
        <div class="table-wrap desktop-table">
          <table class="table">
            <thead>
              <tr>
                <th @click="setSort('name')">Name</th>
                <th @click="setSort('email')">Email</th>
                <th>Rollen</th>
                <th @click="setSort('status')">Status</th>
                <th @click="setSort('createdAt')">Erstellt</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="u in filtered" :key="u.id">
                <td class="cell-strong">
                  <div class="user">
                    <img class="avatar" :src="avatarUrl(u)" alt="Avatar" />
                    <div class="user-meta">
                      <div class="user-name">{{ u.name || '-' }}</div>
                      <div class="user-id">ID: {{ u.id }}</div>
                    </div>
                  </div>
                </td>

                <td class="mono">{{ u.email }}</td>

                <td>
                  <div class="roles">
                    <span
                      v-for="r in u.roles"
                      :key="r"
                      class="role-pill"
                      :class="{ admin: r === 'ADMIN' }"
                    >
                      {{ r }}
                    </span>
                    <span v-if="!u.roles?.length" class="role-pill muted">-</span>
                  </div>
                </td>

                <td>
                  <span class="status" :class="statusClass(u.status)">
                    <span class="status-dot"></span>
                    {{ u.status || 'Nicht begonnen' }}
                  </span>
                </td>

                <td class="mono">{{ formatDate(u.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mobile-users">
          <article v-for="u in filtered" :key="`mobile-${u.id}`" class="mobile-user-card">
            <div class="mobile-user-head">
              <div class="user">
                <img class="avatar" :src="avatarUrl(u)" alt="Avatar" />
                <div class="user-meta">
                  <div class="user-name">{{ u.name || '-' }}</div>
                  <div class="user-id">ID: {{ u.id }}</div>
                </div>
              </div>

              <span class="status" :class="statusClass(u.status)">
                <span class="status-dot"></span>
                {{ u.status || 'Nicht begonnen' }}
              </span>
            </div>

            <div class="mobile-user-grid">
              <div class="mobile-user-row">
                <span class="mobile-label">Email</span>
                <span class="mono mobile-value">{{ u.email }}</span>
              </div>

              <div class="mobile-user-row">
                <span class="mobile-label">Rollen</span>
                <div class="roles">
                  <span
                    v-for="r in u.roles"
                    :key="`${u.id}-${r}`"
                    class="role-pill"
                    :class="{ admin: r === 'ADMIN' }"
                  >
                    {{ r }}
                  </span>
                  <span v-if="!u.roles?.length" class="role-pill muted">-</span>
                </div>
              </div>

              <div class="mobile-user-row">
                <span class="mobile-label">Erstellt</span>
                <span class="mono mobile-value">{{ formatDate(u.createdAt) }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <div class="card-title">
          <span class="dot dot-purple"></span>
          ADMIN Rolle verwalten
        </div>
        <div class="card-meta">
          <span class="hint">Eine Email pro Zeile</span>
        </div>
      </div>

      <div class="role-grid">
        <textarea
          v-model="emailsText"
          class="textarea"
          placeholder="max.mustermann@htlwienwest.at&#10;..."
        ></textarea>

        <div class="role-actions">
          <button type="button" class="btn btn-green" @click="makeAdmin">ADMIN vergeben</button>
          <button type="button" class="btn btn-red" @click="removeAdmin">ADMIN entfernen</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../stores/userStore";

const store = useUserStore();

const filter = ref("");
const sortBy = ref("name");
const sortDir = ref("asc");
const emailsText = ref("");

onMounted(() => store.fetchUsers());

const refresh = () => store.fetchUsers();

const filtered = computed(() => {
  let data = store.users;

  if (filter.value) {
    const f = filter.value.toLowerCase();
    data = data.filter(
      (u) =>
        u.name?.toLowerCase().includes(f) ||
        u.email?.toLowerCase().includes(f) ||
        u.roles?.join(",").toLowerCase().includes(f) ||
        u.status?.toLowerCase().includes(f)
    );
  }

  return [...data].sort((a, b) => {
    const dir = sortDir.value === "asc" ? 1 : -1;
    const av = a[sortBy.value] ?? "";
    const bv = b[sortBy.value] ?? "";
    return av > bv ? dir : av < bv ? -dir : 0;
  });
});

const setSort = (key) => {
  if (sortBy.value === key) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = key;
    sortDir.value = "asc";
  }
};

const sortArrow = (key) => {
  if (sortBy.value !== key) return "<>";
  return sortDir.value === "asc" ? "^" : "v";
};

const parseEmails = () =>
  emailsText.value
    .split("\n")
    .map((e) => e.trim())
    .filter(Boolean);

const makeAdmin = async () => {
  await store.grantRole(parseEmails(), "ADMIN");
  refresh();
};

const removeAdmin = async () => {
  await store.removeRole(parseEmails(), "ADMIN");
  refresh();
};

const downloadCsv = () => {
  const rows = filtered.value;
  const csv = [
    "id;name;email;roles;status;createdAt",
    ...rows.map(
      (u) =>
        `${u.id};${u.name};${u.email};${(u.roles || []).join(",")};${u.status};${u.createdAt}`
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "users.csv";
  a.click();
  URL.revokeObjectURL(url);
};

const formatDate = (d) => (d ? new Date(d).toLocaleString() : "-");

const statusClass = (status) => {
  if (status === "Abgeschlossen") return "done";
  if (status === "In Bearbeitung") return "progress";
  return "none";
};

const avatarUrl = (u) => {
  const seed = encodeURIComponent(u?.name || u?.email || "User");
  return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}`;
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
  padding: 64px 24px;
  color: #f8fafc;
}

.header {
  max-width: 1200px;
  margin: 0 auto 18px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.title {
  margin: 0;
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: 8px 0 0;
  color: #94a3b8;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.toolbar {
  max-width: 1200px;
  margin: 18px auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.search {
  flex: 1;
  min-width: 260px;
  min-height: 52px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.18);
  backdrop-filter: blur(10px);
}

.search-icon {
  color: #cbd5e1;
  font-weight: 600;
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #e5e7eb;
  font-size: 1rem;
}

.sort {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.sort-label {
  color: #94a3b8;
  font-size: 0.9rem;
}

.chip {
  min-height: 44px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(30, 41, 59, 0.35);
  color: #e5e7eb;
  padding: 9px 12px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.85rem;
  transition: transform 0.15s ease, border-color 0.2s ease;
}

.chip:hover {
  transform: translateY(-1px);
  border-color: rgba(148, 163, 184, 0.35);
}

.chip.active {
  border-color: rgba(96, 165, 250, 0.55);
  box-shadow: 0 0 0 1px rgba(96, 165, 250, 0.15);
}

.arrow {
  opacity: 0.8;
  margin-left: 6px;
}

.card {
  max-width: 1200px;
  margin: 0 auto 18px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.65) 100%);
  border-radius: 22px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  backdrop-filter: blur(12px);
  overflow: hidden;
}

.card-head {
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #60a5fa;
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.12);
}

.dot-purple {
  background: #a78bfa;
  box-shadow: 0 0 0 4px rgba(167, 139, 250, 0.12);
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.meta-pill {
  font-size: 0.85rem;
  font-weight: 700;
  color: #cbd5e1;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(2, 6, 23, 0.35);
}

.hint {
  color: #94a3b8;
  font-size: 0.9rem;
}

.table-wrap {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  min-width: 860px;
}

th,
td {
  padding: 14px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  text-align: left;
  vertical-align: middle;
}

th {
  position: sticky;
  top: 0;
  background: rgba(2, 6, 23, 0.65);
  backdrop-filter: blur(12px);
  color: #cbd5e1;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
}

tbody tr:hover {
  background: rgba(96, 165, 250, 0.06);
}

.cell-strong {
  font-weight: 700;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
    monospace;
  color: #e5e7eb;
  font-size: 0.92rem;
}

.user {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 2px solid rgba(96, 165, 250, 0.55);
  background: #020617;
  flex-shrink: 0;
}

.user-meta {
  min-width: 0;
}

.user-name {
  font-weight: 800;
  overflow-wrap: anywhere;
}

.user-id {
  margin-top: 2px;
  font-size: 0.8rem;
  color: #94a3b8;
}

.roles {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.role-pill {
  font-size: 0.8rem;
  font-weight: 800;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(2, 6, 23, 0.3);
  color: #cbd5e1;
}

.role-pill.admin {
  border-color: rgba(239, 68, 68, 0.45);
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.08);
}

.role-pill.muted {
  opacity: 0.7;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 7px 12px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border: 1px solid transparent;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.status.none {
  color: #cbd5e1;
  background: rgba(148, 163, 184, 0.12);
  border-color: rgba(148, 163, 184, 0.2);
}

.status.progress {
  color: #fbbf24;
  background: rgba(234, 179, 8, 0.12);
  border-color: rgba(234, 179, 8, 0.25);
}

.status.done {
  color: #4ade80;
  background: rgba(34, 197, 94, 0.12);
  border-color: rgba(34, 197, 94, 0.25);
}

.mobile-users {
  display: none;
}

.mobile-user-card {
  border-top: 1px solid rgba(148, 163, 184, 0.12);
  padding: 16px 18px;
  background: rgba(2, 6, 23, 0.2);
}

.mobile-user-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.mobile-user-grid {
  display: grid;
  gap: 12px;
}

.mobile-user-row {
  display: grid;
  gap: 6px;
}

.mobile-label {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
}

.mobile-value {
  overflow-wrap: anywhere;
}

.role-grid {
  padding: 16px 18px 18px;
  display: grid;
  gap: 12px;
}

.textarea {
  width: 100%;
  min-height: 130px;
  resize: vertical;
  border-radius: 16px;
  padding: 12px 14px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(2, 6, 23, 0.35);
  color: #e5e7eb;
  outline: none;
  font-size: 16px;
}

.role-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  min-height: 46px;
  border: none;
  cursor: pointer;
  padding: 10px 14px;
  border-radius: 14px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 10px 26px rgba(37, 99, 235, 0.25);
  transition: transform 0.12s ease, box-shadow 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 34px rgba(37, 99, 235, 0.32);
}

.btn:active {
  transform: translateY(0);
}

.btn-ghost {
  background: rgba(148, 163, 184, 0.12);
  color: #e5e7eb;
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: none;
}

.btn-green {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  box-shadow: 0 10px 26px rgba(34, 197, 94, 0.18);
}

.btn-red {
  background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
  box-shadow: 0 10px 26px rgba(239, 68, 68, 0.18);
}

.info {
  max-width: 1200px;
  margin: 10px auto 18px;
  color: #94a3b8;
}

.info.error {
  color: #f87171;
}

.state {
  padding: 28px 18px;
  display: grid;
  place-items: center;
  gap: 10px;
  color: #94a3b8;
}

.state-title {
  font-weight: 900;
  color: #e5e7eb;
}

.state-sub {
  margin-top: -6px;
}

.spinner {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 3px solid rgba(148, 163, 184, 0.25);
  border-top-color: rgba(96, 165, 250, 0.9);
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 820px) {
  .page {
    padding: 28px 16px 40px;
  }

  .title {
    font-size: clamp(1.9rem, 7vw, 2.3rem);
  }

  .subtitle {
    font-size: 0.95rem;
  }

  .actions,
  .toolbar,
  .sort,
  .role-actions {
    width: 100%;
  }

  .actions .btn,
  .role-actions .btn {
    flex: 1 1 100%;
  }

  .search {
    min-width: 100%;
  }

  .sort-label {
    width: 100%;
  }

  .chip {
    flex: 1 1 calc(50% - 10px);
    justify-content: center;
  }

  .desktop-table {
    display: none;
  }

  .mobile-users {
    display: grid;
  }

  .mobile-user-card:first-child {
    border-top: none;
  }

  .mobile-user-head {
    flex-direction: column;
    align-items: stretch;
  }

  .status {
    width: fit-content;
    max-width: 100%;
  }

  .card-head,
  .card-meta {
    align-items: flex-start;
  }
}

@media (max-width: 520px) {
  .chip {
    flex-basis: 100%;
  }

  .mobile-user-card {
    padding: 14px 16px;
  }
}
</style>
