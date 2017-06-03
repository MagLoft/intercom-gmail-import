class ContentClient {
  constructor() {
    this.importedConversations = []
    this.attachedMessageIds = []
  }
  
  setInboxSDK(sdk) {
    sdk.Conversations.registerMessageViewHandler((messageView) => {
      messageView.on("load", () => this.attachImportIcon(messageView))
      messageView.on("viewStateChange", (details) => this.attachImportIcon(details.messageView))
    })
  }
  
  onMessageViewIconClicked(event, messageView) {
    if(this.messageImported(messageView)) { return }
    this.setAttachmentIcon(messageView, "attachment-loading.svg")
    this.queryConversationData(messageView).then((conversation) => {
      return this.sendAction("submitConversation", conversation).then(() => {
        this.importedConversations.push(messageView.getMessageID())
        this.setAttachmentIcon(messageView, "attachment-success.png")
      })
    }).catch((response) => {
      if(response && response.error && !response.error.silent) {
        if(response.error.errors) {
          const errorString = response.error.errors.map((e) => e.message).join("; ")
          alert(`Unable to import conversation: ${errorString}`)
        }else if(response.error.message){
          alert(`Unable to import conversation: ${error.message}`)
        }
      }
      this.setAttachmentIcon(messageView, "attachment-icon.png")
    })
  }
  
  queryConversationData(messageView) {
    let conversation = {
      email: messageView.getSender().emailAddress,
      body: this.getBodyContent(messageView),
      subject: messageView.getThreadView().getSubject().replace("Fwd: ", ""),
      dateString: messageView.getDateString(),
      date: new Date(messageView.getDateString().replace(" at ", " "))
    }
    return this.sendAction("retrieveUser", conversation.email).then((user) => {
      conversation.user = user
      let modal = this.createConfirmationModal(conversation)
      return new Promise((resolve, reject) => {
        modal.classList.add("modal-backdrop")
        document.body.append(modal)
        this.delegateClickResolver(modal, "[modal-dismiss]").then(() => {
          modal.remove()
          reject({ silent: true })
        })
        return this.delegateClickResolver(modal, "[modal-confirm]").then(() => {
          modal.remove()
          conversation.body = modal.querySelector("textarea").value.trim()
          resolve(conversation)
        })
      })
    })
  }
  
  createConfirmationModal(conversation) {
    let element = document.createElement("div")
    element.innerHTML = `
      <div class="modal">
        <header>
          <img class="logo" src="${chrome.extension.getURL("images/intercom-logo-sm.png")}"></img>
          <section><h2>${conversation.subject}</h2><p>${conversation.email}</p></section>
          <a href="#" modal-dismiss>×</a>
        </header>
        <main class="int-imp-modal-body"><textarea>${conversation.body}</textarea></main>
        <footer>
          <span>${conversation.dateString}</span>
          <a class="btn" href="#" modal-dismiss>Cancel</a>
          <a class="btn btn-primary" href="#" modal-confirm>Import Conversation</a>
        </footer>
      </div>`
    return element
  }
  
  getBodyContent(messageView) {
    let bodyNode = messageView.getBodyElement().cloneNode(true)
    bodyNode.querySelectorAll("blockquote, .im, .h5").forEach((node) => node.remove())
    return bodyNode.innerText.trim().replace(/\n{3,}/g, "\n\n")
  }
  
  delegateClickResolver(element, selector) {
    return new Promise((resolve) => {
      element.querySelectorAll(selector).forEach(node => {
        node.onclick = (event) => {
          resolve(node)
          event.preventDefault()
          return false
        }
      })
    })
  }

  messageAttached(messageView) {
    return this.attachedMessageIds.indexOf(messageView.getMessageID()) !== -1
  }
  
  messageImported(messageView) {
    return this.importedConversations.indexOf(messageView.getMessageID()) !== -1
  }
  
  attachImportIcon(messageView) {
    if(this.messageAttached(messageView)) { return }
    if(this.messageImported(messageView)) {
      messageView.addAttachmentIcon({
        iconUrl: chrome.extension.getURL("images/attachment-success.png"),
        tooltip: "Already Imported",
        onClick: () => {}
      })
    }else{
      messageView.addAttachmentIcon({
        iconUrl: chrome.extension.getURL("images/attachment-icon.png"),
        iconClass: this.iconClass(messageView),
        tooltip: "Import to Intercom",
        onClick: (event) => this.onMessageViewIconClicked(event, messageView)
      })
      this.attachedMessageIds.push(messageView.getMessageID())
    }
  }
  
  setAttachmentIcon(messageView, path) {
    const icon = document.querySelector(`.${this.iconClass(messageView)}`)
    icon.style.backgroundImage = `url(${chrome.extension.getURL("images/"+path)})`
  }
  
  iconClass(messageView) {
    return `import-icon-${messageView.getMessageID()}`
  }
  
  sendAction(action, message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage("ckmapackjkkpnibiajegpmllhfoeombn", { action: action, message: message }, (response) => {
        if(response && response.error) {
          reject(response)
        }else{
          resolve(response)
        }
      })
    })
  }
}

export default ContentClient
