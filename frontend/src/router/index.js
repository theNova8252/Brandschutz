import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import ChaptersView from "../views/ChaptersView.vue";
import ChapterDetailView from "../views/ChapterDetailView.vue";
import UsersView from "../views/UsersView.vue";
import { useUserStore } from "../stores/userStore";

const routes = [
  { path: "/", redirect: "/login" },

  { path: "/login", component: LoginView, meta: { guestOnly: true } },

  { path: "/chapters", component: ChaptersView, meta: { requiresAuth: true } },

  {
    path: "/chapters/:slug",
    name: "chapter-detail",
    component: ChapterDetailView,
    props: true,
    meta: { requiresAuth: true },
  },

  {
    path: "/users",
    component: UsersView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const userStore = useUserStore();

  if (!userStore.user) {
    await userStore.fetchMe();
  }

  const isLoggedIn = userStore.isLoggedIn;

  if (to.meta.guestOnly && isLoggedIn) {
    return "/chapters";
  }

  if (to.meta.requiresAuth && !isLoggedIn) {
    return "/login";
  }

  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    return "/chapters";
  }

  return true;
});

export default router;
