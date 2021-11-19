import { MongoClient, Db } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';
import { environment } from '@app/environnements/environnement';

// CHANGE the URL for your database information
// const DATABASE_URL = 'mongodb+srv://equipe104:Teamprojet2@cluster0.2bthm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const DATABASE_URL = environment.mongoUrl;
const DATABASE_NAME = 'database';
const DATABASE_COLLECTION = 'JVName';

@Service()
export class DatabaseService {
    private db: Db;
    private client: MongoClient;

    async start(url: string = DATABASE_URL): Promise<MongoClient | null> {
        try {
            // const client = await MongoClient.connect(url, this.options);
            const client = await MongoClient.connect(url);
            this.client = client;
            this.db = client.db(DATABASE_NAME);
        } catch {
            throw new Error('Database connection error');
        }

        if ((await this.db.collection(DATABASE_COLLECTION).countDocuments()) === 0) {
            await this.populateDB();
        }
        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    async populateDB(): Promise<void> {
        const jVNamesEasy = [{ name: 'JV1' }, { name: 'JV2' }, { name: 'JV3' }];
        const jVNamesHard = [{ name: 'JVHard1' }, { name: 'JVHard2' }, { name: 'JVHard3' }];
        // eslint-disable-next-line no-console
        console.log('THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE');
        for (const name of jVNamesEasy) {
            await this.db.collection(DATABASE_COLLECTION).insertOne(name);
        }
        for (const name of jVNamesHard) {
            await this.db.collection(DATABASE_COLLECTION).insertOne(name);
        }
    }

    get database(): Db {
        return this.db;
    }
}
