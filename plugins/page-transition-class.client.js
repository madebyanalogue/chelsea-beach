export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();

  router.beforeEach((to, from, next) => {
    document.body.classList.add('page-out');
    next();
  });

  router.afterEach(() => {
    document.body.classList.remove('page-out');
    document.body.classList.add('page-in');
    setTimeout(() => {
      document.body.classList.remove('page-in');
    }, 500); // Adjust duration to match your transition
  });
});