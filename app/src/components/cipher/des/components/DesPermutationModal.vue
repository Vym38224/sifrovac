<!-- Komponenta pro zobrazení permutačních tabulek DES -->
<template>
  <div 
    v-if="jeViditelny"
    class="ip-image-container"
    :class="[modalClass, { 'is-dragging': isDragging }]"
    :style="containerStyle"
    @click.self="zavrit"
  >
    <div class="ip-scrollable">
      <div class="ip-image-wrapper ip-draggable-handle" @mousedown="startDrag">
      <button class="ip-close-button" @click="zavrit">×</button>
      <img
        :src="cestaKObrazku"
        class="ip-image"
      />
      </div>
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
      jeViditelny: false,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      offsetX: 0,
      offsetY: 0
    };
  },
  computed: {
    cestaKObrazku() {
      return require(`@/assets/images/des/${this.tableType}.png`);
    },
    containerStyle() {
      return {
        '--drag-x': `${this.offsetX}px`,
        '--drag-y': `${this.offsetY}px`
      };
    }
  },
  methods: {
    otevrit() {
      this.offsetX = 0;
      this.offsetY = 0;
      this.jeViditelny = true;
    },
    zavrit() {
      this.jeViditelny = false;
    },
    prepnout() {
      this.jeViditelny = !this.jeViditelny;
    },
    startDrag(event) {
      if (event.button !== 0 || event.target.closest('.ip-close-button')) {
        return;
      }

      this.isDragging = true;
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
      event.preventDefault();
    },
    onDrag(event) {
      if (!this.isDragging) {
        return;
      }

      const deltaX = event.clientX - this.dragStartX;
      const deltaY = event.clientY - this.dragStartY;

      this.offsetX += deltaX;
      this.offsetY += deltaY;
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
    },
    stopDrag() {
      this.isDragging = false;
    }
  },
  mounted() {
    window.addEventListener('mousemove', this.onDrag);
    window.addEventListener('mouseup', this.stopDrag);
  },
  beforeUnmount() {
    window.removeEventListener('mousemove', this.onDrag);
    window.removeEventListener('mouseup', this.stopDrag);
  }
};
</script>