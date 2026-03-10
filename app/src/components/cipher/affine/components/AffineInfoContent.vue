<template>
  <div>
    <h3 id="info-title">Afinní šifra</h3>

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
        Afinní šifra je
        <router-link
          to="/#monoalfabeticka"
          class="primary-color without-underline"
        >monoalfabetická šifra</router-link
        >, která používá lineární funkci k šifrování a dešifrování textu.
        Jde o rozšíření Posuvné šifry. Když je <strong class="primary-color">a = 1</strong>,
        dostaneme právě Posuvnou šifru.
      </p>
      <h4>Popis</h4>
      <p>
        Šifra kombinuje dva klíče: <strong class="primary-color">a</strong> (násobení)
        a <strong class="primary-color">b</strong> (posun). Každé písmeno se nejprve
        přenásobí hodnotou <em>a</em> a poté posune o <em>b</em> pozic.
        Aby bylo dešifrování jednoznačné, musí platit
        <strong class="primary-color">gcd(a, 26) = 1</strong>. Tedy <em>a</em> musí
        být nesoudělné s 26. Platné hodnoty <em>a</em> jsou:
        1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25.
      </p>
      <h4>Bezpečnost</h4>
      <p>
        Existuje 12 platných hodnot <em>a</em> a 26 hodnot <em>b</em>, tedy
        <strong class="primary-color">12 × 26 = 312</strong> možných klíčů.
        To je stále velmi málo, útočník může snadno vyzkoušet všechny kombinace
        <router-link to="/#brute-force" class="primary-color without-underline"
          >útok hrubou silou</router-link
        >.
      </p>
      <h4>Více informací</h4>
      <a
        href="https://en.wikipedia.org/wiki/Affine_cipher"
        target="_blank"
        class="primary-color without-underline"
        >Wikipedia: Affine cipher</a
      >
    </div>

    <!-- Definice -->
    <div v-if="activeTab === 'definice'">
      <h4>Definice</h4>
      <p>
        Nechť <strong class="primary-color">P = C = Z<sub>26</sub></strong> a klíčový prostor:
      </p>
      <pre class="formula" style="font-size:19px;">K = {(a, b) ∈ Z₂₆ × Z₂₆ : gcd(a, 26) = 1}</pre>
      <p>Pro klíč <strong class="primary-color">K = (a, b)</strong> jsou funkce definovány:</p>
      <pre class="formula">e<sub style="font-size: 14px;">K</sub>(x) = (ax + b) mod 26</pre>
      <pre class="formula">d<sub style="font-size: 14px;">K</sub>(y) = a<sup>−1</sup>(y − b) mod 26</pre>
      <p style="font-size: 0.9em; color: var(--text-muted);">
        kde x, y ∈ Z<sub>26</sub> ; a<sup>−1</sup> je inverze k a v Z<sub>26</sub>.
      </p>

      <h4>Inverze a v Z<sub>26</sub></h4>
      <p>Je to hodnota a<sup>−1</sup>, pro kterou platí:</p>
      <pre class="formula">a × a<sup>−1</sup> mod 26 = 1</pre>
      <p>
        Například pro a = 5 je inverze a<sup>−1</sup> = 21, protože
        5 × 21 mod 26 = 105 mod 26 = 1.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AffineInfoContent',
  data () {
    return {
      activeTab: 'definice'
    }
  }
}
</script>

