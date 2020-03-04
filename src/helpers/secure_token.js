const crypto = require('crypto');

const generateSecureToken = (length) => {
    const urlSafeCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~'.split('');
    const characterCount = urlSafeCharacters.length;
    const maxValidSelector = (Math.floor(0x10000 / characterCount) * characterCount) - 1;
    const entropyLength = 2 * Math.ceil(1.1 * length);
    let string = '';
    let stringLength = 0;

    while (stringLength < length) {
        const entropy = crypto.randomBytes(entropyLength);
        let entropyPosition = 0;

        while (entropyPosition < entropyLength && stringLength < length) {
            const entropyValue = entropy.readUInt16LE(entropyPosition);
            entropyPosition += 2;
            if (entropyValue > maxValidSelector) {
                continue;
            }

            string += urlSafeCharacters[entropyValue % characterCount];
            stringLength += 1;
        }
    }

    return string;
};

module.exports = { generateSecureToken };
