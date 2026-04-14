<!-- Komponenta pro informace o Vigenèrově šifře -->
<template>
  <div>
    <h3 id="info-title">Vigenèrova šifra</h3>

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
        Šifra vychází
        <router-link to="/#alberti-h" class="primary-color without-underline">z šifry</router-link>
        florentského polyhistora Leona Battisty Albertiho.
        <router-link to="/#vigenere-h" class="primary-color without-underline">Vigenèrova šifra</router-link>
        je
        <router-link to="/#polyalfabeticka" class="primary-color without-underline">polyalfabetická šifra</router-link>,
        pojmenovaná po francouzském diplomatovi Blaise de Vigenère, který ji popularizoval v 16. století.
        Na rozdíl od monoalfabetických šifer (Posuvná, Substituční) je každý znak plaintextu
        šifrován jiným posuvem.
      </p>
      <h4>Popis</h4>
      <p>
        Klíčem je slovo délky <strong class="primary-color">m</strong>, které se cyklicky opakuje
        přes celý plaintext. Každé písmeno klíče určuje posun pro odpovídající písmeno textu.
      </p>
      <h4>Bezpečnost</h4>
      <p>
        Počet možných klíčů délky <strong class="primary-color">m</strong> je <strong class="primary-color">26<sup>m</sup></strong>.
        Při m = 5 je to přes 1,1 × 10<sup>7</sup> klíčů. Útok hrubou silou ručně již není reálný,
        ale počítačem stále možný. Šifra byla považována za nerozluštitelnou po 300 let, dokud nebyly
        vyvinuty metody jako
        <router-link to="/#kasiskeho-test" class="primary-color without-underline">Kasiskiho test</router-link>
        a
        <router-link to="/#fridmanuv-test" class="primary-color without-underline">Friedmanův test</router-link>.
      </p>
    </div>

    <!-- Definice -->
    <div v-if="activeTab === 'definice'">
      <h4>Definice</h4>
      <p>
        Nechť <strong class="primary-color">m</strong> je kladné celé číslo.<br>
        Definujeme <strong class="primary-color">P = C = K = (Z<sub>26</sub>)<sup>m</sup></strong>.<br>
        Pro klíč <strong class="primary-color">K = (k<sub>1</sub>, k<sub>2</sub>, …, k<sub>m</sub>)</strong>
        jsou funkce definovány:
      </p>
      <pre class="formula">e<sub style="font-size: 14px;">K</sub>(x₁,…,xₘ) = (x₁+k₁, x₂+k₂, …, xₘ+kₘ)</pre>
      <pre class="formula">d<sub style="font-size: 14px;">K</sub>(y₁,…,yₘ) = (y₁−k₁, y₂−k₂, …, yₘ−kₘ)</pre>
      <p style="font-size: 0.9em; color: var(--text-muted, #888);">
        kde všechny operace jsou prováděny v Z<sub>26</sub>.
      </p>

      <h4>Opakování klíče</h4>
      <p>
        Klíč délky <strong class="primary-color">m</strong> se cyklicky opakuje přes celý plaintext.
        Pro i-tý znak plaintextu se použije posun odpovídající písmenu klíče na pozici
        <strong class="primary-color">i mod m</strong>.
      </p>
      <pre class="formula">k<sub style="font-size: 14px;">(i mod m)</sub></pre>
      <p>
        Například pro klíč <span class="primary-color">CIPHER</span> (m = 6) a plaintext
        <em>thiscryptosystem…</em> se klíč opakuje:<br>
        C I P H E R C I P H E R …
      </p>
      <p style="font-size: 0.9em; color: var(--text-muted, #888);">
        i je index znaku v plaintextu (počítáno od 0)
      </p>

    </div>
  </div>
</template>

<script>
export default {
  name: 'VigenereInfoContent',
  data () {
    return {
      activeTab: 'definice'
    }
  }
}
</script>

