<template>
  <div>
    <h3 id="info-title">O Posunné šifře</h3>
    <p>
      Posunná šifra, nebo také známá jako
      <router-link to="/#caesarova" class="primary-color without-underline"
        >Caesarova šifra</router-link
      >. je pojmenována po římském vojenském a politickém vůdci Gaiu Juliu
      Caesarovi, který tuto jednoduchou šifru používal pro šifrování
      vojenských zpráv. Je to
      <router-link
        to="/#monoalfabeticka"
        class="primary-color without-underline"
        >monoalfabetická šifra</router-link
      >.
    </p>
    <h4>Popis</h4>
    <p>
      Posuvná šifra je typ šifry, kde je každý znak v otevřeném textu nahrazen
      znakem, který je posunut o pevný počet míst v abecedě. Například při
      posunu o 3 se písmeno "A" stane "D", "B" se stane "E", a tak dále. Po
      dosažení konce abecedy se pokračuje od začátku (např. "Z" se stane "C").
    </p>
    <p>
      Každé písmeno v původním textu je převedeno na svůj index v abecedě (0
      pro A, 1 pro B atd.). Poté se použije vzorec pro šifrování:
    </p>
    <h5>Vzorec pro šifrování</h5>
    <pre
      style="
        white-space: pre-wrap;
        font-size: 1em;
        font-weight: bold;
        color: #36a06f;
      "
    >
C = (P + K) MOD 26</pre
    >
    <p>
      Kde C je index šifrovaného písmene, P je index původního písmene a K je
      hodnota posunu (klíč).
    </p>
    <h5>Vzorec pro dešifrování</h5>
    <pre
      style="
        white-space: pre-wrap;
        font-size: 1em;
        font-weight: bold;
        color: #36a06f;
      "
    >
P = (C - K + 26) MOD 26</pre
    >
    <p>
      Kde P je index původního písmene, C je index šifrovaného písmene a K je
      hodnota posunu (klíč).
    </p>
    <h4>Bezpečnost</h4>
    <p>
      Počet možných klíčů odpovídá velikosti použité abecedy. Pro 26 písmen je
      tedy 26 klíčů, ale 26. klíč je bezvýznamný (každé písmeno se mapuje samo
      na sebe). Ve skutečnosti je tedy pouze 25 smysluplných klíčů, to
      umožňuje snadné prolomení šifry vyzkoušením všech možností
      <router-link to="/#brute-force" class="primary-color without-underline"
        >brute-force</router-link
      >.
    </p>
    <h4>Více informací</h4>
    <a
      href="https://en.wikipedia.org/wiki/Caesar_cipher"
      target="_blank"
      class="primary-color without-underline"
    >
      Wikipedia: Caesar cipher
    </a>
    <h4>Test</h4>
    <p>
      Jaký je původní text pro šifrovaný text
      <strong>KHOOR ZRUOG</strong>?
    </p>
    <details>
      <summary>Odpověď</summary>
      <p>Původní text je <strong>HELLO WORLD</strong></p>
    </details>
  </div>
</template>

<script>
export default {
  name: 'CaesarInfoContent'
}
</script>
