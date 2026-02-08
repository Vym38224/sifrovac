<template>
  <main class="container flex">

    <!-- 1.část: VSTUP UŽIVATELE -->
    <section class="content flex">

      <!-- Komponenta pro nadpis -->
      <CipherHeader title="Proudová šifra" />

      <!-- Formulář pro nastavení parametrů -->
      <form class="params stream-params flex column">
        <fieldset class="row">
          <label>
            Registr m:
            <input
              type="number"
              class="input wide input-m"
              v-model.number="m"
              min="1"
              max="16"
              step="1"
              @keydown="blokujNeciselnePismena"
            />
          </label>
          <label class="input-pv">
            Počáteční vektor:
            <input
              class="input wide"
              :class="{
                'invalid-background invalid-border': isPocatecniVektorInvalid,
              }"
              v-model="pocatecniVektorBity"
              :maxlength="m"
              @input="validaceBinVstupuParametru('pocatecniVektorBity', $event)"
            />
          </label>
        </fieldset>
        <fieldset class="flex row center">
          <label>
            Koeficienty:
            <input
              class="input wide"
              :class="{
                'invalid-background invalid-border': isKoeficientyInvalid,
              }"
              v-model="koeficientyBity"
              type="text"
              :maxlength="m"
              @input="validaceBinVstupuParametru('koeficientyBity', $event)"
            />
          </label>
          <div class=" stream input-type-selector flex">
            <input
              type="radio"
              v-model="typVstupu"
              value="text"
              id="radio-text"
            />
            <label for="radio-text">Text</label>
            <input
              type="radio"
              v-model="typVstupu"
              value="bity"
              id="radio-bity"
            />
            <label for="radio-bity">Bity</label>
          </div>
        </fieldset>
      </form>

      <!-- Komponenta pro textový vstup a výstup -->
      <CipherTextarea
        :vstupni-text="vstupniText"
        :vystupni-text="vystupniText"
        :vstupni-placeholder="
          typVstupu === 'text' ? 'Zadejte text' : 'Zadejte bity'
        "
        :custom-filter="customFilter"
        :pred-filtrem="detekujTypVstupu"
      />

      <!-- Komponenta pro oznámení úspěšného zkopírování textu (zpětná vazba) -->
      <CipherToast :show="zobrazitToast" />

      <!-- Komponenta pro tlačítka -->
      <CipherButtons
        :disable-encrypt="isPocatecniVektorInvalid || isKoeficientyInvalid || m === 0"
        :disable-decrypt="isPocatecniVektorInvalid || isKoeficientyInvalid || m === 0"
      />
    </section>

    <!-- 2.část: VIZUALIZACE -->
    <aside class="secondary-content flex column zero-gap">

      <!-- bod1(pokud je vstup text): Převod znaků vstupu na bity -->
      <section
        class="viz-step"
        v-if="typVstupu === 'text' && vstupniText.length > 0"
      >
        <h4>Převod znaku na bity (ASCII)</h4>
        <ul class="char-breakdown flex">
          <li
            v-for="(znak, index) in vstupniText.split('')"
            :key="index"
            class="courier-new flex column center"
          >
            <span class="char-label bold">{{ znak }}</span>
            <span class="char-binary tertiary-color">{{
              textNaBinarni(znak)
            }}</span>
          </li>
        </ul>
      </section>

      <!-- bod2: Vizualizace generovaní proudu klíčů-->
      <section class="viz-step">
        <h4>Generování proudu klíčů</h4>
        <ul class="lfsr-register flex">
          <li
            v-for="(bit, index) in vizualizaceStavuRegistru"
            :key="index"
            class="register-bit bold flex center courier-new"
            :class="{ 'feedback-bit': koeficientyBity[index] === '1' }"
          >
            {{ bit }}
          </li>
        </ul>
        <p class="viz-stream">
          Zpětná vazba:
          <span class="courier-new">
            {{ vizualizaceVypoctuZpetneVazby }} =
            <strong>{{ vizualizaceBituZpetneVazby }}</strong>
          </span>
        </p>
        <nav>
          <button
            @click="dalsiKrok"
            class="btn-view neutral-color"
            :disabled="isGenerating"
          >
            Další krok
          </button>
          <button
            @click="generovatCelyProud"
            class="btn-view neutral-color"
            :disabled="isGenerating"
          >
            Generovat vše
          </button>
        </nav>
        <p class="viz-stream">
          Proud klíčů:
          <br/>
          <span class="courier-new primary-color">{{
            proudKlicu.replace("...", "")
          }}</span>
        </p>
      </section>

      <!-- bod3: Finále vstup XOR proud kíčů -->
      <section class="viz-step">
        <h4>Šifrování vstupu pomocí operace XOR</h4>
        <table class="xor-visualization">
          <tbody>
            <tr class="xor-row">
              <th class="xor-label">Vstup:</th>
              <td class="courier-new tertiary-color">
                {{ vizualizaceCistehoTextuBity }}
              </td>
            </tr>
            <tr class="xor-row">
              <th class="xor-label">P. klíčů:</th>
              <td class="courier-new primary-color">
                {{ proudKlicu.replace("...", "") }}
              </td>
            </tr>
            <tr>
              <td colspan="2"><hr class="xor-divider" /></td>
            </tr>
            <tr class="xor-row result">
              <th class="xor-label">Výsledek:</th>
              <td class="courier-new bold secondary-color">
                {{ vizualizaceSifrovanehoTextuBity }}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- bod4(pokud je vstup bitový): Převod bitů výstupu na znaky -->
      <section
        class="viz-step"
        v-if="
          typVstupu === 'bity' && vizualizaceSifrovanehoTextuBity.length > 0
        "
      >
        <h4>Převod bitů na znaky (ASCII)</h4>
        <ul class="char-breakdown flex">
          <li
            v-for="(item, index) in vizualizaceVystupuZnaky"
            :key="index"
            class="courier-new flex column center"
          >
            <span class="char-label bold">{{ item.char }}</span>
            <span class="char-binary bold">{{ item.bits }}</span>
          </li>
        </ul>
      </section>

    </aside>

     <!-- Komponenta pro zobrazení informací o šifře -->
    <CipherInfo :show="zobrazitInfo" @close="zobrazitInfo">
      <StreamInfoContent />
    </CipherInfo>

  </main>
</template>

<script>
import { textToBinary, binaryToText, calculateFeedback, xorBinary, encrypt, decrypt, visualizeStep, validateParameters } from "@/utils/ciphers/stream";
import StreamInfoContent from './components/StreamInfoContent.vue';

export default {
  name: "StreamView",
  components: {
    StreamInfoContent
  },
  data() {
    return {
      vstupniText: "",
      vystupniText: "",
      m: 4,
      pocatecniVektorBity: "1000",
      aktualniStavRegistru: "1000",
      koeficientyBity: "1100",
      proudKlicu: "",
      typVstupu: "text",
      isGenerating: false,
      zobrazitInfo: false,
      zobrazitToast: false,
      automatickePrepnuti: false,
    };
  },
  methods: {
    sifrovat() {
      try {
        this.vystupniText = encrypt(
          this.vstupniText,
          this.pocatecniVektorBity,
          this.koeficientyBity,
          this.typVstupu
        );
      } catch (error) {
        console.error("Došlo k chybě při šifrování:", error);
        alert("Chyba při šifrování, zkontrolujte parametry");
      }
    },
    desifrovat() {
      try {
        this.vystupniText = decrypt(
          this.vstupniText,
          this.pocatecniVektorBity,
          this.koeficientyBity,
          this.typVstupu
        );
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
      this.m = 4;
      this.pocatecniVektorBity = "1000";
      this.koeficientyBity = "1100";
      this.aktualniStavRegistru = "1000";
      this.proudKlicu = "";
    },
    detekujTypVstupu(novaHodnota) {
      if (novaHodnota.length > 0) {
        const prvniZnak = novaHodnota[0];
        if ((prvniZnak === '0' || prvniZnak === '1') && this.typVstupu !== "bity") {
          this.automatickePrepnuti = true;
          this.typVstupu = "bity";
        } else if (/[a-zA-Z]/.test(prvniZnak) && this.typVstupu !== "text") {
          this.automatickePrepnuti = true;
          this.typVstupu = "text";
        }
      }
      return novaHodnota;
    },
    validaceBinVstupuParametru(pole, udalost) {
      let hodnota = udalost.target.value;
      this[pole] = hodnota.replace(/[^01]/g, "").slice(0, this.m); // slice(0, this.m) vezme znaky od pozice 0 do pozice m 
    },
    blokujNeciselnePismena(udalost) {
      // Zablokuj "e", "E", "+", "-", "." a další nečíselné znaky
      const zakazaneKlavesy = ['e', 'E', '+', '-', '.', ','];
      if (zakazaneKlavesy.includes(udalost.key)) {
        udalost.preventDefault();  // preventDefault() zabrání výchozímu chování události (backspace pro nas)
      }
    },
    // fce pro vizualizaci dalsiKrok = výpočet jednoho bitu proudu klíčů, generovatCelyproud = výpočet celého proudu
    dalsiKrok() {
      if (this.proudKlicu.endsWith("...")) {
        return;
      }

      const potrebnaDelka = this.vizualizaceCistehoTextuBity.length;
      if (this.proudKlicu.length >= potrebnaDelka) {
        this.proudKlicu += "...";
        return;
      }

      const stepData = visualizeStep(this.aktualniStavRegistru, this.koeficientyBity);
      
      this.proudKlicu += stepData.outputBit;
      this.aktualniStavRegistru = stepData.newRegister;

      if (this.proudKlicu.length === potrebnaDelka) {
        this.proudKlicu += "...";
      }
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async generovatCelyProud() {
      if (this.proudKlicu.endsWith("...") || this.isGenerating) {
        return;
      }

      this.isGenerating = true;
      const potrebnaDelka = this.vizualizaceCistehoTextuBity.length;

      try {
        while (this.proudKlicu.length < potrebnaDelka) {
          this.dalsiKrok();
          if (this.proudKlicu.endsWith("...")) {
            break;
          }
          await this.sleep(200);
        }
      } 
      finally {
        this.isGenerating = false;
      }
    },
    textNaBinarni(text) {
      return textToBinary(text);
    },
  },
  // WATCH: sleduje změny konkrétní reaktivní proměnné a spustí funkci, když se změní
  watch: {
    pocatecniVektorBity(novaHodnota) {
      this.aktualniStavRegistru = novaHodnota;
      this.proudKlicu = "";
    },
    koeficientyBity() {
      this.aktualniStavRegistru = this.pocatecniVektorBity;
      this.proudKlicu = "";
    },
    m(novaHodnota) {
      if (novaHodnota > 16) {
        this.m = 16;
      }
      this.pocatecniVektorBity = this.pocatecniVektorBity.slice(0, this.m);
      this.koeficientyBity = this.koeficientyBity.slice(0, this.m);
      this.proudKlicu = "";
    },
    vstupniText(novaHodnota, staraHodnota) {
      this.aktualniStavRegistru = this.pocatecniVektorBity;
      this.proudKlicu = "";

      if (staraHodnota === "" && novaHodnota.length === 1) {
        const prvniZnak = novaHodnota[0];
        if (prvniZnak === '0' || prvniZnak === '1') {
          if (this.typVstupu !== "bity") {
            this.typVstupu = "bity";
          }
        } else if (/[a-zA-Z]/.test(prvniZnak)) {
          if (this.typVstupu !== "text") {
            this.typVstupu = "text";
          }
        }
      }
    },
    typVstupu() {
      if (this.automatickePrepnuti) {
        this.automatickePrepnuti = false;
        return;
      }
      this.vstupniText = "";
      this.vystupniText = "";
    },
  },
  // COMPUTED: vypočítaná hodnota, která se automaticky přepočítá, jen když se změní data, na kterých závisí (né pokaždé když je volána)
  computed: {
    // custom filter pro vstup 
    customFilter() {
      return (hodnota) => {
        let filtrovanaHodnota;
        if (this.typVstupu === "text") {
          filtrovanaHodnota = hodnota
            .replace(/[^a-zA-Z]/g, "")
            .toUpperCase()
            .slice(0, 6); 
        } else {
          filtrovanaHodnota = hodnota.replace(/[^01]/g, "").slice(0, 48);
        }
        return filtrovanaHodnota;
      };
    },
    isKoeficientyInvalid() {
      return this.koeficientyBity.length !== this.m;
    },
    isPocatecniVektorInvalid() {
      return this.pocatecniVektorBity.length !== this.m;
    },
    vizualizaceCistehoTextuBity() {
      if (this.typVstupu === "text") {
        return this.textNaBinarni(this.vstupniText);
      }
      return this.vstupniText;
    },
    vizualizaceStavuRegistru() {
      return this.aktualniStavRegistru.split("");
    },
    vizualizaceVypoctuZpetneVazby() {
      const stepData = visualizeStep(this.aktualniStavRegistru, this.koeficientyBity);
      return stepData.calculationExpression;
    },
    vizualizaceBituZpetneVazby() {
      return calculateFeedback(this.aktualniStavRegistru, this.koeficientyBity);
    },
    vizualizaceSifrovanehoTextuBity() {
      const textBity = this.vizualizaceCistehoTextuBity;
      const klicBity = this.proudKlicu.replace("...", "");
      return xorBinary(textBity, klicBity);
    },
    vizualizaceVystupuZnaky() {
      if (this.typVstupu !== "bity") {
        return [];
      }

      const znaky = [];
      const bitovyRetezec = this.vizualizaceSifrovanehoTextuBity;

      for (let i = 0; i < bitovyRetezec.length; i += 8) {
        const osmBitu = bitovyRetezec.slice(i, i + 8);

        if (osmBitu.length === 8) {
          znaky.push({
            bits: osmBitu,
            char: binaryToText(osmBitu),
          });
        }
      }

      return znaky;
    },
  },
};
</script>

<style scoped>
@import "@/assets/styles/cipher/stream.css";
</style>
