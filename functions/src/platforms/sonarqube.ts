import { 
  TokenResponse,
  TokenSonarQubeEvent
} from '../types';

import { 
  Logger,
  buildResponse,
  getRandomString
} from '../shared'

import * as self from './sonarqube';

import axios, { Method } from 'axios';

const SONAR_API_URL = process.env.API_URL_SONARQUBE;

export async function handleSonarQube(event: TokenSonarQubeEvent, adminToken: string) {
  let response: TokenResponse;
  Logger.info("Getting SonarQube token");

  const { type, project } = event.headers;
  const { repository, run_id } = event.requestContext.authorizer.jwt.claims;
  
  if(await checkProjectBindingMatches(adminToken, project, repository)) {
    const botName = project + "_bot_autoken"    
    await createBotIfNeeded(botName, adminToken, project);

    const payload = { 
      login: botName,
      name: run_id
    }
    // Generate or revoke token based on input from the action
    if(type === "token") {
      const { token } = await self.callSonarQube('user_tokens/generate', 'post', adminToken, payload)      
      response = buildResponse({token: token }, 200);
    } else {
      await self.callSonarQube('user_tokens/revoke', 'post', adminToken, payload)
      response = buildResponse("Token revoked", 200);
    }

  } else {
    response = buildResponse("You are not authorized for this project", 401);
  }
  console.log(response)
  return response
}

// Check which Repository the SonarQube Project that is to be accessed is configured with
async function checkProjectBindingMatches (adminToken: string, project: string, repository: string) {
  const binding = await self.callSonarQube('alm_settings/get_binding', 'get', adminToken, { 
    project: project 
  })
  return binding.repository == repository
}

async function createBotIfNeeded(botName: string, adminToken: string, project: string) {
  const bots = await self.callSonarQube('users/search', 'get', adminToken, { 
    q: botName
  })

  // Create Bot and add scan permissions to mentioned SonarQube project
  if(bots.users.length === 0) {
    await self.callSonarQube('users/create', 'post', adminToken, { 
      login: botName,
      name: botName,
      password: getRandomString()
    })
    await self.callSonarQube('permissions/add_user', 'post', adminToken, { 
      login: botName,
      projectKey: project,
      permission: "scan"
    })
  }
}

export async function callSonarQube(path:string, method:Method, adminToken: string, data: object) {
  let response;
  try {
    response = await axios({
      method: method,
      url: SONAR_API_URL + "/" + path + "?" + Object.entries(data).map(e => e.join('=')).join('&'),
      responseType: 'json',
      auth: {username: adminToken, password: ""}
    })
  } catch(e) {
    console.log("Request: callSonarQube")
  }
  const result = response && response.status < 400 ? response.data : ""
  Logger.info(path, result)
  return result;
}
