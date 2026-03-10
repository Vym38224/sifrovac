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
        <router-link to="/#proudova" class="primary-color without-underline">Proudová šifra</router-link> je typ šifrovacího algoritmu, který šifruje data postupně znak po znaku
        (nebo bit po bitu). Na rozdíl od <router-link to="/#blokova" class="primary-color without-underline">blokových šifer</router-link>, kde se stejný klíč <strong class="primary-color">K</strong>
        použije pro každý blok vstupního textu, proudová šifra generuje
        <strong class="primary-color">proud klíčů</strong> z = z<sub>1</sub>z<sub>2</sub>…
        a každý znak plaintextu je šifrován jiným prvkem proudu klíčů.
      </p>
      <h4>LFSR (Linear Feedback Shift Register)</h4>
      <p>
        Aplikace v této šifře generuje proud klíčů pomocí
        <strong class="primary-color">lineárního zpětnovazebního posuvného registru (LFSR)</strong>.
        Registr délky <strong class="primary-color">m</strong> je inicializován počátečním
        vektorem (k<sub>1</sub>, …, k<sub>m</sub>). Na každém kroku:
      </p>
      <ul style="list-style: none; padding-left: 0;">
        <li>1. nejstarší bit je vydán jako bit proudu klíčů,</li>
        <li>2. ostatní bity se posunou o jedno místo,</li>
        <li>3. nový bit se vypočítá jako lineární zpětná vazba (XOR vybraných bitů dle koeficientů).</li>
      </ul>
      <h4>Bezpečnost</h4>
      <p>
        Bezpečnost závisí na kvalitě generátoru proudu klíčů a správném použití počátečního
        vektoru. Nikdy nesmí být stejný proud klíčů použit dvakrát, útočník by mohl provést
        XOR dvou ciphertextů a eliminovat proud klíčů. Samotný LFSR není bezpečný pro moderní
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
        <li><strong class="primary-color">L</strong> – abeceda proudu klíčů,</li>
        <li><strong class="primary-color">g</strong> – generátor proudu klíčů; přijme klíč K a vrátí nekonečný proud klíčů z<sub>1</sub>z<sub>2</sub>… (z<sub>i</sub> ∈ L),</li>
        <li>pro každé z ∈ L existuje šifrovací funkce e<sub style="font-size: 14px;">z</sub> : P → C a dešifrovací d<sub style="font-size: 14px;">z</sub> : C → P, kde d<sub style="font-size: 14px;">z</sub>(e<sub style="font-size: 14px;">z</sub>(x)) = x.</li>
      </ul>
      <p>
        Pro P = C = L = Z<sub>2</sub> jsou operace XOR:
      </p>
      <pre class="formula">e<sub style="font-size: 14px;">z</sub>(x) = (x + z) mod 2</pre>
      <pre class="formula">d<sub style="font-size: 14px;">z</sub>(y) = (y + z) mod 2</pre>

      <h4>Generování proudu klíčů pomocí LFSR</h4>
      <pre class="formula">z<sub style="font-size: 14px;">i+m</sub> = (∑ cⱼ · z<sub style="font-size: 14px;">i+j</sub>) mod 2</pre>
      <p style="font-size:0.9em;color:var(--text-muted,#888);">
        pro všechna i ≥ 1, kde j = 0, 1, …, m−1 a c<sub>0</sub>, …, c<sub>m−1</sub> ∈ Z<sub>2</sub> jsou koeficienty zpětné vazby.
        Počáteční stav z<sub>1</sub>, …, z<sub>m</sub> tvoří klíč K.
      </p>
      <p>Proud klíčů vzniká vygenerováním posloupnosti bitů z<sub>1</sub>, z<sub>2</sub>, …</p>
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

