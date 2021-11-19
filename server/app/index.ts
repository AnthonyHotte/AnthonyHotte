// WARNING : Make sure to always import 'reflect-metadata' and 'module-alias/register' first
import 'reflect-metadata';
import 'module-alias/register';
import { Server } from '@app/server';
import { container } from '@app/inversify.config';

const server: Server = container.get(Server);
server.init();
