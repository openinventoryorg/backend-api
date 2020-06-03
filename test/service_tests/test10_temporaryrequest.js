/* eslint-disable no-undef */
const { assert } = require('chai');
const chai = require('chai');
chai.use(require('chai-uuid'));

const truncate = require('../truncate');
const TemporaryRequestsService = require('../../src/services/temporaryrequests');

const {
    labFactory, roleFactory, userFactory, itemsetFactory, itemFactory, temporaryRequestFactory,
} = require('../factories');

describe('TemporaryRequestsService', () => {
    describe('CreateTemporaryRequest', () => {
        let itemset;
        let lab;
        let item;
        let role;
        let user;
        beforeEach(async () => {
            await truncate();
            itemset = await itemsetFactory();
            lab = await labFactory();
            item = await itemFactory({ itemSetId: itemset.id, labId: lab.id });
            role = await roleFactory();
            user = await userFactory({ roleId: role.id });
        });
        it('1. should return an object if temp request is created successfully', async () => {
            const request = await TemporaryRequestsService.CreateTemporaryRequest({
                serialNumber: item.serialNumber,
                studentId: 'studentid',
                userId: user.id,
                userPermissions: ['LAB_MANAGER', 'ADMINISTRATOR'],
            });
            assert.isObject(request);
        });
        it('2. should throw an error if the requested item does not exist', async () => {
            await TemporaryRequestsService.CreateTemporaryRequest({
                serialNumber: 'falseserialNumber',
                studentId: 'studentid',
                userId: user.id,
                userPermissions: ['LAB_MANAGER', 'ADMINISTRATOR'],
            }).catch((error) => {
                assert.equal(error.message, 'Requested Item does not exist');
            });
        });
        it('3. should throw an error if the user does not have enough permissions', async () => {
            await TemporaryRequestsService.CreateTemporaryRequest({
                serialNumber: item.serialNumber,
                studentId: 'studentid',
                userId: user.id,
                userPermissions: ['REQUESTER', 'ADMINISTRATOR'],
            }).catch((error) => {
                assert.equal(error.message, 'Insufficient permissions');
            });
        });
        it('4. should throw an error if the user has not returned items', async () => {
            await TemporaryRequestsService.CreateTemporaryRequest({
                serialNumber: item.serialNumber,
                studentId: 'studentid',
                userId: user.id,
                userPermissions: ['LAB_MANAGER', 'ADMINISTRATOR'],
            });
            const item2 = await itemFactory({ itemSetId: itemset.id, labId: lab.id });
            await TemporaryRequestsService.CreateTemporaryRequest({
                serialNumber: item2.serialNumber,
                studentId: 'studentid',
                userId: user.id,
                userPermissions: ['LAB_MANAGER', 'ADMINISTRATOR'],
            }).catch((error) => {
                assert.equal(error.message, 'Requester has items to be returned to the lab.');
            });
        });
        it('5. should throw an error if the requested item is not available at the moment', async () => {
            await TemporaryRequestsService.CreateTemporaryRequest({
                serialNumber: item.serialNumber,
                studentId: 'studentid',
                userId: user.id,
                userPermissions: ['LAB_MANAGER', 'ADMINISTRATOR'],
            });
            await TemporaryRequestsService.CreateTemporaryRequest({
                serialNumber: item.serialNumber,
                studentId: 'studentiddifferent',
                userId: user.id,
                userPermissions: ['LAB_MANAGER', 'ADMINISTRATOR'],
            }).catch((error) => {
                assert.equal(error.message, 'Item is not available in the lab.');
            });
        });
    });

    describe('UpdateTemporaryRequest', () => {
        let itemset;
        let lab;
        let item;
        let role;
        let user;
        beforeEach(async () => {
            await truncate();
            itemset = await itemsetFactory();
            lab = await labFactory();
            item = await itemFactory({ itemSetId: itemset.id, labId: lab.id });
            role = await roleFactory();
            user = await userFactory({ roleId: role.id });
            await temporaryRequestFactory({
                itemId: item.id,
                studentId: 'studentid',
                userId: user.id,
                userPermissions: ['LAB_MANAGER', 'ADMINISTRATOR'],
            });
        });
        it('1. should return an object if temp request is created successfully', async () => {
            const request = await TemporaryRequestsService.UpdateTemporaryRequest({
                serialNumber: item.serialNumber,
                studentId: 'studentid',
                userId: user.id,
                userPermissions: ['LAB_MANAGER', 'ADMINISTRATOR'],
            });
            assert.isObject(request);
        });
        it('2. should throw an error if the item does not exist', async () => {
            await TemporaryRequestsService.UpdateTemporaryRequest({
                serialNumber: 'serialNumber',
                studentId: 'studentid',
                userId: user.id,
                userPermissions: ['LAB_MANAGER', 'ADMINISTRATOR'],
            }).catch((error) => {
                assert.equal(error.message, 'Requested Item does not exist');
            });
        });
        it('3. should throw an error if the item request does not exist', async () => {
            item = await itemFactory({ itemSetId: itemset.id, labId: lab.id });
            await TemporaryRequestsService.UpdateTemporaryRequest({
                serialNumber: item.serialNumber,
                studentId: 'studentid',
                userId: user.id,
                userPermissions: ['LAB_MANAGER', 'ADMINISTRATOR'],
            }).catch((error) => {
                assert.equal(error.message, 'Temporary Item request does not exist');
            });
        });
        it('4. should throw an error if the user does not have enough permissions', async () => {
            await TemporaryRequestsService.UpdateTemporaryRequest({
                serialNumber: item.serialNumber,
                studentId: 'studentid',
                userId: user.id,
                userPermissions: ['ADMINISTRATOR'],
            }).catch((error) => {
                assert.equal(error.message, 'Insufficient permissions');
            });
        });
    });
});
