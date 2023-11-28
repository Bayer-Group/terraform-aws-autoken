import { 
  TokenResponse,
  TokenArtifactoryEvent,
} from '../types';

import { 
  Logger,
  buildResponse,
} from '../shared'

import axios, { Method } from 'axios';

const ARTIFACTORY_API_URL = process.env.ARTIFACTORY_API_URL;

export async function handleArtifactory(event: TokenArtifactoryEvent, adminToken: string) {

  const { type } = event.headers;
  const { repository } = event.requestContext.authorizer.jwt.claims;
  
  let response: TokenResponse;

  const botName = repository.replace("/", "_") + "_bot_autoken"
  
  const bot = getOrCreateBot(botName, adminToken);

  // Generate token or revoke token based on input
  if(type === "token") {
    const r = await callArtifactory(`api/security/token`, 'post', adminToken, {
      username: "autoken_bot_transient",
      scope: `member-of-groups:"readers,crop-science_group,shared-all-users,${botName}"`
    });
    Logger.info(r);
    response = buildResponse({token: r.access_token, text: !bot ? `Bot group ${botName} created in Artifactory. Make sure to give the group the permissions it needs.` : "" }, 200);
  } else {
    await callArtifactory(`api/security/token/revoke`, 'post', adminToken, {
      token: event.headers.token,
    })
    response = buildResponse("Token revoked", 200);
  }
  return response
}

async function getOrCreateBot(botName: string, adminToken: string) {
  let bot: object;
  try {
    bot = await callArtifactory(`api/security/groups/${botName}`, 'get', adminToken, {});
  } catch(e) { 
    Logger.warn("Bot not found", bot)
  }

  Logger.info("BOT", bot)

  // Create Bot in Artifactory
  if(!bot) {
    Logger.warn(`Creating bot ${botName}`);
    await callArtifactory(`api/security/groups/${botName}`, 'put', adminToken, { }, false)
  }
  return bot;
}

export async function callArtifactory(path:string, method:Method, adminToken: string, data: object, urlencode = true) {
  const response = await axios({
        method: method,
        url: ARTIFACTORY_API_URL + path,
        data: urlencode ? Object.entries(data).map(e => e.join('=')).join('&') : data,
        headers: {
          "X-JFrog-Art-Api": adminToken
        }
    })
  Logger.info(path, response.data)
  return response.data ? response.data : {};
}
