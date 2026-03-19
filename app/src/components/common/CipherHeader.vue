<!-- Komponenta pro nadpis -->
<template>
  <header class="flex center">
    <h2>{{ title }}</h2>
    <img
      src="@/assets/images/icons/infoicon.png"
      alt="Info"
      width="14"
      height="16"
      class="info-icon"
      @click="$parent.zobrazitInfo = !$parent.zobrazitInfo"
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
