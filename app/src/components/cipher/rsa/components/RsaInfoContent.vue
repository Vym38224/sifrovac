<!-- Komponenta pro informace o RSA šifře -->
<template>
  <div>
    <h3 id="info-title">RSA</h3>

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
        <router-link to="/#rsa" class="primary-color without-underline">RSA</router-link> je <router-link to="/#asymetricke" class="primary-color without-underline">asymetrická šifra</router-link>
        navržená v roce 1977 Rivestem, Shamirem a Adlemanem. 
      </p>
      <h4>Veřejný a soukromý klíč</h4>
      <p>
        Princip spočívá v oddělení šifrovacího a dešifrovacího klíče.
        <span class="primary-color">Veřejný klíč <strong>(b,n)</strong></span> může být volně zveřejněn a
        kdokoli jím může zprávu zašifrovat. Dešifrovat ji umí jen držitel
        <span class="primary-color">soukromého klíče <strong>(a, p, q)</strong></span>,
        protože výpočet <strong class="primary-color">a</strong> z <strong class="primary-color">b</strong> vyžaduje znát rozklad <strong class="primary-color">n = p × q</strong>.
      </p>
      <h4>Bezpečnost</h4>
      <p>
        Bezpečnost RSA stojí na <router-link to="/#obtiznost-faktorizace" class="primary-color without-underline"><span class="primary-color">obtížnosti faktorizace čísla n</span></router-link>.
        Pro dostatečně velká čísla <strong class="primary-color">p</strong> a <strong class="primary-color">q</strong> je faktorizace čísla <strong class="primary-color">n</strong> nereálná, což činí RSA bezpečným pro praktické použití.
      </p>
    </div>

    <!-- Definice -->
    <div v-if="activeTab === 'definice'">
      <h4>Definice</h4>
      <p>
        Nechť <strong class="primary-color">n = p × q</strong>, kde <strong class="primary-color">p</strong> a <strong class="primary-color">q</strong>
        jsou různá prvočísla. Pak Eulerova funkce <strong class="primary-color">φ(n) = (p−1)(q−1)</strong>.
        Definujeme:
      </p>
      <ul style="list-style: none; padding-left: 0;">
        <li><strong class="primary-color">P = C = Z<sub>n</sub></strong></li>
        <li><strong class="primary-color">K = {(n, p, q, a, b) : a = b<sup>−1</sup> mod φ(n)}</strong></li>
        <li><strong class="primary-color">b</strong> – veřejný exponent</li>
        <li><strong class="primary-color">a</strong> – soukromý exponent</li>
      </ul>
      <pre class="formula">e<sub style="font-size:14px;">K</sub>(x) = x<sup>b</sup> mod n</pre>
      <pre class="formula">d<sub style="font-size:14px;">K</sub>(y) = y<sup>a</sup> mod n</pre>
    
      <h4>Generování parametrů RSA</h4>
      <ol>
        <li>Zvolíme dvě velká prvočísla <strong class="primary-color">p ≠ q</strong>.</li>
        <li>Spočítáme <strong class="primary-color">n = p × q</strong> a <strong class="primary-color">φ(n) = (p−1)(q−1)</strong>.</li>
        <li>Zvolíme <strong class="primary-color">b</strong>, kde gcd(b, φ(n)) = 1.</li>
        <li>Vypočítáme <strong class="primary-color">a</strong>, kde a = b<sup>−1</sup> mod φ(n).</li>
        <li><span class="primary-color">Veřejný klíč: <strong>(b, n)</strong></span> | <span class="primary-color">Soukromý klíč: <strong>(a, p, q)</strong></span>.</li>
      </ol>

      <h4>Volba b</h4>
      <p>
        Pro volbu veřejného exponentu <strong class="primary-color">b</strong> musí platit gcd(b, φ(n)) = 1, tedy <strong class="primary-color">b</strong> musí být nesoudělné s φ(n).
        To proto že pro výpočet soukromého exponentu <strong class="primary-color">a</strong> potřebujeme inverzi k <strong class="primary-color">b</strong> modulo φ(n).
      </p>
      <h4>Výpočet a</h4>
      <p>
        Pro výpočet <strong class="primary-color">a</strong> z <strong class="primary-color">b</strong> a <strong class="primary-color">φ(n)</strong> se používá rozšířený Eukleidův algoritmus.
        Tento algoritmus efektivně najde inverzi k <strong class="primary-color">b</strong> modulo φ(n), což nám umožní získat soukromý exponent <strong class="primary-color">a</strong>.
      </p>

    </div>
  </div>
</template>

<script>
export default {
  name: 'RsaInfoContent',
  data () {
    return {
      activeTab: 'definice'
    }
  }
}
</script>
