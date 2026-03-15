<template>
  <main class="container flex">

    <!-- 1.část: VSTUP UŽIVATELE -->
    <section class="content flex">

      <!-- Komponenta pro nadpis -->
      <CipherHeader title="Substituční šifra" />

      <!-- Formulář pro nastavení parametrů -->
      <form class="params flex">
        <label :class="{ 'warning-color': jePermutaceNeplatna }">
          Permutace abecedy:
          <div class="flex" style="margin-top: 5px">
            <input
              v-model="permutace"
              type="text"
              class="input-permutation"
              :class="{
                'invalid-background invalid-border': jePermutaceNeplatna,
              }"
              maxlength="26"
              @input="filtrovatPermutaci"
            />
            <button
              type="button"
              class="btn-view neutral-color center"
              @click="generovatNahodnouPermutaci"
              style="margin-left: 10px"
            >
              Náhodně
            </button>
          </div>
        </label>
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
        :disable-encrypt="jePermutaceNeplatna"
        :disable-decrypt="jePermutaceNeplatna"
      />

      <!-- Oznamení uživateli, že permutace není validní (zpětná vazba) -->
      <div v-if="jePermutaceNeplatna">
        <p class="warning-color">Šifrování a dešifrování není k dispozici!<br> Permutace je neplatná</p>
      </div>

    </section>

    <!-- 2.část: VIZUALIZACE -->
    <aside class="substitution secondary-content flex column">
      
      <!-- Tabulka aktuálního šifrování znaků -->
      <section>
        <table class="substitution-table neutral-background">
          <tbody>
            <tr>
              <th
                v-for="pismeno in vizualizaceAbeceda"
                :key="'orig-' + pismeno"
                class="alphabet-cell"
              >
                {{ pismeno }}
              </th>
            </tr>
            <tr class="arrow-row" aria-hidden="true">
              <td v-for="(_, index) in vizualizaceAbeceda" :key="'arrow-' + index">
                <img
                  src="@/assets/images/ui/arrow-down.png"
                  alt=""
                  :class="['mapping-arrow', { 'mapping-arrow-up': aktivniSmerSipky === 'up' }]"
                />
              </td>
            </tr>
            <tr
              :class="[
                {
                  'warning-color bold': jeCervena,
                  'primary-color bold': jeZelena,
                },
              ]"
            >
              <td
                v-for="(pismeno, index) in permutaceZnaky"
                :key="'perm-' + index"
                class="mapped-cell"
              >
                {{ pismeno }}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

    </aside>

    <!-- Komponenta pro zobrazení informací o šifře -->
    <CipherInfo :show="zobrazitInfo">
      <SubstitutionInfoContent />
    </CipherInfo>

  </main>
</template>

<script>
import { encrypt, decrypt } from '@/utils/ciphers/substitution';
import SubstitutionInfoContent from './components/SubstitutionInfoContent.vue';
export default {
  name: "SubstitutionView",
  components: {
    SubstitutionInfoContent
  },
  data() {
    return {
      vstupniText: "",
      vystupniText: "",
      permutace: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      abeceda: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), 
      aktivniSmerSipky: "down",
      zobrazitInfo: false,
      zobrazitToast: false,
      jeCervena: false,
      jeZelena: false,
    };
  },
  methods: {
    async sifrovat() {
      try {
        this.vystupniText = encrypt(this.vstupniText, this.permutace);
        this.aktivniSmerSipky = "down";
      } catch (error) {
        console.error("Došlo k chybě při šifrování:", error);
        alert("Chyba při šifrování, zkontrolujte parametry");
      }
    },
    async desifrovat() {
      try {
        this.vystupniText = decrypt(this.vstupniText, this.permutace);
        this.aktivniSmerSipky = "up";
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
      this.aktivniSmerSipky = "down";
      this.jeCervena = false;
      this.jeZelena = false;
    },
    filtrovatPermutaci() {
      const filtrovanaHodnota = this.permutace.replace(/[^a-zA-Z]/g, "").toUpperCase();
      this.permutace = filtrovanaHodnota;
    },
    generovatNahodnouPermutaci() {
      this.permutace = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").sort(() => Math.random() - 0.5).join("");
    }
  },
  // WATCH: sleduje změny konkrétní reaktivní proměnné a spustí funkci, když se změní
  watch: {
    permutace() {
      if (this.jePermutaceNeplatna) {
        this.jeCervena = true;
        this.jeZelena = false;
      } else {
        this.jeCervena = false;
        this.jeZelena = true;

        setTimeout(() => {
          this.jeZelena = false;
        }, 600);
      }
    },
  },
  // COMPUTED: vypočítaná hodnota, která se automaticky přepočítá, jen když se změní data, na kterých závisí
  computed: {
    vizualizaceAbeceda() {
      return this.abeceda.slice(0, this.permutace.length);
    },
    permutaceZnaky() {
      return this.permutace.split("");
    },
    jePermutaceNeplatna() {
      if (this.permutace.length !== 26) {
        return true;
      }

      let pocetUnikatnich = 0;
      const pismena = {};

      for (let i = 0; i < this.permutace.length; i++) {
        let pismeno = this.permutace[i];
        if (!pismena[pismeno]) {
          pismena[pismeno] = true;
          pocetUnikatnich = pocetUnikatnich + 1;
        }
      }

      if (pocetUnikatnich !== 26) {
        return true;
      }

      return false;
    },
  },
};
</script>

<style scoped>
@import "@/assets/styles/cipher/substitution.css";
</style>
