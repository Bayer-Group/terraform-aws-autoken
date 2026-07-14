import { 
  callTokenApi, 
  detectSonarQubeProject 
} from "../../src/shared/action-request";

import * as core from "@actions/core";
import axios from "axios";
jest.mock("axios")
const mockedAxios = jest.mocked(axios)

const getInput = jest.spyOn(core, "getInput").mockImplementation(() => "https://example.com");
const getIDToken = jest.spyOn(core, "getIDToken").mockResolvedValue("idtoken123");

describe('callTokenApi', () => {
  beforeEach(() => {
    getInput.mockClear();
    getIDToken.mockClear();
    mockedAxios.mockClear();
  })

  test('default', async () => {
    mockedAxios.mockResolvedValue({
      status: 200,
      statusText: "OK",
      config: {},
      headers: {},
      data: { token: "test123" }
    })
    getInput
      .mockImplementationOnce(() => "https://api.example.com")
    
    const response = await callTokenApi({ 
      platform: "sonarqube", 
      token: "token"
    });
    
    expect(mockedAxios).toHaveBeenCalledTimes(1);

    expect(mockedAxios.mock.calls[0][0]).toMatchObject({
      method: "GET",
      url: "https://api.example.com",
      responseType: 'json',
      headers: {
          authorization: "idtoken123",
      },
    });

    expect(response).toEqual({ token: "test123" });
  });

  test('rejects invalid apiUrl', async () => {
    getInput.mockImplementationOnce(() => "");

    await expect(callTokenApi({ platform: "sonarqube" })).rejects.toThrow(/Invalid apiUrl/);
    expect(mockedAxios).not.toHaveBeenCalled();
  });

  test('surfaces axios AggregateError details', async () => {
    getInput.mockImplementationOnce(() => "https://api.example.com");
    const aggregate = Object.assign(new Error("AggregateError"), {
      errors: [new Error("connect ECONNREFUSED 127.0.0.1:443")],
    });
    mockedAxios.mockRejectedValue(aggregate);

    await expect(callTokenApi({ platform: "sonarqube" })).rejects.toThrow(
      /Failed to call Autoken API at "https:\/\/api.example.com": connect ECONNREFUSED/
    );
  });
});

describe('detectSonarQubeProject', () => {
  test('default', async () => {
    process.env.GITHUB_REPOSITORY = "bayer-group/devops-sonarqube-autoken";
    
    const response = detectSonarQubeProject();
    expect(response).toEqual("bayer-group_devops-sonarqube-autoken");
  });
});
