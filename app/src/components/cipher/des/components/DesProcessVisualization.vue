<!-- Komponenta pro vizualizaci jednotlivých kroků DES procesu, té složitější strany -->
<template>
  <div class="des viz-step flex column center">
    <div>
      <span class="tertiary-color bold">
        {{ isDecryption ? 'L' : 'R' }}<sub>{{ isDecryption ? '1' : '0' }}</sub>
      </span>
      <code class="binary-display next tertiary-color">{{ inputBinary }}</code>
    </div>

    <div class="step-description">
      <h4>
        Expanzní permutace
        <a
          class="primary-color without-underline"
          href="#E"
          @click.prevent="$refs.eModal.prepnout()"
        >
          E
        </a>
      </h4>
    </div>

    <DesPermutationModal ref="eModal" table-type="E" modal-class="e" />

    <div class="expansion-result">
      <code
        class="binary-display"
        v-for="(chunk, index) in expandedInput"
        :key="index"
      >
        {{ chunk }}
      </code>
    </div>

    <div class="step-description">
      <button 
        @click="$parent.zobrazRundovniKlic()"
        class="rund-key bold"
      >
        XOR s rundovním klíčem
      </button>
    </div>

    <div class="expansion-result">
      <code
        class="binary-display"
        v-for="(chunk, index) in xorResult"
        :key="index"
      >
        {{ chunk }}
      </code>
    </div>

    <div class="step-description">
      <div class="sbox-grid">
        <div
          class="sbox-item"
          v-for="i in 8"
          :key="i"
          @click="otevritSboxModal(i - 1)" 
          
        >
          <span class="sbox-label">S-box {{ i }}</span>
          <div class="flex column center">
            <small>6 bitů</small>
            <span class="arrow-down">↓</span>
            <small>4 bity</small>
          </div>
        </div>
      </div>
    </div>
    <DesSboxModal ref="sboxModal" /> 

    <div class="sbox-result">
      <code
        class="binary-display"
        v-for="(nibble, index) in sboxOutput"
        :key="'sbox-' + index"
      >
        {{ nibble }}
      </code>
    </div>

    <div class="step-description">
      <h4>
        Permutace podle
        <a
          class="primary-color without-underline"
          href="#P"
          @click.prevent="$refs.pModal.prepnout()"
        >
          P-boxu
        </a>
      </h4>
    </div>

    <DesPermutationModal ref="pModal" table-type="P" modal-class="p" />

    <div class="expansion-result">
      <code class="binary-display wide">{{ pboxOutput }}</code>
    </div>

    <div class="step-description">
      <h4>
        XOR s druhou polovinou
        <span
          class="tertiary-color"
        >
          {{ isDecryption ? 'R' : 'L' }}<sub>{{ isDecryption ? '1' : '0' }}</sub>
        </span>
        nám vytvoří
        <span class="primary-color bold">
          {{ isDecryption ? 'L' : 'R' }}<sub>{{ isDecryption ? '0' : '1' }}</sub>
        </span>
      </h4>
    </div>

    <div>
      <code class="binary-display primary-color">{{ outputResult }}</code>
    </div>
  </div>
</template>

<script>
import DesPermutationModal from './DesPermutationModal.vue';
import DesSboxModal from './DesSboxModal.vue';

export default {
  name: "DesProcessVisualization",
  components: {
    DesPermutationModal,
    DesSboxModal
  },
  props: {
    inputBinary: {
      type: String,
      required: true
    },
    expandedInput: {
      type: Array,
      required: true
    },
    xorResult: {
      type: Array,
      required: true
    },
    sboxOutput: {
      type: Array,
      required: true
    },
    pboxOutput: {
      type: String,
      required: true
    },
    outputResult: {
      type: String,
      required: true
    },
    isDecryption: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    otevritSboxModal(index) {
      const inputBits = this.xorResult[index]; // vstup pro daný S-box
      this.$refs.sboxModal.otevrit(index+1, inputBits); // refs pro přímý přístup k DesSboxModal, index+1 protože S-boxy jsou číslovány od 1
    }
  }
};
</script>