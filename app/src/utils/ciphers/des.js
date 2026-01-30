/**
 * DES (Data Encryption Standard) šifra
 */

import { IP, IP_INV, E, P, PC1, PC2 } from '@/utils/constants/permutationTables.js';
import { S_BOXES } from '@/utils/constants/sboxes.js';

/**
 * Převede text na binární reprezentaci
 * @param {string} text Text k převodu
 * @returns {string} Binární řetězec oddělený mezerami po 8 bitech
 */
export function textNaBinarni(text) {
  let vysledek = "";
  for (let i = 0; i < text.length; i++) {
    const znak = text[i];
    const asciiKod = znak.charCodeAt(0);
    const binarni = asciiKod.toString(2).padStart(8, "0");
    vysledek += binarni + " ";
  }
  return vysledek.trim();
}

/**
 * Převede binární řetězec na text
 * @param {string} binarni Binární řetězec
 * @returns {string} Textová reprezentace
 */
export function binarniNaText(binarni) {
  const bits = binarni.replace(/\s/g, "");
  let text = "";
  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.slice(i, i + 8);
    if (byte.length === 8) {
      text += String.fromCharCode(parseInt(byte, 2));
    }
  }
  return text;
}

/**
 * Aplikuje permutaci podle dané tabulky
 * @param {string} binaryString Binární řetězec
 * @param {Array} tabulka Permutační tabulka
 * @returns {string} Permutovaný binární řetězec oddělený mezerami po 8 bitech
 */
export function aplikujPermutaci(binaryString, tabulka) {
  const bity = binaryString.replace(/\s/g, ""); 
  let vysledek = "";
  for (let i = 0; i < tabulka.length; i++) {
    const pozice = tabulka[i] - 1;
    vysledek += bity[pozice];
  }
  let formatovany = "";
  for (let i = 0; i < vysledek.length; i += 8) {
    formatovany += vysledek.slice(i, i + 8) + " ";
  }
  return formatovany.trim();  
}

/**
 * Aplikuje expanzní permutaci E
 * @param {string} binaryString 32-bitový binární řetězec
 * @returns {string} 48-bitový expandovaný binární řetězec
 */
export function aplikujExpanzi(binaryString) {
  const bity = binaryString.replace(/\s/g, "");
  let vysledek = "";
  for (let i = 0; i < E.length; i++) {
    const pozice = E[i] - 1;
    vysledek += bity[pozice];
  }
  return vysledek;
}

/**
 * Rotuje binární řetězec doleva
 * @param {string} bity Binární řetězec
 * @param {number} pocet Počet pozic k rotaci
 * @returns {string} Rotovaný binární řetězec
 */
export function rotujDoleva(bity, pocet) {
  const zacatek = bity.slice(pocet);
  const konec = bity.slice(0, pocet);
  return zacatek + konec;
}

/**
 * XOR operace nad dvěma binárními řetězci
 * @param {string} a První binární řetězec
 * @param {string} b Druhý binární řetězec
 * @returns {string} Výsledek XOR operace
 */
export function xorOperace(a, b) {
  let vysledek = "";
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) {
      vysledek += "0";
    } else {
      vysledek += "1";
    }
  }
  return vysledek;
}

/**
 * Aplikuje S-boxy na 48-bitový vstup
 * @param {string} vstup48bitu 48-bitový binární řetězec
 * @returns {string} 32-bitový výstup po aplikaci S-boxů
 */
export function aplikujSBoxy(vstup48bitu) {
  let vystup = "";
  for (let i = 0; i < 8; i++) {
    const zacatek = i * 6;
    const kousek = vstup48bitu.slice(zacatek, zacatek + 6);
    const radekBinarni = kousek[0] + kousek[5];
    const radek = parseInt(radekBinarni, 2);
    const sloupecBinarni = kousek.slice(1, 5);
    const sloupec = parseInt(sloupecBinarni, 2);
    const hodnota = S_BOXES[i][radek][sloupec];
    const binarni = hodnota.toString(2).padStart(4, "0");
    vystup += binarni;
  }
  return vystup;
}

/**
 * Aplikuje P-box permutaci
 * @param {string} vstup32bitu 32-bitový binární řetězec
 * @returns {string} Permutovaný 32-bitový binární řetězec
 */
export function aplikujPBox(vstup32bitu) {
  let vysledek = "";
  for (let i = 0; i < P.length; i++) {
    const pozice = P[i] - 1;
    vysledek += vstup32bitu[pozice];
  }
  return vysledek;
}

/**
 * Generuje první rundovní klíč
 * @param {string} klic64 64-bitový binární klíč
 * @returns {string} 48-bitový rundovní klíč
 */
export function vygenerujPrvniRundovniKlic(klic64) {
  const klicBezMezer = klic64.replace(/\s/g, "");
  
  // PC-1 permutace (64 bitů -> 56 bitů)
  let klic56 = "";
  for (let i = 0; i < PC1.length; i++) {
    const pozice = PC1[i] - 1;
    klic56 += klicBezMezer[pozice];
  }
  
  // dělení na C0 a D0
  let C = klic56.slice(0, 28);
  let D = klic56.slice(28, 56);
  
  // rotace pro první rundu (1 bit doleva)
  C = rotujDoleva(C, 1);
  D = rotujDoleva(D, 1);
  
  // spojení C1 a D1
  const CD = C + D;
  
  // PC-2 permutace (56 bitů -> 48 bitů)
  let rundovniKlic = "";
  for (let i = 0; i < PC2.length; i++) {
    const pozice = PC2[i] - 1;
    rundovniKlic += CD[pozice];
  }
  
  return rundovniKlic;
}

/**
 * Získá C0 (levých 28 bitů po PC-1)
 * @param {string} klic64 64-bitový binární klíč
 * @returns {string} C0 formátované po 8 bitech
 */
export function ziskejC0(klic64) {
  const klicBezMezer = klic64.replace(/\s/g, "");
  let klic56 = "";
  for (let i = 0; i < PC1.length; i++) {
    const pozice = PC1[i] - 1;
    klic56 += klicBezMezer[pozice];
  }
  const C = klic56.slice(0, 28);
  let vysledek = "";
  for (let i = 0; i < C.length; i += 8) {
    vysledek += C.slice(i, i + 8) + " ";
  }
  return vysledek.trim();
}

/**
 * Získá D0 (pravých 28 bitů po PC-1)
 * @param {string} klic64 64-bitový binární klíč
 * @returns {string} D0 formátované (4 bity + mezera + 8 bitů + ...)
 */
export function ziskejD0(klic64) {
  const klicBezMezer = klic64.replace(/\s/g, "");
  let klic56 = "";
  for (let i = 0; i < PC1.length; i++) {
    const pozice = PC1[i] - 1;
    klic56 += klicBezMezer[pozice];
  }
  const D = klic56.slice(28, 56);
  let vysledek = "";
  vysledek += D.slice(0, 4) + " "; 
  for (let i = 4; i < D.length; i += 8) {
    vysledek += D.slice(i, i + 8) + " ";
  }
  return vysledek.trim();
}

/**
 * Získá C1 (C0 rotované o 1 bit doleva)
 * @param {string} klic64 64-bitový binární klíč
 * @returns {string} C1 formátované po 8 bitech
 */
export function ziskejC1(klic64) {
  const klicBezMezer = klic64.replace(/\s/g, "");
  let klic56 = "";
  for (let i = 0; i < PC1.length; i++) {
    const pozice = PC1[i] - 1;
    klic56 += klicBezMezer[pozice];
  }
  let C = klic56.slice(0, 28);
  C = rotujDoleva(C, 1);
  let vysledek = "";
  for (let i = 0; i < C.length; i += 8) {
    vysledek += C.slice(i, i + 8) + " ";
  }
  return vysledek.trim();
}

/**
 * Získá D1 (D0 rotované o 1 bit doleva)
 * @param {string} klic64 64-bitový binární klíč
 * @returns {string} D1 formátované (4 bity + mezera + 8 bitů + ...)
 */
export function ziskejD1(klic64) {
  const klicBezMezer = klic64.replace(/\s/g, "");
  let klic56 = "";
  for (let i = 0; i < PC1.length; i++) {
    const pozice = PC1[i] - 1;
    klic56 += klicBezMezer[pozice];
  }
  let D = klic56.slice(28, 56);
  D = rotujDoleva(D, 1);
  let vysledek = "";
  vysledek += D.slice(0, 4) + " "; 
  for (let i = 4; i < D.length; i += 8) {
    vysledek += D.slice(i, i + 8) + " ";
  }
  return vysledek.trim();
}

/**
 * Získá klíč po PC-1 permutaci (56 bitů)
 * @param {string} klic64 64-bitový binární klíč
 * @returns {string} 56-bitový klíč formátovaný po 7 bitech
 */
export function ziskejKlic56PoPC1(klic64) {
  const klicBezMezer = klic64.replace(/\s/g, "");
  let klic56 = "";
  for (let i = 0; i < PC1.length; i++) {
    const pozice = PC1[i] - 1;
    klic56 += klicBezMezer[pozice];
  }
  let vysledek = "";
  for (let i = 0; i < klic56.length; i += 7) {
    vysledek += klic56.slice(i, i + 7) + " ";
  }
  return vysledek.trim();
}

/**
 * Feistelova funkce f(R, K)
 * @param {string} pravaPulka 32-bitová pravá půlka
 * @param {string} rundovniKlic 48-bitový rundovní klíč
 * @returns {object} Objekt s mezivýsledky pro vizualizaci
 */
export function feistelFunkce(pravaPulka, rundovniKlic) {
  const pravaBezMezer = pravaPulka.replace(/\s/g, "");
  
  // 1. Expanze (32 bitů -> 48 bitů)
  const expandovana = aplikujExpanzi(pravaBezMezer);
  
  // 2. XOR s rundovním klíčem
  const xorVysledek = xorOperace(expandovana, rundovniKlic);
  
  // 3. S-boxy (48 bitů -> 32 bitů)
  const sBoxVystup = aplikujSBoxy(xorVysledek);
  
  // 4. P-box permutace
  const pBoxVystup = aplikujPBox(sBoxVystup);
  
  return {
    expandovana,
    xorVysledek,
    sBoxVystup,
    pBoxVystup
  };
}

/**
 * ENCRYPT (pouze 1 runda)
 * @param {string} text 8 znaků plaintext
 * @param {string} klic 8 znaků klíč
 * @returns {string} 64-bitový zašifrovaný binární řetězec
 */
export function sifrovat(text, klic) {
  // převod textu a klíče na binární
  const textBin = textNaBinarni(text);
  const klicBin = textNaBinarni(klic);
  
  // počáteční permutace (IP)
  const permutovany = aplikujPermutaci(textBin, IP);
  const permutovanyBezMezer = permutovany.replace(/\s/g, "");
  
  // rozdělení na L0 a R0
  const L0 = permutovanyBezMezer.slice(0, 32);
  const R0 = permutovanyBezMezer.slice(32, 64);
  
  // generování rundovního klíče
  const K1 = vygenerujPrvniRundovniKlic(klicBin);
  
  // Feistelova funkce
  const { pBoxVystup } = feistelFunkce(R0, K1);
  
  // L1 = R0
  const L1 = R0;
  
  // R1 = L0 ⊕ f(R0, K1)
  const R1 = xorOperace(L0, pBoxVystup);
  
  // spojení R1 a L1
  const spojeno = R1 + L1;
  
  // konečná permutace (IP^-1)
  const zasifrovany = aplikujPermutaci(spojeno, IP_INV);
  
  return zasifrovany.replace(/\s/g, "");
}

/**
 * DECRYPT (pouze 1 runda)
 * @param {string} binarniText 64-bitový zašifrovaný binární řetězec
 * @param {string} klic 8 znaků klíč
 * @returns {string} Dešifrovaný plaintext
 */
export function desifrovat(binarniText, klic) {
  // převod klíče na binární
  const klicBin = textNaBinarni(klic);
  
  // počáteční permutace (IP) na zašifrovaný text
  let binarniTextFormatovany = "";
  for (let i = 0; i < binarniText.length; i += 8) {
    binarniTextFormatovany += binarniText.slice(i, i + 8) + " ";
  }
  binarniTextFormatovany = binarniTextFormatovany.trim();
  
  const permutovany = aplikujPermutaci(binarniTextFormatovany, IP);
  const permutovanyBezMezer = permutovany.replace(/\s/g, "");
  
  // rozdělení na R1 a L1
  const R1 = permutovanyBezMezer.slice(0, 32);
  const L1 = permutovanyBezMezer.slice(32, 64);
  
  // generování rundovního klíče
  const K1 = vygenerujPrvniRundovniKlic(klicBin);
  
  // R0 = L1
  const R0 = L1;
  
  // Feistelova funkce
  const { pBoxVystup } = feistelFunkce(R0, K1);
  
  // L0 = R1 ⊕ f(L1, K1)
  const L0 = xorOperace(R1, pBoxVystup);
  
  // spojení L0 a R0
  const spojeno = L0 + R0;
  
  // konečná permutace (IP^-1)
  const desifrovany = aplikujPermutaci(spojeno, IP_INV);
  
  // převod binárního řetězce na text
  return binarniNaText(desifrovany.replace(/\s/g, ""));
}

/**
 * Rozdělí binární řetězec na dva formátované díly
 * @param {string} binarni Binární řetězec
 * @returns {object} Objekt s levou a pravou polovinou
 */
export function rozdelNaPulky(binarni) {
  const bezMezer = binarni.replace(/\s/g, "");
  const leva = bezMezer.slice(0, 32);
  const prava = bezMezer.slice(32, 64);
  
  let levaFormat = "";
  for (let i = 0; i < leva.length; i += 8) {
    levaFormat += leva.slice(i, i + 8) + " ";
  }
  
  let pravaFormat = "";
  for (let i = 0; i < prava.length; i += 8) {
    pravaFormat += prava.slice(i, i + 8) + " ";
  }
  
  return {
    leva: levaFormat.trim(),
    prava: pravaFormat.trim()
  };
}

/**
 * Formátuje binární řetězec po 8 bitech s mezerami
 * @param {string} binarni Binární řetězec
 * @returns {string} Formátovaný binární řetězec
 */
export function formatujBinarni(binarni) {
  const bezMezer = binarni.replace(/\s/g, "");
  let vysledek = "";
  for (let i = 0; i < bezMezer.length; i += 8) {
    vysledek += bezMezer.slice(i, i + 8) + " ";
  }
  return vysledek.trim();
}

/**
 * Formátuje binární řetězec po 6 bitech (pro zobrazení po XOR s klíčem)
 * @param {string} binarni Binární řetězec
 * @returns {Array} Pole 6-bitových kusů
 */
export function formatujPo6Bitech(binarni) {
  const kusy = [];
  for (let i = 0; i < binarni.length; i += 6) {
    kusy.push(binarni.slice(i, i + 6));
  }
  return kusy;
}

/**
 * Formátuje binární řetězec po 4 bitech (pro S-box výstup)
 * @param {string} binarni Binární řetězec
 * @returns {Array} Pole 4-bitových kusů
 */
export function formatujPo4Bitech(binarni) {
  const kusy = [];
  for (let i = 0; i < binarni.length; i += 4) {
    kusy.push(binarni.slice(i, i + 4));
  }
  return kusy;
}
