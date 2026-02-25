/**
 * Substituční šifra
 */

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * ENCRYPT
 * @param {string} text Otevřený text
 * @param {string} permutation Permutace anglické abecedy
 * @returns {string} Zašifrovaný text
 */
export function encrypt(text, permutation) {
    let result = "";

    for (let char of text) {
        if (ALPHABET.includes(char)) {
            const position = ALPHABET.indexOf(char);
            result += permutation[position];
        } else if (char === ' ' || char === '.') {
            result += char;
        }
    }

    return result;
}

/**
 * DECRYPT
 * @param {string} text Zašifrovaný text
 * @param {string} permutation Permutace anglické abecedy
 * @returns {string} Dešifrovaný text
 */
export function decrypt(text, permutation) {
    let result = "";

    for (let char of text) {
        if (permutation.includes(char)) {
            const position = permutation.indexOf(char);
            result += ALPHABET[position];
        } else if (char === ' ' || char === '.') {
            result += char;
        }
    }

    return result;
}
