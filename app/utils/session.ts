import { createCookieSessionStorage} from '@remix-run/node'
import { userIdCookie } from './cookies';

export const {getSession,commitSession,destroySession}=createCookieSessionStorage({
    cookie:userIdCookie,
});

