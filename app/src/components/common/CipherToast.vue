<!-- Komponenta pro oznámení úspěšného zkopírování textu (zpětná vazba) -->
<template>
  <section class="toast" :class="{ show: show }">
    ✓ Text zkopírován do schránky
  </section>
</template>

<script>
import "@/assets/styles/common/toast.css";
export default {
  name: "CipherToast",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
