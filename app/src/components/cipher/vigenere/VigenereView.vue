<template>
  <main class="container flex">

    <!-- 1.část: VSTUP UŽIVATELE -->
    <section class="content flex">

      <!-- Komponenta pro nadpis -->
      <CipherHeader title="Vigenèrova šifra" />

      <!-- Formulář pro nastavení parametrů -->
      <form class="params flex">
        <label id="key-label" for="key">Klíč:</label>
        <input
          type="text"
          id="key"
          v-model="klic"
          @input="filtrovatKlic"
          placeholder="Zadejte klíč (jen písmena)"
          class="input"
          style="width: 80%"
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

      <!-- Opakování klíče pro vstupní text -->
      <div
        v-if="klic.length && vstupniText.length"
        class="key-repetition flex column"
      >
        <label>Opakování klíče</label>
        <span>{{ opakovaniKlice }}</span>
      </div>

    </section>

    <!-- 2.část: VIZUALIZACE -->
    <aside class=" vigenere secondary-content flex">

      <!-- Tabulka recta  -->
      <section class="vigenere-table-wrapper">
        <legend class="table-legend">Řádek (klíč) × Sloupec (otevřený text) = Šifrovaný text</legend>
        <table class="vigenere-table neutral-background">
          <thead>
            <tr>
              <th class="bold"></th>
              <th 
                class="bold" 
                v-for="(col, indexSloupec) in abeceda" 
                :key="'col-' + col"
                :class="{
                  'primary-background neutral-color': vysledky.includes('sloupec-' + indexSloupec) && aktualniVysledek !== 'sloupec-' + indexSloupec,
                  'tertiary-background neutral-color': aktualniVysledek === 'sloupec-' + indexSloupec,
                  'tertiary-background neutral-color low-highlight': aktualniSloupec === indexSloupec,
                }"
              >
                {{ col }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(pismenoRadek, indexRadek) in abeceda"
              :key="'row-' + pismenoRadek"
            >
              <th class="bold"
                :class="{
                  'tertiary-background neutral-color low-highlight': aktualniRadek === indexRadek,
                }"
              >{{ pismenoRadek }}</th>
              <td
              v-for="(pismenoSloupec, indexSloupec) in abeceda"
              :key="pismenoRadek + '-' + pismenoSloupec"
              :class="{
                'neutral-color bold primary-background':
                  vysledky.includes(`${indexRadek}-${indexSloupec}`) && aktualniVysledek !== `${indexRadek}-${indexSloupec}`,
                'neutral-color bold tertiary-background':
                  aktualniVysledek === `${indexRadek}-${indexSloupec}`,
                'neutral-color bold tertiary-background low-highlight':
                  aktualniPar === `${indexRadek}-${indexSloupec}`,
              }"
            >
              {{ abeceda[(indexSloupec + indexRadek) % 26] }}
            </td>
            </tr>
          </tbody>
        </table>
      </section>

    </aside>

    <!-- Komponenta pro zobrazení informací o šifře -->
    <CipherInfo :show="zobrazitInfo">
      <VigenereInfoContent />
    </CipherInfo>

  </main>
</template>

<script>
import { encrypt, decrypt } from '@/utils/ciphers/vigenere';
import VigenereInfoContent from './components/VigenereInfoContent.vue';
export default {
  name: "VigenereView",
  components: {
    VigenereInfoContent
  },
  // reaktivní proměnné 
  data() {
    return {
      klic: "",
      vstupniText: "",
      vystupniText: "",
      zobrazitInfo: false,
      zobrazitToast: false,
      abeceda: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), // split("") mi udělá pole 26 znaků ze stringu
      rezim: "encrypt"
    };
  },
  methods: {
    // šifrování a dešifrování
    async sifrovat() {
      this.rezim = "encrypt";

      // není klíč, vrať vstupní text
      if (!this.klic || this.klic.trim() === "") {
        this.vystupniText = this.vstupniText;
        return;
      }

      try {
        this.vystupniText = encrypt(this.vstupniText, this.klic);
      } catch (error) {
        console.error("Došlo k chybě při šifrování:", error);
        alert("Chyba při šifrování, zkontrolujte parametry");
      }
    },
    async desifrovat() {
      this.rezim = "decrypt";

      // není klíč, vrať vstupní text
      if (!this.klic || this.klic.trim() === "") {
        this.vystupniText = this.vstupniText;
        return;
      }

      try {
        this.vystupniText = decrypt(this.vstupniText, this.klic);
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
      this.klic = "";
    },
    filtrovatKlic() {
      this.klic = this.klic.toUpperCase().replace(/[^A-Z]/g, "");
    },
  },
  // COMPUTED: vypočítaná hodnota, která se automaticky přepočítá, jen když se změní data, na kterých závisí (né pokaždé když je volána)
  computed: {
    // vizualizace zvýraznění v tabulce
    zvyrazneni() {
      const vysledek = {
        pary: [], // cesta -buňky které vedly k výsledku
        sloupce: [], // cesta - sloupce (otevřený text)
        radky: [], // cesta - řádky (klíč)
        vysledky: [], // zelené - buňky s výsledky
        aktualniPar: null,
        aktualniSloupec: null,
        aktualniRadek: null,
        aktualniVysledek: null,
      };

      if (this.klic === "" || this.vstupniText === "") {
        return vysledek;
      }

      let poziceKlice = 0;
      const desifrujeme = this.rezim === "decrypt"; 

      for (let i = 0; i < this.vstupniText.length; i++) {
        const pismeno = this.vstupniText[i];
        
        if (pismeno === " " || pismeno === ".") {
          continue;
        }

        const pismenoZKlice = this.klic[poziceKlice % this.klic.length];

        const radek = this.abeceda.indexOf(pismenoZKlice);
        const pozicePismena = this.abeceda.indexOf(pismeno);

        let sloupec;
        
        if (desifrujeme) {
          // dešifrování: hledáme sloupec s dešifrovaným písmenem
          sloupec = (pozicePismena - radek + 26) % 26;
          
          const jeUzVSeznamu = vysledek.vysledky.includes('sloupec-' + sloupec);
          if (!jeUzVSeznamu) {
            vysledek.vysledky.push('sloupec-' + sloupec);
          }
          
          const jeRadekVSeznamu = vysledek.radky.includes(radek);
          if (!jeRadekVSeznamu) {
            vysledek.radky.push(radek);
          }
          
          vysledek.pary.push(radek + "-" + sloupec);
        } else {
          // šifrování: sloupec je pozice původního písmena
          sloupec = pozicePismena;
          
          const vysledekBunka = radek + "-" + sloupec;
          const jeUzVSeznamu = vysledek.vysledky.includes(vysledekBunka);
          if (!jeUzVSeznamu) {
            vysledek.vysledky.push(vysledekBunka);
          }
          
          const jeSloupecVSeznamu = vysledek.sloupce.includes(sloupec);
          if (!jeSloupecVSeznamu) {
            vysledek.sloupce.push(sloupec);
          }
          
          const jeRadekVSeznamu = vysledek.radky.includes(radek);
          if (!jeRadekVSeznamu) {
            vysledek.radky.push(radek);
          }
        }

        // pokud je to poslední písmeno, ulož jako aktuální (modře)
        const jePoslední = (i === this.vstupniText.length - 1);
        if (jePoslední) {
          if (desifrujeme) {
            vysledek.aktualniPar = radek + "-" + sloupec;
            vysledek.aktualniVysledek = 'sloupec-' + sloupec;
            vysledek.aktualniRadek = radek;
          } else {
            const vysledekBunka = radek + "-" + sloupec;
            vysledek.aktualniVysledek = vysledekBunka;
            vysledek.aktualniSloupec = sloupec;
            vysledek.aktualniRadek = radek;
          }
        }

        poziceKlice = poziceKlice + 1;
      }

      return vysledek;
    },
    
    // zkratky pro template
    zvyraznenePary() {
      return this.zvyrazneni.pary;
    },
    zvyrazneneSloupce() {
      return this.zvyrazneni.sloupce;
    },
    zvyrazneneRadky() {
      return this.zvyrazneni.radky;
    },
    vysledky() {
      return this.zvyrazneni.vysledky;
    },
    aktualniPar() {
      return this.zvyrazneni.aktualniPar;
    },
    aktualniSloupec() {
      return this.zvyrazneni.aktualniSloupec;
    },
    aktualniRadek() {
      return this.zvyrazneni.aktualniRadek;
    },
    aktualniVysledek() {
      return this.zvyrazneni.aktualniVysledek;
    },

    // opakování klíče pro vstupní text
    opakovaniKlice() {
      if (this.klic === "") {
        return "";
      }
      if (this.vstupniText === "") {
        return "";
      }
      let opakovanyKlic = "";
      let poziceKlice = 0;
      for (let i = 0; i < this.vstupniText.length; i++) {
        const znak = this.vstupniText[i];
        // pro mezery a tečky přidat mezeru do opakovaného klíče
        if (znak === " " || znak === ".") {
          opakovanyKlic += znak;
        } else {
          opakovanyKlic += this.klic[poziceKlice % this.klic.length];
          poziceKlice++;
        }
      }
      return `${opakovanyKlic}`;
    },
  },
};
</script>

<style scoped>
@import "@/assets/styles/cipher/vigenere.css";
</style>
