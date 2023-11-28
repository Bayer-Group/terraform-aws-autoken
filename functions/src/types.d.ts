interface TokenEvent {
    headers: {
        platform: string,
        type: string,
    };
    requestContext: {
        authorizer: {
            jwt: {
                claims: {
                    repository: string,
                    run_id: string,
                    repository_owner: string
                }
            }
        }
    };
}

interface TokenArtifactoryEvent extends TokenEvent {
    headers: {     
        type: string,
        token: string,
    }
}

interface TokenSonarQubeEvent extends TokenEvent {
    headers: {     
        type: string,
        project: string,
        sonarUrl: string,
    }
}

interface TokenResponse {
    code: number; 
    message: {
        text?: string,
        token?: string;
    }; 
}

export interface TokenSecretConfig {
    sonarqube: string;
    artifactory: string;
}
