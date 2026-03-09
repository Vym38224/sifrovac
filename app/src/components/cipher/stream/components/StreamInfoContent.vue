<!-- Komponenta pro informace o Proudové šifře -->
<template>
  <div>
    <h3 id="info-title">Proudová šifra</h3>

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
        Proudová šifra je typ šifrovacího algoritmu, který šifruje data postupně znak po znaku
        (nebo bit po bitu). Na rozdíl od blokových šifer, kde se stejný klíč <strong class="primary-color">K</strong>
        použije pro každý blok vstupního textu, proudová šifra generuje
        <strong class="primary-color">keystream</strong> z = z<sub>1</sub>z<sub>2</sub>…
        a každý znak plaintextu je šifrován jiným prvkem keystreamu.
      </p>
      <h4>Blokové vs. proudové šifry</h4>
      <p>
        U blokové šifry platí: y = e<sub>K</sub>(x<sub>1</sub>) e<sub>K</sub>(x<sub>2</sub>) …;
        všechny znaky sdílejí stejný klíč.<br>
        U proudové šifry platí: y = e<sub>z<sub>1</sub></sub>(x<sub>1</sub>) e<sub>z<sub>2</sub></sub>(x<sub>2</sub>) …;
        každý znak má svůj vlastní klíčový prvek z keystreamu.
      </p>
      <h4>LFSR (Linear Feedback Shift Register)</h4>
      <p>
        Aplikace v této šifře generuje keystream pomocí
        <strong class="primary-color">lineárního zpětnovazebního posuvného registru (LFSR)</strong>.
        Registr délky <strong class="primary-color">m</strong> je inicializován počátečním
        vektorem (k<sub>1</sub>, …, k<sub>m</sub>). Na každém kroku:
      </p>
      <ul style="list-style: none; padding-left: 0;">
        <li>1. nejstarší bit je vydán jako keystream bit,</li>
        <li>2. ostatní bity se posunou o jedno místo,</li>
        <li>3. nový bit se vypočítá jako lineární zpětná vazba (XOR vybraných bitů dle koeficientů).</li>
      </ul>
      <h4>Bezpečnost</h4>
      <p>
        Bezpečnost závisí na kvalitě generátoru keystreamu a správném použití inicializačního
        vektoru. Nikdy nesmí být stejný keystream použit dvakrát, útočník by mohl provést
        XOR dvou ciphertextů a eliminovat keystream. Samotný LFSR není bezpečný pro moderní
        použití, ale slouží jako základ pro složitější proudové šifry.
      </p>
      <h4>Více informací</h4>
      <a
        href="https://en.wikipedia.org/wiki/Stream_cipher"
        target="_blank"
        class="primary-color without-underline"
        >Wikipedia: Stream cipher</a
      >
    </div>

    <!-- Definice -->
    <div v-if="activeTab === 'definice'">
      <h4>Definice</h4>
      <p>
        Proudová šifra je šestice
        <strong class="primary-color">(P, C, K, L, E, D)</strong> spolu s funkcí
        <strong class="primary-color">g</strong>, kde:
      </p>
      <ul style="list-style: none; padding-left: 0;">
        <li><strong class="primary-color">P</strong> – množina plaintextů,</li>
        <li><strong class="primary-color">C</strong> – množina ciphertextů,</li>
        <li><strong class="primary-color">K</strong> – klíčový prostor,</li>
        <li><strong class="primary-color">L</strong> – abeceda keystreamu,</li>
        <li><strong class="primary-color">g</strong> – generátor keystreamu; přijme klíč K a vrátí nekonečný keystream z<sub>1</sub>z<sub>2</sub>… (z<sub>i</sub> ∈ L),</li>
        <li>pro každé z ∈ L existuje šifrovací funkce e<sub style="font-size: 14px;">z</sub> : P → C a dešifrovací d<sub style="font-size: 14px;">z</sub> : C → P, kde d<sub style="font-size: 14px;">z</sub>(e<sub style="font-size: 14px;">z</sub>(x)) = x.</li>
      </ul>
      <p>
        Pro P = C = L = Z<sub>2</sub> jsou operace XOR:
      </p>
      <pre class="formula">e<sub style="font-size: 14px;">z</sub>(x) = (x + z) mod 2</pre>
      <pre class="formula">d<sub style="font-size: 14px;">z</sub>(y) = (y + z) mod 2</pre>

      <h4>Generování keystreamu pomocí LFSR</h4>
      <pre class="formula">z<sub style="font-size: 14px;">i+m</sub> = (∑ cⱼ · z<sub style="font-size: 14px;">i+j</sub>) mod 2</pre>
      <p style="font-size:0.9em;color:var(--text-muted,#888);">
        pro všechna i ≥ 1, kde j = 0, 1, …, m−1 a c<sub>0</sub>, …, c<sub>m−1</sub> ∈ Z<sub>2</sub> jsou koeficienty zpětné vazby.
        Počáteční stav z<sub>1</sub>, …, z<sub>m</sub> tvoří klíč K.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StreamInfoContent',
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
