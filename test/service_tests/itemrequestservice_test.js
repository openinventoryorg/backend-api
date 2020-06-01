/* eslint-disable no-undef */
const { assert } = require('chai');
const chai = require('chai');
chai.use(require('chai-uuid'));

const truncate = require('../truncate');
const ItemsRequestService = require('../../src/services/itemsRequest');
const {
    itemsetFactory, labFactory, itemFactory, roleFactory,
    supervisorFactory, userFactory,
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
});
