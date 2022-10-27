import axios from 'axios';
import {EXPERT_AI_API, EXPERT_AI_AUTH, SLACK_WEBHOOK} from '../constants/url.constants';
import {OpenSearchUtils} from '../utils/open_search';
import ResponseUtils from "../utils/response.utils";
import {HTTP_CONSTANTS} from "../utils/http.cosntants";

export class ExpertAi {


  static getSpeakers(text: string) {
    const charArr = text.split('');
    let startCharIndex = -1;
    let endCharIndex = 0;
    const speakers = []
    charArr.forEach((char, index) => {
      if (char === '<')
        startCharIndex = index;
      if (char === '>' && startCharIndex != -1) {
        endCharIndex = index;
        const speaker = text.slice(startCharIndex+1, endCharIndex);
        speakers.push(speaker)
        startCharIndex = -1;
      }
    })
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    return speakers.filter(onlyUnique);
  }

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
        let transcript =event.body;
        // let transcript = payload.text;
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
        const speakers = ExpertAi.getSpeakers(transcript);
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
              field['meetingId'] = payload.meetingId;
              field['speakers'] = speakers;
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
        let slackBody = {
          text: `Hi HR team, \n <${hateSpeeches[0].speaker}> has made some violent comments \`${hateSpeeches[0].value}\`. See details on the <https://search-expertai-jlyvjjfqyaq3tph5tv7f47v564.us-east-1.es.amazonaws.com/_dashboards/goto/7b945eedc5ab066789b2b981448bab15?security_tenant=global|dashboard>.`
        }
        await axios.post(SLACK_WEBHOOK, slackBody)
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
        const speakers = ExpertAi.getSpeakers(transcript);
        let emotionalTraits: Array<any> = []
        const categories = response.data?.data.categories;
        if(categories.length > 0) {
          categories.forEach(category => {
            let position =category.positions[0];
            // let speech = transcript.substring(position.start, position.end)
            let string = transcript.substring(position.start, position.end)
            category['statement'] = string;
            category['timestamp'] = new Date().toISOString()
            category['meetingId'] = payload.meetingId;
            category['speakers'] = speakers;
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
        const speakers = ExpertAi.getSpeakers(transcript);
        let behavioralTraits: Array<any> = []
        const categories = response.data?.data?.categories
        if(categories.length > 0) {
          categories.forEach(category => {
            let position =category.positions[0];
            // let speech = transcript.substring(position.start, position.end)
            let string = transcript.substring(position.start, position.end)
            category['statement'] = string;
            category['timestamp'] = new Date().toISOString()
            category['meetingId'] = payload.meetingId;
            category['speakers'] = speakers;
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