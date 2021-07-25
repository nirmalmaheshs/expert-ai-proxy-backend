export class response {
    /**
     * Function to return the given request
     * @param event 
     */
  static async returnRequest(event) {
    return new Promise((resolve, reject) => {
      try {
        const response = {
          statusCode: 200,
          event
        };
        resolve(JSON.stringify(response))

      } catch (error) {
        reject(error);
      }
    })
  }
}

export const returnRequest = response.returnRequest;
