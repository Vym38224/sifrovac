<!-- Komponenta při NotFound 404 -->
<template>
  <main class="container flex">
    <div class="content-404">
      <h1 class="primary-color">404</h1>
      <h2 class="secondary-color">Stránka nenalezena</h2>
      <p>Omlouváme se, ale stránka kterou hledáte neexistuje.</p>
      <router-link to="/" class="btn-view neutral-color">
        <img src="@/assets/images/icons/home-bold.png" alt="Domů" />
        Zpět na Domovskou stránku
      </router-link>
    </div>
  </main>
</template>

<script>
export default {
  name: "NotFoundView",
};
</script>

<style scoped>
@import "@/assets/styles/layout/notfound.css";
</style>
