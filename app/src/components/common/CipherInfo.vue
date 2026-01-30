<!-- Komponenta pro zobrazení informací o šifře -->
<template>
  <transition name="fade">
    <div v-if="show" class="info-overlay" role="dialog">
      <article class="info-article">
        <button
          class="close-btn delete-background neutral-color"
          @click="$parent.zobrazitInfo = false"
        >
        <!-- &times; je × jako symbol pro zavření okna -->
          &times; 
        </button>
        <slot></slot>
      </article>
    </div>
  </transition>
</template>

<script>
import "@/assets/styles/common/info.css";
export default {
  name: "CipherInfo",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
