<template>
  <main class="container">
    <section class="home content flex">
  
      <section class="flex header-column">
        <header class="flex center home">
          <h1 class="flex column center">
            <span class="z-two">Šifrovač</span>
            <img
              src="@/assets/images/logo/logo.svg"
              alt="Logo"
              class="logo-inline"
              width="192"
              height="192"
            />
            <p class="z-two">Interaktivní průvodce kryptografií</p>
          </h1>
        </header>
        <div class="lead">
          <p>
            Tato aplikace slouží k vizualizaci šifrovacích algoritmů. Můžete si zde
            vyzkoušet různé historické i moderní šifry. Stačí zadat text, klíč a
            vizualizace vám ukáže postup šifrování nebo dešifrování. Pracuje pouze
            se znaky anglické abecedy, některé šifry přitom převádí znaky na čísla pomocí <a class="primary-color without-underline" target="_blank" href="https://cs.wikipedia.org/wiki/ASCII">ASCII</a>.
            Pokud vás zajímá teorie a formální definice, najdete
            je vždy pod ikonou
            <img
              src="@/assets/images/icons/infoicon.png"
              class="inline-icon"
              width="14"
              height="14"
              alt="Info ikona"
            />.
          </p>
        </div>
      </section>

      <section>
        <h2 class="home-h2">Úvod do kryptografie</h2>
        <div class="viz-step">
          <p>
            Základním cílem kryptografie je umožnit dvěma osobám (tradičně nazývaným
            <strong class="primary-color">Alice</strong> a <strong class="primary-color">Bob</strong>) komunikovat přes nezabezpečený kanál
            tak, aby případný útočník <strong class="primary-color">Oscar</strong> nemohl pochopit obsah zprávy.
            Informaci, kterou chce Alice odeslat, nazýváme <em>plaintext</em> (otevřený text).
            Alice plaintext zašifruje pomocí předem dohodnutého klíče a výsledný
            <em>ciphertext</em> (šifrovaný text) odešle přes kanál. Oscar sice ciphertext zachytí,
            ale bez znalosti klíče nedokáže zjistit původní zprávu. Bob, který klíč zná,
            ciphertext dešifruje a získá původní plaintext.
          </p>
          <p>
            Formálně se kryptosystém definuje jako pětice <strong class="primary-color">(P, C, K, E, D)</strong>, kde:
          </p>
          <ul style="list-style: none; padding-left: 0;">
            <li><strong class="primary-color">P</strong>: konečná množina možných plaintextů</li>
            <li><strong class="primary-color">C</strong>: konečná množina možných ciphertextů</li>
            <li><strong class="primary-color">K</strong>: klíčový prostor; konečná množina možných klíčů</li>
            <li><strong class="primary-color">E</strong>: množina šifrovacích pravidel; pro každý klíč K ∈ <strong class="primary-color">K</strong> existuje šifrovací funkce <strong class="primary-color">e<sub>K</sub> : P → C</strong></li>
            <li><strong class="primary-color">D</strong>: množina dešifrovacích pravidel; pro každý klíč K ∈ <strong class="primary-color">K</strong> existuje dešifrovací funkce <strong class="primary-color">d<sub>K</sub> : C → P</strong></li>
          </ul>
          <p>
            Důležitou vlastností je, že pro každý plaintext x ∈ P platí:
            <strong class="primary-color">d<sub>K</sub>(e<sub>K</sub>(x)) = x</strong>.<br>
            Tedy dešifrováním zašifrovaného textu vždy získáme zpět původní zprávu.
          </p>
        </div>
      </section>

      <section style="margin-top:0.7em;">
        <h2 class="home-h2">Historie šifrování</h2>

        <div class="timeline">
          <article class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content flex">
              <div>
                <span class="timeline-year">500 př. n. l.</span>
                <h3>Skytale</h3>
                <p>Spartská transpoziční šifra používající dřevěný válec</p>
              </div>
              <div class="timeline-image">
                <img
                  src="@/assets/images/history/scytale.webp"
                  loading="lazy"
                  alt="Scytale"
                  class="timeline-img"
                  width="101"
                  height="60"
                  style="margin-right: 0.7rem; margin-top: 1.3rem"
                />
              </div>
            </div>
          </article>
          <article class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content flex" id="caesarova">
              <div>
                <span class="timeline-year">100 př. n. l.</span>
                <h3>Caesarova šifra</h3>
                <p>
                  Julius Caesar používal posun o 3 pozice pro vojenské zprávy
                </p>
              </div>
              <div class="timeline-image">
                <img
                  src="@/assets/images/history/caesar.webp"
                  loading="lazy"
                  alt="Caesarova šifra"
                  class="timeline-img"
                  width="127"
                  height="80"
                  style="margin-right: -1rem"
                />
              </div>
            </div>
          </article>

          <article class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content flex" id="alberti-h">
              <div>
                <span class="timeline-year">1467</span>
                <h3>Albertiho disk</h3>
                <p>První polyalfabetická šifra, předchůdce Vigenèrovy šifry</p>
              </div>
              <div class="timeline-image">
                <img
                  src="@/assets/images/history/alberti.webp"
                  alt="Albertiho disk"
                  class="timeline-img alberti"
                  width="114"
                  height="78"
                  loading="lazy"
                  style="margin-top: 5px; margin-right: 2px"
                />
              </div>
            </div>
          </article>

          <article class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content flex" id="vigenere-h">
              <div>
                <span class="timeline-year">1586</span>
                <h3>Vigenèrova šifra</h3>
                <p>
                  Polyalfabetická šifra, považována za nerozluštitelnou po 300
                  let
                </p>
              </div>
              <div class="timeline-image">
                <img
                  src="@/assets/images/history/vigenere.webp"
                  alt="Vigenèrova šifra"
                  class="timeline-img vigenere"
                  width="63"
                  height="82"
                  style="margin-right: 25px; margin-top: 3px"
                  loading="lazy"
                />
              </div>
            </div>
          </article>

          <article class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content flex">
              <div>
                <span class="timeline-year">1918</span>
                <h3>Enigma</h3>
                <p>
                  Elektromechanický šifrovací stroj používaný Německem ve 2.
                  světové válce
                </p>
              </div>
              <div class="timeline-image">
                <img
                  src="@/assets/images/history/enigma.webp"
                  alt="Enigma"
                  class="timeline-img"
                  width="54"
                  height="73"
                  style="margin-right: 2rem; margin-top: 0.4rem"
                />
              </div>
            </div>
          </article>

          <article class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content flex" id="rsa">
              <div>
                <span class="timeline-year">1977</span>
                <h3>RSA</h3>
                <p>
                  Nejznámější asymetrická šifra, základ moderní kryptografie.
                  Používá se pro zabezpečení dat a pro digitální podpisy
                </p>
              </div>
              <div class="timeline-image">
                <img
                  src="@/assets/images/history/rsa.webp"
                  alt="RSA autoři"
                  class="timeline-img"
                  width="110"
                  height="63"
                  style="margin-top: 0.8rem; margin-right: 10px"
                />
              </div>
            </div>
          </article>

          <article class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content flex" id="aes">
              <div>
                <span class="timeline-year">2001</span>
                <h3>AES</h3>
                <p>
                  Advanced Encryption Standard - současné symetrické šifrování.
                  Zabezpečení dat v různých oblastech, včetně šifrování disků,
                  Wi-Fi sítí, VPN a HTTPS
                </p>
              </div>
              <div class="timeline-image">
                <img
                  src="@/assets/images/history/aes.webp"
                  alt="AES"
                  class="timeline-img"
                  width="95"
                  height="50"
                  style="margin-top: 1.2rem; padding-bottom: 1.5rem; margin-right: 13px"
                />
              </div>
            </div>
          </article>
        </div>
      </section>

      <section>
        <h2 class="home-h2">Základní pojmy</h2>
        <div class="home viz-step">
          <h3>Terminologie</h3>
          <p>
            <span class="primary-color">Kryptografie</span>: věda o utajování
            zpráv<br />
            <span class="primary-color">Kryptoanalýza</span>: věda o luštění
            zpráv<br />
            <span class="primary-color">Šifrovací funkce</span>: matematická
            funkce provádějící šifrování (proces, který ukryje obsah textu,
            převede ho do tvaru, který není srozumitelný)<br />
            <span class="primary-color">Děšifrovací funkce</span>: matematická
            funkce provádějící dešifrování (proces, který převede šifrovaný text
            zpět na původní text)<br />
            <span class="primary-color">Šifra</span>: společné označení pro
            šifrovací a dešifrovací funkci
          </p>
        </div>
        <div class="home viz-step">
          <h3>Typy šifer</h3>
          <p>
            <span class="primary-color">Omezené</span>: bezpečnost založena na
            utajení způsobu, jakým šifra pracuje. Na první pohled dobrý nápad,
            ale z praktického pohledu nevýhodné<br />
            <span class="primary-color">Založené na klíči</span>: bezpečnost
            šifry závisí pouze na utajení klíče, nikoliv na utajení šifry. Dál
            se dělí na symetrické a asymetrické<br />
            <span id="symetricke" class="primary-color">Symetrické šifry</span>: pro šifrování i
            dešifrování se používá stejný klíč. Mohou být monoalfabetické, nebo
            polyalfabetické<br />
            <span id="monoalfabeticka" class="primary-color"
              >Monoalfabetické</span
            >: pokud písmeno abecedy je mapováno na jiné písmeno téže abecedy,
            které je posunuté o určitý počet pozic<br />
            <span id="polyalfabeticka" class="primary-color"
              >Polyalfabetické</span
            >: pokud symbol abecedy je mapován na jeden z několika symbolů<br />
            <span id="asymetricke" class="primary-color">Asymetrické šifry</span
            >: používají se dva různé klíče - veřejný klíč pro šifrování a
            soukromý klíč pro dešifrování<br />
            <span id="blokova" class="primary-color">Bloková šifra</span
            >: symetrická šifra, která zpracovává data po pevně daných blocích
            bitů. Každý blok je šifrován stejným klíčem nezávisle<br />
            <span id="proudova" class="primary-color">Proudová šifra</span
            >: symetrická šifra, která šifruje data postupně bit po bitu (nebo
            znak po znaku) pomocí generovaného proudu klíčů
          </p>
        </div>
        <div class="home viz-step">
          <h3>Kryptoanalýza</h3>
          <p>
            <span id="brute-force" class="primary-color">Útok hrubou silou</span>:
            zkoušení všech možných klíčů, dokud se nenajde správný. Tato metoda
            je časově náročná a neefektivní pro šifry s dlouhými klíči.<br />
            <span id="frekvencni-analyza" class="primary-color"
              >Frekvenční analýza</span
            >: zkoumání frekvence výskytu jednotlivých písmen nebo skupin písmen
            v šifrovaném textu. Tato metoda je účinná u monoalfabetických šifer,
            kde některá písmena se v jazyce vyskytují častěji než jiná.<br />
            <span id="kasiskeho-test" class="primary-color">Kasiskiho test</span
            >: metoda používaná k určení délky klíče u polyalfabetických šifer.
            Analyzuje opakující se sekvence písmen v šifrovaném textu a
            vzdálenosti mezi nimi.<br />
            <span id="fridmanuv-test" class="primary-color">Fridmanův test</span
            >: statistická metoda pro odhad délky klíče u polyalfabetických
            šifer. Využívá indexu koincidence, který měří pravděpodobnost, že
            dvě náhodně vybraná písmena ze šifrovaného textu jsou stejná.<br />
            <span id="obtiznost-faktorizace" class="primary-color"
              >Obtížnost faktorizace velkých čísel</span
            >: základní princip bezpečnosti mnoha moderních asymetrických šifer.
            Představte si, že máte obrovské číslo, které vzniklo vynásobením
            dvou tajných prvočísel. Najít zpět ta dvě původní čísla je extrémně
            časově náročné. Právě na této obtížnosti je postavena bezpečnost
            moderního šifrování.
          </p>
        </div>
      </section>
    </section>
  </main>
</template>

<script>
export default {
  name: "HomeView",
  mounted() {
    const odkazNaSekci = this.$route.hash;
    
    if (odkazNaSekci) {
      // $nextTick zajistí, že počkáme, až se stránka úplně vykreslí
      this.$nextTick(() => {
        const element = document.querySelector(odkazNaSekci);
        element.scrollIntoView({ behavior: "smooth", block: "center" });

        // pokud je to položka v časové ose (timeline)
        if (element.classList.contains("timeline-content")) {
          element.classList.add("force-hover");
          const celaPolozka = element.closest(".timeline-item");
          celaPolozka.classList.add("force-hover");

          setTimeout(() => {
            element.classList.remove("force-hover");
            if (celaPolozka) {
              celaPolozka.classList.remove("force-hover");
            }
          }, 900);
        } else {
          // pokud je to text
          element.classList.add("tertiary-color");
          element.style.fontWeight = "900";

          setTimeout(() => {
            element.style.fontWeight = "";
            element.classList.remove("tertiary-color");
          }, 900);
        }
      });
    }
  },
};
</script>

<style scoped>
@import "@/assets/styles/layout/home.css";
</style>
