<template>
  <main class="container flex">

    <!-- 1.část: VSTUP UŽIVATELE -->
    <section class="content flex">

      <!-- Komponenta pro nadpis -->
      <CipherHeader title="Afinní šifra" />

      <!-- Formulář pro nastavení parametrů -->
      <form class="params flex">
        <label :class="{ 'warning-color': !jeAckoNesoudelne }"
          >Hodnota A:</label
        >
        <input
          type="number"
          class="input"
          id="hodnotaA"
          v-model.number="hodnotaA"
          min="1"
          max="26"
          :class="{ 'invalid-border invalid-background': !jeAckoNesoudelne }"
          @keydown="blokujNeciselnePismena"
        />
        <label for="hodnotaB">Hodnota B:</label>
        <input
          type="number"
          class="input"
          id="hodnotaB"
          min="0"
          max="26"
          v-model.number="hodnotaB"
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
      <CipherButtons 
        :disable-encrypt="!jeAckoNesoudelne"
        :disable-decrypt="!jeAckoNesoudelne"
      />

      <!-- Oznamení uživateli, že parametr A není validní (zpětná vazba)  -->
      <div v-if="!jeAckoNesoudelne">
        <p class="warning-color">Šifrování a dešifrování není k dispozici!<br>Hodnota A musí být nesoudělná s 26</p>
      </div>

    </section>

    <!-- 2.část: VIZUALIZACE -->
    <aside class="afinne secondary-content flex">

      <!-- Tabulka aktuálního šifrování znaků -->
      <div class="affine-table">
        <table class="neutral-background">
          <thead>
            <tr>
              <th>Index</th>
              <th>Původní X</th>
              <th>Šifrované Y</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(pismeno, index) in abeceda" :key="pismeno">
              <td>{{ index }}</td>
              <td>{{ pismeno }}</td>
              <td
                :class="{
                  'primary-color bold': jeIndexVPoliZvyraznench(index),
                  'warning-color bold': !jeAckoNesoudelne,
                }"
              >
                {{ ziskatAfinniPismeno(index) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </aside>

    <!-- Komponenta pro zobrazení informací o šifře -->
    <CipherInfo :show="zobrazitInfo">
      <AffineInfoContent />
    </CipherInfo>

  </main>
</template>

<script>
import { encrypt, decrypt, inverseA } from '@/utils/ciphers/affine';
import AffineInfoContent from './components/AffineInfoContent.vue';
export default {
  name: "AfinneView",
  components: {
    AffineInfoContent
  },
  data() {
    return {
      vstupniText: "",
      hodnotaA: 1,
      hodnotaB: 0,
      vystupniText: "",
      abeceda: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
      zvyrazneneIndexy: [],
      zobrazitInfo: false,
      zobrazitToast: false,
    };
  },
  methods: {
    async sifrovat() {
      try {
        this.vystupniText = encrypt(this.vstupniText, this.hodnotaA, this.hodnotaB);
      } catch (error) {
        console.error("Došlo k chybě při šifrování:", error);
        alert(error.message || "Chyba při šifrování, zkontrolujte parametry");
      }
    },
    async desifrovat() {
      try {
        this.vystupniText = decrypt(this.vstupniText, this.hodnotaA, this.hodnotaB);
      } catch (error) {
        console.error("Došlo k chybě při dešifrování:", error);
        alert(error.message || "Chyba při dešifrování, zkontrolujte parametry");
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
      this.hodnotaA = 1;
      this.hodnotaB = 0;
    },
    blokujNeciselnePismena(udalost) {
      const zakazaneKlavesy = ['e', 'E', '+', '-', '.', ','];
      if (zakazaneKlavesy.includes(udalost.key)) {
        udalost.preventDefault();
      }
    }, 
    // zvýraznění textu v tabulce při změně parametrů
    zmenitZvyrazneni() {
      for (let i = 0; i < this.abeceda.length; i++) {
        this.zvyrazneneIndexy.push(i);
      }
      setTimeout(() => {
        this.zvyrazneneIndexy = [];
      }, 600);
    },
    jeIndexVPoliZvyraznench(i) {
      for (let j = 0; j < this.zvyrazneneIndexy.length; j++) {
        if (this.zvyrazneneIndexy[j] === i) {
          return true;
        }
      }
    },
    // výpočet šifrovaného znaku podle indexu znaku otevřeného textu v abecedě
    ziskatAfinniPismeno(index) {
      const kod = (this.hodnotaA * index + this.hodnotaB) % 26;
      return this.abeceda[kod];
    },
    inverzniA() {
      return inverseA(this.hodnotaA);
    },
  },
  // WATCH: sleduje změny konkrétní reaktivní proměnné a spustí funkci, když se změní
  watch: {
    hodnotaB() {
      if (this.hodnotaB < 0) {
        this.hodnotaB = 0;
      }
      if (this.hodnotaB > 26) {
        this.hodnotaB = 26;
      }
      this.zmenitZvyrazneni();
    },
    hodnotaA() {
      if (this.hodnotaA < 0) {
        this.hodnotaA = 0;
      }
      if (this.hodnotaA > 25) {
        this.hodnotaA = 25;
      }
      this.zmenitZvyrazneni();
    }
  },
  // COMPUTED: vypočítaná hodnota, která se automaticky přepočítá, jen když se změní data, na kterých závisí
  computed: {
    // je nesoudělné == má inverzi
    jeAckoNesoudelne() {
      const inverze = this.inverzniA();
      if (inverze === null) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style scoped>
@import "@/assets/styles/cipher/afinne.css";
</style>
