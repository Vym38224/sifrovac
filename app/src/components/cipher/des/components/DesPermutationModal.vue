<!-- Komponenta pro zobrazení permutačních tabulek DES -->
<template>
  <div 
    v-if="jeViditelny"
    class="ip-image-container"
    :class="modalClass"
    @click="zavrit"
  >
    <div class="ip-image-wrapper">
      <button class="ip-close-button" @click="zavrit">×</button>
      <img
        :src="cestaKObrazku"
        class="ip-image"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "DesPermutationModal",
  props: {
    tableType: {
      type: String,
      required: true
    },
    modalClass: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      jeViditelny: false
    };
  },
  computed: {
    cestaKObrazku() {
      return require(`@/assets/images/des/${this.tableType}.png`);
    },
  },
  methods: {
    otevrit() {
      this.jeViditelny = true;
    },
    zavrit() {
      this.jeViditelny = false;
    },
    prepnout() {
      this.jeViditelny = !this.jeViditelny;
    }
  }
};
</script>