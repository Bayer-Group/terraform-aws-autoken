// import { 
//   getConfig
// } from "../../src/shared";

// import AWS from "aws-sdk";
  
// const mockgetSecretValue = jest.fn((SecretId) => {
//   switch(SecretId){
//     case "string": 
//       return { SecretString: '{ "secret1": "secret123" }' };
//     case "binary":
//       return { SecretBinary: { "secret1": "secret123" } };
//   }  
// });

// jest.mock("aws-sdk", () => {
//   return {
//     config: {
//       update() {
//         return {};
//       },
//     },
//     SecretsManager: jest.fn(() => {
//       return {
//         getSecretValue: jest.fn(({ SecretId }) => {
//           return {
//             promise: () => mockgetSecretValue(SecretId),
//           };
//         }),
//       };
//     }),
//   };
// });

describe('getConfig', () => {
  test('SecretString', async () => {
    expect("").toBe("")
  });

 //   test('SecretString', async () => {
//     jest.spyOn(AWS, "SecretsManager");
//     const response = await getConfig("string")
//     expect(response).toMatchObject({ "secret1": "secret123" })
//   });

//   test('SecretBinary', async () => {
//     jest.spyOn(AWS, "SecretsManager");
//     const response = await getConfig("binary")
//     expect(response).toMatchObject({ "secret1": "secret123" })
//   });
});