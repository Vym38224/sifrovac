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
export function textToBinary(text) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const asciiCode = char.charCodeAt(0);
    const binary = asciiCode.toString(2).padStart(8, "0");
    result += binary + " ";
  }
  return result.trim();
}

/**
 * Převede binární řetězec na text
 * @param {string} binary Binární řetězec
 * @returns {string} Textová reprezentace
 */
export function binaryToText(binary) {
  const bits = binary.replace(/\s/g, "");
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
 * @param {Array} table Permutační tabulka
 * @returns {string} Permutovaný binární řetězec oddělený mezerami po 8 bitech
 */
export function applyPermutation(binaryString, table) {
  const bits = binaryString.replace(/\s/g, "");
  let result = "";
  for (let i = 0; i < table.length; i++) {
    const position = table[i] - 1;
    result += bits[position];
  }
  let formatted = "";
  for (let i = 0; i < result.length; i += 8) {
    formatted += result.slice(i, i + 8) + " ";
  }
  return formatted.trim();
}

/**
 * Aplikuje expanzní permutaci E
 * @param {string} binaryString 32-bitový binární řetězec
 * @returns {string} 48-bitový expandovaný binární řetězec
 */
export function applyExpansion(binaryString) {
  const bits = binaryString.replace(/\s/g, "");
  let result = "";
  for (let i = 0; i < E.length; i++) {
    const position = E[i] - 1;
    result += bits[position];
  }
  return result;
}

/**
 * Rotuje binární řetězec doleva
 * @param {string} bits Binární řetězec
 * @param {number} count Počet pozic k rotaci
 * @returns {string} Rotovaný binární řetězec
 */
export function rotateLeft(bits, count) {
  const start = bits.slice(count);
  const end = bits.slice(0, count);
  return start + end;
}

/**
 * XOR operace nad dvěma binárními řetězci
 * @param {string} a První binární řetězec
 * @param {string} b Druhý binární řetězec
 * @returns {string} Výsledek XOR operace
 */
export function xorOperation(a, b) {
  let result = "";
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) {
      result += "0";
    } else {
      result += "1";
    }
  }
  return result;
}

/**
 * Aplikuje S-boxy na 48-bitový vstup
 * @param {string} input48bits 48-bitový binární řetězec
 * @returns {string} 32-bitový výstup po aplikaci S-boxů
 */
export function applySBoxes(input48bits) {
  let output = "";
  for (let i = 0; i < 8; i++) {
    const start = i * 6;
    const chunk = input48bits.slice(start, start + 6);
    const rowBinary = chunk[0] + chunk[5];
    const row = parseInt(rowBinary, 2);
    const colBinary = chunk.slice(1, 5);
    const col = parseInt(colBinary, 2);
    const value = S_BOXES[i][row][col];
    const binary = value.toString(2).padStart(4, "0");
    output += binary;
  }
  return output;
}

/**
 * Aplikuje P-box permutaci
 * @param {string} input32bits 32-bitový binární řetězec
 * @returns {string} Permutovaný 32-bitový binární řetězec
 */
export function applyPBox(input32bits) {
  let result = "";
  for (let i = 0; i < P.length; i++) {
    const position = P[i] - 1;
    result += input32bits[position];
  }
  return result;
}

/**
 * Generuje první rundovní klíč
 * @param {string} key64 64-bitový binární klíč
 * @returns {string} 48-bitový rundovní klíč
 */
export function generateFirstRoundKey(key64) {
  const keyNoSpaces = key64.replace(/\s/g, "");

  let key56 = "";
  for (let i = 0; i < PC1.length; i++) {
    const position = PC1[i] - 1;
    key56 += keyNoSpaces[position];
  }

  let C = key56.slice(0, 28);
  let D = key56.slice(28, 56);

  C = rotateLeft(C, 1);
  D = rotateLeft(D, 1);

  const CD = C + D;

  let roundKey = "";
  for (let i = 0; i < PC2.length; i++) {
    const position = PC2[i] - 1;
    roundKey += CD[position];
  }

  return roundKey;
}

/**
 * Získá C0 (levých 28 bitů po PC-1)
 * @param {string} key64 64-bitový binární klíč
 * @returns {string} C0 formátované po 8 bitech
 */
export function getC0(key64) {
  const keyNoSpaces = key64.replace(/\s/g, "");
  let key56 = "";
  for (let i = 0; i < PC1.length; i++) {
    const position = PC1[i] - 1;
    key56 += keyNoSpaces[position];
  }
  const C = key56.slice(0, 28);
  let result = "";
  for (let i = 0; i < C.length; i += 8) {
    result += C.slice(i, i + 8) + " ";
  }
  return result.trim();
}

/**
 * Získá D0 (pravých 28 bitů po PC-1)
 * @param {string} key64 64-bitový binární klíč
 * @returns {string} D0 formátované (4 bity + mezera + 8 bitů + ...)
 */
export function getD0(key64) {
  const keyNoSpaces = key64.replace(/\s/g, "");
  let key56 = "";
  for (let i = 0; i < PC1.length; i++) {
    const position = PC1[i] - 1;
    key56 += keyNoSpaces[position];
  }
  const D = key56.slice(28, 56);
  let result = "";
  result += D.slice(0, 4) + " ";
  for (let i = 4; i < D.length; i += 8) {
    result += D.slice(i, i + 8) + " ";
  }
  return result.trim();
}

/**
 * Získá C1 (C0 rotované o 1 bit doleva)
 * @param {string} key64 64-bitový binární klíč
 * @returns {string} C1 formátované po 8 bitech
 */
export function getC1(key64) {
  const keyNoSpaces = key64.replace(/\s/g, "");
  let key56 = "";
  for (let i = 0; i < PC1.length; i++) {
    const position = PC1[i] - 1;
    key56 += keyNoSpaces[position];
  }
  let C = key56.slice(0, 28);
  C = rotateLeft(C, 1);
  let result = "";
  for (let i = 0; i < C.length; i += 8) {
    result += C.slice(i, i + 8) + " ";
  }
  return result.trim();
}

/**
 * Získá D1 (D0 rotované o 1 bit doleva)
 * @param {string} key64 64-bitový binární klíč
 * @returns {string} D1 formátované (4 bity + mezera + 8 bitů + ...)
 */
export function getD1(key64) {
  const keyNoSpaces = key64.replace(/\s/g, "");
  let key56 = "";
  for (let i = 0; i < PC1.length; i++) {
    const position = PC1[i] - 1;
    key56 += keyNoSpaces[position];
  }
  let D = key56.slice(28, 56);
  D = rotateLeft(D, 1);
  let result = "";
  result += D.slice(0, 4) + " ";
  for (let i = 4; i < D.length; i += 8) {
    result += D.slice(i, i + 8) + " ";
  }
  return result.trim();
}

/**
 * Získá klíč po PC-1 permutaci (56 bitů)
 * @param {string} key64 64-bitový binární klíč
 * @returns {string} 56-bitový klíč formátovaný po 7 bitech
 */
export function getKey56AfterPC1(key64) {
  const keyNoSpaces = key64.replace(/\s/g, "");
  let key56 = "";
  for (let i = 0; i < PC1.length; i++) {
    const position = PC1[i] - 1;
    key56 += keyNoSpaces[position];
  }
  let result = "";
  for (let i = 0; i < key56.length; i += 7) {
    result += key56.slice(i, i + 7) + " ";
  }
  return result.trim();
}

/**
 * Feistelova funkce f(R, K)
 * @param {string} rightHalf 32-bitová pravá půlka
 * @param {string} roundKey 48-bitový rundovní klíč
 * @returns {object} Objekt s mezivýsledky pro vizualizaci
 */
export function feistelFunction(rightHalf, roundKey) {
  const rightClean = rightHalf.replace(/\s/g, "");

  const expanded = applyExpansion(rightClean);

  const xorResult = xorOperation(expanded, roundKey);

  const sBoxOutput = applySBoxes(xorResult);

  const pBoxOutput = applyPBox(sBoxOutput);

  return {
    expanded,
    xorResult,
    sBoxOutput,
    pBoxOutput
  };
}

/**
 * ENCRYPT (pouze 1 runda)
 * @param {string} text 8 znaků plaintext
 * @param {string} key 8 znaků klíč
 * @returns {string} 64-bitový zašifrovaný binární řetězec
 */
export function encrypt(text, key) {
  const textBin = textToBinary(text);
  const keyBin = textToBinary(key);

  const permuted = applyPermutation(textBin, IP);
  const permutedClean = permuted.replace(/\s/g, "");

  const L0 = permutedClean.slice(0, 32);
  const R0 = permutedClean.slice(32, 64);

  const K1 = generateFirstRoundKey(keyBin);

  const { pBoxOutput } = feistelFunction(R0, K1);

  const L1 = R0;

  const R1 = xorOperation(L0, pBoxOutput);

  const combined = R1 + L1;

  const encrypted = applyPermutation(combined, IP_INV);

  return encrypted.replace(/\s/g, "");
}

/**
 * DECRYPT (pouze 1 runda)
 * @param {string} binaryText 64-bitový zašifrovaný binární řetězec
 * @param {string} key 8 znaků klíč
 * @returns {string} Dešifrovaný plaintext
 */
export function decrypt(binaryText, key) {
  const keyBin = textToBinary(key);

  let formattedBinaryText = "";
  for (let i = 0; i < binaryText.length; i += 8) {
    formattedBinaryText += binaryText.slice(i, i + 8) + " ";
  }
  formattedBinaryText = formattedBinaryText.trim();

  const permuted = applyPermutation(formattedBinaryText, IP);
  const permutedClean = permuted.replace(/\s/g, "");

  const R1 = permutedClean.slice(0, 32);
  const L1 = permutedClean.slice(32, 64);

  const K1 = generateFirstRoundKey(keyBin);

  const R0 = L1;

  const { pBoxOutput } = feistelFunction(R0, K1);

  const L0 = xorOperation(R1, pBoxOutput);

  const combined = L0 + R0;

  const decrypted = applyPermutation(combined, IP_INV);

  return binaryToText(decrypted.replace(/\s/g, ""));
}

/**
 * Rozdělí binární řetězec na dva formátované díly
 * @param {string} binary Binární řetězec
 * @returns {object} Objekt s levou a pravou polovinou
 */
export function splitIntoHalves(binary) {
  const noSpaces = binary.replace(/\s/g, "");
  const left = noSpaces.slice(0, 32);
  const right = noSpaces.slice(32, 64);

  let leftFormatted = "";
  for (let i = 0; i < left.length; i += 8) {
    leftFormatted += left.slice(i, i + 8) + " ";
  }

  let rightFormatted = "";
  for (let i = 0; i < right.length; i += 8) {
    rightFormatted += right.slice(i, i + 8) + " ";
  }

  return {
    left: leftFormatted.trim(),
    right: rightFormatted.trim()
  };
}

/**
 * Formátuje binární řetězec po 8 bitech s mezerami
 * @param {string} binary Binární řetězec
 * @returns {string} Formátovaný binární řetězec
 */
export function formatBinary(binary) {
  const noSpaces = binary.replace(/\s/g, "");
  let result = "";
  for (let i = 0; i < noSpaces.length; i += 8) {
    result += noSpaces.slice(i, i + 8) + " ";
  }
  return result.trim();
}

/**
 * Formátuje binární řetězec po 8 bitech
 * @param {string} binary Binární řetězec
 * @returns {Array} Pole 8-bitových kusů
 */
export function formatBy8Bits(binary) {
  const chunks = [];
  for (let i = 0; i < binary.length; i += 8) {
    chunks.push(binary.slice(i, i + 8));
  }
  return chunks;
}

/**
 * Formátuje binární řetězec po 6 bitech (pro zobrazení po XOR s klíčem)
 * @param {string} binary Binární řetězec
 * @returns {Array} Pole 6-bitových kusů
 */
export function formatBy6Bits(binary) {
  const chunks = [];
  for (let i = 0; i < binary.length; i += 6) {
    chunks.push(binary.slice(i, i + 6));
  }
  return chunks;
}

/**
 * Formátuje binární řetězec po 4 bitech (pro S-box výstup)
 * @param {string} binary Binární řetězec
 * @returns {Array} Pole 4-bitových kusů
 */
export function formatBy4Bits(binary) {
  const chunks = [];
  for (let i = 0; i < binary.length; i += 4) {
    chunks.push(binary.slice(i, i + 4));
  }
  return chunks;
}
