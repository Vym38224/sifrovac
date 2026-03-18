<!-- Komponenta pro informace o DES (Data Encryption Standard) -->
<template>
  <div>
    <h3 id="info-title">DES (Data Encryption Standard)</h3>

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
        DES byl vyvinut společností IBM a v roce 1977 přijat jako americký federální standard
        pro šifrování. Vychází z dřívějšího systému <em>Lucifer</em> a stal se nejrozšířenějším
        kryptosystémem na světě. Standard byl pravidelně přezkoumáván; v roce 1999 byl zahájen
        vývoj nástupce <router-link to="/#aes" class="primary-color without-underline">AES (Advanced Encryption Standard)</router-link>.
      </p>
      <h4>Popis</h4>
      <p>
        DES je <router-link to="/#blokova" class="primary-color without-underline">bloková šifra</router-link>, která zpracovává data po blocích o velikosti 64 bitů a používá
        klíč o délce 56 bitů. Šifrování probíhá pomocí 16 rund, z nichž každá zahrnuje
        komplexní kombinaci permutací, substitucí a logických operací.
      </p>
      <h4>Bezpečnost</h4>
      <p>
        Hlavní výtkou byl malý klíčový prostor: 2<sup>56</sup> klíčů umožňuje vyčerpávající prohledávání.
        V roce 1998 organizace Electronic Frontier Foundation (nezisková organizace na ochranu
        digitálních práv) postavila <em>DES Cracker</em>,
        který prolomil DES za 56 hodin.
      </p>
    </div>

    <!-- Definice -->
    <div v-if="activeTab === 'definice'">
      <h4>Feistelova šifra</h4>
      <p>
        DES je speciální typ iterované šifry založen na <strong class="primary-color">Feistelově šifře</strong>.
        Každý stav je rozdělen na dvě stejně dlouhé poloviny
        <strong class="primary-color">L<sub>i</sub></strong> a <strong class="primary-color">R<sub>i</sub></strong>.
        Rundovní funkce g má tvar:
      </p>
      <pre class="formula">L<sub style="font-size:14px;">i</sub> = R<sub style="font-size:14px;">i−1</sub></pre>
      <pre class="formula">R<sub style="font-size:14px;">i</sub> = L<sub style="font-size:14px;">i−1</sub> XOR f(R<sub style="font-size:14px;">i−1</sub>, K<sub style="font-size:14px;">i</sub>)</pre>
      <p>
        Feistelova rundovní funkce g je vždy invertibilní (bez ohledu na vlastnosti f),
        dešifrování jedné rundy proto probíhá jako:
      </p>
      <pre class="formula">L<sub style="font-size:14px;">i−1</sub> = R<sub style="font-size:14px;">i</sub> XOR f(L<sub style="font-size:14px;">i</sub>, K<sub style="font-size:14px;">i</sub>)</pre>
      <pre class="formula">R<sub style="font-size:14px;">i−1</sub> = L<sub style="font-size:14px;">i</sub></pre>

      <h4>DES</h4>
      <p>
        DES je 16-rundová Feistelova šifra s délkou bloku 64 bitů. Šifruje plaintext
        <strong class="primary-color">x</strong> (64 bitů) klíčem
        <strong class="primary-color">K</strong> (56 bitů) na ciphertext
        <strong class="primary-color">y</strong> (64 bitů).
      </p>
      <ul style="list-style: none; padding-left: 0;">
        <li>Počáteční permutace: <strong class="primary-color">IP(x) = L<sub>0</sub>R<sub>0</sub></strong></li>
        <li>Po 16 rundách se prohodí L<sub>16</sub> a R<sub>16</sub> a aplikuje se inverzní permutace: <strong class="primary-color">IP<sup>−1</sup>(R<sub>16</sub>L<sub>16</sub>)</strong></li>
      </ul>
      <h4>Funkce f</h4>
      <p>
        Funkce <strong class="primary-color">f : {0,1}<sup>32</sup> × {0,1}<sup>48</sup> → {0,1}<sup>32</sup></strong>
        přijímá 32bitovou pravou polovinu a 48bitový rundovní klíč.
        Pro výpočet f(A, J) se provádějí tyto kroky:
      </p>
      <ol>
        <li>
          <strong class="primary-color">Expanze E</strong>:
          32bitový řetězec A se rozšíří na 48 bitů pomocí pevné expanzní permutace E.
        </li>
        <li>
          <strong class="primary-color">XOR s rundovním klíčem</strong>:
          Vypočítá se E(A) XOR J a výsledek se zapíše jako
          B = B<sub>1</sub>B<sub>2</sub>B<sub>3</sub>B<sub>4</sub>B<sub>5</sub>B<sub>6</sub>B<sub>7</sub>B<sub>8</sub>
          (osm 6bitových řetězců).
        </li>
        <li>
          <strong class="primary-color">S-boxy</strong>:
          Osm S-boxů S<sub>1</sub>, …, S<sub>8</sub>, každý zobrazující
          6 bitů na 4 bity: C<sub>j</sub> = S<sub>j</sub>(B<sub>j</sub>),&nbsp; 1 ≤ j ≤ 8.
        </li>
        <li>
          <strong class="primary-color">P-box</strong>:
          32bitový řetězec C = C<sub>1</sub>…C<sub>8</sub> se permutuje podle P-boxu.
          Výsledek P-box(C) je hodnota f(A, J).
        </li>
      </ol>

      <h4>Generování rundovních klíčů K<sub>i</sub></h4>
      <ol>
        <li>Z 64bitového klíče se odstraní paritní bity.</li>
        <li>Zbylých 56 bitů se permutuje pomocí <strong class="primary-color">PC-1</strong>.</li>
        <li>Klíč se rozdělí na <strong class="primary-color">C<sub>0</sub></strong> a <strong class="primary-color">D<sub>0</sub></strong> (každý 28 bitů).</li>
        <li>
          Pro každou rundu i:
          C<sub>i</sub> = RL<sub>i</sub>(C<sub>i−1</sub>), D<sub>i</sub> = RL<sub>i</sub>(D<sub>i−1</sub>),<br>
          kde RL<sub>i</sub> je rotace doleva o 1 bit (rundy 1, 2, 9, 16) nebo 2 bity (ostatní rundy).
        </li>
        <li>
          Spojení C<sub>i</sub>D<sub>i</sub> a aplikace <strong class="primary-color">PC-2</strong>
          dává 48bitový rundovní klíč <strong class="primary-color">K<sub>i</sub></strong>.
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DesInfoContent',
  data () {
    return {
      activeTab: 'definice'
    }
  }
}
</script>

