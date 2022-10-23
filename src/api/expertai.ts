import axios from 'axios';
import { EXPERT_AI_API, EXPERT_AI_AUTH } from '../constants/url.constants';

export class ExpertAi {
  

  static async getToken(event) {
    return new Promise(async(resolve, reject) => {
      try {
        const body = JSON.parse(event.body);
        const params = {
          username: body.username,
          password: body.password
        }
        const token = await axios.post(EXPERT_AI_AUTH, params)
        resolve(token.data)
      } catch (error) {
        reject(error);
      }
    })
  }

  static async hateSpeech(event) {
    return new Promise(async (resolve, reject) => {
      try {
        let transcript = event.body;
        const token = event.headers.Authorization;
        transcript = transcript.replace(/(\r\n|\n|\r)/gm, "");
        const params = {
          document: {
            text: transcript
          }
        }
        const headers = {
          Authorization: token
        }
        let response = await axios.post(`${EXPERT_AI_API}/detect/hate-speech/en`, params, {
          headers: headers
        });
        let hateSpeeches: Array<any> = []
        const extractions = response.data?.data?.extractions
        if(extractions.length > 0) {
          extractions.forEach(extraction => {
            extraction.fields.forEach(field => {
              let position =field.positions[0];
              // let speech = transcript.substring(position.start, position.end)
              let string = transcript.substring(0, position.end)
              let startIndex = string.lastIndexOf('<');
              let endIndex = string.lastIndexOf('>');
              let username = string.substring(startIndex+1, endIndex)
              field['speaker'] = username
              hateSpeeches.push(field)
            })
          });
        }
        console.log(hateSpeeches)
        resolve(hateSpeeches)
      } catch (error) {
        reject(error);
      }
    })
  }
}

export const getToken = ExpertAi.getToken;
export const hateSpeech = ExpertAi.hateSpeech;