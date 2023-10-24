import { 
  buildResponse,
  getRandomString
} from "../../src/shared";

describe('buildResponse', () => {
  test('text message', () => {
      const response = buildResponse("Test Message", 200);
      expect(response).toMatchObject({
        code: 200,
        message: {
            text: "Test Message"
        }
      });
  });

  test('token', () => {
    const response = buildResponse({token: "123456789"}, 200);      
    expect(response).toMatchObject({
      code: 200,
      message: {
        token: "123456789"
      }
    });
  });

  test('error code', () => {
      const response = buildResponse("Test Message", 400);
      expect(response).toMatchObject({
        code: 400,
        message: {
            text: "Test Message"
        }
      });
  });
});

describe('getRandomString', () => {
  let mockRandom;
  beforeEach(() => {
    mockRandom = jest.spyOn(global.Math, "random");
  });

  test('length 10', async () => {
    mockRandom.mockReturnValue(0.5);
    
    expect(getRandomString(5)).toEqual("fffff");
  });

  test('length 5 word', async () => {
    mockRandom
      .mockReturnValue(0)
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.2)
      .mockReturnValueOnce(0.7);
    
    expect(getRandomString(5)).toEqual("YMrAA");
  });
});

