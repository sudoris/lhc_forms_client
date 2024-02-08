/// <reference types="fhir" />

import axios, { Axios, type AxiosPromise, type AxiosResponse } from 'axios'

const baseUrl = 'https://hapi.fhir.org/baseR4'
const publisher = ['watkins-chen-uchicagobsd', 'mwatkins']
const SYSTEM_URI = 'urn:uuid:0f7533a9-8a99-4666-9a7d-d435937cdef5'

const actions = {
  async listQuestionnaires () {
    try {
      const { data } = await axios.get(`${baseUrl}/Questionnaire?publisher=${publisher[0]},${publisher[1]}`)
      if (data) {
        return data
      } else {
        throw new Error('data not found')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {    
        // handle axios error
        console.log(error)
      } else {    
        // handle self defined or unexpected error
        console.log(error)
      }
    }
  },

  async saveQuestionnaireResponse (questionnaireResponse) {
    // console.log(questionnaireResponse)
    try {
      const { data } = await axios.post(`${baseUrl}/QuestionnaireResponse`, questionnaireResponse)
      console.log('post response:')
      console.log(data)
    } catch (error) {
      if (axios.isAxiosError(error)) {    
        // handle axios error
        console.log(error)
      } else {    
        // handle self defined or unexpected error
        console.log(error)
      }
    }
  },

  async listQuestionnaireResponses () {
    try {
      const { data } = await axios.get(`${baseUrl}/QuestionnaireResponse?_source=${SYSTEM_URI}`)
      if (data) {
        return data
      } else {
        throw new Error('data not found')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {    
        // handle axios error
        console.log(error)
      } else {    
        // handle self defined or unexpected error
        console.log(error)
      }
    }
  }
}

const methods = {

}

export default actions