delete process.env.CI
import { run } from "../src/action-cleanup";

import * as core from "@actions/core";
import * as actionRequest from "../src/shared/action-request";

const getInput = jest.spyOn(core, "getInput").mockImplementation(jest.fn());
const exportVariable = jest.spyOn(core, "exportVariable").mockImplementation(jest.fn());
const setFailed = jest.spyOn(core, "setFailed").mockImplementation(jest.fn());
const callTokenApi = jest.spyOn(actionRequest, "callTokenApi").mockImplementation(jest.fn());

describe('run', () => {
  beforeEach(() => {
    exportVariable.mockClear();
    setFailed.mockClear();
    callTokenApi.mockClear();
    getInput.mockClear();
  })

  test('sonarqube', async () => {
    callTokenApi.mockResolvedValue({
      code: 200,
      message: {token: "test"}
    });
    getInput
      .mockReturnValueOnce("sonarqube")
      .mockReturnValueOnce("devops-sonarqube-test")
    
    await run();
    
    expect(callTokenApi).toHaveBeenCalledTimes(1);
    expect(exportVariable).toHaveBeenCalledTimes(2);
    expect(setFailed).toHaveBeenCalledTimes(0);

    expect(exportVariable.mock.calls[0][0]).toBe("SONAR_HOST_URL");
    expect(exportVariable.mock.calls[0][1]).toBe("");
    expect(exportVariable.mock.calls[1][0]).toBe("SONAR_TOKEN");
    expect(exportVariable.mock.calls[1][1]).toBe("");
  });

  test('error', async () => {
    callTokenApi.mockRejectedValue("Error 123");
    await run();
    
    expect(callTokenApi).toHaveBeenCalledTimes(1);
    expect(setFailed).toHaveBeenCalledTimes(1);

    expect(setFailed.mock.calls[0][0]).toBe("Error 123");
  });
});
