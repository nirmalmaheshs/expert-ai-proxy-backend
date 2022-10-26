import axios from 'axios';
import {EXPERT_AI_API, EXPERT_AI_AUTH} from '../constants/url.constants';
import {OpenSearchUtils} from '../utils/open_search';
import ResponseUtils from "../utils/response.utils";
import {HTTP_CONSTANTS} from "../utils/http.cosntants";

export class ExpertAi {


  static async getToken(event) {
    return new Promise(async(resolve) => {
      try {
        const body = JSON.parse(event.body);
        const params = {
          username: body.username,
          password: body.password
        }
        const token = await axios.post(EXPERT_AI_AUTH, params)
        resolve(ResponseUtils.generateResponse(
            HTTP_CONSTANTS.STATUS.SUCCESS, JSON.stringify({
              status: HTTP_CONSTANTS.STATUS.SUCCESS,
              response: token.data
            })
        ));
      } catch (error) {
        resolve(ResponseUtils.generateResponse(
            HTTP_CONSTANTS.STATUS.SUCCESS, JSON.stringify({
              status: HTTP_CONSTANTS.STATUS.SYSTEM_ERROR,
              response: error.message
            })
        ));
      }
    })
  }

  static async hateSpeech(event) {
    return new Promise(async (resolve) => {
      try {
        const payload = JSON.parse(event.body);
        let transcript = payload.text;
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
              field['speaker'] = string.substring(startIndex + 1, endIndex)
              field['timestamp'] = new Date().toISOString()
              field['meetingId'] = event.body.meetingId;
              hateSpeeches.push(field)
            })
          });
        }
        hateSpeeches = hateSpeeches.filter((speech) => speech.name !== 'target');
        console.log(hateSpeeches)
        if(hateSpeeches.length > 0){
          const openSearchUtils = new OpenSearchUtils();
          let indexResponse = await openSearchUtils.insert_doc(hateSpeeches, 'expert_ai_hate_speech');
          console.log(indexResponse)
        }
        resolve(ResponseUtils.generateResponse(
            HTTP_CONSTANTS.STATUS.SUCCESS, JSON.stringify({
              status: HTTP_CONSTANTS.STATUS.SUCCESS,
              response: hateSpeeches
            })
        ));
      } catch (error) {
        resolve(ResponseUtils.generateResponse(
            HTTP_CONSTANTS.STATUS.SUCCESS, JSON.stringify({
              status: HTTP_CONSTANTS.STATUS.SYSTEM_ERROR,
              response: error.message
            })
        ));
      }
    })
  }

  static async emotionalTraits(event) {
    return new Promise(async (resolve) => {
      try {
        const payload = JSON.parse(event.body);
        let transcript = payload.text;
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
        let response = await axios.post(`${EXPERT_AI_API}/categorize/emotional-traits/en`, params, {
          headers: headers
        });
        let emotionalTraits: Array<any> = []
        const categories = response.data?.data.categories;
        if(categories.length > 0) {
          categories.forEach(category => {
            let position =category.positions[0];
            // let speech = transcript.substring(position.start, position.end)
            let string = transcript.substring(position.start, position.end)
            category['statement'] = string;
            category['timestamp'] = new Date().toISOString()
            category['meetingId'] = event.body.meetingId;
            emotionalTraits.push(category)
          });
        }
        console.log(emotionalTraits)
        if(emotionalTraits.length > 0){
          const openSearchUtils = new OpenSearchUtils();
          let indexResponse = await openSearchUtils.insert_doc(emotionalTraits, 'expert_ai_emotional_traits');
          console.log(indexResponse)
        }
        resolve(ResponseUtils.generateResponse(
            HTTP_CONSTANTS.STATUS.SUCCESS, JSON.stringify({
              status: HTTP_CONSTANTS.STATUS.SUCCESS,
              response: emotionalTraits
            })
        ));
      } catch (error) {
        resolve(ResponseUtils.generateResponse(
            HTTP_CONSTANTS.STATUS.SUCCESS, JSON.stringify({
              status: HTTP_CONSTANTS.STATUS.SYSTEM_ERROR,
              response: error.message
            })
        ));
      }
    })
  }

  static async behavioralTraits(event) {
    return new Promise(async (resolve) => {
      try {
        const payload = JSON.parse(event.body);
        let transcript = payload.text;
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
        let response = await axios.post(`${EXPERT_AI_API}/categorize/behavioral-traits/en`, params, {
          headers: headers
        });
        let behavioralTraits: Array<any> = []
        const categories = response.data?.data?.categories
        if(categories.length > 0) {
          categories.forEach(category => {
            let position =category.positions[0];
            // let speech = transcript.substring(position.start, position.end)
            let string = transcript.substring(position.start, position.end)
            category['statement'] = string;
            category['timestamp'] = new Date().toISOString()
            category['meetingId'] = event.body.meetingId;
            behavioralTraits.push(category)
          });
        }
        console.log(behavioralTraits)
        if(behavioralTraits.length > 0){
          const openSearchUtils = new OpenSearchUtils();
          let indexResponse = await openSearchUtils.insert_doc(behavioralTraits, 'expert_ai_behavioral_traits');
          console.log(indexResponse)
        }
        resolve(ResponseUtils.generateResponse(
            HTTP_CONSTANTS.STATUS.SUCCESS, JSON.stringify({
              status: HTTP_CONSTANTS.STATUS.SUCCESS,
              response: behavioralTraits
            })
        ));
      } catch (error) {
        resolve(ResponseUtils.generateResponse(
            HTTP_CONSTANTS.STATUS.SUCCESS, JSON.stringify({
              status: HTTP_CONSTANTS.STATUS.SYSTEM_ERROR,
              response: error.message
            })
        ));
      }
    })
  }
}

export const getToken = ExpertAi.getToken;
export const hateSpeech = ExpertAi.hateSpeech;
export const emotionalTraits = ExpertAi.emotionalTraits;
export const behavioralTraits = ExpertAi.behavioralTraits;