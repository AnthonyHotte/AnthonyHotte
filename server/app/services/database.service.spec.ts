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
        expect(databaseService.db.listCollections.length).to.be.equal(0);
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
        expect(databaseService.db.listCollections.length).to.be.equal(0);
        expect(databaseService.db.databaseName).to.equal('database');
    });
    it('getBestScoreClassique get best score classique', async () => {
        // Reconnect to local server
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        databaseService.getBestScoreClassique().then((res) => {
            expect(res.length).to.be.equal(0);
        });
    });
    it('bestScoreLog2990 should get best score log2990', async () => {
        // Reconnect to local server
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        databaseService.bestScoreLog2990().then((res) => {
            expect(res.length).to.be.equal(0);
        });
    });
    it('sendScoreChanges should send score changes', async () => {
        // Reconnect to local server
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        const bestArr = [{ score: 2, name: ['adr'] }];
        await databaseService.sendScoreChanges(0, bestArr);
        expect(await databaseService.db.collection('bestScoreClassique').find().count()).to.be.equal(1);
    });
    it('jvEasyNames should send jvEasyNames changes', async () => {
        // Reconnect to local server
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        await databaseService.jvEasyNames();
        expect(await databaseService.db.collection('JVEasyName').find().count()).to.be.equal(3);
    });
    it('jvHardNames should send jvHardNames changes', async () => {
        // Reconnect to local server
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        await databaseService.jvHardNames();
        expect(await databaseService.db.collection('JVHardName').find().count()).to.be.equal(3);
    });
    it('sendNamesChanges should send names changes', async () => {
        // Reconnect to local server
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        const names = ['fggg', 'frtr', 'eretey'];
        await databaseService.sendNamesChanges(0, names);
        expect(await databaseService.db.collection('JVEasyName').find().count()).to.be.equal(3);
    });
});
