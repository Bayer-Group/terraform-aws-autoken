
import { TokenResponse } from '../types';

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
export function getRandomString(length: number) {
    let result             = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
