const Administrator = 'ADMINISTRATOR';
const LabManager = 'LAB_MANAGER';
const Requester = 'REQUESTER';
const Registrar = 'REGISTRAR';
const InventoryManager = 'INVENTORY_MANAGER';


module.exports = {
    Administrator,
    LabManager,
    Requester,
    Registrar,
    InventoryManager,
    permissions: [Administrator, LabManager, Requester, Registrar, InventoryManager],
};
