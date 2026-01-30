<!-- Komponenta pro zobrazení okna S-boxu v DES -->
<template>
  <div
    v-if="sboxNumber !== null"
    class="ip-image-container sbox"
    @click.self="zavrit"
  >
    <div class="sbox-modal-wrapper">
      <button class="sbox ip-close-button" @click="zavrit">×</button>
      
      <div class="sbox-modal-content">
        <h3>S-box {{ sboxNumber }}</h3>

        <legend class="sbox-legend flex">
          <span>řádek: první a poslední bit vstupu, </span>
          <span>sloupec: prostřední čtyři bity vstupu</span>
        </legend>
        
        <table class="sbox-table">
          <thead>
            <tr>
              <th class="corner-cell"></th>
              <th 
                v-for="col in 16" 
                :key="'col-' + col" 
                class="col-header"
                :class="{ 'selected-cell': jeSloupecZvyraznen(col - 1) }"
              >
                {{ (col - 1).toString(2).padStart(4, '0') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in ziskatDataSBoxu()" :key="'row-' + rowIndex">
              <th 
                class="row-header"
                :class="{ 'selected-cell': jeRadekZvyraznen(rowIndex) }"
              >
                {{ rowIndex.toString(2).padStart(2, '0') }}
              </th>
              <td 
                v-for="(value, colIndex) in row" 
                :key="'cell-' + colIndex"
                :class="{ 'selected-cell bold': jeBunkaVybrana(rowIndex, colIndex) }"
              >
                <div class="cell-content">
                  <span class="decimal-value">{{ value }}</span>
                  <span class="binary-value">{{ value.toString(2).padStart(4, '0') }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
// S-boxy 
import { S_BOXES } from '../../../../utils/constants/sboxes.js';

export default {
  name: "DesSboxModal",
  data() {
    return {
      sboxNumber: null, // číslo aktuálně zobrazeného S-boxu
      inputBits: null, // 6-bitový vstup pro S-box
    };
  },
  computed: {
    vybranRadek() {
      if (!this.inputBits) return null;
      return parseInt(this.inputBits[0] + this.inputBits[5], 2);
    },
    vybranSloupec() {
      if (!this.inputBits) return null;
      return parseInt(this.inputBits.slice(1, 5), 2);
    },
  },
  methods: {
    otevrit(number, bits = null) {
      this.sboxNumber = number;
      this.inputBits = bits;
    },
    zavrit() {
      this.sboxNumber = null;
      this.inputBits = null;
    },
    ziskatDataSBoxu() {
      return S_BOXES[this.sboxNumber - 1];
    },
    jeRadekZvyraznen(rowIndex) {
      return this.vybranRadek === rowIndex;
    },
    jeSloupecZvyraznen(colIndex) {
      return this.vybranSloupec === colIndex;
    },
    jeBunkaVybrana(rowIndex, colIndex) {
      return this.vybranRadek === rowIndex && this.vybranSloupec === colIndex;
    },
  },
};
</script>

<style scoped>
@import "@/assets/styles/cipher/des/des_sbox.css";
</style>