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
export function najitValidniB(phi, count = 7) {
  const validniB = [];
  for (let b = 3; b < phi && validniB.length < count; b += 2) {
    if (nsd(b, phi) === 1) {
      validniB.push(b);
    }
  }
  return validniB;
}

/**
 * Vypočítá validní hodnoty soukromého exponentu d
 * @param {number} e Veřejný exponent
 * @param {number} phi Eulerova funkce φ(n)
 * @param {number} count Počet hodnot d (7)
 * @returns {number[]} Pole validních hodnot d
 */
export function najitValidniA(b, phi, count = 7) {
  const validniA = [];
  
  const a = modInverse(b, phi);
  
  if (a > 0) {
    for (let k = 0; k < count; k++) {
      validniA.push(a + k * phi);
    }
  }
  
  return validniA;
}

/**
 * ENCRYPT
 * @param {string} text Otevřený text
 * @param {number} e Veřejný exponent
 * @param {number} n Modul
 * @returns {string} Šifrovaný text (čísla oddělená mezerami)
 */
export function rsaEncrypt(text, b, n) {
  const zasifrovana_cisla = [];
  
  for (let i = 0; i < text.length; i++) {
    const cislo_znaku = text.charCodeAt(i); 
    const zasifrovane_cislo = modPow(cislo_znaku, b, n);
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
export function rsaDecrypt(text, a, n) {
  const zasifrovana_cisla = text.trim().split(/\s+/);
  const desifrovane_znaky = [];
  
  for (let i = 0; i < zasifrovana_cisla.length; i++) {
    const zasifrovane_cislo = parseInt(zasifrovana_cisla[i]);
    if (!isNaN(zasifrovane_cislo)) {
      const desifrovane_cislo = modPow(zasifrovane_cislo, a, n);
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
export function ziskatAktualniZnak(vstupniText, b, a, n) {
  if (!vstupniText || n === 0 || b === 0 || a === 0) {
    return null;
  }


  const prvniZnak = vstupniText.trim().charAt(0);
  const jeCislo = prvniZnak >= '0' && prvniZnak <= '9';

  if (jeCislo) {
    // pro DECRYPT vizualizaci
    const cisla = vstupniText.trim().split(/\s+/);
    const c = parseInt(cisla[cisla.length - 1]);
    
    if (isNaN(c)) return null;
    
    const mDesifrovane = modPow(c, a, n);
    
    return {
      c,
      mDesifrovane,
      znakDesifrovany: String.fromCharCode(mDesifrovane),
    };
  } else {
    // pro ENCRYPT vizualizaci
    const posledniZnak = vstupniText[vstupniText.length - 1];
    const m = posledniZnak.charCodeAt(0);
    const c = modPow(m, b, n);

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
export function vytvorSifrovaciKroky(text, b, n) {
  const kroky = [];
  
  for (let i = 0; i < text.length; i++) {
    const znak = text[i];
    const m = znak.charCodeAt(0);
    const c = modPow(m, b, n);
    
    kroky.push({
      index: i,
      znak,
      m,
      c,
      vypocet: `${m}^${b} mod ${n} = ${c}`
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
export function vytvorDesifrovaciKroky(text, a, n) {
  const kroky = [];
  const cisla = text.trim().split(/\s+/);
  
  for (let i = 0; i < cisla.length; i++) {
    const c = parseInt(cisla[i]);
    if (!isNaN(c)) {
      const m = modPow(c, a, n);
      const znak = String.fromCharCode(m);
      
      kroky.push({
        index: i,
        c,
        m,
        znak,
        vypocet: `${c}^${a} mod ${n} = ${m}`
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
