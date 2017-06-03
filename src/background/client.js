import IntercomApi from './intercom_api'

class BackgroundClient {
  constructor() {
    this.api = new IntercomApi()
    chrome.runtime.onMessage.addListener(this.onAction.bind(this))
  }
  
  retrieveUser(email) {
    return this.api.get("users", { email: email })
  }
  
  submitConversation(conversation) {
    return this.api.post("messages", {
      from: { type: "user", id: conversation.user.id },
      body: conversation.body
    })
  }
  
  setIntercomAccessKey(key) {
    this.api.accessToken = key
    return Promise.resolve(true)
  }
  
  onAction({action, message}, sender, respond) {
    this[action](message).then(respond).catch(respond)
    return true
  }
}

export default BackgroundClient
