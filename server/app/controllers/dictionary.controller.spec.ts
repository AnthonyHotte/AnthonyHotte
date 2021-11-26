import { Application } from '@app/app';
import { Dictionary } from '@app/classes/dictionary';
import { DictionaryService } from '@app/services/dictionary.service';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import supertest from 'supertest';
import { Container } from 'typedi';

const HTTP_STATUS_OK = StatusCodes.OK;
const HTTP_STATUS_CREATED = StatusCodes.CREATED;

describe('DictionaryController', () => {
    let dictionaryService: SinonStubbedInstance<DictionaryService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        dictionaryService = createStubInstance(DictionaryService);
        dictionaryService.getDictionaryTitleAndDescription.returns([]);
        dictionaryService.modifyDictionary.returns();
        dictionaryService.deleteDictionary.returns();
        dictionaryService.addFullDictionary.returns();
        dictionaryService.reinitialize.returns();
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['dictionaryController'], 'dictionaryService', { value: dictionaryService });
        expressApp = app.app;
    });

    it('should return [] from dictionary service on valid get request to root', async () => {
        return supertest(expressApp)
            .get('/api/dictionary/list')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                expect(response.body).to.deep.equal([]);
            });
    });
    /*
    it('should return [] from dictionary service on valid get request to root', async () => {
        return (
            supertest(expressApp)
                .get('/api/dictionary/fulldictionary?indexNumber=0')
                // .query({ indexNumber: 0 })
                .expect(HTTP_STATUS_OK)
                .then((response) => {
                    expect(response.body).to.deep.equal([]);
                })
        );
        
        // const params: HttpParams = new HttpParams().append('indexNumber', 0);
        // return supertest(expressApp)
        //     .get('/api/dictionary/fulldictionary', params)
        //     .expect(HTTP_STATUS_OK)
        //     .then((response) => {
        //         expect(response.body).to.deep.equal([]);
        //     });
            
    });
    */

    it('should change dictionary in dictionary service on valid post request to /sendnamechange', async () => {
        const message = { index: 0, dictionary: new Dictionary('t1', 'd1') };
        return supertest(expressApp).post('/api/dictionary/sendnamechange').send(message).set('Accept', 'application/json').expect(HTTP_STATUS_OK);
    });
    it('should store delete a dictionary in dictionary service on valid post request to /senddeletedictionary', async () => {
        const message = { indexNumber: 0 };
        return supertest(expressApp)
            .post('/api/dictionary/senddeletedictionary')
            .send(message)
            .set('Accept', 'application/json')
            .expect(HTTP_STATUS_OK);
    });
    it('should add new dictionnary in dictionary service on valid post request to /newdictionary', async () => {
        const message = new Dictionary('t1', 'd1');
        message.words = ['aa'];
        return supertest(expressApp)
            .post('/api/dictionary/newdictionary')
            .send(message)
            .set('Accept', 'application/json')
            .expect(HTTP_STATUS_CREATED);
    });
    it('should reinitialise dictionnary in dictionary service on valid post request to /sendreinitialise', async () => {
        return supertest(expressApp)
            .post('/api/dictionary/sendreinitialise')
            .send({ reinitialise: true })
            .set('Accept', 'application/json')
            .expect(HTTP_STATUS_OK);
    });
});
