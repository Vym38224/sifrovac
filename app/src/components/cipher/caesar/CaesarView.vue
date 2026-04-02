<template>
  <main class="container flex">

    <!-- 1.část: VSTUP UŽIVATELE -->
    <section class="content flex">

      <!-- Komponenta pro nadpis -->
      <CipherHeader title="Posuvná šifra" />

      <!-- Formulář pro nastavení parametrů -->
      <form class="params flex">
        <label style="padding-top:1px;" for="shift-slider">Zvolte klíč šifry:</label>
        <input
          id="shift-slider"
          type="range"
          class="form-range"
          min="0"
          max="25"
          step="1"
          v-model.number="shift"
          @input="rotateWheel"
        />
        <input
          id="shift-number"
          type="number"
          min="0"
          max="25"
          v-model.number="shift"
          class="input"
          @keydown="blokujNeciselnePismena"
        />
      </form>

      <!-- Komponenta pro textový vstup a výstup -->
      <CipherTextarea
        :vstupni-text="vstupniText"
        :vystupni-text="vystupniText"
      />

      <!-- Komponenta pro oznámení úspěšného zkopírování textu (zpětná vazba) -->
      <CipherToast :show="zobrazitToast" />

      <!-- Komponenta pro tlačítka -->
      <CipherButtons />

    </section>

    <!-- 2.část: VIZUALIZACE -->
    <aside class="caesar secondary-content flex">
      <img alt="Vnější kolo" class="wheel outer" fetchpriority="high"/>
      <img
        alt="Vnitřní kolo"
        class="wheel inner"
        fetchpriority="high"
        :style="{ transform: 'rotate(' + wheelAngle + 'deg)' }"
      />
    </aside>

    <!-- Komponenta pro zobrazení informací o šifře -->
    <CipherInfo :show="zobrazitInfo">
      <CaesarInfoContent />
    </CipherInfo>

  </main>
</template>

<script>
import { encrypt, decrypt } from '@/utils/ciphers/caesar';
import CaesarInfoContent from './components/CaesarInfoContent.vue';
export default {
  name: "CaesarView",
  components: {
    CaesarInfoContent
  },
  data() {
    return {
      shift: 0,
      vstupniText: "",
      vystupniText: "",
      wheelAngle: 75,
      zobrazitInfo: false,
      zobrazitToast: false,
    };
  },
  methods: {
    async sifrovat() {
      try {
        this.vystupniText = encrypt(this.vstupniText, this.shift);
      } catch (error) {
        console.error("Došlo k chybě při šifrování:", error);
        alert("Chyba při šifrování, zkontrolujte parametry");
      }
    },
    async desifrovat() {
      try {
        this.vystupniText = decrypt(this.vstupniText, this.shift);
      } catch (error) {
        console.error("Došlo k chybě při dešifrování:", error);
        alert("Chyba při dešifrování, zkontrolujte parametry");
      }
    },
    kopirovat(text) {
      if (text !== "") {
        navigator.clipboard.writeText(text);
        this.zobrazitToast = true;
        setTimeout(() => {
          this.zobrazitToast = false;
        }, 2000);
      }
    },
    vymazatVse() {
      this.vstupniText = "";
      this.vystupniText = "";
      this.shift = 0;
      this.wheelAngle = 75;
    },
    blokujNeciselnePismena(udalost) {
      const zakazaneKlavesy = ['e', 'E', '+', '-', '.', ','];
      if (zakazaneKlavesy.includes(udalost.key)) {
        udalost.preventDefault();
      }
    },
    // otáčení kola při změně posunu (klíče)
    rotateWheel() {
      const correction = 75;
      this.wheelAngle = this.shift * (360 / 26) + correction;
    },
  },
  // WATCH: sleduje změny konkrétní reaktivní proměnné a spustí funkci, když se změní
  watch: {
    shift() {
      if (this.shift < 0) {
        this.shift = 0;
      }
      if (this.shift > 25) {
        this.shift = 25;
      }
      this.rotateWheel();
    }
  },
};
</script>

<style scoped>
@import "@/assets/styles/cipher/caesar.css";
</style>
