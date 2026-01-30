
<!-- Komponenta pro informace o Substituční šifře -->
<template>
  <div>
    <h3 id="info-title">O Substituční šifře</h3>
    <p>
      Substituční šifra je
      <router-link
        to="/#monoalfabeticka"
        class="primary-color without-underline"
        >monoalfabetická šifra</router-link
      >, která nahrazuje každé písmeno v textu jiným písmenem. Pro správné
      fungování musí být klíč (náhrada písmen) pevně stanoven.
    </p>
    <h4>Popis</h4>
    <p>
      V této šifře je každé písmeno abecedy nahrazeno jiným písmenem podle
      předem určené permutace. Například, pokud je permutace
      "QWERTYUIOPASDFGHJKLZXCVBNM", pak písmeno "A" bude nahrazeno "Q", "B"
      bude nahrazeno "W", a tak dále.
    </p>
    <h4>Bezpečnost</h4>
    <p>
      Existuje 26! možných permutací pro anglickou
      abecedu, což činí tuto šifru relativně bezpečnou proti hrubé síle.
      Nicméně, je náchylná k
      <router-link
        to="/#frekvencni-analyza"
        class="primary-color without-underline"
        >frekvenční analýze</router-link
      >, protože některá písmena se v jazyce vyskytují častěji než jiná.
    </p>
    <h4>Více Informací</h4>
    <a
      href="https://en.wikipedia.org/wiki/Substitution_cipher"
      target="_blank"
      class="primary-color without-underline"
      >Wikipedia: Substitution cipher</a
    >
    <h4>Test</h4>
    <p>
      Při permutaci <strong>MBNAOXFTEJSQLWHRVCDPUGIYKZ</strong> jaké písmeno
      nahradí <strong>A</strong>? Při stejné permutaci jaké písmeno nahradí
      <strong>H</strong>? Pokud je šifrovaný text
      <strong>ROCLUPMPEHW</strong>, jaký je původní text?
    </p>
    <details>
      <summary>Odpověď</summary>
      <p>
        A → <strong>M</strong>, H → <strong>T</strong>, původní text je<strong>
          PERMUTATION</strong
        >
      </p>
    </details>
  </div>
</template>

<script>
export default {
  name: 'SubstitutionInfoContent'
}
</script>
