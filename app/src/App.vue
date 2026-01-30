<template>
  <SidebarView />
  <LampView />
  <router-view />
</template>

<script>
import SidebarView from "./components/layout/SidebarView.vue";
import LampView from "./components/layout/LampView.vue";
import "./assets/styles/base.css";

export default {
  name: "App",
  components: {
    SidebarView,
    LampView,
  },
};
</script>
