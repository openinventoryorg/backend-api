/*
Modified from: https://github.com/sindresorhus/crypto-random-string/blob/master/index.js

MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
*/

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
