import { Application } from '@app/app';
import { DatabaseService } from '@app/services/database.service';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import supertest from 'supertest';
import { Container } from 'typedi';

const HTTP_STATUS_OK = StatusCodes.OK;
// const HTTP_STATUS_CREATED = StatusCodes.CREATED;

describe('DatabaseController', () => {
    let databaseService: SinonStubbedInstance<DatabaseService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        databaseService = createStubInstance(DatabaseService);
        const promise1 = new Promise<void>((resolve) => {
            resolve();
        });
        const promise2 = new Promise<string[]>((resolve) => {
            resolve([]);
        });
        databaseService.getBestScoreClassique.returns([]);
        databaseService.bestScoreLog2990.returns([]);
        databaseService.sendScoreChanges.returns(promise1);
        databaseService.sendNamesChanges.returns(promise1);
        databaseService.jvEasyNames.returns(promise2);
        databaseService.jvHardNames.returns(promise2);
        // how to mock the getter

        const app = Container.get(Application);

        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['databaseController'], 'databaseService', { value: databaseService });
        expressApp = app.app;
    });

    it('bestscoreclassique should return [] from database service on valid get request to root', async () => {
        return supertest(expressApp)
            .get('/api/database/bestscoreclassique')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                expect(response.body).to.deep.equal([]);
            });
    });
    it('bestscorelog2990 should return [] from database service on valid get request to root', async () => {
        return supertest(expressApp)
            .get('/api/database/bestscorelog2990')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                expect(response.body).to.deep.equal([]);
            });
    });
    it('sendscorechanges should from database service on valid get request to root', async () => {
        return supertest(expressApp).post('/api/database/sendscorechanges').expect(HTTP_STATUS_OK);
    });
    it('jveasynames should return [] from database service on valid get request to root', async () => {
        return supertest(expressApp)
            .get('/api/database/jveasynames')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                expect(response.body).to.deep.equal([]);
            });
    });
    it('jvhardnames should return [] from database service on valid get request to root', async () => {
        return supertest(expressApp)
            .get('/api/database/jvhardnames')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                expect(response.body).to.deep.equal([]);
            });
    });
    it('sendnameschanges should from database service on valid get request to root', async () => {
        return supertest(expressApp).post('/api/database/sendnameschanges').expect(HTTP_STATUS_OK);
    });
});
