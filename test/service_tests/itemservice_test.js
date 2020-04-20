/* eslint-disable no-undef */
const proxyquire = require('proxyquire');

const { assert } = require('chai');
// const Errors = require('../../src/helpers/errors');
const { mockDatabase } = require('../mockdatabase/mockdatabase');
const {
    ItemSetValue, LabValue, ItemValue, ItemAttributeCreateValueList,
} = require('../mockdatabase/schemavalues');

const ItemService = proxyquire('../../src/services/items', {
    '../helpers/get_database': {
        getDatabase: () => mockDatabase(),
    },
});


describe('ItemService', () => {
    describe('GetItem', () => {
        // it('GetItem should return an error if item id is not in the db', () => assert.throws(
        //     () => ItemService.GetItem('00c44a93-429b-439d-8722-2e358f454a17'), Errors.BadRequest,
        // ));
        it('GetItem should return an object', (done) => {
            ItemService.GetItem(ItemValue.id).then((item) => {
                assert.isObject(item, 'item is an object');
                done();
            }).catch(done);
        });
        it('GetItem should have the same id as in the request query', (done) => {
            ItemService.GetItem(ItemValue.id).then((item) => {
                assert.strictEqual(item.id, ItemValue.id);
                done();
            }).catch(done);
        });
        it('GetItem should have the correct details of its lab ', (done) => {
            ItemService.GetItem(ItemValue.id).then((item) => {
                assert.strictEqual(item.Lab.id, LabValue.id);
                done();
            }).catch(done);
        });
        it('GetItem should have the correct details of its itemset ', (done) => {
            ItemService.GetItem(ItemValue.id).then((item) => {
                assert.strictEqual(item.ItemSet.id, ItemSetValue.id);
                done();
            }).catch(done);
        });
        it('GetItem ItemAttributes should be an array', (done) => {
            ItemService.GetItem(ItemValue.id).then((item) => {
                assert.isArray(item.ItemAttributes);
                done();
            }).catch(done);
        });
    });

    describe('CreateItem', () => {
        // it('Should throw an error if there is a DB error', (done) => {
        //     ItemService.CreateItem(ItemValue.serialNumber, ItemSetValue.id, ).then((item) => {
        //         done();
        //     }).catch(done);
        // });

        it('should create an item successfully and return an object', (done) => {
            ItemService.CreateItem(
                ItemValue.serialNumber, ItemSetValue.id, Lab.id, ItemAttributeCreateValueList,
            ).then((item) => {
                assert.isObject(item, 'item is an object');
                done();
            }).catch(done);
        });

        // it('should throw an error if an item with the given name exists', (done) => {
        //     ItemService.CreateItem().then((item) => {
        //         done();
        //     }).catch(done);
        // });

        // it('should throw an error if an itemset with the given itemsetid does not exist', (done) => {
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

        // it('should throw an error if attribute list has the correct format {key, value}[]', (done) => {
        //     ItemService.CreateItem().then((item) => {
        //         done();
        //     }).catch(done);
        // });

        // it('should return an id in the format UUID', (done) => {
        //     ItemService.CreateItem().then((item) => {
        //         done();
        //     }).catch(done);
        // });

        // it('should return an attribute list with the correct format {key, value}[]', (done) => {
        //     ItemService.CreateItem().then((item) => {
        //         done();
        //     }).catch(done);
        // });
    });
});
