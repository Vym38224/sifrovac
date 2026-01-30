<template>
  <div>
    <h3 id="info-title">O Afinní šifře</h3>
    <p>
      Afinní šifra je
      <router-link
        to="/#monoalfabeticka"
        class="primary-color without-underline"
      >
        monoalfabetická šifra </router-link
      >, která používá lineární funkci k šifrování a dešifrování textu. Pro
      správné fungování musí být hodnota A nesoudělná s 26.
    </p>
    <h4>Popis</h4>
    <p>
      Šifru si můžete představit jako vylepšenou Caesarovu šifru, která
      používá dva klíče (dvě hodnoty) místo jednoho. Nazvěme je hodnota A a
      hodnota B.
    </p>
    <p>
      Hodnota B (Posun): Tato hodnota funguje přesně jako u Caesarovy
      šifry, jednoduše posune každé písmeno v abecedě o daný počet míst.
      Například pokud je B=3, "A" se stane "D", "B"se stane "E" atd.
    </p>
    <p>
      Hodnota A (Násobení): Toto je ten hlavní rozdíl. Než se písmeno posune
      pomocí hodnoty B, jeho pozice v abecedě se nejprve přeskládá podle
      hodnoty A.
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
        margin-bottom: -1em;
      "
    >
C = (A × P + B) MOD 26
    </pre>
    <p>
      Kde C je index šifrovaného písmene, P je index původního písmene, A je
      klíč šifry a B je posun. Pro dešifrování se používá inverzní hodnota A
      (A⁻¹):
    </p>
    <h5>Vzorec pro dešifrování</h5>
    <pre
      style="
        white-space: pre-wrap;
        font-size: 1em;
        font-weight: bold;
        color: #36a06f;
        margin-bottom: -1em;
      "
    >
P = (A⁻¹ × (C - B)) MOD 26
    </pre>
    <p>
      Kde P je index původního písmene, C je index šifrovaného písmene, A⁻¹ je
      inverzní hodnota A a B je posun.
    </p>
    <h5>A⁻¹ je hodnota, která splňuje:</h5>
    <pre
      style="
        white-space: pre-wrap;
        font-size: 1em;
        font-weight: bold;
        color: #36a06f;
        margin-bottom: -1em;
      "
    >
A × A⁻¹ MOD 26 = 1
    </pre>
    <h4>Bezpečnost</h4>
    <p>
      Afinní šifra je relativně slabá, protože existuje pouze 12 možných
      hodnot A, které jsou nesoudělné s 26. Proto existuje 12×26 = 312 různých
      klíčů. To je stále velmi málo, protože útočník může snadno vyzkoušet
      všechny kombinace a tím prolomit šifru
      <router-link to="/#brute-force" class="primary-color without-underline"
        >brute-force</router-link
      >.
    </p>
    <h4>Více Informací</h4>
    <a
      href="https://en.wikipedia.org/wiki/Affine_cipher"
      target="_blank"
      class="primary-color without-underline"
      >Wikipedia: Affine cipher</a
    >
    <h4>Test</h4>
    <p>
      Zkuste dešifrovat následující zprávu pomocí hodnoty B = 8:
      <strong>ZCUZ</strong>
    </p>
    <details>
      <summary>Odpověď</summary>
      <p>Původní text je <strong>TEST</strong></p>
    </details>
  </div>
</template>

<script>
export default {
  name: 'AffineInfoContent'
}
</script>
