const itemsetFactory = require('./itemset');
const labFactory = require('./lab');
const itemFactory = require('./item');
const attributeFactory = require('./attribute');
const roleFactory = require('./role');
const supervisorFactory = require('./supervisor');
const userFactory = require('./user');
const requestFactory = require('./request');
const requestitemFactory = require('./requestitem');
const rolePermissionFactory = require('./rolepermission');
const labAssignFactory = require('./labassign');
const temporaryRequestFactory = require('./temporaryrequest');
const registrationTokenFactory = require('./registrationtoken');

const fakeSchema = require('./fake_schema');

module.exports = {
    itemsetFactory,
    labFactory,
    itemFactory,
    attributeFactory,
    roleFactory,
    supervisorFactory,
    userFactory,
    fakeSchema,
    requestFactory,
    requestitemFactory,
    rolePermissionFactory,
    labAssignFactory,
    temporaryRequestFactory,
    registrationTokenFactory,
};
