import { PrismaClient } from "@prisma/client/extension";

interface CustomNodeJSGlobal extends NodeJS.Global{
    db:PrismaClient;
}

declare const global:CustomNodeJSGlobal;

const db=global.db || new PrismaClient();

global.db=db;

export default db;