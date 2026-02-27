
<!-- Komponenta pro zobrazení binárních dat v DES s volitelným počítadlem bitů a nadpisem -->
<template>
  <div class="binary-display-wrapper" style="opacity: 85%; font-size: 14px">
    <h4 v-if="title" :class="{ 'warning-color': titleWarning }">
      {{ title }}
      <slot name="link"></slot>
      <small v-if="showCount">
        {{ count }}
      </small>
    </h4>
    <div class="binary flex column center" style="padding-top: 4.2px; gap:1.5px; font-size: 13.5px">
      <code 
        v-for="(line, index) in naformatovaneRadky" 
        :key="index"
        class="binary-display"
      >
        {{ line }}
      </code>
    </div>
  </div>
</template>

<script>
export default {
  name: "DesBinaryDisplay",
  props: {
    binaryData: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ""
    },
    titleWarning: {
      type: Boolean,
      default: false
    },
    showCount: {
      type: Boolean,
      default: false
    },
    count: {
      type: String,
      default: ""
    },

  },
  computed: {
    naformatovaneRadky() {
      const chunks = this.binaryData.split(" ");
      const lines = [];
      for (let i = 0; i < chunks.length; i += 4) {
        lines.push(chunks.slice(i, i + 4).join(" "));
      }
      return lines;
    }
  }
};
</script>