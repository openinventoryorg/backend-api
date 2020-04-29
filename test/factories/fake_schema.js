const faker = require('faker');

exports.fakeItemSet = {
    title: faker.commerce.productName(),
    image: faker.image.image(),
};

exports.fakeLab = {
    title: faker.commerce.productName(),
    subtitle: faker.commerce.product(),
    image: faker.image.image(),
};

exports.fakeItem = {
    serialNumber: faker.random.alphaNumeric(10),
    labId: faker.random.uuid(),
    itemSetId: faker.random.uuid(),
};

exports.fakeItemAttributes = [
    {
        key: faker.commerce.productAdjective(),
        value: faker.random.word(),
    },
    {
        key: faker.commerce.productAdjective(),
        value: faker.random.word(),
    },
];

exports.fakeAttributes = [
    {
        key: faker.commerce.productAdjective(),
        defaultValue: faker.random.word(),
        editable: faker.random.boolean(),
    },
    {
        key: faker.commerce.productAdjective(),
        defaultValue: faker.random.word(),
        editable: faker.random.boolean(),
    },
];
