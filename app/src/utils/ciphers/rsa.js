/**
 * RSA šifra
 */

/**
 * Kontrola prvočíslo
 * @param {number} num Číslo ke kontrole
 * @returns {boolean} True pokud je číslo prvočíslo, jinak False
 */
export function jePrvocislo(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;

  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}

/**
 * Největší společný dělitel
 * @param {number} a První číslo
 * @param {number} b Druhé číslo
 * @returns {number} Největší společný dělitel
 */
export function nsd(a, b) {
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Rozšířený Euklidův algoritmus pro výpočet modulární inverze
 * Hledáme d, takové: e × d ≡ 1 (mod φ(n))
 * @param {number} a Číslo pro inverzi (e)
 * @param {number} m Modul (φ(n))
 * @returns {number} Modulární inverze čísla a modulo m
 */
export function modInverse(a, m) {
  let m0 = m;
  let x0 = 0;
  let x1 = 1;

  if (m === 1) return 0;

  while (a > 1) {
    const q = Math.floor(a / m);
    let t = m;

    m = a % m;
    a = t;
    t = x0;

    x0 = x1 - q * x0;
    x1 = t;
  }

  if (x1 < 0) x1 += m0;

  return x1;
}

/**
 * Rychlé modulární umocňování
 * Pro větší čísla použijeme v JS BigInt
 * @param {number} base Základ
 * @param {number} exp Exponent
 * @param {number} mod Modul
 * @returns {number} Výsledek base^exp MOD mod
 */
export function modPow(base, exp, mod) {
  if (mod === 1) return 0;
  
  let baseBig = BigInt(base);
  let expBig = BigInt(exp);
  let modBig = BigInt(mod);
  let result = 1n;
  
  baseBig = baseBig % modBig;
  
  while (expBig > 0n) {
    if (expBig % 2n === 1n) {
      result = (result * baseBig) % modBig;
    }
    expBig = expBig / 2n;
    baseBig = (baseBig * baseBig) % modBig;
  }
  
  return Number(result);
}

/**
 * Vypočítá RSA parametry n, φ(n) z prvočísel p a q
 * @param {number} p První prvočíslo
 * @param {number} q Druhé prvočíslo
 * @returns {Object|null} Objekt s n a phi, nebo null pokud vstupy nejsou validní
 */
export function vypocitatNaPhi(p, q) {
  if (!jePrvocislo(p) || !jePrvocislo(q) || p === q) {
    return null;
  }
  
  const n = p * q;
  if (n <= 90) {
    return null; // n musí být větší než 90 pro ASCII znaky
  }
  
  const phi = (p - 1) * (q - 1);
  
  return { n, phi };
}

/**
 * Najde validní hodnoty veřejného exponentu e
 * @param {number} phi Eulerova funkce φ(n)
 * @param {number} count Počet hodnot e (7)
 * @returns {number[]} Pole validních hodnot e
 */
export function najitValidniE(phi, count = 7) {
  const validniE = [];
  for (let e = 3; e < phi && validniE.length < count; e += 2) {
    if (nsd(e, phi) === 1) {
      validniE.push(e);
    }
  }
  return validniE;
}

/**
 * Vypočítá validní hodnoty soukromého exponentu d
 * @param {number} e Veřejný exponent
 * @param {number} phi Eulerova funkce φ(n)
 * @param {number} count Počet hodnot d (7)
 * @returns {number[]} Pole validních hodnot d
 */
export function najitValidniD(e, phi, count = 7) {
  const validniD = [];
  
  const d = modInverse(e, phi);
  
  if (d > 0) {
    for (let k = 0; k < count; k++) {
      validniD.push(d + k * phi);
    }
  }
  
  return validniD;
}

/**
 * ENCRYPT
 * @param {string} text Otevřený text
 * @param {number} e Veřejný exponent
 * @param {number} n Modul
 * @returns {string} Šifrovaný text (čísla oddělená mezerami)
 */
export function rsaEncrypt(text, e, n) {
  const zasifrovana_cisla = [];
  
  for (let i = 0; i < text.length; i++) {
    const cislo_znaku = text.charCodeAt(i); 
    const zasifrovane_cislo = modPow(cislo_znaku, e, n);
    zasifrovana_cisla.push(zasifrovane_cislo);
  }
  
  return zasifrovana_cisla.join(' ');
}

/**
 * DECRYPT
 * @param {string} text Šifrovaný text (čísla oddělená mezerami)
 * @param {number} d Soukromý exponent
 * @param {number} n Modul
 * @returns {string} Dešifrovaný text
 */
export function rsaDecrypt(text, d, n) {
  const zasifrovana_cisla = text.trim().split(/\s+/);
  const desifrovane_znaky = [];
  
  for (let i = 0; i < zasifrovana_cisla.length; i++) {
    const zasifrovane_cislo = parseInt(zasifrovana_cisla[i]);
    if (!isNaN(zasifrovane_cislo)) {
      const desifrovane_cislo = modPow(zasifrovane_cislo, d, n);
      const znak = String.fromCharCode(desifrovane_cislo);
      desifrovane_znaky.push(znak);
    }
  }
  
  return desifrovane_znaky.join('');
}

/**
 * Získá informace o aktuálním znaku pro vizualizaci
 * @param {string} vstupniText Vstupní text (otevřený nebo šifrovaný)
 * @param {number} e Veřejný exponent
 * @param {number} d Soukromý exponent
 * @param {number} n Modul
 * @returns {Object|null} Informace o aktuálním znaku nebo null
 */
export function ziskatAktualniZnak(vstupniText, e, d, n) {
  if (!vstupniText || n === 0 || e === 0 || d === 0) {
    return null;
  }


  const prvniZnak = vstupniText.trim().charAt(0);
  const jeCislo = prvniZnak >= '0' && prvniZnak <= '9';

  if (jeCislo) {
    // pro DECRYPT vizualizaci
    const cisla = vstupniText.trim().split(/\s+/);
    const c = parseInt(cisla[cisla.length - 1]);
    
    if (isNaN(c)) return null;
    
    const mDesifrovane = modPow(c, d, n);
    
    return {
      c,
      mDesifrovane,
      znakDesifrovany: String.fromCharCode(mDesifrovane),
    };
  } else {
    // pro ENCRYPT vizualizaci
    const posledniZnak = vstupniText[vstupniText.length - 1];
    const m = posledniZnak.charCodeAt(0);
    const c = modPow(m, e, n);

    return {
      znak: posledniZnak,
      m,
      c,
    };
  }
}

/**
 * Vytvoří krokovou vizualizaci šifrování
 * @param {string} text Otevřený text
 * @param {number} e Veřejný exponent
 * @param {number} n Modul
 * @returns {Array} Pole objektů s informacemi o každém kroku šifrování
 */
export function vytvorSifrovaciKroky(text, e, n) {
  const kroky = [];
  
  for (let i = 0; i < text.length; i++) {
    const znak = text[i];
    const m = znak.charCodeAt(0);
    const c = modPow(m, e, n);
    
    kroky.push({
      index: i,
      znak,
      m,
      c,
      vypocet: `${m}^${e} mod ${n} = ${c}`
    });
  }
  
  return kroky;
}

/**
 * Vytvoří krokovou vizualizaci dešifrování
 * @param {string} text Šifrovaný text (čísla oddělená mezerami)
 * @param {number} d Soukromý exponent
 * @param {number} n Modul
 * @returns {Array} Pole objektů s informacemi o každém kroku dešifrování
 */
export function vytvorDesifrovaciKroky(text, d, n) {
  const kroky = [];
  const cisla = text.trim().split(/\s+/);
  
  for (let i = 0; i < cisla.length; i++) {
    const c = parseInt(cisla[i]);
    if (!isNaN(c)) {
      const m = modPow(c, d, n);
      const znak = String.fromCharCode(m);
      
      kroky.push({
        index: i,
        c,
        m,
        znak,
        vypocet: `${c}^${d} mod ${n} = ${m}`
      });
    }
  }
  
  return kroky;
}

/**
 * Validace RSA parametrů
 * @param {number} p První prvočíslo
 * @param {number} q Druhé prvočíslo
 * @returns {Object} Objekt s validitou a chybovou zprávou
 */
export function validovatRSAParametry(p, q) {
  if (p <= 1 || q <= 1) {
    return { valid: false, error: 'p a q musí být větší než 1' };
  }
  
  if (!jePrvocislo(p)) {
    return { valid: false, error: 'p musí být prvočíslo' };
  }
  
  if (!jePrvocislo(q)) {
    return { valid: false, error: 'q musí být prvočíslo' };
  }
  
  if (p === q) {
    return { valid: false, error: 'p a q musí být různá prvočísla' };
  }
  
  if (p * q <= 90) {
    return { valid: false, error: 'n (p × q) musí být větší než 90' };
  }
  
  return { valid: true, error: null };
}
