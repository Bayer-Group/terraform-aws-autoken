import * as core from "@actions/core";
import axios from "axios";

import { TokenResponse } from "../types";

import { Logger } from './Logger';

// Call to API Gateway / Lambda; send JWT + Metadata
// returns token or confirms revocation
export const callTokenApi = async (params: object) => {

    const apiUrl = core.getInput("apiUrl");
    
    const jwt = await core.getIDToken();        
    await new Promise(r => setTimeout(r, 2000)); // Wait two seconds to avoid the iat in the token to be too early

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
};

// 
export const detectSonarQubeProject = () => {    
    Logger.warn("No project was provided. Using the default project.");

    const repository = process.env.GITHUB_REPOSITORY;

    if(repository)
        return repository.replace("/", "_")
    
    throw new Error("Could not detect the project.");
}
