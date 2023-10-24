import { handleSonarQube } from "../../src/platforms/sonarqube";
import * as sonarqube from "../../src/platforms/sonarqube";

import MOCK_EVENT_TOKEN from '../mock/lambda_event_token.json';
import MOCK_EVENT_CLEANUP from '../mock/lambda_event_cleanup.json';
import MOCK_EVENT_RESPONSE_OK from '../mock/lambda_resp_token.json';
import MOCK_EVENT_RESPONSE_PROJECT_MISMATCH from '../mock/lambda_resp_project_mismatch.json';

import * as utils from "../../src/shared/utils";

const MOCK_ADMIN_TOKEN = "test123"
const mockCallSonarQube = jest.spyOn(sonarqube, "callSonarQube")
.mockImplementation(async (path: string) => {
  let result: object;
  switch(path) {
    case 'alm_settings/get_binding':  result = { 
      repository: 'bayer-group/devops-sonarqube-autoken-test'
    }; break;
    case 'users/search':  result = { 
      users: [{}]
    }; break;
    case 'users/create':  result = { }; break;
    case 'permissions/add_user':  result = { }; break;
    case 'user_tokens/generate':  result = { 
      token: 'test123'
    }; break;
    case 'user_tokens/revoke':  result = { }; break;
  }
  return result
});

jest.spyOn(utils, "buildResponse")
.mockImplementation((message: string | { token: string }, code: number) => ({
    code: code,
    message: typeof message == "object" ? message : { text: message }
}));

describe('handler', () => {
  test('default', async () => {
    const response = await handleSonarQube(MOCK_EVENT_TOKEN, MOCK_ADMIN_TOKEN)
    expect(response).toMatchObject(MOCK_EVENT_RESPONSE_OK);
  });
});

describe('handleSonarQube', () => {

  test('token: bot exists', async () => {
    const response = await handleSonarQube(MOCK_EVENT_TOKEN, MOCK_ADMIN_TOKEN)
    expect(response).toMatchObject(MOCK_EVENT_RESPONSE_OK);
  });

  test('cleanup: bot exists', async () => {
    const response = await handleSonarQube(MOCK_EVENT_CLEANUP, MOCK_ADMIN_TOKEN)
    expect(response).toMatchObject(MOCK_EVENT_RESPONSE_OK);
  });

  test('token: bot does not exists', async () => {
    mockCallSonarQube
      .mockResolvedValueOnce({ repository: "bayer-group/devops-sonarqube-autoken-test" })
      .mockResolvedValueOnce({ users: [] })
    const response = await handleSonarQube(MOCK_EVENT_TOKEN, MOCK_ADMIN_TOKEN)
    expect(response).toMatchObject(MOCK_EVENT_RESPONSE_OK);
  });

  test('project not owned by repository', async () => {
    mockCallSonarQube
      .mockResolvedValueOnce({ repository: "other-project" })
    const response = await handleSonarQube(MOCK_EVENT_TOKEN, MOCK_ADMIN_TOKEN)
    expect(response).toMatchObject(MOCK_EVENT_RESPONSE_PROJECT_MISMATCH);
  });
  
});
