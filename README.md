# It's coming...

[![Join the chat at https://gitter.im/tylerl0706/project-lightning](https://badges.gitter.im/tylerl0706/project-lightning.svg)](https://gitter.im/tylerl0706/project-lightning?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

![](https://boltly.azurewebsites.net/img/light_theme_alpha.png)

Boltly (formally codenamed: "Project Lightning"), will be a complete Socket.io test client allowing you to send and receive messages from your server in order to debug your applications. Think of it as "Postman for Socket.io"

## Why?

I sent out a survey a bunch of people asking different questions about how they use Socket.io. The biggest question I asked, was:

##### What do you currently do in order to test to make sure your Socket.io logic in your application is correct?

Astoundingly, these were the results:

![](http://i.imgur.com/wrg9y0r.png)

Debugging Socket.io server logic is a mess. This is what Boltly (formally codenamed: "Project Lightning") hopes to fix. It will save time by allowing developers to test their logic with a click of a button.

## MVP Features
* Beautifully styled with Material Design guidelines
* Multiple connections
* Send events with complex bodies thanks to Ace Editor.
* History of sent messages
* Track any event
* Watch messages come in in real time
* Multi-platform support thanks to Electron

### Dark theme
Oh yeah... There's also a slick dark theme.

## Roadmap and progress
The progress of this project will be kept on Trello [here](https://trello.com/b/ixMGRAL1/project-lightning).

## Getting Started

1. clone this repository or download the zip
2. `cd project-lightning/`
3. `npm install`
4. `gulp`
5. `npm start`

You should be good to go. If you need a simple Socket.io server to test it out, try this:
https://github.com/tylerl0706/echo-socket.io-server
