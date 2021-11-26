import * as chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
// import { assert } from 'console';
import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabaseService } from './database.service';
chai.use(chaiAsPromised); // this allows us to test for rejection

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;

    beforeEach(async () => {
        databaseService = new DatabaseService();

        // Start a local test server
        mongoServer = await MongoMemoryServer.create();
    });

    afterEach(async () => {
        // if (databaseService.client && databaseService.client.isConnected()) {
        // await databaseService.client.close();
        await databaseService.closeConnection();
        // }
    });

    // NB : We dont test the case when DATABASE_URL is used in order to not connect to the real database
    it('should connect to the database when start is called', async () => {
        // Reconnect to local server
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        expect(databaseService.database.listCollections.length).to.be.equal(0);
        expect(databaseService.db.databaseName).to.equal('database');
    });
    // NB : We dont test the case when DATABASE_URL is used in order to not connect to the real database
    it('should not populate when already populated', async () => {
        // Reconnect to local server
        let mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        await databaseService.closeConnection();
        mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        expect(databaseService.database.listCollections.length).to.be.equal(0);
        expect(databaseService.db.databaseName).to.equal('database');
    });
});
