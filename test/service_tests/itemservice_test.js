/* eslint-disable no-undef */

const proxyquire = require('proxyquire');

const { assert } = require('chai');
const { mockDatabase } = require('../mockdatabase/mockdatabase');
const {
    ItemSetValue, LabValue, ItemValue,
} = require('../mockdatabase/schemavalues');

const ItemService = proxyquire('../../src/services/items', {
    '../helpers/get_database': {
        getDatabase: () => mockDatabase(),
    },
});

// const itemId = '00c44a93-429b-439d-8722-2e358f454a18';
// const labId = '6ba84a97-ebca-4d44-8e6a-8e55905cafb6';

describe('ItemService', () => {
    describe('GetItem', () => {
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
});
