import '../../vendor/fetch'

class IntercomApi {
  constructor() {
    this.accessToken = null
    this.baseUrl = "https://api.intercom.io"
  }
  
  get(path, params={}) {
    const url = this.buildUrl(`${this.baseUrl}/${path}`, params)
    return fetch(url, { method: "GET", headers: this.getHeaders() }).then(this.checkStatus).then(this.parseJSON)
  }
  
  post(path, body={}, params={}) {
    const url = this.buildUrl(`${this.baseUrl}/${path}`, params)
    return fetch(url, { method: "POST", body: JSON.stringify(body), headers: this.getHeaders() }).then(this.checkStatus).then(this.parseJSON)
  }
  
  buildUrl(url, params={}) {
    const encodedParams = Object.entries(params).map((entry) => `${encodeURIComponent(entry[0])}=${encodeURIComponent(entry[1])}`)
    return encodedParams.length > 0 ? `${url}?${encodedParams.join("&")}` : url
  }
  
  getHeaders() {
    return {
      "Authorization": `Bearer ${this.accessToken}`,
      "Accept": "application/json",
      "Content-Type": 'application/json'
    }
  }
  
  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      return response.json().then((error) => {
        return Promise.reject({ error: error })
      })
    }
  }

  parseJSON(response) {
    return response.json()
  }
}

export default IntercomApi
