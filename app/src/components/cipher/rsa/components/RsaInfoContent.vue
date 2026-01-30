<template>
  <div>
    <h3 id="info-title">O RSA</h3>
    <p>
      RSA šifra je jednou z nejznámějších a nejpoužívanějších
      <router-link to="/#asymetricke" class="primary-color without-underline">
        asymetrických šifer</router-link
      >. Byla vyvinuta Ronem Rivestem, Adi Shamirem a Leonardem Adlemanem v
      roce 1977. Je pojmenována podle prvních písmen jejich příjmení.
      <router-link to="/#rsa" class="primary-color without-underline">
        RSA</router-link
      >
      se široce používá pro zabezpečení dat a pro digitální podpisy.
    </p>
    <h4>Popis</h4>
    <p>
      RSA je asymetrická šifra, což znamená, že používá dva různé klíče:
      <strong>Veřejný klíč (e, n)</strong> - slouží k šifrování zpráv, může
      být volně sdílen <strong>Soukromý klíč (d, n)</strong> - slouží k
      dešifrování zpráv, musí zůstat tajný
    </p>
    <h5>Parametry RSA</h5>
    <p>p, q - dvě různá prvočísla (musí být tajná)<br>
    n = p × q - modul, součin prvočísel (veřejný)<br>
    φ(n) = (p-1) × (q-1) - Eulerova funkce (tajná)<br>
    e - veřejný exponent, platí: nsd(e, φ(n)) = 1<br>
    d - soukromý exponent, platí: (e × d) mod φ(n) = 1</p>
    <h5>Postup šifrování</h5>
    <ol>
      <li>Převeď každý znak na číslo (ASCII): m = znak</li>
      <li>
        Zašifruj:
        <span
          style="
            white-space: pre-wrap;
            font-size: 0.9em;
            font-weight: bold;
            color: #36a06f;
          "
        >
          c = m<sup>e</sup> mod n</span
        >
      </li>
      <li>Výsledek jsou zašifrovaná čísla oddělená mezerami</li>
    </ol>

    <h5>Postup dešifrování</h5>
    <ol>
      <li>Vezmi zašifrované číslo c</li>
      <li>
        Dešifruj:<span
          style="
            white-space: pre-wrap;
            font-size: 0.9em;
            font-weight: bold;
            color: #36a06f;
          "
        >
          m = c<sup>d</sup> mod n</span
        >
      </li>
      <li>Převeď číslo zpět na znak (ASCII)</li>
    </ol>

    <h4>Bezpečnost</h4>
    <p>
      Bezpečnost RSA je založena na
      <router-link
        to="/#obtiznost-faktorizace"
        class="primary-color without-underline"
      >
        obtížnosti faktorizace velkých čísel.</router-link
      >
      I když útočník zná veřejný klíč (e, n), nemůže jednoduše vypočítat
      soukromý klíč (d,n), protože by musel rozložit n na prvočísla p a q. Pro
      velká a co nejméně podobná p a q je považována za bezpečnou a v praxi
      používanou. (V našem případě se pro ukázku spokojíme s malými p a q)
    </p>
    <h4>Více informací</h4>
    <a
      href="https://en.wikipedia.org/wiki/RSA_cipher"
      target="_blank"
      class="primary-color without-underline"
      >RSA cipher - Wikipedia</a
    >
    <h4>Test</h4>
    <p>
      <strong>1.</strong> Mějme prvočísla p=13 a q=11. Jaké bude
      <strong>n</strong> a <strong>φ(n)</strong>?
    </p>
    <details>
      <summary>Odpověď 1</summary>
      <p>n = p × q = 13 × 11 = <strong>143</strong></p>
      <p>φ(n) = (p-1) × (q-1) = 12 × 10 = <strong>120</strong></p>
    </details>
    <p>
      <strong>2.</strong> Jaká bude šifrovaná hodnota znaku
      <strong>E</strong>, když veřejný klíč = (5, 91)?
    </p>
    <details>
      <summary>Odpověď 2</summary>
      <p>Veřejný klíč (e=5, n=91) použijeme k šifrování.</p>
      <p><strong>Postup:</strong></p>
      <ol>
        <li>Převedeme znak "E" na ASCII hodnotu: m = 69</li>
        <li>
          Použijeme vzorec: <br />c = m<sup>e</sup> mod n = 69<sup>5</sup> mod 91 = <strong>29</strong>
        </li>
      </ol>
      <p>Šifrovaná hodnota je <strong>29</strong></p>
    </details>
  </div>
</template>

<script>
export default {
  name: 'RsaInfoContent'
}
</script>
