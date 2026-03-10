<!-- Komponenta pro zobrazení informací o šifře -->
<template>
  <transition name="fade">
    <div v-if="show" class="info-overlay" role="dialog">
      <article
        class="info-article"
        :style="{ top: posY + 'px', left: posX + 'px' }"
      >
        <div class="info-drag-handle" @mousedown.prevent="startDrag">
          <span class="drag-handle-spacer"></span>
          <img src="@/assets/images/icons/infoicon.png" alt="Info" class="drag-info-icon" />
          <button
            class="close-btn delete-background neutral-color"
            @click="$parent.zobrazitInfo = false"
            @mousedown.stop
          >
            &times;
          </button>
        </div>
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
  data () {
    return {
      posX: 170,
      posY: 73,
      dragging: false,
      dragOffsetX: 0,
      dragOffsetY: 0
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.$nextTick(() => {
          const viz = document.querySelector('.secondary-content')
          const panel = this.$el && this.$el.querySelector('.info-article')
          const panelWidth = panel ? panel.offsetWidth : 500
          const gap = 8
          if (viz) {
            const rect = viz.getBoundingClientRect()
            this.posX = Math.max(0, rect.left - panelWidth - gap)
          } else {
            this.posX = 230
          }
          this.posY = 73
        })
      }
    }
  },
  methods: {
    startDrag (e) {
      this.dragging = true
      this.dragOffsetX = e.clientX - this.posX
      this.dragOffsetY = e.clientY - this.posY
      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.stopDrag)
    },
    onDrag (e) {
      if (!this.dragging) return
      this.posX = e.clientX - this.dragOffsetX
      this.posY = e.clientY - this.dragOffsetY
    },
    stopDrag () {
      this.dragging = false
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDrag)
    }
  },
  beforeDestroy () {
    document.removeEventListener('mousemove', this.onDrag)
    document.removeEventListener('mouseup', this.stopDrag)
  }
}
</script>
