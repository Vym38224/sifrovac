<!-- Komponenta pro nadpis -->
<template>
  <header class="flex center">
    <h2>{{ title }}</h2>
    <img
      src="@/assets/images/icons/infoicon.png"
      alt="Info"
      class="info-icon"
      @click="$parent.zobrazitInfo = true"
    />
  </header>
</template>

<script>
import "@/assets/styles/common/header.css";
export default {
  name: "CipherHeader",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
