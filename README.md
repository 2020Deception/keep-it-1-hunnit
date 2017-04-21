##1hunnit
##Overview

This bot keeps everything 100. One of the most hated and most loved, this bot likes to listen and react, even reply occasionally. No information is ever stored, no weird service calls, just a plain fun bot that doesn't care about analyitics or tracking. Enjoy.

services :
• train updates

Visit Beep Boop to get the scoop on the the Beep Boop hosting platform. The Slack API documentation can be found here.

##Assumptions

You have already signed up with Beep Boop and have a local fork of this project.
You have sufficient rights in your Slack team to configure a bot and generate/access a Slack API token.
##Usage

##Run locally

npm install
SLACK_TOKEN=<YOUR_SLACK_TOKEN> npm start
Things are looking good if the console prints something like:

** API CALL: https://slack.com/api/rtm.start
** BOT ID:  witty  ...attempting to connect to RTM!
** API CALL: https://slack.com/api/chat.postMessage
##Run locally in Docker

docker build -t starter-node .`
docker run --rm -it -e SLACK_TOKEN=<YOUR SLACK API TOKEN> starter-node
##Run in BeepBoop

If you have linked your local repo with the Beep Boop service (check here), changes pushed to the remote master branch will automatically deploy.

##Acknowledgements

This code uses the botkit npm module by the fine folks at Howdy.ai.

##License

See the LICENSE file (MIT).
