import { MongoClient, Db } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';
import { environment } from '@app/environnements/environnement';
import { BestScore } from '@app/classes/best-score-interface';

// CHANGE the URL for your database information
// const DATABASE_URL = 'mongodb+srv://equipe104:Teamprojet2@cluster0.2bthm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const DATABASE_URL = environment.mongoUrl;
const DATABASE_NAME = 'database';
const DATABASE_JV_EASY_NAME = 'JVEasyName';
const DATABASE_JV_HARD_NAME = 'JVHardName';
const BESTSCORECLASSIQUE = 'bestScoreClassique';
const BESTSCORELOG2990 = 'bestScoreLog2990';

@Service()
export class DatabaseService {
    // public for testing both
    client: MongoClient;
    db: Db;
    // private client: MongoClient;

    async start(url: string = DATABASE_URL): Promise<MongoClient | null> {
        try {
            const client = await MongoClient.connect(url);
            this.client = client;
            this.db = client.db(DATABASE_NAME);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err.message);
            throw new Error('Database connection error');
        }

        if ((await this.db.collection(DATABASE_JV_EASY_NAME).countDocuments()) === 0) {
            await this.populateJVEasyNameDB();
        }
        if ((await this.db.collection(DATABASE_JV_HARD_NAME).countDocuments()) === 0) {
            await this.populateJVHardNameDB();
        }

        if ((await this.db.collection(BESTSCORECLASSIQUE).countDocuments()) === 0) {
            await this.populateBestScoreClassiqueDB();
        }

        if ((await this.db.collection(BESTSCORELOG2990).countDocuments()) === 0) {
            await this.populateBestScoreLog2990DB();
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
    async populateBestScoreLog2990DB(): Promise<void> {
        const bestScoreLog2990 = [
            { name: ['Player 1'], score: 150 },
            { name: ['Player 2'], score: 130 },
            { name: ['Player 3'], score: 120 },
            { name: ['Player 4'], score: 100 },
            { name: ['Player 5'], score: 90 },
        ];
        // eslint-disable-next-line no-console
        console.log('THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE');
        for (const best of bestScoreLog2990) {
            await this.db.collection(BESTSCORELOG2990).insertOne(best);
        }
    }
    async populateBestScoreClassiqueDB(): Promise<void> {
        const bestScoreClassique = [
            { name: ['Player 1'], score: 120 },
            { name: ['Player 2'], score: 110 },
            { name: ['Player 3'], score: 100 },
            { name: ['Player 4'], score: 90 },
            { name: ['Player 5'], score: 80 },
        ];
        // eslint-disable-next-line no-console
        console.log('THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE');
        for (const best of bestScoreClassique) {
            await this.db.collection(BESTSCORECLASSIQUE).insertOne(best);
        }
    }

    getBestScoreClassique() {
        const bestScore: BestScore[] = [];
        this.db
            .collection(BESTSCORECLASSIQUE)
            .find()
            .forEach((document) => {
                bestScore.push({ score: document.score, name: document.name });
            });
        return bestScore;
    }
    bestScoreLog2990() {
        const bestScore: BestScore[] = [];
        this.db
            .collection(BESTSCORELOG2990)
            .find()
            .forEach((document) => {
                bestScore.push({ score: document.score, name: document.name });
            });
        return bestScore;
    }
    async sendScoreChanges(mode: number, bestScoreArr: BestScore[]) {
        const nameCollection = [BESTSCORECLASSIQUE, BESTSCORELOG2990];
        this.db.collection(nameCollection[mode]).deleteMany({});
        for (const bestScore of bestScoreArr) {
            await this.addOneScore(nameCollection, mode, bestScore);
        }
    }
    async addOneScore(nameCollection: string[], mode: number, bestScore: BestScore) {
        return this.db.collection(nameCollection[mode]).insertOne({ score: bestScore.score, name: bestScore.name });
    }
    async jvEasyNames() {
        const nameJv: string[] = [];
        await this.db
            .collection(DATABASE_JV_EASY_NAME)
            .find()
            .forEach((document) => {
                nameJv.push(document.name);
            });
        return nameJv;
    }
    async jvHardNames() {
        const nameJv: string[] = [];
        await this.db
            .collection(DATABASE_JV_HARD_NAME)
            .find()
            .forEach((document) => {
                nameJv.push(document.name);
            });
        return nameJv;
    }
    async sendNamesChanges(modeJV: number, jvNames: string[]) {
        const nameCollection = [DATABASE_JV_EASY_NAME, DATABASE_JV_HARD_NAME];
        this.db.collection(nameCollection[modeJV]).deleteMany({});
        for (const nameJV of jvNames) {
            await this.addOneName(nameCollection, modeJV, nameJV);
        }
    }
    async addOneName(nameCollection: string[], modeJV: number, nameJV: string) {
        return this.db.collection(nameCollection[modeJV]).insertOne({ name: nameJV, level: modeJV });
    }
}
