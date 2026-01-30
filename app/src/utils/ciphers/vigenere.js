/**
 * Vigenerova šifra 
 */

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * ENCRYPT
 * @param {string} text Otevřený text
 * @param {string} key klíč
 * @returns {string} Zašifrovaný text
 */
export function encrypt(text, key) {
    let result = "";
    let keyIndex = 0;

    for (let char of text) {
        if (ALPHABET.includes(char)) {
            const keyChar = key[keyIndex % key.length];

            const textIndex = ALPHABET.indexOf(char);
            const keyCharIndex = ALPHABET.indexOf(keyChar);

            const newIndex = (textIndex + keyCharIndex) % 26;
            result += ALPHABET[newIndex];
            keyIndex++;
        } else if (char === ' ' || char === '.') {
            result += char;
        }
    }

    return result;
}

/**
 * DECRYPT
 * @param {string} text Zašifrovaný text
 * @param {string} key klíč
 * @returns {string} Dešifrovaný text
 */
export function decrypt(text, key) {
    let result = "";
    let keyIndex = 0;

    for (let char of text) {
        if (ALPHABET.includes(char)) {
            const keyChar = key[keyIndex % key.length];

            const textIndex = ALPHABET.indexOf(char);
            const keyCharIndex = ALPHABET.indexOf(keyChar);

            const newIndex = (textIndex - keyCharIndex + 26) % 26;
            result += ALPHABET[newIndex];
            keyIndex++;
        } else if (char === ' ' || char === '.') {
            result += char;
        }
    }

    return result;
}
