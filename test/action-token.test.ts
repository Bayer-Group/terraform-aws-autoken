delete process.env.CI
import { run, detectProject } from "../src/action-token";

import * as core from "@actions/core";
import * as actionRequest from "../src/shared/action-request";

const getInput = jest.spyOn(core, "getInput").mockImplementation(jest.fn());
const setSecret = jest.spyOn(core, "setSecret").mockImplementation(jest.fn());
const exportVariable = jest.spyOn(core, "exportVariable").mockImplementation(jest.fn());
const setFailed = jest.spyOn(core, "setFailed").mockImplementation(jest.fn());
const callTokenApi = jest.spyOn(actionRequest, "callTokenApi").mockImplementation(jest.fn());

describe('run', () => {
  beforeEach(() => {
    getInput.mockClear();
    setSecret.mockClear();
    exportVariable.mockClear();
    setFailed.mockClear();
    callTokenApi.mockClear();
    process.env.CI = "";
  })
  test('default', async () => {
    callTokenApi.mockResolvedValue({
      code: 200,
      message: {token: "test"}
    });
    
    getInput
      .mockReturnValueOnce("sonarqube")
      .mockReturnValueOnce("devops-autoken-test")
      .mockReturnValueOnce("https://example.com")
      .mockReturnValueOnce("https://example.com")
    
    await run();
    
    expect(callTokenApi).toHaveBeenCalledTimes(1);
    expect(getInput).toHaveBeenCalledTimes(4);
    expect(setSecret).toHaveBeenCalledTimes(1);
    expect(exportVariable).toHaveBeenCalledTimes(2);
    expect(setFailed).toHaveBeenCalledTimes(0);

    expect(exportVariable.mock.calls[0][0]).toBe("SONAR_HOST_URL");
    expect(exportVariable.mock.calls[0][1]).toBe("https://example.com");
    expect(exportVariable.mock.calls[1][0]).toBe("SONAR_TOKEN");
    expect(exportVariable.mock.calls[1][1]).toBe("test");
  });

  test('no credentials', async () => {
    callTokenApi.mockResolvedValue({
      code: 200,
      message: {text: "This is an error message"}
    });
    getInput
      .mockReturnValueOnce("sonarqube")
      .mockReturnValueOnce("devops-autoken-test")
      .mockReturnValueOnce("https://example.com")

    await run();
    
    expect(callTokenApi).toHaveBeenCalledTimes(1);
    expect(setFailed).toHaveBeenCalledTimes(1);

    expect(setFailed.mock.calls[0][0]).toBe("Could not get credentials.");
  });

  test('error', async () => {
    callTokenApi.mockRejectedValue("Error 123");    
    getInput
      .mockReturnValueOnce("sonarqube")
      .mockReturnValueOnce("devops-autoken-test")
      .mockReturnValueOnce("https://example.com")
    
    await run();
    
    expect(callTokenApi).toHaveBeenCalledTimes(1);
    expect(setFailed).toHaveBeenCalledTimes(1);

    expect(setFailed.mock.calls[0][0]).toBe("Error 123");
  });
});

describe('detectProject', () => {
  test('default', async () => {
    process.env.GITHUB_REPOSITORY = "bayer-group/devops-sonarqube-autoken";
    
    const response = detectProject();
    expect(response).toEqual("bayer-group_devops-sonarqube-autoken");
  });
});
