/**
 * Proudová šifra s LFSR
 */

/**
 * Převod textu na binární reprezentaci (ASCII)
 * @param {string} text Text k převodu
 * @returns {string} Binární řetězec
 */
export function textToBinary(text) {
    let binaryString = "";
    for (let i = 0; i < text.length; i++) {
        let binaryChar = text.charCodeAt(i).toString(2).padStart(8, '0');
        binaryString += binaryChar;
    }
    return binaryString;
}

/**
 * Převod binárního řetězce na text (ASCII)
 * @param {string} binary Binární řetězec (délka musí být násobek 8)
 * @returns {string} Text
 */
export function binaryToText(binary) {
    let result = "";
    for (let i = 0; i < binary.length; i += 8) {
        const eightBits = binary.slice(i, i + 8);
        if (eightBits.length === 8) {
            const charCode = parseInt(eightBits, 2);
            result += String.fromCharCode(charCode);
        }
    }
    return result;
}

/**
 * Výpočet zpětné vazby pro LFSR
 * @param {string} register Aktuální stav registru (binární řetězec)
 * @param {string} coefficients Koeficienty (binární řetězec délky registeru)
 * @returns {string} Nový bit zpětné vazby (0 nebo 1)
 */
export function calculateFeedback(register, coefficients) {
    let xorResult = 0;
    for (let i = 0; i < register.length; i++) {
        if (coefficients[i] === "1") {
            xorResult ^= parseInt(register[i]);
        }
    }
    return xorResult.toString();
}

/**
 * Generování proudu klíčů pomocí LFSR
 * @param {string} initialVector Počáteční vektor (binární řetězec)
 * @param {string} coefficients Koeficienty (binární řetězec stejné délky)
 * @param {number} length Požadovaná délka proudu klíčů
 * @returns {string} Proud klíčů (binární řetězec)
 */
export function generateKeyStream(initialVector, coefficients, length) {
    let register = initialVector.split("");
    let keyStream = "";

    for (let i = 0; i < length; i++) {
        const outputBit = register[register.length - 1];
        keyStream += outputBit;

        const feedback = calculateFeedback(register.join(""), coefficients);

        register.pop();
        register.unshift(feedback);
    }

    return keyStream;
}

/**
 * XOR operace mezi dvěma binárními řetězci
 * @param {string} binary1 První binární řetězec
 * @param {string} binary2 Druhý binární řetězec
 * @returns {string} Výsledek XOR operace
 */
export function xorBinary(binary1, binary2) {
    const minLength = Math.min(binary1.length, binary2.length);
    let result = "";

    for (let i = 0; i < minLength; i++) {
        const bit1 = parseInt(binary1[i]);
        const bit2 = parseInt(binary2[i]);
        result += (bit1 ^ bit2).toString();
    }

    return result;
}

/**
 * ENCRYPT 
 * @param {string} plaintext Otevřený text nebo binární řetězec
 * @param {string} initialVector Počáteční vektor (binární řetězec)
 * @param {string} coefficients Koeficienty (binární řetězec)
 * @param {string} inputType Typ vstupu (text nebo bity)
 * @returns {string} Zašifrovaný text (binární řetězec pro bity, text pro text)
 */
export function encrypt(plaintext, initialVector, coefficients, inputType = "text") {
    const binaryInput = inputType === "text" ? textToBinary(plaintext) : plaintext;

    const keyStream = generateKeyStream(initialVector, coefficients, binaryInput.length);

    const encryptedBinary = xorBinary(binaryInput, keyStream);

    if (inputType === "bity") {
        return binaryToText(encryptedBinary);
    } else {
        return encryptedBinary;
    }
}

/**
 * DECRYPT
 * @param {string} ciphertext Zašifrovaný text nebo binární řetězec
 * @param {string} initialVector Počáteční vektor (binární řetězec)
 * @param {string} coefficients Koeficienty (binární řetězec)
 * @param {string} inputType Typ vstupu (text nebo bity)
 * @returns {string} Dešifrovaný text
 */
export function decrypt(ciphertext, initialVector, coefficients, inputType = "text") {
    return encrypt(ciphertext, initialVector, coefficients, inputType);
}

/**
 * Validace parametrů
 * @param {string} initialVector Počáteční vektor
 * @param {string} coefficients Koeficienty
 * @param {number} m Délka registru
 * @returns {boolean} True pokud jsou parametry validní
 */
export function validateParameters(initialVector, coefficients, m) {
    if (initialVector.length !== m || coefficients.length !== m) {
        return false;
    }
    if (!/^[01]+$/.test(initialVector) || !/^[01]+$/.test(coefficients)) {
        return false;
    }
    return true;
}

/**
 * Generování vizualizačních dat pro JEDEN KROK LFSR
 * @param {string} register Aktuální stav registru
 * @param {string} coefficients Koeficienty
 * @returns {Object} Objekt s daty pro vizualizaci
 */
export function visualizeStep(register, coefficients) {
    const feedback = calculateFeedback(register, coefficients);
    const outputBit = register[register.length - 1];

    let bitsForCalculation = [];
    for (let i = 0; i < register.length; i++) {
        if (coefficients[i] === "1") {
            bitsForCalculation.push(register[i]);
        }
    }
    const calculationExpression = bitsForCalculation.join(" ⊕ ");

    const newRegister = feedback + register.slice(0, -1);

    return {
        feedback,
        outputBit,
        calculationExpression,
        newRegister
    };
}
