/* eslint-disable no-undef */
const { assert } = require('chai');
const chai = require('chai');
chai.use(require('chai-uuid'));

const truncate = require('../truncate');
const RolesService = require('../../src/services/roles');

const { roleFactory } = require('../factories');

describe('RolesService', () => {
    describe('CreateRole', () => {
        beforeEach(async () => {
            await truncate();
        });
        it('1. should return a role object if role is created successfully', async () => {
            const role = await RolesService.CreateRole({
                name: 'Instructor',
                permissions: ['INVENTORY_MANAGER', 'ADMINISTRATOR'],
            });
            assert.isObject(role);
        });
        it('2. should throw an error if the role name already exists', async () => {
            const role = await roleFactory();
            await RolesService.CreateRole({
                name: role.name,
                permissions: ['INVENTORY_MANAGER', 'ADMINISTRATOR'],
            }).catch((error) => {
                assert.equal(error.message, `A role with the name ${role.name} is already created. Role name must be unique`);
            });
        });
    });
    describe('GetRole', () => {
        beforeEach(async () => {
            await truncate();
        });
        it('1. should return a role object if role id is correct', async () => {
            const role = await roleFactory();
            const response = await RolesService.GetRole(role.id);
            assert.isObject(response);
        });
        it('2. should throw an error if the role id is incorrect', async () => {
            await RolesService.GetRole('35c420be-05d8-4beb-b4e5-c76c03c3c0d9').catch((error) => {
                assert.equal(error.message, 'Role 35c420be-05d8-4beb-b4e5-c76c03c3c0d9 does not exist.');
            });
        });
    });
});
