/* eslint-disable no-undef */
const { assert } = require('chai');
const chai = require('chai');
chai.use(require('chai-uuid'));

const truncate = require('../truncate');
const ItemService = require('../../src/services/items');
const {
    itemsetFactory, labFactory, itemFactory, attributeFactory, fakeSchema,
} = require('../factories');

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
        it('6. GetItem should return an error if item id is not in the db', async () => {
            await ItemService.GetItem('00c44a93-429b-439d-8722-2e358f454a15').catch((error) => {
                assert.equal(error.message, 'Item does not exist.');
            });
        });
    });

    describe('CreateItem', () => {
        beforeEach(async () => {
            await truncate();
            itemset = await itemsetFactory();
            lab = await labFactory();
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
                    assert.hasAllKeys(attribute, ['key', 'value']);
                });
                done();
            }).catch(done);
        });

        it('4. should throw an error if an item with the given serialNumber exists', async () => {
            await ItemService.CreateItem({
                ...fakeSchema.fakeItem,
                itemSetId: itemset.id,
                labId: lab.id,
                attributes: fakeSchema.fakeItemAttributes,
            }).then(async (item) => {
                await ItemService.CreateItem({
                    ...fakeSchema.fakeItem,
                    serialNumber: item.serialNumber,
                    itemSetId: itemset.id,
                    labId: lab.id,
                    attributes: fakeSchema.fakeItemAttributes,
                });
            }).catch((error) => {
                assert.equal(error.message, `An item with the Serial Number ${fakeSchema.fakeItem.serialNumber} is already created. Serial Number must be unique.`);
            });
        });

        it('5. should throw an error if an itemset with the given itemsetid does not exist', async () => {
            await ItemService.CreateItem({
                ...fakeSchema.fakeItem,
                itemSetId: '35c420be-05d8-4beb-b4e5-c76c03c3c0d9',
                labId: lab.id,
                attributes: fakeSchema.fakeItemAttributes,
            }).catch((error) => {
                assert.equal(error.message, 'Item set does not exist.');
            });
        });
        it('6. should throw an error if an lab with the given labid does not exist', async () => {
            await ItemService.CreateItem({
                ...fakeSchema.fakeItem,
                itemSetId: itemset.id,
                labId: '35c420be-05d8-4beb-b4e5-c76c03c3c0d9',
                attributes: fakeSchema.fakeItemAttributes,
            }).catch((error) => {
                assert.equal(error.message, 'Lab does not exist.');
            });
        });

        it('7. should throw an error if a non editable itemset attribute is altered', async () => {
            await attributeFactory(itemset.id);
            await ItemService.CreateItem({
                ...fakeSchema.fakeItem,
                itemSetId: itemset.id,
                labId: lab.id,
                attributes: [{
                    key: 'temperature',
                    value: '80C',
                }],
            }).catch((error) => {
                assert.equal(error.message, 'Cannot modify a locked attribute: temperature');
            });
        });
    });

    describe('Delete Item', () => {
        beforeEach(async () => {
            await truncate();
            itemset = await itemsetFactory();
            lab = await labFactory();
            item = await itemFactory({
                itemSetId: itemset.id, labId: lab.id,
            });
        });
        it('1. should not return anything if the item is successfully deleted!', async () => {
            assert.isUndefined(await ItemService.DeleteItem(item.id));
        });
        it('2. should throw an error if the item is not in the DB', async () => {
            await ItemService.DeleteItem(itemset.id).catch((error) => {
                assert.equal(error.message, 'Item does not exist.');
            });
        });
    });
    describe('Update Item', () => {
        beforeEach(async () => {
            await truncate();
            itemset = await itemsetFactory();
            itemsetAttributes = await attributeFactory(itemset.id);
            lab = await labFactory();
            item = await itemFactory({
                itemSetId: itemset.id, labId: lab.id,
            });
        });
        it('1. should not throw an error if attrubutes is empty', async () => {
            assert.isObject(await ItemService.UpdateItem({ id: item.id, attributes: [] }));
        });
        it('2. should have the same ID as the passed parameter', (done) => {
            ItemService.UpdateItem({ id: item.id, attributes: fakeSchema.fakeItemAttributes })
                .then((itemInstance) => {
                    assert.strictEqual(itemInstance.id, item.id);
                    done();
                }).catch(done);
        });
        it('3. should not change the serial number', (done) => {
            ItemService.UpdateItem({ id: item.id, attributes: fakeSchema.fakeItemAttributes })
                .then((itemInstance) => {
                    assert.strictEqual(itemInstance.serialNumber, item.serialNumber);
                    done();
                }).catch(done);
        });
        it('4. should return an attribute list with the correct format {key, value}[]', (done) => {
            ItemService.UpdateItem({ id: item.id, attributes: fakeSchema.fakeItemAttributes }).then(
                (itemInstance) => {
                    itemInstance.attributes.forEach((attribute) => {
                        assert.hasAllKeys(attribute, ['itemId', 'key', 'value']);
                    });
                    done();
                },
            ).catch(done);
        });
        it('5. Should include the itemset attributes in returned attributes list', (done) => {
            ItemService.UpdateItem({ id: item.id, attributes: fakeSchema.fakeItemAttributes }).then(
                (itemInstance) => {
                    const inherited = itemsetAttributes.map(
                        (attr) => ({
                            itemId: itemInstance.id, key: attr.key, value: attr.defaultValue,
                        }),
                    );
                    assert.includeDeepMembers(itemInstance.attributes, inherited);
                    done();
                },
            ).catch(done);
        });
        it('6. Should let an editable attribute to be edited', (done) => {
            ItemService.UpdateItem({ id: item.id, attributes: [{ key: 'price', value: '200' }] }).then(
                (itemInstance) => {
                    assert.deepInclude(itemInstance.attributes, { itemId: item.id, key: 'price', value: '200' });
                    assert.notDeepInclude(itemInstance.attributes, { itemId: item.id, key: 'price', value: '500' });
                    done();
                },
            ).catch(done);
        });
        it('7. should throw an error if a non editable itemset attribute is altered', async () => {
            await ItemService.UpdateItem({
                id: item.id,
                attributes: [{
                    key: 'temperature',
                    value: '80C',
                }],
            }).catch((error) => {
                assert.equal(error.message, 'Cannot modify a locked attribute: temperature');
            });
        });
        it('8. should throw an error if attrubutes is null', async () => {
            await ItemService.UpdateItem({ id: item.id, attributes: null }).catch(
                (error) => {
                    assert.equal(error.name, 'TypeError');
                },
            );
        });
        it('9. should throw an error if the item is not in the DB', async () => {
            await ItemService.UpdateItem({
                id: itemset.id, attributes: fakeSchema.fakeItemAttributes,
            }).catch((error) => {
                assert.equal(error.message, `Item ${itemset.id} does not exist.`);
            });
        });
    });

    describe('Transfer Items', () => {
        beforeEach(async () => {
            await truncate();
            itemset = await itemsetFactory();
            itemsetAttributes = await attributeFactory(itemset.id);
            lab1 = await labFactory();
            lab2 = await labFactory();
            item = await itemFactory({
                itemSetId: itemset.id, labId: lab1.id,
            });
        });
        it('1. should return undefined when success', (done) => {
            ItemService.TransferItem({ id: item.id, labId: lab2.id }).then(
                (result) => {
                    assert.isUndefined(result);
                    done();
                },
            ).catch(done);
        });
        it('2. should update labId to new labId', (done) => {
            ItemService.TransferItem({ id: item.id, labId: lab2.id }).then(
                () => ItemService.GetItem(item.id),
            ).then(
                (updatedItem) => {
                    assert.equal(updatedItem.Lab.id, lab2.id);
                    done();
                },
            ).catch(done);
        });
        it('3. should throw an error if the item is not in the DB', async () => {
            await ItemService.TransferItem({ id: itemset.id, labId: lab2.id }).catch((error) => {
                assert.equal(error.message, `Item ${itemset.id} does not exist.`);
            });
        });
        it('4. should throw an error if the lab is not in the DB', async () => {
            await ItemService.TransferItem({ id: item.id, labId: itemset.id }).catch((error) => {
                assert.equal(error.message, `Lab ${itemset.id} does not exist.`);
            });
        });
    });
});
