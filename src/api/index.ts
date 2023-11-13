/// <reference types="fhir" />

import axios, { Axios, type AxiosPromise, type AxiosResponse } from 'axios'

const baseUrl = 'https://hapi.fhir.org/baseR4'
const publisher = 'watkins-chen-uchicagobsd'

const actions = {
  async listQuestionnaires () {
    try {
      const { data } = await axios.get(`${baseUrl}/Questionnaire?publisher=${publisher}`)
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