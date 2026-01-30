/**
 * Caesarova šifra 
 */

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * ENCRYPT
 * @param {string} text Otevřený text
 * @param {number} shift klíč
 * @returns {string} Zašifrovaný text
 */
export function encrypt(text, shift) {
    let result = "";

    for (let char of text) {
        if (ALPHABET.includes(char)) {
            const oldIndex = ALPHABET.indexOf(char);
            // +26 a druhý % 26 zajistí správnou funkci i se zápornými čísly (při dešifrování)
            const newIndex = ((oldIndex + shift) % 26 + 26) % 26;
            result += ALPHABET[newIndex];
        } else if (char === ' ' || char === '.') {
            result += char;
        }
    }

    return result;
}

/**
 * DECRYPT
 * @param {string} text Zašifrovaný text
 * @param {number} shift klíč
 * @returns {string} Dešifrovaný text
 */
export function decrypt(text, shift) {
    return encrypt(text, -shift);
}
