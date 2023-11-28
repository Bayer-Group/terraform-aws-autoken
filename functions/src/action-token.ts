import  * as core from "@actions/core";
import { Logger, LogLevel } from './shared/Logger';
import { callTokenApi, detectSonarQubeProject } from './shared/action-request';

export const run = async () => {
    try {      
        Logger.setLogLevel(LogLevel.debug);

        const platform = core.getInput("platform")
        
        // Collect Metadata for request
        let params: object;
        if(platform === "sonarqube") {
            const project = core.getInput("project") || detectSonarQubeProject()
            Logger.info("Using project: " + project);
            params = {
                project: project,
                sonarUrl: core.getInput("sonarUrl")
            }
        }

        const body = await callTokenApi({
            platform: platform,
            type: "token",
            ...params
        })

        // Add token to the environment
        if(body.message && body.message.token) {
            const token = body.message.token;
    
            core.setSecret(token);

            if(platform === "sonarqube") {
                core.exportVariable("SONAR_HOST_URL",  core.getInput("sonarUrl"));
                core.exportVariable("SONAR_TOKEN", token);
            } else if (platform === "artifactory") {
                core.exportVariable("ARTIFACTORY_TOKEN", token);
                core.saveState("ARTIFACTORY_TOKEN", token);
                if(body.message.text)
                    core.warning(body.message.text)
            }
            Logger.info("Token was retrieved and added to the environment.");
        }else{
            Logger.error(body);
            core.setFailed("Could not get credentials.");
        }
    } catch(e) {
        core.setFailed(e);
    }    
};

if(process.env.CI) 
    run();
