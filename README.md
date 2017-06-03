# Intercom Import for Gmail™
Import your Gmail™ messages to Intercom

## Installation

You can install this Extension directly from the Chrome Web-Store:
https://chrome.google.com/webstore/detail/intercom-import-for-gmail/ckmapackjkkpnibiajegpmllhfoeombn

## Description

Some of your customers will eventually send you a Ticket via Email which is not automatically tracked by Intercom. This Tool integrates with Gmail and allows you to import those conversations into Intercom with ease.

Once you have connected your Intercom Access Token using the extension options page or clicking on the Extension-Icon in your toolbar, all you need to do is click the blue button at the top-right of any email to import the conversation to Intercom.

Additionally, you will have a chance to clean up the message to remove any unwanted content, like signatures and the likes. This Extension is automatically trying to only grab the "meaningful" content, but it's better to double-check the message before importing.

Overall, the aim is to allow you to get all your customer's conversations into intercom, as we have personally experienced it as a huge pain if some of your conversations are managed elsewhere - and therefore - not managed at all.

I hope you gain some value from this extension, and if you like it - or more importantly, if you don't like it, please leave a short review or feature request in the Chrome Store.

## Development

Install Dependencies:

    $ npm install -g gulp-cli
    $ npm install

Local Development (build and watch for changes):

    $ gulp

Run lint before deploying or committing your code:

    $ gulp lint

Create extension zip file:

    $ gulp zip

Create extension crx file:

    $ gulp crx
