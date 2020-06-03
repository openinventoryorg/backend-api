/* eslint-disable no-undef */
const { assert } = require('chai');
const chai = require('chai');
chai.use(require('chai-uuid'));
const faker = require('faker');

const truncate = require('../truncate');
const RegistrarService = require('../../src/services/registrar');

const { roleFactory, registrationTokenFactory } = require('../factories');

describe('RegistrarService', () => {
    describe('SendRegistrationToken', () => {
        let role;
        let email;
        beforeEach(async () => {
            await truncate();
            role = await roleFactory();
            email = faker.internet.email();
        });
        it('1. should return a token object if registration token is sent successfully', async () => {
            const response = await RegistrarService.SendRegistrationToken(email, role.id);
            assert.isObject(response);
        });
        it('2. should throw an error if the email already exists', async () => {
            await registrationTokenFactory({
                email,
                assignedRoleId: role.id,
                token: faker.random.alphaNumeric(96),
            });
            await RegistrarService.SendRegistrationToken(email, role.id).catch((error) => {
                assert.equal(error.message, `User ${email} is already sent an invitation link or account already created`);
            });
        });
        it('3. should throw an error if the role does not exist', async () => {
            await RegistrarService.SendRegistrationToken(
                email, faker.random.uuid(),
            ).catch((error) => {
                assert.equal(error.message, 'Invalid data. Token saving failed.');
            });
        });
    });
    describe('SendRegistrationTokenList', () => {
        let role;
        let email;
        beforeEach(async () => {
            await truncate();
            role = await roleFactory();
            email = faker.internet.email();
        });
        it('1. should return undefined if registration token is sent successfully', async () => {
            const response = await RegistrarService.SendRegistrationTokenList([email], role.id);
            assert.isUndefined(response);
        });
        it('2. should throw an error if the email already exists', async () => {
            await registrationTokenFactory({
                email,
                assignedRoleId: role.id,
                token: faker.random.alphaNumeric(96),
            });
            await RegistrarService.SendRegistrationTokenList([email], role.id).catch((error) => {
                assert.equal(error.message, `User ${email} is already sent an invitation link or account already created`);
            });
        });
    });

    describe('DeleteRegistrationToken', () => {
        let role;
        let email;
        beforeEach(async () => {
            await truncate();
            role = await roleFactory();
            email = faker.internet.email();
        });
        it('1. should delete successfully if the email already exists', async () => {
            await registrationTokenFactory({
                email,
                assignedRoleId: role.id,
                token: faker.random.alphaNumeric(96),
            });
            const response = await RegistrarService.DeleteRegistrationToken(email);
            assert.isUndefined(response);
        });
        it('2. should return undefined if registration token is sent successfully', async () => {
            await RegistrarService.DeleteRegistrationToken(email).catch((error) => {
                assert.equal(error.message, `User ${email} is not sent an invitation link or the user has created an account.`);
            });
        });
    });
});
