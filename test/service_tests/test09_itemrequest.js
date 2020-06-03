/* eslint-disable no-undef */
const { assert } = require('chai');
const chai = require('chai');
chai.use(require('chai-uuid'));

const truncate = require('../truncate');
const ItemsRequestService = require('../../src/services/itemsRequest');
const { generateSecureToken } = require('../../src/helpers/secure_token');

const {
    itemsetFactory, labFactory, itemFactory, roleFactory,
    supervisorFactory, userFactory, requestFactory, requestitemFactory,
} = require('../factories');

describe('ItemRequestService', () => {
    describe('CreateItemsRequest', () => {
        let role;
        let user;
        let supervisor;
        let itemset;
        let lab;
        let item1;
        let item2;
        beforeEach(async () => {
            await truncate();
            itemset = await itemsetFactory();
            lab = await labFactory();
            item1 = await itemFactory({ itemSetId: itemset.id, labId: lab.id });
            item2 = await itemFactory({ itemSetId: itemset.id, labId: lab.id });
            role = await roleFactory();
            user = await userFactory({ roleId: role.id });
            supervisor = await supervisorFactory();
        });

        it('1. should create an item request successfully and return an object', (done) => {
            ItemsRequestService.CreateItemsRequest(
                {
                    itemIds: [item1.id, item2.id],
                    labId: lab.id,
                    userId: user.id,
                    supervisorId: supervisor.id,
                    reason: 'some reason',
                },
            ).then((itemRequest) => {
                assert.isObject(itemRequest, 'item request is an object');
                done();
            }).catch(done);
        });

        it('2. should throw an error if the lab id is incorrect', async () => {
            await ItemsRequestService.CreateItemsRequest(
                {
                    itemIds: [item1.id, item2.id],
                    labId: '35c420be-05d8-4beb-b4e5-c76c03c3c0d9',
                    userId: user.id,
                    supervisorId: supervisor.id,
                    reason: 'some reason',
                },
            ).catch((error) => {
                assert.equal(error.message, 'Lab does not exist.');
            });
        });
        it('3. should throw an error if the user id is incorrect', async () => {
            await ItemsRequestService.CreateItemsRequest(
                {
                    itemIds: [item1.id, item2.id],
                    labId: lab.id,
                    userId: '35c420be-05d8-4beb-b4e5-c76c03c3c0d9',
                    supervisorId: supervisor.id,
                    reason: 'some reason',
                },
            ).catch((error) => {
                assert.equal(error.message, 'User does not exist.');
            });
        });
        it('4. should throw an error if the supervisor id is incorrect', async () => {
            await ItemsRequestService.CreateItemsRequest(
                {
                    itemIds: [item1.id, item2.id],
                    labId: lab.id,
                    userId: user.id,
                    supervisorId: '35c420be-05d8-4beb-b4e5-c76c03c3c0d9',
                    reason: 'some reason',
                },
            ).catch((error) => {
                assert.equal(error.message, 'Supervisor does not exist.');
            });
        });
        it('5. should throw an error if an item id is incorrect', async () => {
            await ItemsRequestService.CreateItemsRequest(
                {
                    itemIds: [item1.id, '35c420be-05d8-4beb-b4e5-c76c03c3c0d9'],
                    labId: lab.id,
                    userId: user.id,
                    supervisorId: supervisor.id,
                    reason: 'some reason',
                },
            ).catch((error) => {
                assert.equal(error.message, 'A requested item does not exist');
            });
        });
        it('6. should throw an error if a previous item request exists', async () => {
            await ItemsRequestService.CreateItemsRequest(
                {
                    itemIds: [item1.id, item2.id],
                    labId: lab.id,
                    userId: user.id,
                    supervisorId: supervisor.id,
                    reason: 'some reason',
                },
            ).then(async () => {
                await ItemsRequestService.CreateItemsRequest(
                    {
                        itemIds: [item1.id, item2.id],
                        labId: lab.id,
                        userId: user.id,
                        supervisorId: supervisor.id,
                        reason: 'some reason',
                    },
                );
            }).catch((error) => {
                assert.equal(error.message, 'A pending request for the same lab already exists.');
            });
        });
    });

    describe('GetItemsRequestByToken', () => {
        let role;
        let user;
        let supervisor;
        let itemset;
        let lab;
        let item1;
        let item2;
        let request;
        // eslint-disable-next-line no-unused-vars
        let itemRequest1;
        // eslint-disable-next-line no-unused-vars
        let itemRequest2;
        beforeEach(async () => {
            await truncate();
            itemset = await itemsetFactory();
            lab = await labFactory();
            item1 = await itemFactory({ itemSetId: itemset.id, labId: lab.id });
            item2 = await itemFactory({ itemSetId: itemset.id, labId: lab.id });
            role = await roleFactory();
            user = await userFactory({ roleId: role.id });
            supervisor = await supervisorFactory();
            request = await requestFactory({
                labId: lab.id, userId: user.id, supervisorId: supervisor.id,
            });
            itemRequest1 = await requestitemFactory({ itemId: item1.id, requestId: request.id });
            itemRequest2 = await requestitemFactory({ itemId: item2.id, requestId: request.id });
        });
        it('1. should return an request when a valid token is provided', (done) => {
            ItemsRequestService.GetItemsRequestByToken({ token: request.supervisorToken }).then(
                (itemRequest) => {
                    assert.isObject(itemRequest, 'item request is an object');
                    done();
                },
            ).catch(done);
        });
        it('2. should throw error an request when a valid token is provided', async () => {
            await ItemsRequestService.GetItemsRequestByToken(
                { token: generateSecureToken(96) },
            ).catch((error) => { assert.equal(error.message, 'Invalid token!'); });
        });
    });

    describe('AcceptOrDeclineRequest', () => {
        let role;
        let user;
        let supervisor;
        let itemset;
        let lab;
        let item1;
        let item2;
        let request;
        let request2;
        // eslint-disable-next-line no-unused-vars
        let itemRequest1;
        // eslint-disable-next-line no-unused-vars
        let itemRequest2;
        beforeEach(async () => {
            await truncate();
            itemset = await itemsetFactory();
            lab = await labFactory();
            item1 = await itemFactory({ itemSetId: itemset.id, labId: lab.id });
            item2 = await itemFactory({ itemSetId: itemset.id, labId: lab.id });
            role = await roleFactory();
            user = await userFactory({ roleId: role.id });
            supervisor = await supervisorFactory();
            request = await requestFactory({
                labId: lab.id, userId: user.id, supervisorId: supervisor.id,
            });
            request2 = await requestFactory({
                labId: lab.id, userId: user.id, supervisorId: supervisor.id, status: 'ACCEPTED',
            });
            itemRequest1 = await requestitemFactory({ itemId: item1.id, requestId: request.id });
            itemRequest2 = await requestitemFactory({ itemId: item2.id, requestId: request.id });
        });
        it('1. should return undefined when a valid token is accepted', (done) => {
            ItemsRequestService.AcceptOrDeclineRequest({
                token: request.supervisorToken,
                value: true,
                declineReason: null,
            }).then(
                (response) => {
                    assert.isUndefined(response);
                    done();
                },
            ).catch(done);
        });
        it('2. should return undefined when a valid token is rejected', (done) => {
            ItemsRequestService.AcceptOrDeclineRequest({
                token: request.supervisorToken,
                value: false,
                declineReason: 'some reason',
            }).then(
                (response) => {
                    assert.isUndefined(response);
                    done();
                },
            ).catch(done);
        });
        it('3. should throw error when an invalid token is provided', async () => {
            await ItemsRequestService.AcceptOrDeclineRequest({
                token: generateSecureToken(96),
                value: false,
                declineReason: 'some reason',
            }).catch((error) => { assert.equal(error.message, 'Invalid token!'); });
        });
        it('4. should throw error when an expired token is provided', async () => {
            await ItemsRequestService.AcceptOrDeclineRequest({
                token: request2.supervisorToken,
                value: true,
                declineReason: null,
            }).catch((error) => { assert.equal(error.message, 'Expired request!'); });
        });
    });

    describe('ListItemsRequestsByStudent', () => {
        let role;
        let user;
        let supervisor;
        let itemset;
        let lab;
        let item1;
        let item2;
        let request;
        // eslint-disable-next-line no-unused-vars
        let itemRequest1;
        // eslint-disable-next-line no-unused-vars
        let itemRequest2;
        beforeEach(async () => {
            await truncate();
            itemset = await itemsetFactory();
            lab = await labFactory();
            item1 = await itemFactory({ itemSetId: itemset.id, labId: lab.id });
            item2 = await itemFactory({ itemSetId: itemset.id, labId: lab.id });
            role = await roleFactory();
            user = await userFactory({ roleId: role.id });
            supervisor = await supervisorFactory();
            request = await requestFactory({
                labId: lab.id, userId: user.id, supervisorId: supervisor.id,
            });
            request2 = await requestFactory({
                labId: lab.id, userId: user.id, supervisorId: supervisor.id, status: 'ACCEPTED',
            });
            itemRequest1 = await requestitemFactory({ itemId: item1.id, requestId: request.id });
            itemRequest2 = await requestitemFactory({ itemId: item2.id, requestId: request.id });
        });
        it('1. should return requests of a student', (done) => {
            ItemsRequestService.ListItemsRequestsByStudent({ id: user.id }).then(
                (response) => {
                    assert.isObject(response);
                    done();
                },
            ).catch(done);
        });
    });

    describe('ListItemsRequestsByLab', () => {
        let role;
        let user;
        let supervisor;
        let itemset;
        let lab;
        let item1;
        let item2;
        let request;
        // eslint-disable-next-line no-unused-vars
        let itemRequest1;
        // eslint-disable-next-line no-unused-vars
        let itemRequest2;
        beforeEach(async () => {
            await truncate();
            itemset = await itemsetFactory();
            lab = await labFactory();
            item1 = await itemFactory({ itemSetId: itemset.id, labId: lab.id });
            item2 = await itemFactory({ itemSetId: itemset.id, labId: lab.id });
            role = await roleFactory();
            user = await userFactory({ roleId: role.id });
            supervisor = await supervisorFactory();
            request = await requestFactory({
                labId: lab.id, userId: user.id, supervisorId: supervisor.id,
            });
            itemRequest1 = await requestitemFactory({ itemId: item1.id, requestId: request.id });
            itemRequest2 = await requestitemFactory({ itemId: item2.id, requestId: request.id });
        });
        it('1. should throw an error if insufficient permissions', async () => {
            await ItemsRequestService.ListItemsRequestsByLab({
                userId: user.id, userPermissions: ['INVENTORY_MANAGER'], labId: lab.id,
            }).catch((error) => { assert.equal(error.message, 'Insufficient permissions.'); });
        });
        it('2. should return an array of objects if success', (done) => {
            ItemsRequestService.ListItemsRequestsByLab({
                userId: user.id, userPermissions: ['LAB_MANAGER'], labId: lab.id,
            }).then((result) => {
                assert.isArray(result);
                result.forEach((each) => {
                    assert.isObject(each);
                });
                done();
            }).catch(done);
        });
    });

    describe('LendItem', () => {
        let role;
        let user;
        let supervisor;
        let itemset;
        let lab;
        let item1;
        let item2;
        let request;
        // eslint-disable-next-line no-unused-vars
        let itemRequest1;
        // eslint-disable-next-line no-unused-vars
        let itemRequest2;
        beforeEach(async () => {
            await truncate();
            itemset = await itemsetFactory();
            lab = await labFactory();
            item1 = await itemFactory({ itemSetId: itemset.id, labId: lab.id });
            item2 = await itemFactory({ itemSetId: itemset.id, labId: lab.id });
            role = await roleFactory();
            user = await userFactory({ roleId: role.id });
            supervisor = await supervisorFactory();
            request = await requestFactory({
                labId: lab.id, userId: user.id, supervisorId: supervisor.id, status: 'ACCEPTED',
            });
            itemRequest1 = await requestitemFactory({ itemId: item1.id, requestId: request.id, status: 'ACCEPTED' });
            itemRequest2 = await requestitemFactory({ itemId: item2.id, requestId: request.id, status: 'ACCEPTED' });
        });
        it('1. should throw an error if insufficient permissions', async () => {
            await ItemsRequestService.LendItem({
                itemId: item1.id, requestId: request.id, userId: user.id, userPermissions: ['INVENTORY_MANAGER'],
            }).catch((error) => { assert.equal(error.message, 'Insufficient permissions.'); });
        });
        it('2. should throw an error if requested item does not exist', async () => {
            await ItemsRequestService.LendItem({
                itemId: '35c420be-05d8-4beb-b4e5-c76c03c3c0d9', requestId: request.id, userId: user.id, userPermissions: ['LAB_MANAGER'],
            }).catch((error) => { assert.equal(error.message, 'Item Request does not exist'); });
        });
        it('3. should return an array of objects if success', (done) => {
            ItemsRequestService.LendItem({
                itemId: item1.id, requestId: request.id, userId: user.id, userPermissions: ['LAB_MANAGER'],
            }).then((result) => {
                assert.isObject(result);
                done();
            }).catch(done);
        });
    });

    describe('ReturnItem', () => {
        let role;
        let user;
        let supervisor;
        let itemset;
        let lab;
        let item1;
        let item2;
        let request;
        // eslint-disable-next-line no-unused-vars
        let itemRequest1;
        // eslint-disable-next-line no-unused-vars
        let itemRequest2;
        beforeEach(async () => {
            await truncate();
            itemset = await itemsetFactory();
            lab = await labFactory();
            item1 = await itemFactory({ itemSetId: itemset.id, labId: lab.id });
            item2 = await itemFactory({ itemSetId: itemset.id, labId: lab.id });
            role = await roleFactory();
            user = await userFactory({ roleId: role.id });
            supervisor = await supervisorFactory();
            request = await requestFactory({
                labId: lab.id, userId: user.id, supervisorId: supervisor.id, status: 'ACCEPTED',
            });
            itemRequest1 = await requestitemFactory({ itemId: item1.id, requestId: request.id, status: 'BORROWED' });
            itemRequest2 = await requestitemFactory({ itemId: item2.id, requestId: request.id, status: 'ACCEPTED' });
        });
        it('1. should throw an error if insufficient permissions', async () => {
            await ItemsRequestService.ReturnItem({
                itemId: item1.id, requestId: request.id, userId: user.id, userPermissions: ['INVENTORY_MANAGER'],
            }).catch((error) => { assert.equal(error.message, 'Insufficient permissions.'); });
        });
        it('2. should throw an error if requested item does not exist', async () => {
            await ItemsRequestService.ReturnItem({
                itemId: '35c420be-05d8-4beb-b4e5-c76c03c3c0d9', requestId: request.id, userId: user.id, userPermissions: ['LAB_MANAGER'],
            }).catch((error) => { assert.equal(error.message, 'Item Request does not exist'); });
        });
        it('3. should return an array of objects if success', (done) => {
            ItemsRequestService.ReturnItem({
                itemId: item1.id, requestId: request.id, userId: user.id, userPermissions: ['LAB_MANAGER'],
            }).then((result) => {
                assert.isObject(result);
                done();
            }).catch(done);
        });
    });
});
