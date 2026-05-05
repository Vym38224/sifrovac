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
            id="p-input"
            name="p-input"
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
            id="q-input"
            name="q-input"
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
      :disable-decrypt="computedDisableDecryptRsa"
      :disable-encrypt="computedDisableEncryptRsa"
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
              <strong>3. Volba veřejného exponentu b</strong>
              <div
                v-if="validniHodnotyB.length > 0"
                style="gap: 10px"
                class="flex"
              >
                <label>
                  b =
                  <select
                    v-model.number="b"
                    style="cursor: pointer; width: 100px"
                  >
                    <option
                      v-for="hodnota in validniHodnotyB"
                      :key="hodnota"
                      :value="hodnota"
                    >
                      {{ hodnota }}
                    </option>
                  </select>
                </label>
                <p class="quaternary-color">
                  musí splňovat: nsd(b, φ(n)) = 1
                </p>
              </div>
            </div>

            <div class="step">
              <strong>4. Výpočet soukromého exponentu a</strong>
              <div
                v-if="validniHodnotyA.length > 0"
                style="gap: 10px"
                class="flex"
              >
                <label>
                  a =
                  <select
                    v-model.number="a"
                    style="cursor: pointer; width: 100px"
                  >
                    <option
                      v-for="hodnota in validniHodnotyA"
                      :key="hodnota"
                      :value="hodnota"
                    >
                      {{ hodnota }}
                    </option>
                  </select>
                </label>
                <p class="quaternary-color">
                  musí splňovat: a = b<sup>−1</sup> mod φ(n)
                </p>
              </div>
            </div>

            <div class="step">
              <strong>Veřejný klíč</strong>
              <p class="quaternary-color">(b, n) = ({{ b }}, {{ n }})</p>
            </div>

            <div class="step">
              <strong>Soukromý klíč</strong>
              <p class="quaternary-color">(a, p, q) = ({{ a }}, {{ p }}, {{ q }})</p>
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
                <p>Použití soukromého klíče (a = {{ a }}, p, q ) s n = {{ n }}</p>
                <p class="courier-new quaternary-color">
                  m = c<sup>a</sup> mod n = {{ aktualniZnak.c
                  }}<sup>{{ a }}</sup> mod {{ n }} =
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
                <p>Použití veřejného klíče (b = {{ b }}, n = {{ n }})</p>
                <p class="courier-new quaternary-color">
                  c = m<sup>b</sup> mod n = {{ aktualniZnak.m
                  }}<sup>{{ b }}</sup> mod {{ n }} = {{ aktualniZnak.c }}
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
  najitValidniB,
  najitValidniA,
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
      b: 0,
      a: 0,
      aktivniKrok: "klice",
      validniHodnotyB: [],
      validniHodnotyA: [],
      userInteracted: false,
    };
  },
  methods: {
    sifrovat() {
      if (!this.vstupniText || this.jeCislo(this.vstupniText) || this.p <= 0 || this.q <= 0 || this.n < 90) {
        this.vystupniText = "";
        return;
      }
      try {
        this.vystupniText = rsaEncrypt(this.vstupniText, this.b, this.n);
      } catch (error) {
        console.error("Došlo k chybě při šifrování:", error);
        this.vystupniText = "";
      }
    },
    desifrovat() {
      if (!this.vstupniText || !this.jeCislo(this.vstupniText) || this.p <= 0 || this.q <= 0 || this.n < 90) {
        this.vystupniText = "";
        return;
      }
      try {
        this.vystupniText = rsaDecrypt(this.vstupniText, this.a, this.n);
      } catch (error) {
        console.error("Došlo k chybě při dešifrování:", error);
        this.vystupniText = "";
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
      this.b = 0;
      this.a = 0;
      this.userInteracted = false;
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
        this.validniHodnotyB = najitValidniB(this.phi);

        if (this.validniHodnotyB.length > 0) {
          if (!this.validniHodnotyB.includes(this.b)) {
            this.b = this.validniHodnotyB[0];
          }
        } else {
          this.b = 0;
        }

        this.vypocitatValidniD();
      } else {
        // vyresetovat hodnoty pokud nesplňují podmínky
        this.n = 0;
        this.phi = 0;
        this.b = 0;
        this.a = 0;
        this.validniHodnotyB = [];
        this.validniHodnotyA = [];
      }
    },
    // prvních 7 nejmenších a
    vypocitatValidniD() {
      this.validniHodnotyA = najitValidniA(this.b, this.phi);

      if (this.validniHodnotyA.length > 0) {
        this.a = this.validniHodnotyA[0];
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
    b() {
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
      return ziskatAktualniZnak(this.vstupniText, this.b, this.a, this.n);
    },
    posledniIndexMezery() {
    if (!this.vstupniText) return -1;
    const posledniMezera = this.vstupniText.lastIndexOf(' '); 
    // pokud není mezera, zvýrazní celý text (vrátí -1)
    return posledniMezera;
    },
    computedDisableEncryptRsa() {
      if (!this.userInteracted) return false;
      return this.vstupniText.length > 0 && this.jeCislo(this.vstupniText) || (this.p == 0 && this.q == 0 || this.n < 90);
    },
    computedDisableDecryptRsa() {
      if (!this.userInteracted) return false;
      return this.vstupniText.length > 0 && !this.jeCislo(this.vstupniText) || (this.p == 0 && this.q == 0 || this.n < 90);
    },
  },
};
</script>

<style scoped>
@import "@/assets/styles/cipher/rsa.css";
</style>
