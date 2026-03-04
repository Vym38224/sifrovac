<template>
  <main class="container flex">

    <!-- 1.část: VSTUP UŽIVATELE -->
    <section class="content flex">

      <!-- Komponenta pro nadpis -->
      <CipherHeader title="RSA" />

      <!-- Formulář pro nastavení parametrů -->
      <form class="params flex">
        <label>
          Prvočíslo p:
          <input
            style="width: 84px"
            v-model.number="p"
            type="number"
            min="2"
            maxlength="7"
            @input="omezitDelku7($event, 'p')"
            @keydown="blokujNeciselnePismena"
            :class="{
              'invalid-border invalid-background':
                (p > 0 && !jePrvocislo(p)) ||
                (p > 0 && q > 0 && p === q) ||
                (p > 0 && q > 0 && p * q <= 90),
            }"
          />
        </label>
        <label>
          Prvočíslo q:
          <input
            style="width: 84px"
            v-model.number="q"
            type="number"
            min="2"
            maxlength="7"
            @input="omezitDelku7($event, 'q')"
            @keydown="blokujNeciselnePismena"
            :class="{
              'invalid-border invalid-background':
                (q > 0 && !jePrvocislo(q)) ||
                (p > 0 && q > 0 && p === q) ||
                (p > 0 && q > 0 && p * q <= 90),
            }"
          />
        </label>
      </form>

      <!-- Komponenta pro textový vstup a výstup -->
      <CipherTextarea
        :vstupni-text="vstupniText"
        :vystupni-text="vystupniText"
        :custom-filter="customFilter"
        @keydown="handleBackspace"
      />

      <!-- Komponenta pro oznámení úspěšného zkopírování textu (zpětná vazba) -->
      <CipherToast :show="zobrazitToast" />

      <!-- Komponenta pro tlačítka -->
      <CipherButtons 
      :disable-decrypt="vstupniText.length > 0 && !jeCislo(vstupniText)"
      :disable-encrypt="vstupniText.length > 0 && jeCislo(vstupniText)"
      />

      <!-- Oznamení uživateli, že parametr p,q není validní (zpětná vazba)  -->
      <section>
        <div v-if="(p > 0 && !jePrvocislo(p))">
          <p class="warning-color">Šifrování a dešifrování není k dispozici!<br>Hodnota p není prvočíslo</p>
        </div>
        <div v-else-if="(q > 0 && !jePrvocislo(q))">
          <p class="warning-color">Šifrování a dešifrování není k dispozici!<br>Hodnota q není prvočíslo</p>
        </div>
        <div v-else-if="(p > 0 && q > 0 && p === q)">
          <p class="warning-color">Šifrování a dešifrování není k dispozici!<br>Hodnoty p a q musí být různá prvočísla</p>
        </div>
        <div v-else-if="(p > 0 && q > 0 && p * q <= 90)">
          <p class="warning-color">Šifrování a dešifrování není k dispozici!<br>Součin p a q musí být větší než 90</p>
        </div>
      </section>
    </section>

    <!-- 2.část: VIZUALIZACE -->
    <aside class="rsa secondary-content flex">
      
      <!-- Celý postup rozdělen na 
       1.Výpočet klíčů  = společne pro otevřený text a šifrovaný text
       2.Šifrování/Dešifrování = oddělené pro otevřený text a šifrovaný text -->
      <section
        class="rsa viz-step"
        :style="{
          height:
            (aktivniKrok === 'klice' && n > 0) ||
            (aktivniKrok === 'sifrovani' &&
              vstupniText &&
              n > 0)
              ? 'auto'
              : '120px',
        }"
      >

        <!-- Tlačítka přepínání mezi výpočtem klíčů a šifrováním/dešifrováním -->
        <section class="tab-buttons flex">
          <button
            :class="[
              'tab-btn cursor-pointer',
              { active: aktivniKrok === 'klice' },
            ]"
            @click="aktivniKrok = 'klice'"
          >
            Výpočet klíčů
          </button>
          <button
            :class="[
              'tab-btn cursor-pointer',
              { active: aktivniKrok === 'sifrovani' },
            ]"
            @click="aktivniKrok = 'sifrovani'"
          >
            Šifrování / Dešifrování
          </button>
        </section>

        <!-- 1.Výpočet klíčů -->
        <section v-if="aktivniKrok === 'klice'">

          <!-- pokud jsou platné parametry p a q, ukázat postup pro výpočet klíčů -->
          <div v-if="n > 0" class="steps flex column" style="">

            <div class="step">
              <strong>1. Výpočet modulu n</strong>
              <p class="quaternary-color">
                n = p × q = {{ p }} × {{ q }} = {{ n }}
              </p>
            </div>

            <div class="step">
              <strong>2. Výpočet Eulerovy funkce φ(n)</strong>
              <p class="quaternary-color">
                φ(n) = (p-1) × (q-1) = {{ p - 1 }} × {{ q - 1 }} = {{ phi }}
              </p>
            </div>

            <div class="step">
              <strong>3. Volba veřejného exponentu e</strong>
              <div
                v-if="validniHodnotyE.length > 0"
                style="gap: 10px"
                class="flex"
              >
                <label>
                  e =
                  <select
                    v-model.number="e"
                    style="cursor: pointer; width: 100px"
                  >
                    <option
                      v-for="hodnota in validniHodnotyE"
                      :key="hodnota"
                      :value="hodnota"
                    >
                      {{ hodnota }}
                    </option>
                  </select>
                </label>
                <p class="quaternary-color">
                  musí splňovat: nsd(e, φ(n)) = 1
                </p>
              </div>
            </div>

            <div class="step">
              <strong>4. Výpočet soukromého exponentu d</strong>
              <div
                v-if="validniHodnotyD.length > 0"
                style="gap: 10px"
                class="flex"
              >
                <label>
                  d =
                  <select
                    v-model.number="d"
                    style="cursor: pointer; width: 100px"
                  >
                    <option
                      v-for="hodnota in validniHodnotyD"
                      :key="hodnota"
                      :value="hodnota"
                    >
                      {{ hodnota }}
                    </option>
                  </select>
                </label>
                <p class="quaternary-color">
                  musí splňovat: (e × d) mod φ(n) = 1
                </p>
              </div>
            </div>

            <div class="step">
              <strong>Veřejný klíč</strong>
              <p class="quaternary-color">(e, n) = ({{ e }}, {{ n }})</p>
            </div>

            <div class="step">
              <strong>Soukromý klíč</strong>
              <p class="quaternary-color">(d, n) = ({{ d }}, {{ n }})</p>
            </div>
          </div>

          <!-- pokud jsou neplatné parametry p a q, ukázat zpětnou vazbu -->
          <div v-else class="no-params quaternary-color">
            <p>
              Zadejte různá prvočísla p a q pro zobrazení kroků.
            </p>
            <p>p × q musí být větší než 90</p>
          </div>

        </section>

        <!-- 2.Šifrování/Dešifrování -->
        <section v-if="aktivniKrok === 'sifrovani'">

          <!-- a) Dešifrování pro šifrovaný text -->
          <div v-if="jeCislo(vstupniText) && n > 0" class="steps flex column">

            <div class="step" style="border-left: 3px solid #6e6a580d;">
              <strong>Vstupní text</strong>
              <p>
                <span
                  v-for="(znak, index) in vstupniText.split('')"
                  :key="index"
                  :class="{
                    'primary-color bold': index > posledniIndexMezery,
                  }"
                  >{{ znak }}</span
                >
              </p>
              <p>Aktuální šifrovaná hodnota: c = {{ aktualniZnak.c }}</p>
            </div>


            <div class="step">
              <strong>Dešifrování</strong>
              <div v-if="aktualniZnak">
                <p>Použití soukromého klíče (d = {{ d }}, n = {{ n }})</p>
                <p class="courier-new quaternary-color">
                  m = c<sup>d</sup> mod n = {{ aktualniZnak.c
                  }}<sup>{{ d }}</sup> mod {{ n }} =
                  {{ aktualniZnak.mDesifrovane }}
                </p>
                <p>
                  Dešifrovaná hodnota: m = <span class=" primary-color bold">{{ aktualniZnak.mDesifrovane }}</span>
                </p>
              </div>
            </div>

            <div class="step" style="border-left: 3px solid #6e6a580d;">
              <strong>Převod čísla na znak</strong>
              <p>Každé číslo jako ASCII hodnota</p>
              <div v-if="aktualniZnak">
                <p>
                  Aktuální číslo: {{ aktualniZnak.mDesifrovane }} (znak = 
                  <span class="primary-color bold">{{ aktualniZnak.znakDesifrovany }}</span>)
                </p>
              </div>
            </div>

          </div>

          <!-- b) Šifrování pro otevřený text -->
          <div v-else-if="vstupniText && n > 0" class="steps flex column">

            <div class="step" style="border-left: 3px solid #6e6a580d;">
              <strong>Vstupní text</strong>
              <p>
                <span
                  v-for="(znak, index) in vstupniText.split('')"
                  :key="index"
                  :class="{
                    'primary-color bold': index === vstupniText.length - 1,
                  }"
                  >{{ znak }}</span
                >
              </p>
            </div>

            <div class="step" style="border-left: 3px solid #6e6a580d;">
              <strong>Převod znaku na číslo</strong>
              <p>Každý znak jako ASCII hodnota</p>
              <div v-if="aktualniZnak">
                <p>
                  Aktuální znak: {{ aktualniZnak.znak }} (m =
                  <span class="primary-color bold">{{ aktualniZnak.m }}</span>)
                </p>
              </div>
            </div>

            <div class="step">
              <strong>Šifrování</strong>
              <div v-if="aktualniZnak">
                <p>Použití veřejného klíče (e = {{ e }}, n = {{ n }})</p>
                <p class="courier-new quaternary-color">
                  c = m<sup>e</sup> mod n = {{ aktualniZnak.m
                  }}<sup>{{ e }}</sup> mod {{ n }} = {{ aktualniZnak.c }}
                </p>
                <p>
                  Šifrovaná hodnota: c = 
                  <span class="primary-color bold">{{ aktualniZnak.c }}</span>
                </p>
              </div>
            </div>

          </div>

          <!-- pokud nejsou splněny podmínky pro zobrazení 2.Šifrování/Dešifrování, ukazat zpětno uvazbu-->
          <div v-else class="no-params quaternary-color">
            <p>
              Zadejte text a různá prvočísla p a q pro zobrazení
              kroků.
            </p>
            <p>p × q musí být větší než 90</p>
          </div>

        </section>

      </section>

    </aside>

    <!-- Komponenta pro zobrazení informací o šifře -->
    <CipherInfo :show="zobrazitInfo">
      <RsaInfoContent />
    </CipherInfo>

  </main>
</template>

<script>
import {
  jePrvocislo,
  vypocitatNaPhi,
  najitValidniE,
  najitValidniD,
  rsaEncrypt,
  rsaDecrypt,
  ziskatAktualniZnak,
} from "@/utils/ciphers/rsa.js";
import RsaInfoContent from './components/RsaInfoContent.vue';

export default {
  name: "RsaCipherView",
  components: {
    RsaInfoContent
  },
  data() {
    return {
      vstupniText: "",
      vystupniText: "",
      zobrazitInfo: false,
      zobrazitToast: false,
      p: 0,
      q: 0,
      n: 0,
      phi: 0,
      e: 0,
      d: 0,
      aktivniKrok: "klice",
      validniHodnotyE: [],
      validniHodnotyD: [],
    };
  },
  methods: {
    sifrovat() {
      try {
        this.vystupniText = rsaEncrypt(this.vstupniText, this.e, this.n);
      } catch (error) {
        console.error("Došlo k chybě při šifrování:", error);
        alert("Chyba při šifrování, zkontrolujte parametry.");
      }
    },
    desifrovat() {
      try {
        this.vystupniText = rsaDecrypt(this.vstupniText, this.d, this.n);
      } catch (error) {
        console.error("Došlo k chybě při dešifrování:", error);
        alert("Chyba při dešifrování, zkontrolujte parametry.");
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
      this.p = 0;
      this.q = 0;
      this.n = 0;
      this.phi = 0;
      this.e = 0;
      this.d = 0;
    },
    blokujNeciselnePismena(udalost) {
      const zakazaneKlavesy = ['e', 'E', '+', '-', '.', ','];
      if (zakazaneKlavesy.includes(udalost.key)) {
        udalost.preventDefault();
      }
    },
    // fce pro mazaní celých šifrovaných hodnot, když mažu na vstupu zašifrované znaky (tedy čísla oddělené mezerami)
    handleBackspace(event) {
      if (event.key === 'Backspace' && this.jeCislo(this.vstupniText)) {
        const textarea = event.target;
        const cursorPos = textarea.selectionStart;
        const text = this.vstupniText;
        
        if (cursorPos === text.length) {
          event.preventDefault(); // preventDefault() zastaví výchozí chování události (backspace pro nas)
          
          const posledniMezera = text.lastIndexOf(' '); 
          
          if (posledniMezera !== -1) {
            this.vstupniText = text.substring(0, posledniMezera); // substring(0, posledniMezera) vezme text od začatku až k poslední mezeře (smaže posledni blok čísel)
          } else {
            this.vstupniText = '';
          }
        }
      }
    },
    jeCislo(text) {
      if (!text) return false;
      const prvniZnak = text.trim().charAt(0); 
      return prvniZnak >= "0" && prvniZnak <= "9";
    },
    jePrvocislo(num) {
      return jePrvocislo(num);
    },
    // vypočítání všech potřebných parametrů(n,phi,e,d) na zakladě vstupních p a q, ktere jsou ve WATCHERS a vždy se tato funkce vola při jejich změně
    vypocitatRSAParametry() {
      const vysledek = vypocitatNaPhi(this.p, this.q);
      
      if (vysledek) {
        this.n = vysledek.n;
        this.phi = vysledek.phi;
        this.validniHodnotyE = najitValidniE(this.phi);

        if (this.validniHodnotyE.length > 0) {
          if (!this.validniHodnotyE.includes(this.e)) {
            this.e = this.validniHodnotyE[0];
          }
        } else {
          this.e = 0;
        }

        this.vypocitatValidniD();
      } else {
        // vyresetovat hodnoty pokud nesplňují podmínky
        this.n = 0;
        this.phi = 0;
        this.e = 0;
        this.d = 0;
        this.validniHodnotyE = [];
        this.validniHodnotyD = [];
      }
    },
    // prvních 7 nejmenších d
    vypocitatValidniD() {
      this.validniHodnotyD = najitValidniD(this.e, this.phi);

      if (this.validniHodnotyD.length > 0) {
        this.d = this.validniHodnotyD[0];
      }
    },
    // omezeni vstupu p a q
    omezitDelku7(event, field) {
      const value = event.target.value;
      if (value.length > 7) {
        this[field] = parseInt(value.slice(0, 7));
      }
    },
  },
  // WATCH: sleduje změny konkrétní reaktivní proměnné a spustí funkci, když se změní
  watch: {
    p() {
      this.vypocitatRSAParametry();
    },
    q() {
      this.vypocitatRSAParametry();
    },
    e() {
      this.vypocitatValidniD();
    },
  },
  // COMPUTED: vypočítaná hodnota, která se automaticky přepočítá, jen když se změní data, na kterých závisí
  computed: {
    // custom filtr pro rsa otevřený text znaky,mezery,tečky a šifrovaný text jsou čísla oddělené mezerami
    customFilter() {
      return (hodnota) => {
        const prvniZnak = hodnota.charAt(0);

        if (prvniZnak >= "0" && prvniZnak <= "9") {
          let filtrovanaHodnota = hodnota.replace(/[^\d\s]/g, "");  // odstraní vše kromě čísel a mezer
          filtrovanaHodnota = filtrovanaHodnota.replace(/\s{2,}/g, " ");  // nahradí více mezer za sebou jednou mezerou
          return filtrovanaHodnota;
        } else {
          const filtrovanaHodnota = hodnota.replace(/[^a-zA-Z\s.]/g, ""); // povoleny písmena, mezery a tečky
          return filtrovanaHodnota.toUpperCase();
        }
      };
    },
    aktualniZnak() {
      return ziskatAktualniZnak(this.vstupniText, this.e, this.d, this.n);
    },
    posledniIndexMezery() {
    if (!this.vstupniText) return -1;
    const posledniMezera = this.vstupniText.lastIndexOf(' '); 
    // pokud není mezera, zvýrazní celý text (vrátí -1)
    return posledniMezera;
    },
  },
};
</script>

<style scoped>
@import "@/assets/styles/cipher/rsa.css";
</style>
