import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { TokenSecretConfig } from "../types";

/* Get Secret Manager Config
 * @param secretName the name of the secret to retrieve
 * @return the config as a JSON object
 */
export const getConfig = async (secretName: string): Promise<TokenSecretConfig> => {
    const client = new SecretsManagerClient({ region: process.env.AWS_REGION });
    const input = {
        SecretId: secretName,
    };
    const command = new GetSecretValueCommand(input);
    const response = await client.send(command);

    if (response.SecretString) {
        return JSON.parse(response.SecretString);
    }
    return response.SecretBinary as unknown as TokenSecretConfig;
};
