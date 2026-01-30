<!-- Komponenta pro tmavý/světlý motiv -->
<template>
  <button @click="toggleTheme" class="theme-toggle">
    <span v-if="isDark">
      <img src="@/assets/images/ui/brightness.png" />
    </span>
    <span v-else>
      <img src="@/assets/images/ui/moon.png" />
    </span>
  </button>
</template>

<script>
import "@/assets/styles/layout/lamp.css";
export default {
  name: "LampView",
  data() {
    return {
      isDark: false,
    };
  },
  methods: {
    // přepne mezi tmavým a světlým motivem
    toggleTheme() {
      this.isDark = !this.isDark;
      
      if (this.isDark) {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
      }
      
      if (this.isDark) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    },
    // načte uložený motiv z localStorage při načtení stránky
    loadTheme() {
      const ulozenyMotiv = localStorage.getItem("theme");
      
      if (ulozenyMotiv) {
        if (ulozenyMotiv === "dark") {
          this.isDark = true;
        } else {
          this.isDark = false;
        }
      }
      
      if (this.isDark) {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
      }
    },
  },
  mounted() {
    this.loadTheme();
  },
};
</script>