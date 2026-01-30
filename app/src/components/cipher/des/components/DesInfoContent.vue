<!-- Komponenta pro informace o DES (Data Encryption Standard) -->
<template>
  <div>
    <h3 id="info-title">O DES (Data Encryption Standard)</h3>
    
    <p>
      DES je bloková šifra vyvinutá společností IBM v 70. letech 20. století.
      V roce 1977 byla schválena americkou vládou jako federální standard pro
      šifrování citlivých dat. Dnes je považována za zastaralou a nezabezpečenou
      kvůli své krátké délce klíče. Byla nahrazena modernějšími šiframi, jako je
      <router-link to="/#aes" class="primary-color without-underline">
        AES (Advanced Encryption Standard)
      </router-link>.
    </p>

    <h4>Popis</h4>
    <p>
      DES je založena na <span class="primary-color">Feistelově šifře</span> a pracuje s bloky dat o velikosti 64 bitů.
      je to symetrická bloková šifra, která používá klíč o délce 56 bitů
      (+ 8 paritních bitů). Šifrování probíhá v 16 rundách, kde každá
      runda používá vlastní rundovní klíč o délce 48 bitů. Pro jednoduchost se v naší aplikaci
      používá pouze jedna a to první runda.
    </p>

    <h5>Základní charakteristiky</h5>
    <p>Typ: <router-link to="/#symetricke" class="primary-color without-underline">Symetrická</router-link>, bloková, bitově orientovaná šifra<br>
    Délka bloku: 64 bitů<br>
    Délka klíče: 56 bitů (+ 8 paritních bitů = 64 bitů celkem)<br>
    Počet rund: 16<br>
    Délka rundovních klíčů: 48 bitů</p>

    <h5>Postup šifrování</h5>
    <ol>
      <li>
        Počáteční permutace:
        Vstupní blok 64 bitů se permutuje podle tabulky <span class="primary-color">IP</span>
      </li>
      <li>
        Rozdělení:
        Permutovaný blok se rozdělí na levou <span class="tertiary-color">L<sub>0</sub></span> a pravou <span class="tertiary-color">R<sub>0</sub></span> polovinu po 32 bitech
      </li>
      <li>
        16 rund: Pro každou rundu i = 1 až 16:
        <span class="tertiary-color">L<sub>i</sub> = R<sub>i-1</sub></span> a 
        <span class="tertiary-color">R<sub>i</sub> = L<sub>i-1</sub> ⊕ f(k<sub>i</sub>, R<sub>i-1</sub>)</span>
      </li>
      <li>
        Konečná permutace:
        Spojí se <span class="tertiary-color">R<sub>16</sub></span> a <span class="tertiary-color">L<sub>16</sub></span> a aplikuje se inverzní počáteční permutace <span class="primary-color">IP<sup>-1</sup></span>
      </li>
    </ol>

    <h5>Rundovní funkce <span class="tertiary-color">f(k, R)</span></h5>
    <ol>
      <li>
        Expanzní permutace <span class="primary-color">E</span>:
        Rozšíření 32 bitů pravé poloviny na 48 bitů
      </li>
      <li>
        XOR s rundovním klíčem:
        <span class="primary-color">E(R) ⊕ k<sub>i</sub></span>
      </li>
      <li>
        <span class="primary-color">S-boxy</span>:
        8 substitučních boxů, každý převádí 6 bitů na 4 bity
      </li>
      <li>
        <span class="primary-color">P-box</span>:
        Permutace výsledných 32 bitů
      </li>
    </ol>

    <h5>Generování rundovních klíčů (k<sub>i</sub>)</h5>
    <ol>
      <li>Z 64-bitového klíče se odeberou paritní bity</li>
      <li>Zbylých 56 bitů se permutuje pomocí permutace <span class="primary-color">PC-1</span></li>
      <li>Klíč se rozdělí na <span class="tertiary-color">C<sub>0</sub></span> a <span class="tertiary-color">D<sub>0</sub></span> (každý po 28 bitech)</li>
      <li>
        Pro každou rundu i: <span class="tertiary-color"> C<sub>i</sub> = RL<sub>i</sub>(C<sub>i-1</sub>)</span> 
        a <span class="tertiary-color">D<sub>i</sub> = RL<sub>i</sub>(D<sub>i-1</sub>)</span>,<br>
        kde RL<sub>i</sub> je rotace doleva o 1 bit (pro rundy 1, 2, 9, 16) nebo 2 bity (ostatní rundy)
      </li>
      <li>Spojí se <span class="tertiary-color">C<sub>i</sub></span> a <span class="tertiary-color">D<sub>i</sub></span> a aplikuje se permutace <span class="primary-color">PC-2</span>
          pro získání 48-bitového rundovního klíče <span class="primary-color">k<sub>i</sub></span></li>
    </ol>

    <h5>Dešifrování</h5>
    <p>
      DES používá stejný algoritmus pro dešifrování jako pro šifrování díky
      Feistelově struktuře. Jediný rozdíl je v pořadí aplikace rundovních
      klíčů, při dešifrování se používají obráceně (k<sub>16</sub> až k<sub>1</sub>).
    </p>

    <h4>Bezpečnost</h4>
    <p>
      Počet možných klíčů je přibližně 72 kvadrilionů. I když se to zdá jako velké číslo,
      moderní počítače a distribuované systémy mohou tento prostor klíčů prohledat v
      rozumném čase. V roce 1998 byl DES prolomen za méně než 3 dny pomocí specializovaného hardwaru.
      DES je dnes považován za nezabezpečený kvůli krátké
      délce klíče - lze prolomit <router-link to="/#brute-force" class="primary-color without-underline">brute-force</router-link>.
    </p>

    <h4>Více informací</h4>
    <a
      href="https://en.wikipedia.org/wiki/Data_Encryption_Standard"
      target="_blank"
      class="primary-color without-underline"
    >
      Data Encryption Standard - Wikipedia
    </a>

    <h4>Test</h4>
    <p>
      Jaký je původní text, pokud máme zašifrovaný blok
      0000110001011101000101100101000101010110010001110001000101010100<br>
      i odpovídající klíč
      <strong>SECURITY</strong>?
    </p>
    <details>
      <summary>Odpověď</summary>
      <p><strong>MYSECRET</strong></p>
    </details>
  </div>
</template>

<script>
export default {
  name: 'DesInfoContent'
}
</script>
