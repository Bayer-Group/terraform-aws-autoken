import { SecretsManager } from 'aws-sdk'
import { TokenSecretConfig } from '../types';

/* Get Secret Manager Config
 * @param distributionId the CloudFront Distribution id, which is the identifying factor in the tf module
 * @return the config as json object
 */
export const getConfig = async (secretName: string): Promise<TokenSecretConfig> => {
    const secretsClient = new SecretsManager({ region: process.env.AWS_REGION })
    const response = await secretsClient.getSecretValue({SecretId: secretName}).promise()
    if (response.SecretString) 
        return JSON.parse(response.SecretString)
    return response.SecretBinary as TokenSecretConfig;
}