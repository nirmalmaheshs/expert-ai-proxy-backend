export class HelloWorld {
  /**
   * Function to return Welcome to serverless
   */
  static async welcomeFunction() {

    return new Promise((resolve, reject) => {
      try {
        const response = {
          statusCode: 200,
          "Hello": "Welcome to Serverless"
        };
        resolve(JSON.stringify(response))

      } catch (error) {
        reject(error);
      }
    })
  }
}

export const helloWorld = HelloWorld.welcomeFunction;
