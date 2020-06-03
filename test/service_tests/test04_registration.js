/* eslint-disable no-undef */
const { assert } = require('chai');
const chai = require('chai');
chai.use(require('chai-uuid'));
const faker = require('faker');

const truncate = require('../truncate');
const RegistrationService = require('../../src/services/registration');

const { roleFactory, registrationTokenFactory } = require('../factories');

describe('RegistrationService', () => {
    describe('VerifyRegistrationToken', () => {
        let role;
        let email;
        let registerToken;
        beforeEach(async () => {
            await truncate();
            role = await roleFactory();
            email = faker.internet.email();
            registerToken = await registrationTokenFactory({
                email,
                assignedRoleId: role.id,
                token: faker.random.alphaNumeric(96),
            });
        });
        it('1. should return a token object if registration token is sent successfully', async () => {
            const token = await RegistrationService.VerifyRegistrationToken(registerToken.token);
            assert.isObject(token);
        });
        it('2. should throw an error if the token is invalid', async () => {
            await RegistrationService.Register(faker.random.alphaNumeric(96)).catch((error) => {
                assert.equal(error.message, 'Invalid token');
            });
        });
    });
    describe('Register', () => {
        let role;
        let email;
        let registerToken;
        beforeEach(async () => {
            await truncate();
            role = await roleFactory();
            email = faker.internet.email();
            registerToken = await registrationTokenFactory({
                email,
                assignedRoleId: role.id,
                token: faker.random.alphaNumeric(96),
            });
        });
        it('1. should return a user object if registration token is sent successfully', async () => {
            const user = await RegistrationService.Register(registerToken.token, 'firstName', 'lastName', 'password');
            assert.isObject(user);
        });
        it('2. should throw an error if the token is invalid', async () => {
            await RegistrationService.Register(faker.random.alphaNumeric(96), 'firstName', 'lastName', 'password').catch((error) => {
                assert.equal(error.message, 'Invalid token');
            });
        });
    });
});
