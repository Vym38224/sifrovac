<template>
  <main class="container flex">

    <!-- 1.část: VSTUP UŽIVATELE -->
    <section class="content flex">

      <!-- Komponenta pro nadpis -->
      <CipherHeader title="Posuvná šifra" />

      <!-- Formulář pro nastavení parametrů -->
      <form class="params flex">
        <label for="shift-slider">Zvolte klíč šifry:</label>
        <input
          type="range"
          class="form-range"
          min="0"
          max="25"
          step="1"
          v-model.number="posun"
          @input="otocitKolo"
        />
        <input
          type="number"
          min="0"
          max="25"
          v-model.number="posun"
          class="input"
          @input="priZmenePosunu"
          @change="priZmenePosunu"
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
    <aside class="secondary-content flex">
      <img alt="Vnější kolo" class="wheel outer" />
      <img
        alt="Vnitřní kolo"
        class="wheel inner"
        :style="{ transform: 'rotate(' + uhelKola + 'deg)' }"
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
  // reaktivní proměnné 
  data() {
    return {
      posun: 0,
      vstupniText: "",
      vystupniText: "",
      uhelKola: 75,
      zobrazitInfo: false,
      zobrazitToast: false,
    };
  },
  methods: {
    // šifrování a dešifrování 
    async sifrovat() {
      try {
        this.vystupniText = encrypt(this.vstupniText, this.posun);
      } catch (error) {
        console.error("Došlo k chybě při šifrování:", error);
        alert("Chyba při šifrování, zkontrolujte parametry");
      }
    },
    async desifrovat() {
      try {
        this.vystupniText = decrypt(this.vstupniText, this.posun);
      } catch (error) {
        console.error("Došlo k chybě při dešifrování:", error);
        alert("Chyba při dešifrování, zkontrolujte parametry");
      }
    },
    // základní funkce pro práci s UI
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
      this.posun = 0;
      this.uhelKola = 75;
    },
    // otáčení kola při změně posunu (klíče)
    otocitKolo() {
      const korekce = 75;
      this.uhelKola = this.posun * (360 / 26) + korekce;
    },
    priZmenePosunu() {
      if (this.posun > 25) {
        this.posun = 25;
      }
      if (this.posun < 0) {
        this.posun = 0;
      }
      this.otocitKolo();
    },
    blokujNeciselnePismena(udalost) {
      const zakazaneKlavesy = ['e', 'E', '+', '-', '.', ','];
      if (zakazaneKlavesy.includes(udalost.key)) {
        udalost.preventDefault();
      }
    },
  },
};
</script>

<style scoped>
@import "@/assets/styles/cipher/caesar.css";
</style>
