// with { "type": "module" } in your package.json
// import { createServer } from 'http';
// import { io as Client } from 'socket.io-client';
// import { Server, Socket } from 'socket.io';
// import { assert } from 'chai';

// // with { "type": "commonjs" } in your package.json
// // const { createServer } = require("http");
// // const { Server } = require("socket.io");
// // const Client = require("socket.io-client");
// // const assert = require("chai").assert;

// describe('my awesome project', () => {
//     let io: Server;
//     let serverSocket: Socket;
//     let clientSocket: any;

//     before((done) => {
//         const httpServer = createServer();
//         io = new Server(httpServer);
//         httpServer.listen(() => {
//             const port = httpServer.address().port;
//             const clientSocket = Client('http://localhost:3000');
//             io.on('connection', (socket) => {
//                 serverSocket = socket;
//             });
//             clientSocket.on('connect', done);
//         });
//     });

//     after(() => {
//         io.close();
//         clientSocket.close();
//     });

//     it('should work', (done) => {
//         clientSocket.on('hello', (arg: unknown) => {
//             assert.equal(arg as string, 'world');
//             done();
//         });
//         serverSocket.emit('hello', 'world');
//     });

//     it('should work (with ack)', (done) => {
//         serverSocket.on('hi', (cb) => {
//             cb('hola');
//         });
//         clientSocket.emit('hi', (arg: unknown) => {
//             assert.equal(arg as string, 'hola');
//             done();
//         });
//     });
// });
