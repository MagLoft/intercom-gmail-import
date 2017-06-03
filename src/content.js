import '../vendor/inboxsdk'
import ContentClient from './content/client'

const client = new ContentClient()
InboxSDK.load('1.0', 'sdk_IntercomImport_1b16c725dd').then((sdk) => {
  client.setInboxSDK(sdk)
})
