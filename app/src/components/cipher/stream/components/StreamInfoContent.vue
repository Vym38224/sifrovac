<!-- Komponenta pro informace o Proudové šifře -->
<template>
  <div>
    <h3 id="info-title">O Proudové šifře</h3>
    <p>
      Proudová šifra je typ šifrovacího algoritmu, který šifruje data po
      bitech nebo bajtech. Pro úkázku si vysvětlíme jak funguje proudová šifra
      založená na linear feedback shift registru (LFSR). Tato metoda
      generování klíčového proudu, byla dříve často využívána ve vojenských
      šifrách.
    </p>
    <h4>Popis</h4>
    <p>
      Proudové šifry generují nekonečný pseudonáhodný proud bitů, který je
      kombinován s otevřeným textem pomocí operace XOR k vytvoření šifrovaného
      textu. Tento proud bitů je v našem případě generován pomocí lineárního
      zpětnovazebného posuvného registru (LFSR), který využívá počáteční
      vektor a koeficienty k určení svého stavu.
    </p>
    <h5>Parametry</h5>
    <p>
      <span class="primary-color">m</span>: Délka registru (počet bitů). Stejnou délku musí mít
      počáteční vektor a koeficienty.
    </p>
    <p>
      <span class="primary-color">Počáteční vektor</span>: Počáteční stav registru,
      reprezentovaný jako binární řetězec.
    </p>
    <p>
      <span class="primary-color">Koeficienty</span>: Určují, které bity registru se používají k
      výpočtu zpětné vazby.
    </p>
    <p>
      <span class="primary-color">⊕</span>: Operace XOR, která se používá k výpočtu zpětné
      vazby, ale i k šifrování/dešifrování dat. Hodnota je 1, právě když počet
      vstupů s hodnotou 1 je lichý.
    </p>
    <h5>Popis generování proudu klíčů</h5>
    <p>
      Generování proudu klíčů začíná s počátečním vektorem, který určuje
      počáteční stav registru. Na každém kroku se vypočítá nový bit zpětné
      vazby pomocí XOR operace (⊕) na bitech určených koeficienty. Tento nový
      bit je přidán na začátek registru a nejstarší bit je odstraněn. Výstupní
      bit (nejstarší bit registru) se používá jako další bit proudu klíčů.
    </p>
    <h5>Vzorec pro šifrování/dešifrování</h5>
    <pre
      style="
        white-space: pre-wrap;
        font-size: 1em;
        font-weight: bold;
        color: #36a06f;
      "
    >
C = P ⊕ K</pre
    >
    <p>
      Kde C je šifrovaný text, P je otevřený text, K je proud klíčů a ⊕
      označuje operaci XOR. C a P lze prohodit a dešifrovat tak šifrovaný
      text.
    </p>
    <h4>Bezpečnost</h4>
    <p>
      Bezpečnost proudových šifer závisí na kvalitě generátoru pseudonáhodných
      čísel a správném použití počátečního vektoru a koeficientů. Pokud jsou
      tyto parametry slabé nebo opakovaně používány, může být šifra náchylná k
      útokům.
    </p>
    <h4>Více informací</h4>
    <a
      href="https://en.wikipedia.org/wiki/Stream_cipher"
      target="_blank"
      class="primary-color without-underline"
      >Stream cipher - Wikipedia</a
    >
    <h4>Test</h4>
    <p>
      <strong>1.</strong> Mějme registr m=4, počáteční stav 1010 a koeficienty
      1001. Jaký bude <strong>první bit proudu klíčů</strong> a jaký bude
      <strong>nový stav registru</strong> po jednom kroku?
    </p>
    <details>
      <summary>Odpověď 1</summary>
      <p>
        <strong>První bit proudu klíčů:</strong> 0 (poslední bit z registru
        101<strong>0</strong>).
      </p>
      <p><strong>Nový stav registru:</strong>1101.</p>
      <p>
        Zpětná vazba se počítá z bitů, kde je koeficient '1' (první a čtvrtá
        pozice). Tedy <strong>1</strong>01<strong>0</strong> → 1 ⊕ 0 = 1.
        Tento nový bit se vloží na začátek a registr se posune: 1 + 101 =
        1101.
      </p>
    </details>
    <p>
      <strong>2.</strong> Pokud je šifrovaný text:
      1101100110101110011011111001101000001000 a nastavení šifry je m=4,
      počáteční vektor 1001 a koeficienty 1001, jaký byl
      <strong>původní vstupní text (ve znacích)</strong>?
    </p>
    <details>
      <summary>Odpověď 2</summary>
      <p><strong>Původní vstupní text:</strong> HELLO</p>
    </details>
  </div>
</template>

<script>
export default {
  name: 'StreamInfoContent'
}
</script>
