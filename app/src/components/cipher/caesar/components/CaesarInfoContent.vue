<template>
  <div>
    <h3 id="info-title">Posuvná šifra</h3>

    <!-- Tabs -->
    <div class="info-tabs">
      <button
        :class="['info-tab-btn', activeTab === 'definice' ? 'active' : '']"
        @click="activeTab = 'definice'"
      >Definice</button>
      <button
        :class="['info-tab-btn', activeTab === 'teorie' ? 'active' : '']"
        @click="activeTab = 'teorie'"
      >Teorie</button>
    </div>

    <!-- Teorie -->
    <div v-if="activeTab === 'teorie'">
      <p>
        Posuvná šifra, nebo také známá jako
        <router-link to="/#caesarova" class="primary-color without-underline"
          >Caesarova šifra</router-link
        >, je pojmenována po římském vojenském a politickém vůdci Gaiu Juliu
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
      <h4>Bezpečnost</h4>
      <p>
        Počet možných klíčů odpovídá velikosti použité abecedy. Pro 26 písmen je
        tedy 26 klíčů, ale 26. klíč je bezvýznamný (každé písmeno se mapuje samo
        na sebe). Ve skutečnosti je tedy pouze 25 smysluplných klíčů, to
        umožňuje snadné prolomení šifry vyzkoušením všech možností
        <router-link to="/#brute-force" class="primary-color without-underline"
          >útok hrubou silou</router-link
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
    </div>

    <!-- Definice -->
    <div v-if="activeTab === 'definice'">
      
      <h4>Definice</h4>
      <p>
        Nechť <strong class="primary-color">P = C = K = Z<sub>26</sub></strong>.
        Pro klíč <strong class="primary-color">K</strong> (0 ≤ K ≤ 25) jsou šifrovací
        a dešifrovací funkce definovány takto:
      </p>
      <pre class="formula">e<sub style="font-size: 14px;">K</sub>(x) = (x + K) mod 26</pre>
      <pre class="formula">d<sub style="font-size: 14px;">K</sub>(y) = (y − K) mod 26</pre>
      <p style="font-size: 0.9em; color: var(--text-muted, #888);">
        kde x, y ∈ Z<sub>26</sub> ; x je index plaintext písmene, y je index ciphertext písmene
        (A = 0, B = 1, …, Z = 25).
      </p>

      <h4>Modulární aritmetika</h4>
      <p>
        Posuvná šifra je postavena na modulární aritmetice. Zápis
        <strong class="primary-color">a mod m</strong> označuje zbytek po dělení
        <strong class="primary-color">a</strong> číslem <strong class="primary-color">m</strong> (vždy nezáporný). Například:
        101 mod 7 = 3, protože 101 = 7 × 14 + 3.
      </p>
      <pre class="formula">a mod m = r </pre>
      <p>
        Množina <strong class="primary-color">Z<sub>26</sub></strong> = {0, 1, …, 25}
        s operacemi sčítání a násobení (vše modulo 26) tvoří základ pro posuvnou šifru.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CaesarInfoContent',
  data () {
    return {
      activeTab: 'definice'
    }
  }
}
</script>

