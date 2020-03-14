/**
 * Creates a message to encapsulate the payload.
 * @param {string} type Type of the message to send
 * @param {Object} payload Payload data to send
 * @param {string} client Client type
 */
const encapsulateSocketMessage = (type, payload, client) => ({
    type,
    data: payload,
    timestamp: new Date(),
    client,
});


/**
 * This adds the on connection callback to socket io server.
 * @param {SocketIO.Server} io Socket IO server
 */
const onSocketConnection = (io) => (socket) => {
    // Define the room user belongs to
    const room = `room#${socket.user.id}`;
    const client = socket.clientType;

    // Put the user to that room
    socket.join(room);

    // Send a message saying that user of this type connected
    io.in(room).emit('server#message',
        encapsulateSocketMessage('connect', client, client));

    // If this user sends a message, repeat that to the room
    socket.on('client#message', (msg) => {
        io.in(room).emit('server#message',
            encapsulateSocketMessage('message', msg, client));
    });

    // When user disconnects, emit message
    socket.on('disconnect', () => {
        io.in(room).emit('server#message',
            encapsulateSocketMessage('disconnect', client, client));
        socket.leave(room);
    });
};

module.exports = onSocketConnection;
