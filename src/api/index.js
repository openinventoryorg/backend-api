const userRoutes = require('./routes/user');

const defineEndPoints = (app) => {
    app.use('/api/user', userRoutes);
};

module.exports = { defineEndPoints };
