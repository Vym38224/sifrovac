<!-- Komponenta pro Sidebar -->
<template>
  <aside :class="['sidebar', { collapsed }]">
    <header class="flex center logo">
      <router-link to="/" exact-active-class="active">
        <img src="@/assets/images/logo/logo.png" alt="Logo" />
      </router-link>
      <h1 v-show="!collapsed">Šifrovač</h1>
    </header>
    <div class="flex center arrow arrow-btn" @click="arrowSidebar">
      <img src="@/assets/images/ui/arrow.png" />
    </div>
    <div
      v-if="collapsed"
      class="flex center arrow collapsed-arrow"
      @click="arrowSidebar"
    >
      <img src="@/assets/images/ui/arrow.png" />
    </div>
    <nav class="flex center menu column">
      <router-link class="flex center nav-link" to="/" exact-active-class="active">
        <img class="icon" src="@/assets/images/icons/home-bold.png" />
        <span class="label">Domovská stránka</span>
      </router-link>
      <router-link class="flex center nav-link" to="/caesar" exact-active-class="active">
        <img class="icon" src="@/assets/images/icons/wheel.png" />
        <span class="label">Posuvná šifra</span>
      </router-link>
      <router-link class="flex center nav-link" to="/affine" exact-active-class="active">
        <img class="icon" src="@/assets/images/icons/afinne.png" />
        <span class="label">Afinní šifra</span>
      </router-link>
      <router-link class="flex center nav-link" to="/substitution" exact-active-class="active">
        <img class="icon" src="@/assets/images/icons/shuffle.png" />
        <span class="label">Substituční šifra</span>
      </router-link>
      <router-link class="flex center nav-link" to="/vigenere" exact-active-class="active">
        <img class="icon" src="@/assets/images/icons/grid.png" />
        <span class="label">Vigenèrova šifra</span>
      </router-link>
      <router-link class="flex center nav-link" to="/stream" exact-active-class="active">
        <img class="icon" src="@/assets/images/icons/stream.png" />
        <span class="label">Proudová šifra</span>
      </router-link>
      <router-link class="flex center nav-link" to="/des" exact-active-class="active">
        <img class="icon" src="@/assets/images/icons/des.png" />
        <span class="label">DES</span>
      </router-link>
      <router-link class="flex center nav-link" to="/rsa" exact-active-class="active">
        <img class="icon" src="@/assets/images/icons/rsa.png" />
        <span class="label">RSA</span>
      </router-link>
    </nav>
  </aside>
</template>

<script>
import "@/assets/styles/layout/sidebar.css";
export default {
  name: "SidebarView",
  data() {
    return {
      collapsed: false,
    };
  },
  mounted() {
    this.onResize();
    window.addEventListener("resize", this.onResize);
  },
  methods: {
    // mění collapsed dle velikosti okna
    onResize() {
      if (window.innerWidth < 1400) {
        this.collapsed = true;
      } else {
        this.collapsed = false;
      }
    },
    // mění collapsed dle kliknutí uřivatele na šipku
    arrowSidebar() {
      if (window.innerWidth < 1400) {
        this.collapsed = true;
        return;
      }
      this.collapsed = !this.collapsed;
    },
  },
};
</script>
