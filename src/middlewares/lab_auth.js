// const { Administrator } = require('../models/schema/permissions');
// // const Errors = require('../helpers/errors');
// // const { getDatabase } = require('../helpers/get_database');

// /**
//  * Function that will create a
//  * middleware(that intercepts the request of a user and
//  * authenticate the user) according to list of permissions provided.
//  *
//  * This uses decoded token to verify the user.
//  * This checks if the user have any common permissions
//  * with the list provided as allowed permissions.
//  *
//  * Unauthenticated users will get a `401` error.
//  * @category Middlewares
//  * @param  {string[]} allowedPermissions List of permissions that is allowed to
//  * continue in this middleware.
//  */
// const labAuthMiddleware = async (req, res, next) => {
//     // const { id, permissions } = req.user;
//     // const database = await getDatabase();

//     // Administrator can do any task - always authenticated
//     if (req.user.permissions.includes(Administrator)) {
//         next();
//         return;
//     }

//     // const labAssigns = database.LabAssign.findOne({
//     //     where: { userId: id },
//     // });

//     next();
// };

// module.exports = { labAuthMiddleware };
