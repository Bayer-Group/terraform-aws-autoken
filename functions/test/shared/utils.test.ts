import { 
  buildResponse
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
