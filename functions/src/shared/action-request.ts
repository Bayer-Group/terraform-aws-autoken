import * as core from "@actions/core";
import axios, { isAxiosError } from "axios";

import { TokenResponse } from "../types";

import { Logger } from './Logger';

const getErrorDetails = (error: unknown): string => {
    if (error && typeof error === "object" && "errors" in error && Array.isArray((error as { errors: unknown[] }).errors)) {
        return (error as { errors: unknown[] }).errors
            .map((e) => e instanceof Error ? e.message : String(e))
            .filter(Boolean)
            .join("; ");
    }
    if (error instanceof Error) {
        const cause = (error as Error & { cause?: unknown }).cause;
        if (cause) {
            const causeDetails = getErrorDetails(cause);
            if (causeDetails) {
                return causeDetails;
            }
        }
        return error.message;
    }
    return String(error);
};

const formatRequestError = (error: unknown, apiUrl: string): Error => {
    const status = isAxiosError(error) ? error.response?.status : undefined;
    const details = getErrorDetails(error);
    return new Error(
        `Failed to call Autoken API at "${apiUrl}"`
        + (status ? ` (HTTP ${status})` : "")
        + `: ${details}`
    );
};

// Call to API Gateway / Lambda; send JWT + Metadata
// returns token or confirms revocation
export const callTokenApi = async (params: object) => {

    const apiUrl = core.getInput("apiUrl", { required: true });
    if (!/^https?:\/\//i.test(apiUrl)) {
        throw new Error(`Invalid apiUrl "${apiUrl}". Provide the Autoken API Gateway endpoint_url (https://...).`);
    }
    
    const jwt = await core.getIDToken("autoken");        
    await new Promise(r => setTimeout(r, 2000)); // Wait two seconds to avoid the iat in the token to be too early

    try {
        const resp =  await axios({
            method: "GET",
            url: apiUrl,
            responseType: 'json',
            headers: {
                authorization: jwt,            
                ...params
            },
        })

        return await resp.data as TokenResponse;
    } catch (error) {
        throw formatRequestError(error, apiUrl);
    }
};

// 
export const detectSonarQubeProject = () => {    
    Logger.warn("No project was provided. Using the default project.");

    const repository = process.env.GITHUB_REPOSITORY;

    if(repository)
        return repository.replace("/", "_")
    
    throw new Error("Could not detect the project.");
}
