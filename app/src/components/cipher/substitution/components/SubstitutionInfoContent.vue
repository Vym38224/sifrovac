
<!-- Komponenta pro informace o Substituční šifře -->
<template>
  <div>
    <h3 id="info-title">Substituční šifra</h3>

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
        Substituční šifra je
        <router-link
          to="/#monoalfabeticka"
          class="primary-color without-underline"
          >monoalfabetická šifra</router-link
        >, která nahrazuje každé písmeno v textu jiným písmenem podle
        předem určené permutace.
      </p>
      <h4>Popis</h4>
      <p>
        Každé písmeno abecedy je nahrazeno jiným písmenem dle zvolené permutace.
        Například pro permutaci <strong class="primary-color">XNYAHPOGZQWBTSFLRCVMUEDJKI</strong>
        platí: a → X, b → N, c → Y, atd.
        Dešifrování probíhá pomocí inverzní permutace, tedy zpětným mapováním
        ciphertext písmen na plaintext.
      </p>
      <h4>Bezpečnost</h4>
      <p>
        Klíčový prostor obsahuje <strong class="primary-color">26!</strong> možných permutací
        (více než 4,0 × 10<sup>26</sup>), což činí útok hrubou silou nereálným
        i pro počítač. Přesto je šifra zranitelná vůči
        <router-link
          to="/#frekvencni-analyza"
          class="primary-color without-underline"
          >frekvenční analýze</router-link
        >, protože struktura jazyka (četnost písmen) zůstává zachována.
      </p>
      <h4>Více informací</h4>
      <a
        href="https://en.wikipedia.org/wiki/Substitution_cipher"
        target="_blank"
        class="primary-color without-underline"
        >Wikipedia: Substitution cipher</a
      >
    </div>

    <!-- Definice -->
    <div v-if="activeTab === 'definice'">
      <h4>Definice</h4>
      <p>
        Nechť <strong class="primary-color">P = C = Z<sub>26</sub></strong>.
        Klíčový prostor <strong class="primary-color">K</strong> tvoří všechny možné
        permutace 26 symbolů {0, 1, …, 25}. Pro každou permutaci
        <strong class="primary-color">π ∈ K</strong> jsou funkce definovány takto:
      </p>
      <pre class="formula">e<sub style="font-size: 14px;">π</sub>(x) = π(x)</pre>
      <pre class="formula">d<sub style="font-size: 14px;">π</sub>(y) = π<sup>−1</sup>(y)</pre>
      <p style="font-size: 0.9em; color: var(--text-muted, #888);">
        kde π<sup>−1</sup> je inverzní permutace k π ; x, y ∈ Z<sub>26</sub>.
      </p>

      <h4>Příklad permutace</h4>
      <p>Šifrovací permutace π:</p>
      <pre class="formula" style="font-size: 1.2em;">a b c d e f g h i j k l m n o p q r s t u v w x  y  z
X N Y A H P O G Z Q W B T S F L R C V M U E K J  D  I</pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubstitutionInfoContent',
  data () {
    return {
      activeTab: 'definice'
    }
  }
}
</script>

<style scoped>
.info-tabs {
  display: flex;
  gap: 0.5em;
  margin-bottom: 1em;
  border-bottom: 2px solid var(--border-color, #e0e0e0);
  padding-bottom: 0;
}

.info-tab-btn {
  background: none;
  border: none;
  padding: 0.4em 1em;
  cursor: pointer;
  font-size: 0.95em;
  color: var(--text-color, #333);
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: color 0.2s, border-color 0.2s;
}

.info-tab-btn:hover {
  color: #42b983;
}

.info-tab-btn.active {
  color: #42b983;
  border-bottom: 2px solid #42b983;
  font-weight: bold;
}

.formula {
  white-space: pre-wrap;
  font-size: 1.5em;
  font-weight: bold;
  color: #42b983;
  margin: 0.3em 0 0.5em 0;
}
</style>
