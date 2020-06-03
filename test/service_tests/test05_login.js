/* eslint-disable no-undef */
const { assert } = require('chai');
const chai = require('chai');
chai.use(require('chai-uuid'));
const faker = require('faker');

const truncate = require('../truncate');
const LoginService = require('../../src/services/login');
const { hashPassword } = require('../../src/helpers/password');
const { roleFactory, userFactory } = require('../factories');

describe('LoginService', () => {
    describe('Login', () => {
        let role;
        let user;
        beforeEach(async () => {
            await truncate();
            role = await roleFactory();
            password = faker.internet.password();
            user = await userFactory({ roleId: role.id, password: await hashPassword(password) });
        });
        it('1. should return a user object if registration token is sent successfully', async () => {
            const response = await LoginService.Login(user.email, password);
            assert.isObject(response);
        });
        it('2. should throw an error if the email is invalid', async () => {
            await LoginService.Login(faker.internet.email(), password).catch((error) => {
                assert.equal(error.message, 'Email isn\'t registered in the system');
            });
        });
        it('3. should throw an error if the password is invalid', async () => {
            await LoginService.Login(user.email, faker.internet.password()).catch((error) => {
                assert.equal(error.message, 'Email/Password mismatch');
            });
        });
    });
});
