/* eslint-disable no-undef */
const { assert } = require('chai');
const chai = require('chai');
chai.use(require('chai-uuid'));

const truncate = require('../truncate');
const LabsService = require('../../src/services/labs');

const {
    labFactory, roleFactory, userFactory, rolePermissionFactory, labAssignFactory,
} = require('../factories');

describe('ItemRequestService', () => {
    describe('CreateLab', () => {
        beforeEach(async () => {
            await truncate();
        });
        it('1. should throw an error if a lab with the title already exists', async () => {
            await LabsService.CreateLab({ title: 'Temp lab', subtitle: 'nice lab. cool lab', image: 'image url' }).then(
                async () => {
                    await LabsService.CreateLab({ title: 'Temp lab', subtitle: 'nice lab. cool lab', image: 'image url' });
                },
            ).catch((error) => {
                assert.equal(error.message, 'Lab with title Temp lab already exists.');
            });
        });
        it('2. should return an object if lab is created successfully', (done) => {
            LabsService.CreateLab({ title: 'Temp lab', subtitle: 'nice lab. cool lab', image: 'image url' }).then((lab) => {
                assert.isObject(lab);
                done();
            });
        });
    });

    describe('AssignUserstoLabs', () => {
        let lab;
        let role;
        let user;
        beforeEach(async () => {
            await truncate();
            lab = await labFactory();
            role = await roleFactory();
            user = await userFactory({ roleId: role.id });
        });
        it('1. should throw an error if there is no such user', async () => {
            await rolePermissionFactory({ roleId: role.id, permissionId: 'INVENTORY_MANAGER' });
            await LabsService.AssignUserstoLabs({ labId: lab.id, userId: '35c420be-05d8-4beb-b4e5-c76c03c3c0d9' }).catch(
                (error) => {
                    assert.equal(error.message, 'User 35c420be-05d8-4beb-b4e5-c76c03c3c0d9 does not exist.');
                },
            );
        });
        it('2. should throw an error if there is no such lab', async () => {
            await rolePermissionFactory({ roleId: role.id, permissionId: 'INVENTORY_MANAGER' });
            await LabsService.AssignUserstoLabs({ labId: '35c420be-05d8-4beb-b4e5-c76c03c3c0d9', userId: user.id }).catch(
                (error) => {
                    assert.equal(error.message, 'Lab 35c420be-05d8-4beb-b4e5-c76c03c3c0d9 does not exist.');
                },
            );
        });
        it('3. should throw an error the user does not have enough permissions', async () => {
            await rolePermissionFactory({ roleId: role.id });
            await LabsService.AssignUserstoLabs({ labId: lab.id, userId: user.id }).catch(
                (error) => {
                    assert.equal(error.message, `User ${user.id} has not enough permissions.`);
                },
            );
        });
        it('4. should return null if user is assigned successfully', async () => {
            await rolePermissionFactory({ roleId: role.id, permissionId: 'INVENTORY_MANAGER' });
            const response = await LabsService.AssignUserstoLabs(
                { labId: lab.id, userId: user.id },
            );
            assert.isUndefined(response);
        });
    });

    describe('UnassignUsersFromLabs', () => {
        let lab;
        let role;
        let user;
        beforeEach(async () => {
            await truncate();
            lab = await labFactory();
            role = await roleFactory();
            user = await userFactory({ roleId: role.id });
            await rolePermissionFactory({ roleId: role.id, permissionId: 'INVENTORY_MANAGER' });
        });
        it('1. should throw an error if the user is not assigned', async () => {
            await LabsService.UnassignUsersFromLabs({ labId: lab.id, userId: user.id }).catch(
                (error) => {
                    assert.equal(error.message, `User ${user.id} assigned to Lab ${lab.id} relation does not exist.`);
                },
            );
        });
        it('2. should return null if user is unassigned successfully', async () => {
            await labAssignFactory({ labId: lab.id, userId: user.id });
            console.log(lab.id, user.id);
            const response = await LabsService.UnassignUsersFromLabs({
                labId: lab.id, userId: user.id,
            });
            assert.isUndefined(response);
        });
    });
});
