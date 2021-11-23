import { MongoClient, Db } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';
import { environment } from '@app/environnements/environnement';

// CHANGE the URL for your database information
// const DATABASE_URL = 'mongodb+srv://equipe104:Teamprojet2@cluster0.2bthm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const DATABASE_URL = environment.mongoUrl;
const DATABASE_NAME = 'database';
const DATABASE_JV_EASY_NAME = 'JVEasyName';
const DATABASE_JV_HARD_NAME = 'JVHardName';

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
        // the line commented below is to fix bd when it's broking
        // this.db.collection(DATABASE_JV_EASY_NAME).deleteMany({});
        if ((await this.db.collection(DATABASE_JV_EASY_NAME).countDocuments()) === 0) {
            await this.populateJVEasyNameDB();
        }
        if ((await this.db.collection(DATABASE_JV_HARD_NAME).countDocuments()) === 0) {
            await this.populateJVHardNameDB();
        }
        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    async populateJVHardNameDB(): Promise<void> {
        const jVNames = [
            { name: 'JVHard1', level: 1 },
            { name: 'JVHard2', level: 1 },
            { name: 'JVHard3', level: 1 },
        ];
        // eslint-disable-next-line no-console
        console.log('THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE');
        for (const name of jVNames) {
            await this.db.collection(DATABASE_JV_HARD_NAME).insertOne(name);
        }
    }

    async populateJVEasyNameDB(): Promise<void> {
        const jVNames = [
            { name: 'JV1', level: 0 },
            { name: 'JV2', level: 0 },
            { name: 'JV3', level: 0 },
        ];
        // eslint-disable-next-line no-console
        console.log('THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE');
        for (const name of jVNames) {
            await this.db.collection(DATABASE_JV_EASY_NAME).insertOne(name);
        }
    }

    get database(): Db {
        return this.db;
    }
}
