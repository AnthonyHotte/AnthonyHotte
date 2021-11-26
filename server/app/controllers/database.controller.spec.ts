import { Application } from '@app/app';
import { DatabaseService } from '@app/services/database.service';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import supertest from 'supertest';
import { Container } from 'typedi';

const HTTP_STATUS_OK = StatusCodes.OK;
// const HTTP_STATUS_CREATED = StatusCodes.CREATED;

describe('DictionaryController', () => {
    let databaseService: SinonStubbedInstance<DatabaseService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        databaseService = createStubInstance(DatabaseService);
        // how to mock the getter

        const app = Container.get(Application);

        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['databaseController'], 'databaseService', { value: databaseService });
        expressApp = app.app;
    });

    it('should return [] from database service on valid get request to root', async () => {
        return supertest(expressApp)
            .get('/api/database/bestscoreclassique')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                expect(response.body).to.deep.equal([]);
            });
    });
});
