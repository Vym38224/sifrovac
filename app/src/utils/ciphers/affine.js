/**
 * Afinní šifra
 */

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Inverse čísla: a modulo 26
 * @param {number} a - klíč a
 * @returns {number|null} - inverze nebo null, pokud neexistuje
 */
export function inverseA(a) {
    for (let x = 1; x < 26; x++) {
        if ((a * x) % 26 === 1) {
            return x;
        }
    }
    return null;
}

/**
 * ENCRYPT
 * @param {string} text Otevřený text
 * @param {number} a klíč a, musí být nesoudělný s 26 (má inverzi modulo 26)
 * @param {number} b klíč b
 * @returns {string} Zašifrovaný text
 * @throws {Error} Pokud a není nesoudělné s 26
 */
export function encrypt(text, a, b) {
    if (inverseA(a) === null) {
        throw new Error("Chyba šifrování: A musí být nesoudělné s 26");
    }

    let result = "";

    for (let char of text) {
        if (ALPHABET.includes(char)) {
            const p = ALPHABET.indexOf(char);
            const c = (a * p + b) % 26;
            result += ALPHABET[c];
        } else if (char === ' ' || char === '.') {
            result += char;
        }
    }

    return result;
}

/**
 * DECRYPT
 * @param {string} text Zašifrovaný text
 * @param {number} a klíč a, musí být nesoudělný s 26 (má inverzi modulo 26)
 * @param {number} b klíč b
 * @returns {string} Dešifrovaný text
 * @throws {Error} Pokud a není nesoudělné s 26
 */
export function decrypt(text, a, b) {
    const aInverse = inverseA(a);

    if (aInverse === null) {
        throw new Error("Chyba dešifrování: A musí být nesoudělné s 26");
    }

    let result = "";


    for (let char of text) {
        if (ALPHABET.includes(char)) {
            const c = ALPHABET.indexOf(char);
            const p = (aInverse * (c - b + 26)) % 26;
            result += ALPHABET[p];
        } else if (char === ' ' || char === '.') {
            result += char;
        }
    }

    return result;
}
