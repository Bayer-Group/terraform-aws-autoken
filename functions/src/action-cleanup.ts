import * as core from "@actions/core";
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
            Logger.info("Using SonarQube project: " + project);
            params = {
                project: project,
                sonarUrl: core.getInput("sonarUrl")
            }
        } else if(platform === "artifactory") {
            params = {
                token: core.getState("ARTIFACTORY_TOKEN")
            }
        }

        await callTokenApi({
            platform: platform,
            type: "cleanup",
            ...params
        })

        // Remove the token from the environment (for non-ephermal runners)
        if(platform === "sonarqube") {
            core.exportVariable("SONAR_HOST_URL", "");
            core.exportVariable("SONAR_TOKEN", "");
        } else if (platform === "artifactory") {
            core.exportVariable("ARTIFACTORY_TOKEN", "");
        }
        
        Logger.info("Token was revoked.");
    } catch(e) {
        core.setFailed(e);
    }    
};

if(process.env.CI) 
    run();