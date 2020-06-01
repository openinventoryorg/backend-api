/* eslint-disable no-undef */
const { assert } = require('chai');
const chai = require('chai');

chai.use(require('chai-uuid'));

const truncate = require('../truncate');
const ItemsetsService = require('../../src/services/itemsets');
const { itemsetFactory, attributeFactory, fakeSchema } = require('../factories');

describe('ItemSetsService', () => {
    describe('CreateItemset', () => {
        beforeEach(async () => {
            await truncate();
        });
        it('1. Should return an object', async () => {
            const temp = {
                ...fakeSchema.fakeItemSet, attributes: fakeSchema.fakeAttributes,
            };
            ItemsetsService.CreateItemset(temp).then((itemsetInstance) => {
                assert.isObject(itemsetInstance);
            });
        });
        it('2. Should contain an id in UUID format', async () => {
            ItemsetsService.CreateItemset({
                ...fakeSchema.fakeItemSet, attributes: fakeSchema.fakeAttributes,
            }).then((itemsetInstance) => {
                assert.uuid(itemsetInstance.id);
            });
        });
        it('3. Should return the same title as passed into', async () => {
            ItemsetsService.CreateItemset({
                ...fakeSchema.fakeItemSet, attributes: fakeSchema.fakeAttributes,
            }).then((itemsetInstance) => {
                assert.equal(fakeSchema.fakeItemSet.title, itemsetInstance.title);
            });
        });
        it('4. Should return the same image as passed into', async () => {
            ItemsetsService.CreateItemset({
                ...fakeSchema.fakeItemSet, attributes: fakeSchema.fakeAttributes,
            }).then((itemsetInstance) => {
                assert.equal(fakeSchema.fakeItemSet.image, itemsetInstance.image);
            });
        });
        it('5. Should contain attribute list in format {itemSetId,key,defaultValue,editable}[]', (done) => {
            ItemsetsService.CreateItemset({
                ...fakeSchema.fakeItemSet, attributes: fakeSchema.fakeAttributes,
            }).then((itemsetInstance) => {
                itemsetInstance.attributes.forEach((attribute) => {
                    assert.hasAllKeys(attribute, ['key', 'defaultValue', 'editable']);
                });
                done();
            }).catch(done);
        });
        it('6. Should contain the same attributes', async () => {
            await ItemsetsService.CreateItemset({
                ...fakeSchema.fakeItemSet, attributes: fakeSchema.fakeAttributes,
            }).then((itemsetInstance) => {
                assert.sameDeepMembers(fakeSchema.fakeAttributes, itemsetInstance.attributes);
            });
        });
        it('7. Should throw an error if id is already taken', async () => {
            await ItemsetsService.CreateItemset({
                ...fakeSchema.fakeItemSet, attributes: fakeSchema.fakeAttributes,
            }).then(async () => {
                await ItemsetsService.CreateItemset({
                    ...fakeSchema.fakeItemSet, attributes: fakeSchema.fakeAttributes,
                });
            }).catch((error) => {
                assert.equal(error.message, `An itemset with the title ${fakeSchema.fakeItemSet.title} is already created. Itemset title must be unique`);
            });
        });
    });

    describe('GetItemset', () => {
        beforeEach(async () => {
            await truncate();
            itemset = await itemsetFactory();
            itemsetAttributes = await attributeFactory(itemset.id);
        });
        it('1. Should throw an error if itemset is not in the DB', async () => {
            await ItemsetsService.GetItemset('35c420be-05d8-4beb-b4e5-c76c03c3c0d9').catch((error) => {
                assert.equal(error.message, 'Itemset 35c420be-05d8-4beb-b4e5-c76c03c3c0d9 does not exist.');
            });
        });
        it('2. Should return the same id as passed into', async () => {
            await ItemsetsService.GetItemset(itemset.id).then((itemsetInstance) => {
                assert.equal(itemset.id, itemsetInstance.id);
            });
        });
        it('3. Should return the same title as the original', async () => {
            await ItemsetsService.GetItemset(itemset.id).then((itemsetInstance) => {
                assert.equal(itemset.title, itemsetInstance.title);
            });
        });
        it('4. Should return the same image as the original', async () => {
            await ItemsetsService.GetItemset(itemset.id).then((itemsetInstance) => {
                assert.equal(itemset.image, itemsetInstance.image);
            });
        });
        it('5. Should return the same attributes as the original', async () => {
            await ItemsetsService.GetItemset(itemset.id).then((itemsetInstance) => {
                const attributes = itemsetAttributes.map((attr) => ({
                    key: attr.key, defaultValue: attr.defaultValue, editable: attr.editable,
                }));
                const originalAttributes = itemsetInstance.attributes.map((attr) => ({
                    key: attr.key, defaultValue: attr.defaultValue, editable: attr.editable,
                }));
                assert.sameDeepMembers(attributes, originalAttributes);
            });
        });
    });
    describe('DeleteItemset', () => {
        beforeEach(async () => {
            await truncate();
            itemset = await itemsetFactory();
            itemsetAttributes = await attributeFactory(itemset.id);
        });
        it('1. Should throw an error if itemset is not in the DB', async () => {
            await ItemsetsService.DeleteItemset('35c420be-05d8-4beb-b4e5-c76c03c3c0d9').catch((error) => {
                assert.equal(error.message, 'Itemset 35c420be-05d8-4beb-b4e5-c76c03c3c0d9 does not exist.');
            });
        });
        it('2. Should be not in the DB after deletion', async () => {
            await ItemsetsService.DeleteItemset(itemset.id).then(async () => {
                await ItemsetsService.GetItemset(itemset.id);
            }).catch((error) => {
                assert.equal(error.message, `Itemset ${itemset.id} does not exist.`);
            });
        });
    });
    describe('UpdateItemset', () => {
        beforeEach(async () => {
            await truncate();
            itemset = await itemsetFactory();
            itemsetAttributes = await attributeFactory(itemset.id);
        });
        it('1. Should return the same id as passed into', async () => {
            await ItemsetsService.UpdateItemset({
                id: itemset.id, ...fakeSchema.fakeItemSet, attributes: fakeSchema.fakeAttributes,
            }).then((itemsetInstance) => {
                assert.equal(itemset.id, itemsetInstance.id);
            });
        });
        it('2. Should return the new title', async () => {
            await ItemsetsService.UpdateItemset({
                id: itemset.id, ...fakeSchema.fakeItemSet, attributes: fakeSchema.fakeAttributes,
            }).then((itemsetInstance) => {
                assert.equal(fakeSchema.fakeItemSet.title, itemsetInstance.title);
            });
        });
        it('3. Should return the new image', async () => {
            await ItemsetsService.UpdateItemset({
                id: itemset.id, ...fakeSchema.fakeItemSet, attributes: fakeSchema.fakeAttributes,
            }).then((itemsetInstance) => {
                assert.equal(fakeSchema.fakeItemSet.image, itemsetInstance.image);
            });
        });
        it('4. Should return the new attributes', async () => {
            await ItemsetsService.UpdateItemset({
                id: itemset.id, ...fakeSchema.fakeItemSet, attributes: fakeSchema.fakeAttributes,
            }).then((itemsetInstance) => {
                const attributes = fakeSchema.fakeAttributes.map((attr) => ({
                    key: attr.key, defaultValue: attr.defaultValue, editable: attr.editable,
                }));
                const originalAttributes = itemsetInstance.attributes.map((attr) => ({
                    key: attr.key, defaultValue: attr.defaultValue, editable: attr.editable,
                }));
                assert.sameDeepMembers(attributes, originalAttributes);
            });
        });
        it('5. Should throw an error if itemset is not in the DB', async () => {
            await ItemsetsService.UpdateItemset(
                { id: '35c420be-05d8-4beb-b4e5-c76c03c3c0d9', ...fakeSchema.fakeItemSet, attributes: fakeSchema.fakeAttributes },
            ).catch((error) => {
                assert.equal(error.message, 'Itemset 35c420be-05d8-4beb-b4e5-c76c03c3c0d9 does not exist.');
            });
        });
        it('6. Should throw an error if itemset is not in the DB', async () => {
            await ItemsetsService.UpdateItemset(
                {
                    id: itemset.id,
                    title: itemset.title,
                    attributes: fakeSchema.fakeAttributes,
                },
            ).catch((error) => {
                assert.equal(error.message, `Another itemset with the name ${itemset.title} is already created. Itemset name must be unique`);
            });
        });
    });
});
