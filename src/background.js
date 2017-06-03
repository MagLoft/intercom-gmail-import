import BackgroundClient from './background/client'

const client = new BackgroundClient()
chrome.storage.sync.get({ key: '' }, (items) => {
  client.setIntercomAccessKey(items.key)
})
