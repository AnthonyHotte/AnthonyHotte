import { Container } from 'inversify';
import { Application } from '@app/app';

import { Server } from '@app/server';
import { DatabaseService } from './services/database.service';
import Types from '@app/types';

const container: Container = new Container();

container.bind(Types.server).to(Server);
container.bind(Types.application).to(Application);

container.bind(Types.databaseService).to(DatabaseService).inSingletonScope();

export { container };
