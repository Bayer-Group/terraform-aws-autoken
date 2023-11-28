
import { TokenResponse } from '../types';

import {v4 as uuidv4} from 'uuid';

/* Build a response for the Lambda
 * @param message what to say in the response
 * @param code html response code e.g. 200, 404, 500
 * @return the response as json object
 */
export function buildResponse(message: string | { token: string, text?: string}, code: number): TokenResponse {
    return {
        code: code,
        message: typeof message === "object" ? message : { text: message }
    }
}

/* Generate a pseudo-random string of a given length
 * @param length the length of the string to generate
 * @return random string
 */
export function getRandomString() {    
    return uuidv4();
}
