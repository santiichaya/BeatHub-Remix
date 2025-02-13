import {createMemorySessionStorage} from '@remix-run/node'
import { userIdCookie } from './cookies';

export const {getSession,commitSession,destroySession}=createMemorySessionStorage({
    cookie:userIdCookie,
});



