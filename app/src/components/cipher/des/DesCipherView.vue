<template>
  <main class="container flex">

    <!-- 1.část: VSTUP UŽIVATELE -->
    <section class="content flex">

      <!-- Komponenta pro nadpis -->
      <CipherHeader title="DES" />

      <!-- Formulář pro nastavení parametrů -->
      <form class="params flex" style="gap:10px;">
        <label id="key-label" for="key" style="padding-top:3px;">Klíč:</label>
        <input
          type="text"
          id="key"
          v-model="klic"
          maxlength="8"
          @input="filtrovatKlic"
          placeholder="Zadejte 8 znaků"
          class="input"
          style="width: 110px;"
        />
        <button
              type="button"
              class="btn-view neutral-color center"
              @click="generovatNahodny"
            >
              Náhodně
            </button>
        <div class="des input-type-selector flex">
          <input
            type="radio"
            v-model="typVstupu"
            value="text"
            id="des-radio-text"
          />
          <label for="des-radio-text">Text</label>
          <input
            type="radio"
            v-model="typVstupu"
            value="bity"
            id="des-radio-bity"
          />
          <label for="des-radio-bity">Bity</label>
        </div>
      </form>

      <!-- Komponenta pro textový vstup a výstup -->
      <CipherTextarea
        :vstupni-text="vstupniText"
        :vystupni-text="vystupniText"
        :vstupni-placeholder="
          typVstupu === 'text' ? 'Zadejte 8 znaků' : 'Zadejte 64 bitů'
        "
        :custom-filter="desFilter"
        :pred-filtrem="detekujTypVstupu"
      />
      
      <!-- Komponenta pro oznámení úspěšného zkopírování textu (zpětná vazba) -->
      <CipherToast :show="zobrazitToast" />

      <!-- Komponenta pro tlačítka -->
      <CipherButtons
        :disable-encrypt="computedDisableEncryptDes"
        :disable-decrypt="computedDisableDecryptDes"
      />
      <div v-if="klic.length > 0 && klic.length !== 8">
        <p class="warning-color"> 
          Šifrování a dešifrování není k dispozici! <br />
          Klíč má {{ klic.length }}/8 znaků</p
        >
      </div>
    </section>

    <!-- 2.část: VIZUALIZACE -->
    <aside class="des secondary-content flex column center">
      
      <!-- Když nejsou splněny podmínky -->
      <section v-if="!vizPodminky">
        <div
          class="des viz-step flex column quaternary-color"
          style="
            gap: 0;
            font-size: 14px;
          "
        >
          <div class="no-params">
            <p>Pro Vizualizaci vyplňte klíč a text</p>
            <p>
              Podmínky pro klíč jsou 8 znaků, <br />
              pro vstupní text 8 znaků, nebo 64 bitů
            </p>
            <p class="warning-color">Upozornění: Šifrování a dešifrování používá pouze 1 rundu z celkových 16 rund</p>
          </div>
        </div>
      </section>

      <!-- ŠIFROVÁNÍ -->
      <section v-if="jeRezimSifrovani" class="sifrovani">

        <!-- Binární zobrazení Počáteční permutace a dělení-->
        <section class="des bin-visualization flex bin viz-step" v-if="maSeZobrazitBinarni" style="gap: 11px;">
          <!-- Komponenta pro binární zobrazení -->
          <DesBinaryDisplay 
            :binary-data="textBin"
            :title="vstupniText.length === 8 ? 'Binární reprezentace textu' : `${vstupniText.length}/8 znaků (ASCII)`"
            :title-warning="vstupniText.length !== 8"
            :show-count="vstupniText.length === 8"
            :count="`${vstupniText.length}/8 znaků`"
          />
          <!-- Když jsou splněny všechny podmínky-->
          <div v-if="vizPodminky && vstupniText.length === 8 && klic.length === 8" >
            <h4 style="opacity: 85%; font-size: 14px">
              Počáteční permutace
              <a
                class="primary-color without-underline"
                href="#IP"
                @click.prevent="$refs.ipModal.prepnout()"
              >
                IP
              </a>
              a dělení na
              <span class="tertiary-color">L<sub>0</sub></span>,
              <span class="tertiary-color">R<sub>0</sub></span>
            </h4>
            <div class="binary flex column center">
              <code
                class="binary-display binary-half clickable tertiary-color"
                :class="{
                  active: zobrazeniStrana === 'left',
                  'highlight-left': zvyrazneniLevy,
                }"
                @click="zobrazitLevy"
                title="Klikněte pro zobrazení L0"
              >
                <span style="font-family: 'Inter'; font-size:10px;">L<sub>0</sub>:</span><span style="text-decoration: underline;">{{ levaBin }}</span>
              </code>
              <code
                class="binary-display binary-half clickable tertiary-color"
                :class="{ active: zobrazeniStrana === 'right' }"
                @click="zobrazitPravy"
                title="Klikněte pro zobrazení R0"
              >
                <span style="font-family: 'Inter'; font-size:10px;">R<sub>0</sub>:</span><span style="text-decoration: underline;">{{ pravaBin }}</span>
              </code>
            </div>
          </div>
        </section>

        <!-- Modální okno pro Počáteční permutaci -->
        <DesPermutationModal ref="ipModal" table-type="IP" modal-class="ip" />

        <!-- Generování rundovního klíče -->
        <DesRoundKeyGeneration
          v-if="zobrazitRundovniKlic && vstupniText.length === 8 && klic.length === 8"
          :keyText="klic"
          :keyBinary="klicBin"
          :key56AfterPC1="klic56PoPC1"
          :c0="C0"
          :d0="D0"
          :c1="C1"
          :d1="D1"
          :roundKey="rundovniKlic"
        />

        <!-- Šifrovací proces - pravá strana -->
        <DesProcessVisualization
          v-if="!zobrazitRundovniKlic && zobrazeniStrana === 'right' && vstupniText.length === 8 && klic.length === 8"
          :input-binary="pravaBin"
          :expanded-input="pravaExpandovana"
          :xor-result="pravaExpandovanaXor"
          :sbox-output="sBoxVystup"
          :pbox-output="pBoxVystup"
          :output-result="novaPravaPulka"
          :is-decryption="false"
        />

        <!-- Šifrovací proces - levá strana -->
        <section v-if="!zobrazitRundovniKlic && zobrazeniStrana === 'left' && vstupniText.length === 8 && klic.length === 8">
          <div class="des viz-step flex center column">
            <div>
              <span class="tertiary-color bold">L<sub>0</sub></span>
              <code class="binary-display next tertiary-color">{{ levaBin }}</code>
            </div>
            <p class="left step-description bold">
              Podle vzorce
              <span class="bold">L<sub>i</sub> = R<sub>i-1</sub></span>
              se z levé půlky stane pravá půlka a tím vytvoříme
              <span class="primary-color bold">L<sub>1</sub></span>
            </p>
            <code class="binary-display primary-color">{{ pravaBin }}</code>
          </div>
        </section>

        <!-- Finální výsledek šifrování -->
        <section
          v-if="
            (zobrazeniStrana === 'left' || zobrazeniStrana === 'right') &&
            vstupniText.length === 8 && klic.length === 8 && !zobrazitRundovniKlic
          "
          class="des viz-step flex column center"
        >
          <p class="step-description bold" style="margin-top: 5px">
            Spojení bloků
            <span class="primary-color bold">R<sub>1</sub></span>
            a
            <span class="primary-color bold">L<sub>1</sub></span>
          </p>
          <code class="binary-display primary-color result" style="margin-top: 7px; font-size: 9px;">
            {{ spojenoBlokyFormatovano }}
          </code>

          <p class="step-description bold" style="margin-top: 5px">
            Konečná inverzní permutace
            <a
              class="primary-color without-underline"
              href="#IP-inv"
              @click.prevent="$refs.ipInvModal.prepnout()"
            >
              <span class="primary-color">IP<sup style="font-size: 9px">-1</sup></span>
            </a>
          </p>

          <code class="binary-display bold result box-formula" style="font-size: 9px;">{{ konecnaPermutace }}</code>
        </section>

        <DesPermutationModal ref="ipInvModal" table-type="IP_INV" modal-class="ip-inv" />
      </section>

      <!-- DEŠIFROVÁNÍ -->
      <section v-if="jeRezimDesifrovani" class="desifrovani">

        <!-- Binární zobrazení Počáteční permutace a dělení-->
        <section class="des bin-visualization flex bin viz-step" v-if="maSeZobrazitBinarniDesifrovat" style="gap: 11px;">
          <!-- Komponenta pro binární zobrazení -->
          <DesBinaryDisplay 
            :binary-data="textBin"
            :title="pocetBituZobrazeni === 64 ? 'Binární reprezentace textu' : `${pocetBituZobrazeni}/64 bitů`"
            :title-warning="pocetBituZobrazeni !== 64"
            :show-count="pocetBituZobrazeni === 64"
            :count="`${pocetBituZobrazeni}/64 bitů`"
          />

          <!-- Když jsou splněny všechny podmínky-->
          <div v-if="vstupniText.length === 64 && klic.length === 8" >
            <h4 style="opacity: 85%; font-size: 14px">
              Počáteční permutace
              <a
                class="primary-color without-underline"
                href="#IP"
                @click.prevent="$refs.ipModalDecrypt.prepnout()"
              >
                IP
              </a>
              a dělení na
              <span class="tertiary-color">R<sub>1</sub></span>,
              <span class="tertiary-color">L<sub>1</sub></span>
            </h4>
            <div class="binary flex column center">
              <code
                class="binary-display binary-half clickable tertiary-color"
                :class="{
                  active: zobrazeniStrana === 'left',
                  'highlight-left': zvyrazneniLevy,
                }"
                @click="zobrazitLevy"
                title="Klikněte pro zobrazení R1"
              >
                <span style="font-family: 'Inter'; font-size:10px;">R<sub>1</sub>:</span><span style="text-decoration: underline;">{{ dLevaBin }}</span>
              </code>
              <code
                class="binary-display binary-half clickable tertiary-color"
                :class="{ active: zobrazeniStrana === 'right' }"
                @click="zobrazitPravy"
                title="Klikněte pro zobrazení L1"
              >
                <span style="font-family: 'Inter'; font-size:10px;">L<sub>1</sub>:</span><span style="text-decoration: underline;">{{ dPravaBin }}</span>
              </code>
            </div>
          </div>

        </section>
        
        <!-- Modální okno pro Počáteční permutaci -->
        <DesPermutationModal ref="ipModalDecrypt" table-type="IP" modal-class="ip" />

        <!-- Generování rundovního klíče -->
        <DesRoundKeyGeneration
          v-if="zobrazitRundovniKlic && vstupniText.length === 64 && klic.length === 8"
          :keyText="klic"
          :keyBinary="klicBin"
          :key56AfterPC1="klic56PoPC1"
          :c0="C0"
          :d0="D0"
          :c1="C1"
          :d1="D1"
          :roundKey="rundovniKlic"
          @close="skrytRundovniKlic"
        />

        <!-- Dešifrovací proces - levá strana (R1 -> R0) -->
        <section v-if="!zobrazitRundovniKlic && zobrazeniStrana === 'left' && vstupniText.length === 64 && klic.length === 8">
          <div class="des viz-step flex column center">
            <div>
              <span class="tertiary-color bold">R<sub>1</sub></span>
              <code class="binary-display next tertiary-color">{{ dLevaBin }}</code>
            </div>
            <p class="left step-description bold">
              Podle vzorce
              <span class="bold">R<sub>i-1</sub> = L<sub>i</sub></span>
              získáme
              <span class="primary-color bold">R<sub>0</sub></span>
            </p>
            <code class="binary-display primary-color">{{ dPravaBin }}</code>
          </div>
        </section>

        <!-- Dešifrovací proces - pravá strana (L1 -> L0) -->
        <DesProcessVisualization
          v-if="!zobrazitRundovniKlic && zobrazeniStrana === 'right' && vstupniText.length === 64 && klic.length === 8"
          :input-binary="dPravaBin"
          :expanded-input="dPravaExpandovana"
          :xor-result="dPravaExpandovanaXor"
          :sbox-output="dSBoxVystup"
          :pbox-output="dPBoxVystup"
          :output-result="dNovaLevaPulka"
          :is-decryption="true"
        />

        <!-- Finální výsledek dešifrování -->
        <section
          v-if="
            !zobrazitRundovniKlic &&
            (zobrazeniStrana === 'left' || zobrazeniStrana === 'right') &&
            vstupniText.length === 64 && klic.length === 8
          "
          class="des viz-step flex column center"
        >
          <p class="step-description bold" style="margin-top: 5px">
            Spojení bloků
            <span class="primary-color bold">L<sub>0</sub></span>
            a
            <span class="primary-color bold">R<sub>0</sub></span>
          </p>
          <code class="binary-display primary-color result" style="margin-top: 7px ; font-size: 9px;">
            {{ dSpojenoBlokyFormatovano }}
          </code>

          <p class="step-description bold" style="margin-top: 5px">
            Konečná permutace
            <a
              class="primary-color without-underline"
              href="#IP-inv"
              @click.prevent="$refs.ipInvModalDecrypt.prepnout()"
            >
              <span class="primary-color">IP<sup style="font-size: 9px">-1</sup></span>
            </a>
            a převod na znaky pomocí ASCII
          </p>

          <code class="binary-display bold result box-formula">{{ dKonecnaPermutaceNaZnaky }}</code>
        </section>

        <DesPermutationModal ref="ipInvModalDecrypt" table-type="IP_INV" modal-class="ip-inv" />
      </section>

    </aside>

    <!-- Komponenta pro zobrazení informací o šifře -->
    <CipherInfo :show="zobrazitInfo" @close="zobrazitInfo = false">
      <DesInfoContent />
    </CipherInfo>

  </main>
</template>

<script>
import DesBinaryDisplay from './components/DesBinaryDisplay.vue';
import DesRoundKeyGeneration from './components/DesRoundKeyGeneration.vue';
import DesProcessVisualization from './components/DesProcessVisualization.vue';
import DesPermutationModal from './components/DesPermutationModal.vue';
import DesInfoContent from './components/DesInfoContent.vue';

import {
  textToBinary,
  binaryToText,
  applyPermutation,
  xorOperation,
  feistelFunction,
  generateFirstRoundKey,
  getC0,
  getD0,
  getC1,
  getD1,
  getKey56AfterPC1,
  encrypt,
  decrypt,
  splitIntoHalves,
  formatBinary,
  formatBy6Bits,
  formatBy8Bits,
  formatBy4Bits
} from '@/utils/ciphers/des.js';

import { IP, IP_INV } from '../../../utils/constants/permutationTables.js';

export default {
  name: "DesCipherView",
  components: {
    DesBinaryDisplay,
    DesRoundKeyGeneration,
    DesProcessVisualization,
    DesPermutationModal,
    DesInfoContent
  },
  data() {
    return {
      vstupniText: "",
      vystupniText: "",
      zobrazitInfo: false,
      zobrazitToast: false,
      klic: "",
      zobrazeniStrana: "right",
      zvyrazneniLevy: false,
      zobrazitRundovniKlic: false,
      typVstupu: "text",
      automatickePrepnuti: false,
      userInteracted: false,

      // Cache pro vizualizační data
      vizData: null,
      dVizData: null,
    };
  },
  methods: {
    sifrovat() {
      if (!this.vstupniText || this.vstupniText.length !== 8 || !this.klic || this.klic.length !== 8) {
        this.vystupniText = "";
        return;
      }
      try {
        this.vystupniText = encrypt(this.vstupniText, this.klic);
      } catch (error) {
        console.error("Chyba při šifrování:", error);
        this.vystupniText = "";
      }
    },
    desifrovat() {
      if (!this.vstupniText || this.vstupniText.length !== 64 || !/^[01]+$/.test(this.vstupniText) || !this.klic || this.klic.length !== 8) {
        this.vystupniText = "";
        return;
      }
      try {
        this.vystupniText = decrypt(this.vstupniText, this.klic);
      } catch (error) {
        console.error("Chyba při dešifrování:", error);
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
      this.klic = "";
      this.userInteracted = false;
    },
    filtrovatKlic(udalost) {
      this.userInteracted = true;
      const hodnota = udalost.target.value;
      let filtrovanaHodnota = "";
      for (let i = 0; i < hodnota.length; i++) {
        const znak = hodnota[i];
        if (/[a-zA-Z]/.test(znak)) {
          filtrovanaHodnota += znak.toUpperCase();
        }
      }
      this.klic = filtrovanaHodnota;
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
    desFilter(text) {
      if (this.typVstupu === "bity") {
        let vysledek = "";
        for (let i = 0; i < text.length && i < 64; i++) {
          if (text[i] === "0" || text[i] === "1") {
            vysledek += text[i];
          }
        }
        return vysledek;
      } else {
        let vysledek = "";
        for (let i = 0; i < text.length && i < 8; i++) {
          if (/[a-zA-Z]/.test(text[i])) {
            vysledek += text[i].toUpperCase();
          }
        }
        return vysledek;
      }
    },
    generovatNahodny() {
      const key = [
        "PASSWORD", "SECURITY", "ENCODING", "DECIPHER",
        "PROTOCOL", "EXCHANGE", "BACKDOOR", "FIREWALL",
        "COMPUTER", "SOFTWARE", "HARDWARE", "KEYBOARD",
        "TRAPDOOR", "DATABASE",
        "ENCRYPTS", "DECRYPTS", "FUNCTION"
      ];
      const message = "MESSAGES"

      const nahodnyIndex = Math.floor(Math.random() * key.length);
      this.typVstupu = "text";
      this.klic = key[nahodnyIndex];
      this.vstupniText = message;
      this.userInteracted = true;
    },
    prepocitejVizualizaci() {
      // reset Cache
      this.vizData = null;
      this.dVizData = null;

      // Šifrování - když je text 
      if (this.jeRezimSifrovani && this.klic.length === 8 && this.vstupniText.length === 8) {
        const klicBin = textToBinary(this.klic);
        const textBin = textToBinary(this.vstupniText);
        const permutovany = applyPermutation(textBin, IP);
        const { left: leva, right: prava } = splitIntoHalves(permutovany);
        
        const pravaBits = prava.replace(/\s/g, "");
        const roundKey = generateFirstRoundKey(klicBin);
        const { expanded, xorResult, sBoxOutput, pBoxOutput } = feistelFunction(pravaBits, roundKey);
        const novaPrava = xorOperation(leva.replace(/\s/g, ""), pBoxOutput);
        const spojeno = novaPrava + prava.replace(/\s/g, "");
        const konecna = applyPermutation(spojeno, IP_INV);

        this.vizData = {
          klicBin,
          textBin,
          permutovany,
          leva,
          prava,
          expanded: formatBy8Bits(expanded),
          roundKey: formatBy8Bits(roundKey),
          xorResult: formatBy6Bits(xorResult),
          sBoxOutput: formatBy4Bits(sBoxOutput),
          pBoxOutput: formatBinary(pBoxOutput),
          novaPrava: formatBinary(novaPrava),
          konecna,
          klic56PoPC1: getKey56AfterPC1(klicBin),
          C0: getC0(klicBin),
          D0: getD0(klicBin),
          C1: getC1(klicBin),
          D1: getD1(klicBin),
        };
      }

      // Dešifrování - když je binární
      if (this.jeRezimDesifrovani && this.klic.length === 8 && this.vstupniText.length === 64) {
        const klicBin = textToBinary(this.klic);
        const vstup = this.vstupniText.replace(/\s/g, "");
        const permutovany = applyPermutation(formatBinary(vstup), IP);
        const permutovanyBezMezer = permutovany.replace(/\s/g, "");
        const { left: R1, right: L1 } = splitIntoHalves(permutovanyBezMezer);
        
        const R0 = L1;
        const pravaBits = R0.replace(/\s/g, "");
        const roundKey = generateFirstRoundKey(klicBin);
        const { expanded, xorResult, sBoxOutput, pBoxOutput } = feistelFunction(pravaBits, roundKey);
        const L0 = xorOperation(R1.replace(/\s/g, ""), pBoxOutput);
        const spojeno = L0 + R0.replace(/\s/g, "");
        const konecna = applyPermutation(spojeno, IP_INV);
        const text = binaryToText(konecna.replace(/\s/g, ""));

        this.dVizData = {
          klicBin,
          permutovany,
          R1,
          L1,
          R0,
          expanded: formatBy8Bits(expanded),
          roundKey: formatBy8Bits(roundKey),
          xorResult: formatBy6Bits(xorResult),
          sBoxOutput: formatBy4Bits(sBoxOutput),
          pBoxOutput: formatBinary(pBoxOutput),
          L0: formatBinary(L0),
          konecna: konecna.replace(/\s/g, ""),
          text,
          klic56PoPC1: getKey56AfterPC1(klicBin),
          C0: getC0(klicBin),
          D0: getD0(klicBin),
          C1: getC1(klicBin),
          D1: getD1(klicBin),
        };
      }
    },
    zobrazitLevy() {
      this.zobrazeniStrana = "left";
    },
    zobrazitPravy() {
      this.zobrazeniStrana = "right";
    },
    zobrazRundovniKlic() {
      this.zobrazitRundovniKlic = true;
    },
    skrytRundovniKlic() {
      this.zobrazitRundovniKlic = false;
    },
  },
  // WATCH: sleduje změny konkrétní reaktivní proměnné a spustí funkci, když se změní
  watch: {
    vstupniText() {
      this.prepocitejVizualizaci();
    },
    klic() {
      this.prepocitejVizualizaci();
    },
    typVstupu() {
      if (this.automatickePrepnuti) {
        this.automatickePrepnuti = false;
        return;
      }
      this.vstupniText = "";
      this.vystupniText = "";
    }
  },
  // COMPUTED: vypočítaná hodnota, která se automaticky přepočítá, jen když se změní data, na kterých závisí
  computed: {
    vizPodminky() {
      return this.klic.length === 8 && 
        ((/^[A-Za-z]+$/.test(this.vstupniText) && this.vstupniText.length === 8) ||
        (/^[01\s]+$/.test(this.vstupniText) && this.vstupniText.replace(/\s/g, '').length === 64));
    },

    jeRezimSifrovani() {
      return /^[A-Za-z]+$/.test(this.vstupniText);
    },
    
    jeRezimDesifrovani() {
      return /^[01]+$/.test(this.vstupniText);
    },
    
    maSeZobrazitBinarni() {
      return this.vstupniText.length > 0 && this.jeRezimSifrovani && this.klic.length === 8;
    },
    
    maSeZobrazitBinarniDesifrovat() {
      return this.vstupniText.length > 0 && this.jeRezimDesifrovani && this.klic.length === 8;
    },

    pocetBituZobrazeni() {
      const t = (this.vstupniText || "").toString();
      return /^[01\s]+$/.test(t) ? t.replace(/\s/g, "").length : t.length * 8;
    },

    // Šifrování, všechny computed properties čtou z vizData cache
    klicBin() {
      return (this.vizData && this.vizData.klicBin) || (this.dVizData && this.dVizData.klicBin) || "";
    },
    textBin() {
      if (this.vizData && this.vizData.textBin) {
        return this.vizData.textBin;
      }
      if (this.jeRezimDesifrovani) {
        return formatBinary(this.vstupniText);
      }
      if (this.jeRezimSifrovani && this.vstupniText.length > 0) {
        return textToBinary(this.vstupniText);
      }
      return "";
    },
    textBinPermutovany() {
      return this.vizData && this.vizData.permutovany;
    },
    levaBin() {
      return this.vizData && this.vizData.leva;
    },
    pravaBin() {
      return this.vizData && this.vizData.prava;
    },
    pravaExpandovana() {
      return (this.vizData && this.vizData.expanded) || [];
    },
    rundovniKlic() {
      return (this.vizData && this.vizData.roundKey) || (this.dVizData && this.dVizData.roundKey) || [];
    },
    pravaExpandovanaXor() {
      return (this.vizData && this.vizData.xorResult) || [];
    },
    sBoxVystup() {
      return (this.vizData && this.vizData.sBoxOutput) || [];
    },
    pBoxVystupFull() {
      return this.vizData && this.vizData.pBoxOutput && this.vizData.pBoxOutput.replace(/\s/g, "");
    },
    pBoxVystup() {
      return this.vizData && this.vizData.pBoxOutput;
    },
    novaPravaPulka() {
      return this.vizData && this.vizData.novaPrava;
    },
    spojenebloky() {
      if (this.vizData && this.vizData.novaPrava && this.vizData.prava) {
        return this.vizData.novaPrava.replace(/\s/g, "") + this.vizData.prava.replace(/\s/g, "");
      }
      return "";
    },
    konecnaPermutace() {
      return this.vizData && this.vizData.konecna;
    },
    spojenoBlokyFormatovano() {
      if (this.vizData && this.vizData.novaPrava && this.vizData.prava) {
        return this.vizData.novaPrava + " " + this.vizData.prava;
      }
      return "";
    },
    klic56PoPC1() {
      return (this.vizData && this.vizData.klic56PoPC1) || (this.dVizData && this.dVizData.klic56PoPC1);
    },
    C0() {
      return (this.vizData && this.vizData.C0) || (this.dVizData && this.dVizData.C0);
    },
    D0() {
      return (this.vizData && this.vizData.D0) || (this.dVizData && this.dVizData.D0);
    },
    C1() {
      return (this.vizData && this.vizData.C1) || (this.dVizData && this.dVizData.C1);
    },
    D1() {
      return (this.vizData && this.vizData.D1) || (this.dVizData && this.dVizData.D1);
    },

    // Dešifrování, všechny computed properties čtou z dVizData cache
    dLevaBin() {
      return this.dVizData && this.dVizData.R1;
    },
    dPravaBin() {
      return this.dVizData && this.dVizData.R0;
    },
    dPravaExpandovana() {
      return (this.dVizData && this.dVizData.expanded) || [];
    },
    dPravaExpandovanaXor() {
      return (this.dVizData && this.dVizData.xorResult) || [];
    },
    dSBoxVystup() {
      return (this.dVizData && this.dVizData.sBoxOutput) || [];
    },
    dPBoxVystupFull() {
      return this.dVizData && this.dVizData.pBoxOutput && this.dVizData.pBoxOutput.replace(/\s/g, "");
    },
    dPBoxVystup() {
      return this.dVizData && this.dVizData.pBoxOutput;
    },
    dNovaLevaPulka() {
      return this.dVizData && this.dVizData.L0;
    },
    dSpojeneBlok() {
      if (this.dVizData && this.dVizData.L0 && this.dVizData.R0) {
        return this.dVizData.L0.replace(/\s/g, "") + this.dVizData.R0.replace(/\s/g, "");
      }
      return "";
    },
    dKonecnaPermutace() {
      return this.dVizData && this.dVizData.konecna;
    },
    dKonecnaPermutaceNaZnaky() {
      return this.dVizData && this.dVizData.text;
    },
    dSpojenoBlokyFormatovano() {
      if (this.dVizData && this.dVizData.L0 && this.dVizData.R0) {
        return this.dVizData.L0 + " " + this.dVizData.R0;
      }
      return "";
    },
    computedDisableEncryptDes() {
      if (!this.userInteracted) return false;
      return (this.vstupniText.length > 0 && this.vstupniText.length !== 8) ||
             (this.klic.length > 0 && this.klic.length !== 8);
    },
    computedDisableDecryptDes() {
      if (!this.userInteracted) return false;
      return (this.klic.length > 0 && this.klic.length !== 8) ||
             (this.vstupniText.length > 0 && this.vstupniText.length !== 64) ||
             (this.vstupniText.length > 0 && !/^[01]+$/.test(this.vstupniText));
    },
  },
};
</script>

<style scoped>
@import "@/assets/styles/cipher/des.css";
</style>