/* eslint-disable no-undef */
// const proxyquire = require('proxyquire');

const { assert } = require('chai');
const chai = require('chai');

chai.use(require('chai-subset'));
chai.use(require('chai-uuid'));

const truncate = require('../truncate');
const ItemService = require('../../src/services/items');
const {
    itemsetFactory, labFactory, itemFactory, fakeSchema,
} = require('../factories');

// const Errors = require('../../src/helpers/errors');

describe('ItemService', () => {
    describe('GetItem', () => {
        let itemset;
        let lab;
        let item;
        beforeEach(async () => {
            await truncate();
            itemset = await itemsetFactory();
            lab = await labFactory();
            item = await itemFactory({ itemSetId: itemset.id, labId: lab.id });
        });

        it('1. GetItem should return an object', (done) => {
            ItemService.GetItem(item.id).then((itemInstance) => {
                assert.isObject(itemInstance, 'item is an object');
                done();
            }).catch(done);
        });
        it('2. GetItem should have the same id as in the request query', (done) => {
            ItemService.GetItem(item.id).then((itemInstance) => {
                assert.strictEqual(item.id, itemInstance.id);
                done();
            }).catch(done);
        });
        it('3. GetItem should have the correct details of its lab ', (done) => {
            ItemService.GetItem(item.id).then((itemInstance) => {
                assert.strictEqual(item.labId, itemInstance.Lab.id);
                done();
            }).catch(done);
        });
        it('4. GetItem should have the correct details of its itemset ', (done) => {
            ItemService.GetItem(item.id).then((itemInstance) => {
                assert.strictEqual(item.itemSetId, itemInstance.ItemSet.id);
                done();
            }).catch(done);
        });
        it('5. GetItem ItemAttributes should be an array', (done) => {
            ItemService.GetItem(item.id).then((itemInstance) => {
                assert.isArray(itemInstance.ItemAttributes);
                done();
            }).catch(done);
        });
        // it('1. GetItem should return an error if item id is not in the db', () => assert.throw(
        //     async () => { await ItemService.GetItem('00c44a93-429b-439d-8722-2e358f454a15'); },
        //     Errors.BadRequest, 'Item does not exist.',
        // ));
    });

    describe('CreateItem', () => {
        beforeEach(async () => {
            await truncate();
            itemset = await itemsetFactory();
            lab = await labFactory();
            // item = await itemFactory({ itemSetId: itemset.id, labId: lab.id });
        });

        it('1. should create an item successfully and return an object', (done) => {
            ItemService.CreateItem(
                {
                    ...fakeSchema.fakeItem,
                    itemSetId: itemset.id,
                    labId: lab.id,
                    attributes: fakeSchema.fakeItemAttributes,
                },
            ).then((item) => {
                assert.isObject(item, 'item is an object');
                done();
            }).catch(done);
        });

        it('2. should return an id in the format UUID', (done) => {
            ItemService.CreateItem({
                ...fakeSchema.fakeItem,
                itemSetId: itemset.id,
                labId: lab.id,
                attributes: fakeSchema.fakeItemAttributes,
            }).then((item) => {
                assert.uuid(item.id);
                done();
            }).catch(done);
        });
        it('3. should return an attribute list with the correct format {key, value}[]', (done) => {
            ItemService.CreateItem({
                ...fakeSchema.fakeItem,
                itemSetId: itemset.id,
                labId: lab.id,
                attributes: fakeSchema.fakeItemAttributes,
            }).then((item) => {
                item.attributes.forEach((attribute) => {
                    assert.containSubset(attribute, {
                        key: (expectedValue) => expectedValue,
                        value: (expectedValue) => expectedValue,
                    });
                });
                done();
            }).catch(done);
        });

        // it('should throw an error if an item with the given name exists', (done) => {
        //     ItemService.CreateItem().then((item) => {
        //         done();
        //     }).catch(done);
        // });

        // it('should throw an error if an itemset with the given itemsetid does not exist',
        // (done) => {
        //     ItemService.CreateItem().then((item) => {
        //         done();
        //     }).catch(done);
        // });

        // it('should throw an error if an lab with the given labid does not exist', (done) => {
        //     ItemService.CreateItem().then((item) => {
        //         done();
        //     }).catch(done);
        // });

        // it('should throw an error if a non editable itemset attribute is altered', (done) => {
        //     ItemService.CreateItem().then((item) => {
        //         done();
        //     }).catch(done);
        // });

        // it('should throw an error if attribute list has the correct format {key, value}[]',\
        //  (done) => {
        //     ItemService.CreateItem().then((item) => {
        //         done();
        //     }).catch(done);
        // });

        // it('Should throw an error if there is a DB error', (done) => {
        //     ItemService.CreateItem(ItemValue.serialNumber, ItemSetValue.id).then((item) => {
        //         done();
        //     }).catch(done);
        // });
    });
});
