import { callSonarQube } from "../../src/platforms/sonarqube";

import axios from "axios";

jest.mock("axios")
const mockedAxios = jest.mocked(axios)

describe('callSonarQube', () => {
  test('default', async () => {
    mockedAxios.mockResolvedValue({
      status: 200,
      statusText: "OK",
      config: {},
      headers: {},
      data: "result"
    })

    const response = await callSonarQube("users/search", "get", "123123", {
      name: "test"
    })
    expect(response).toEqual("result");
  });
});

