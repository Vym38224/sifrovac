<!-- Komponenta pro vizualizaci jednotlivých kroků generování rundovního klíče DES -->
<template>
  <div class="des viz-step flex column center">
    <div class="step-description">
      <button 
        @click="zavrit" 
        class="gen rund-key bold" 
        style="margin-top:5px;"
      >
        Zpět na šifrování / dešifrování
      </button>
    </div>

    <h3 class="step-description primary-color" style="padding-top:5px;">
      Generování rundovního klíče
    </h3>

    <div class="binary-display-wrapper">
      <h4 style="opacity: 85%; font-size: 14px">
        {{ nadpisKlice }}
      </h4>
      <div class="binary flex column center" style="padding-top: 2.5px; padding-right:41px;">
        <code class="binary-display">
          <span style="font-family: 'Inter'; font-size:11px;">Left:</span> {{ leftBinary }}
        </code>
        <code class="binary-display" style="padding-right: 7px;">
          <span style="font-family: 'Inter'; font-size:11px;">Right:</span> {{ rightBinary }}
        </code>
      </div>
    </div>

    <div class="step-description">
      <h4>
        Permutace 
        <a
          class="primary-color without-underline"
          href="#PC1"
          @click.prevent="$refs.pc1Modal.prepnout()"
        >
          PC-1
        </a>
      </h4>
    </div>

    <DesPermutationModal ref="pc1Modal" table-type="PC1" modal-class="pc1" />

    <div class="expansion-result">
      <code class="binary-display">{{ key56AfterPC1 }}</code>
    </div>

    <div class="step-description">
      <h4>
        Rozdělení na 
        <a class="tertiary-color">C<sub>0</sub></a>
        a 
        <a class="tertiary-color">D<sub>0</sub></a>
      </h4>
    </div>

    <div class="expansion-result" style="gap:7px;">
      <code class="binary-display tertiary-color">{{ c0 }}</code>I
      <code class="binary-display tertiary-color">{{ d0 }}</code>
    </div>

    <div class="step-description">
      <h4>
        Rotace doleva o 1 bit u 
        <a class="tertiary-color">C<sub>0</sub></a>
        i 
        <a class="tertiary-color">D<sub>0</sub></a>
      </h4>
    </div>

    <div class="expansion-result" style="gap:7px;">
      <code class="binary-display tertiary-color">{{ c1 }}</code>I
      <code class="binary-display tertiary-color">{{ d1 }}</code>
    </div>

    <div class="step-description">
      <h4>
        Permutace 
        <a
          class="primary-color without-underline"
          href="#PC2"
          @click.prevent="$refs.pc2Modal.prepnout()"
        >
          PC-2
        </a>
        nám vytvoří 
        <a class="primary-color without-underline">rundovní klíč</a>
      </h4>
    </div>

    <DesPermutationModal ref="pc2Modal" table-type="PC2" modal-class="pc2" />

    <div class="expansion-result">
      <code
        class="binary-display primary-color"
        v-for="(chunk, index) in roundKey"
        :key="index"
      >
        {{ chunk }}
      </code>
    </div>
  </div>
</template>

<script>
import DesBinaryDisplay from './DesBinaryDisplay.vue';
import DesPermutationModal from './DesPermutationModal.vue';

export default {
  name: "DesRoundKeyGeneration",
  components: {
    DesBinaryDisplay,
    DesPermutationModal
  },
  props: {
    keyText: String,
    keyBinary: String,
    key56AfterPC1: String,
    c0: String,  
    d0: String,    
    c1: String,     
    d1: String,
    roundKey: Array
  },
  computed: {
    nadpisKlice() {
      return `Klíč (${this.keyText}) v binární podobě a rozdělený na Left a Right`;
    },
    leftBinary() {
      const chunks = this.keyBinary.split(" ");
      return chunks.slice(0, 4).join(" ");
    },
    rightBinary() {
      const chunks = this.keyBinary.split(" ");
      return chunks.slice(4, 8).join(" ");
    }
  },
  methods: {
    zavrit() {
      this.$parent.skrytRundovniKlic();
    }
  }
};
</script>