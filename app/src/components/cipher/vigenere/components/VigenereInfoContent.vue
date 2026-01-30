<!-- Komponenta pro informace o Vigenèrově šifře -->
<template>
  <div>
    <h3 id="info-title">O Vigenèrově šifře</h3>
    <p>
      Šifra vychází<router-link
        to="/#alberti-h"
        class="primary-color without-underline"
      >
        z šifry </router-link
      >florentského polyhistora Leona Battisty Albertiho.
      <router-link to="/#vigenere-h" class="primary-color without-underline">
        Vigenèrova šifra</router-link
      >
      je
      <router-link
        to="/#polyalfabeticka"
        class="primary-color without-underline"
        >polyalfabetická šifra</router-link
      >, která používá klíč k určení posunu pro každé písmeno v textu. Šifra
      je pojmenována po francouzském diplomatovi Blaise de Vigenère, který ji
      popularizoval v 16. století.
    </p>
    <h4>Popis</h4>
    <p>
      Vigenère šifra používá klíč, který se opakuje pro každé písmeno v textu.
      Každé písmeno v klíči určuje posun pro odpovídající písmeno v textu.
      Například, pokud je klíč "KEY" a text "HELLO", první písmeno "H" bude
      posunuto o hodnotu "K", druhé "E" o hodnotu "E", atd.
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
      index písmene v klíči.
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
      index písmene v klíči.
    </p>
    <h4>Bezpečnost</h4>
    <p>
      Existuje 26 na m-tou různých klíčů délky m, ale stále není bezpečná.
      Vigenère šifra byla považována za velmi bezpečnou až do 19. století, kdy
      byly vyvinuty metody k prolomení šifry, jako je
      <router-link
        to="/#kasiskeho-test"
        class="primary-color without-underline"
        >Kasiskiho test</router-link
      >
      a
      <router-link
        to="/#fridmanuv-test"
        class="primary-color without-underline"
        >Friedmanův test</router-link
      >. Dnes je Vigenèrova šifra považována za slabou a není doporučována pro
      bezpečnou komunikaci.
    </p>
    <h4>Více informací</h4>
    <a
      href="https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher"
      target="_blank"
      class="primary-color without-underline"
      >Vigenère cipher - Wikipedia</a
    >
    <h4>Test</h4>
    <p>
      Jaký je klíč pro šifrovaný text <strong>DIOIETXK</strong>, když původní
      text je <strong>SECURITY</strong>? Klíč má 5 znaků a je tvořen pouze
      písmeny.
    </p>
    <details>
      <summary>Odpověď</summary>
      <p>Klíč je <strong>LEMON</strong>.</p>
    </details>
  </div>
</template>

<script>
export default {
  name: 'VigenereInfoContent'
}
</script>
