/* eslint-disable no-undef */
const { assert } = require('chai');
const chai = require('chai');
chai.use(require('chai-uuid'));
const faker = require('faker');

const truncate = require('../truncate');
const ManageSupervisorsService = require('../../src/services/supervisors');
const { supervisorFactory } = require('../factories');

describe('ManageSupervisorsService', () => {
    describe('CreateSupervisor', () => {
        let supervisorInfo;
        beforeEach(async () => {
            await truncate();
            supervisorInfo = {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                bio: faker.lorem.sentences(),
                email: faker.internet.email(),
            };
        });
        it('1. should return a supervisor object if registration token is sent successfully', async () => {
            const supervisor = await ManageSupervisorsService.CreateSupervisor(supervisorInfo);
            assert.isObject(supervisor);
        });
        it('2. should throw an error if the email is already added as a supervisor', async () => {
            await supervisorFactory(supervisorInfo);
            await ManageSupervisorsService.CreateSupervisor(supervisorInfo).catch((error) => {
                assert.equal(error.message, `Supervisor with email ${supervisorInfo.email} already exists.`);
            });
        });
    });
});
