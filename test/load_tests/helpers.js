/* eslint-disable no-param-reassign */

// Make sure to "npm install faker" first.
const faker = require('faker');

function generateLabsData(userContext, events, done) {
    // generate data with Faker:
    const title = faker.company.companyName();
    const subtitle = faker.lorem.word();
    const image = faker.image.imageUrl();
    // add variables to virtual user's context:
    userContext.vars.title = title;
    userContext.vars.subtitle = subtitle;
    userContext.vars.image = image;
    // continue with executing the scenario:
    return done();
}

function generateSupervisorsData(userContext, events, done) {
    // generate data with Faker:
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const bio = faker.lorem.sentence();
    const email = faker.internet.email();
    // add variables to virtual user's context:
    userContext.vars.firstName = firstName;
    userContext.vars.lastName = lastName;
    userContext.vars.bio = bio;
    userContext.vars.email = email;
    // continue with executing the scenario:
    return done();
}

function generateUsersData(userContext, events, done) {
    // generate data with Faker:
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    // add variables to virtual user's context:
    userContext.vars.firstName = firstName;
    userContext.vars.lastName = lastName;
    // continue with executing the scenario:
    return done();
}

function generateItemrequestData(userContext, events, done) {
    const serialNumber = faker.random.alphaNumeric();
    const title = faker.commerce.productName();
    const subtitle = faker.commerce.productAdjective();
    const image = faker.image.imageUrl();

    userContext.vars.serialNumber = serialNumber;
    userContext.vars.title = title;
    userContext.vars.subtitle = subtitle;
    userContext.vars.image = image;
    return done();
}

module.exports = {
    generateLabsData,
    generateSupervisorsData,
    generateUsersData,
    generateItemrequestData,
};
