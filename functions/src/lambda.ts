import { 
  TokenSecretConfig,
  TokenEvent,
  TokenResponse,
  TokenSonarQubeEvent,
  TokenArtifactoryEvent
} from './types';

import { 
  Logger,
  LogLevel,
  getConfig,
  buildResponse
} from './shared'
import { handleSonarQube } from './platforms/sonarqube';
import { handleArtifactory } from './platforms/artifactory';

export let CONFIG: TokenSecretConfig = { sonarqube: "", artifactory: "" };

// Main Lambda Handler Function
export const handler = async (event: TokenEvent) => {
  Logger.setLogLevel(LogLevel.debug)
  Logger.info("Event", event);

  let response: TokenResponse;
  try {
    if (!CONFIG.sonarqube || !CONFIG.artifactory)
      CONFIG = await getConfig("autoken-admintokens");    
    
    // Confirm that the request is coming from a whitelisted organization (also checked in API Gateway)
    const { repository_owner } = event.requestContext.authorizer.jwt.claims;
    if(repository_owner !== process.env.PERMITTED_GITHUB_OWNER)
      return buildResponse("Only calls from whitelisted organizations are allowed.", 401);
    
    // Dispatch to the correct handler
    if(event.headers.platform === "sonarqube")
      response = await handleSonarQube(event as unknown as TokenSonarQubeEvent, CONFIG.sonarqube);
    else if(event.headers.platform === "artifactory")       
      response = await handleArtifactory(event as unknown as TokenArtifactoryEvent, CONFIG.artifactory);
    else
      return buildResponse("Invalid platform.", 400);

  } catch (e){
    Logger.error("Error", e.stack)
    response = buildResponse("Internal Server Error", 500);
  }
  
  Logger.info("Response", response)
  return Promise.resolve(response)
}


