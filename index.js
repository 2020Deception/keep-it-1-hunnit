var Botkit = require('botkit')
var beep = require('beepboop-botkit')
var request = require('request')
var parseString = require('xml2js').parseString
var htmlToText = require('html-to-text')

var token = process.env.SLACK_TOKEN

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
})
// Assume single team mode if we have a SLACK_TOKEN
if (token) {
  console.log('Starting in single-team mode')
  controller.spawn({
    token: token
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })
// Otherwise assume multi-team mode - setup beep boop resourcer connection
} else {
  console.log('Starting in Beep Boop multi-team mode')
  beep.start(controller, { debug: true })
}

// reply to @bot hello
controller.on('direct_mention', react)

// reply to hello @bot
controller.on('mention', react)

// do something if a reaction is added
controller.on('reaction_added', function (bot, message) {
  bot.api.reactions.add({
    name: message.reaction,
    channel: message.item.channel,
    timestamp: message.item.ts
  }, function (err, resp) {
    if (err) {
      console.log(err)
    }
  })
})

// give the bot something to listen for.
var listenerKeys = [
  new RegExp('\\blol\\b', 'i'),
  new RegExp('\\bfigure it out\\b', 'i'),
  new RegExp('\\b1hunnit\\b', 'i'),
  new RegExp('\\b311\\b', 'i'),
  new RegExp('\\b420\\b', 'i'),
  new RegExp('\\b100\\b', 'i'),
  new RegExp('\\bone hundred\\b', 'i'),
  new RegExp('\\bkeep it \\w+\\b', 'i'),
  new RegExp('\\bwho is brian bowman?\\b', 'i'),
  new RegExp('\\b1 train\\b', 'i'),
  new RegExp('\\b2 train\\b', 'i'),
  new RegExp('\\b3 train\\b', 'i'),
  new RegExp('\\b4 train\\b', 'i'),
  new RegExp('\\b5 train\\b', 'i'),
  new RegExp('\\b6 train\\b', 'i'),
  new RegExp('\\b7 train\\b', 'i'),
  new RegExp('\\ba train\\b', 'i'),
  new RegExp('\\bb train\\b', 'i'),
  new RegExp('\\bc train\\b', 'i'),
  new RegExp('\\bd train\\b', 'i'),
  new RegExp('\\be train\\b', 'i'),
  new RegExp('\\bf train\\b', 'i'),
  new RegExp('\\bg train\\b', 'i'),
  new RegExp('\\bj train\\b', 'i'),
  new RegExp('\\bl train\\b', 'i'),
  new RegExp('\\bm train\\b', 'i'),
  new RegExp('\\bn train\\b', 'i'),
  new RegExp('\\bq train\\b', 'i'),
  new RegExp('\\br train\\b', 'i'),
  new RegExp('\\bs train\\b', 'i'),
  new RegExp('\\bz train\\b', 'i'),
  new RegExp('\\bsir train\\b', 'i'),
  new RegExp('\\bget high\\b', 'i'),
  new RegExp('\\bcarrot\\b', 'i'),
  new RegExp('\\bbook\\b', 'i'),
  new RegExp('\\billiterate\\b', 'i'),
  new RegExp('\\bshame\\b', 'i'),
  new RegExp('\\bnah\\b', 'i'),
  new RegExp('\\brunning\\b', 'i'),
  new RegExp('\\bsuck it\\b', 'i'),
  new RegExp('\\bfrfr\\b', 'i'),
  new RegExp('\\bfarmigo\\b', 'i'),
  new RegExp('\\breal friends\\b', 'i'),
  new RegExp('\\bshots fired\\b', 'i'),
  new RegExp('\\byou are fired\\b', 'i'),
  new RegExp('\\bfood\\b', 'i'),
  new RegExp('\\boh shit\\b', 'i'),
  new RegExp('\\bidk\\b', 'i'),
  new RegExp('\\bWHO IS THE BEST WRESTLER EVER?\\b', 'i'),
  new RegExp('\\bWHAT IS TURNIP SOLUTIONS?\\b', 'i'),
  'weed',
  'turnip',
  '1_train',
  '2_train',
  '3_train',
  '4_train',
  '5_train',
  '6_train',
  '7_train',
  'a_train',
  'b_train',
  'c_train',
  'd_train',
  'e_train',
  'f_train_sucks',
  'g_train',
  'j_train',
  'l_train',
  'm_train',
  'n_train',
  'q_train',
  'r_train',
  's_train',
  'z_train',
  'sir_train'
]

controller.hears(
  listenerKeys,
  ['direct_message', 'direct_mention', 'mention', 'ambient'],
  react
)

function react (bot, message) {
  var rxn = ['100']
  function pushBooks () {
    rxn.push(
      'notebook',
      'green_book',
      'closed_book',
      'blue_book',
      'orange_book',
      'books',
      'book',
      'notebook_with_decorative_cover'
    )
  }

  function pushFood () {
    rxn.push(
      'apple',
      'green_apple',
      'turnip',
      'pear',
      'egg',
      'poultry_leg',
      'grapes',
      'bread',
      'tea',
      'melon',
      'tangerine',
      'lemon',
      'banana',
      'grapes',
      'strawberry',
      'melon',
      'cherries',
      'peach',
      'pineapple',
      'tomato',
      'eggplant',
      'hot_pepper',
      'corn',
      'sweet_potato',
      'bread',
      'honey_pot',
      'cheese_wedge',
      'meat_on_bone',
      'fork_and_knife'
    )
  }

  // checks for both phrase and emoji
  var subwayInfo = [
    ['1 TRAIN', '1_train', '123'],
    ['2 TRAIN', '2_train', '123'],
    ['3 TRAIN', '3_train', '123'],
    ['4 TRAIN', '4_train', '456'],
    ['5 TRAIN', '5_train', '456'],
    ['6 TRAIN', '6_train', '456'],
    ['7 TRAIN', '7_train', '7'],
    ['A TRAIN', 'a_train', 'ACE'],
    ['B TRAIN', 'b_train', 'BDFM'],
    ['C TRAIN', 'c_train', 'ACE'],
    ['D TRAIN', 'd_train', 'BDFM'],
    ['E TRAIN', 'e_train', 'ACE'],
    ['F TRAIN', 'f_train_sucks', 'BDFM'],
    ['G TRAIN', 'g_train', 'G'],
    ['J TRAIN', 'j_train', 'JZ'],
    ['L TRAIN', 'l_train', 'L'],
    ['M TRAIN', 'm_train', 'M'],
    ['N TRAIN', 'n_train', 'NQR'],
    ['Q TRAIN', 'q_train', 'NQR'],
    ['R TRAIN', 'r_train', 'NQR'],
    ['S TRAIN', 's_train', 'S'],
    ['Z TRAIN', 'z_train', 'JZ'],
    ['SIR TRAIN', 'sir_train', 'SIR'],
    ['1_TRAIN', '1_train', '123'],
    ['2_TRAIN', '2_train', '123'],
    ['3_TRAIN', '3_train', '123'],
    ['4_TRAIN', '4_train', '456'],
    ['5_TRAIN', '5_train', '456'],
    ['6_TRAIN', '6_train', '456'],
    ['7_TRAIN', '7_train', '7'],
    ['A_TRAIN', 'a_train', 'ACE'],
    ['B_TRAIN', 'b_train', 'BDFM'],
    ['C_TRAIN', 'c_train', 'ACE'],
    ['D_TRAIN', 'd_train', 'BDFM'],
    ['E_TRAIN', 'e_train', 'ACE'],
    ['F_TRAIN_SUCKS', 'f_train_sucks', 'BDFM'],
    ['G_TRAIN', 'g_train', 'G'],
    ['J_TRAIN', 'j_train', 'JZ'],
    ['L_TRAIN', 'l_train', 'L'],
    ['M_TRAIN', 'm_train', 'M'],
    ['N_TRAIN', 'n_train', 'NQR'],
    ['Q_TRAIN', 'q_train', 'NQR'],
    ['R_TRAIN', 'r_train', 'NQR'],
    ['S_TRAIN', 's_train', 'S'],
    ['Z_TRAIN', 'z_train', 'JZ'],
    ['S_R TRAIN', 'sir_train', 'SIR']
  ]

  for (var i = 0; i < subwayInfo.length; i++) {
    if (message.text.toUpperCase().indexOf(subwayInfo[i][0]) > -1) {
      rxn.push(subwayInfo[i][1], 'mta')
      getTrainStatus(subwayInfo[i][2], function (name, status, text, date, time) {
        var filteredText = htmlToText.fromString(text, {
          wordwrap: 130
        })
        bot.reply(message, 'THE MTA SAYS ::: ' + status + ' FOR THE ' + name + '\n' + filteredText + '\n' + date + '\n' + time)
      })
    }
  }

  var invalidUsers = [
    'U024H2X4H'
  ]

  var validUsers = [
    'U09NPAG11',
    'U08GT2AKC',
    'U0E5ATAET',
    'U0B21BV0E',
    'U09NPMD9D',
    'U024GG01L',
    'U054D7BLQ',
    'U03PUU0ET',
    'U024GGPQL',
    'U072XF54H',
    'U024GG4T9',
    'U024GG2BS'
  ]

  if (invalidUsers.indexOf(message.user) !== -1) {
    return
  }

  if (validUsers.indexOf(message.user) === -1) {
    return
  }

  // checks for both phrase and emoji
  var messageChecks = [
    ['WHO IS THE BEST WRESTLER EVER?', 'muscle', 'Not to front, it was Rehmat Qadir until he got hurt putting Hulk Hogan in a full nelson. That leaves THE UNDERTAKERS AS THE G.O.A.T. of WWE #Facts'],
    ['WHAT IS TURNIP SOLUTIONS?', 'turnip', 'Turnip Solutions was established on 4/1/2016 with Brian Bowman as the CEO, Rebecca Ahn as the CTO, Jeff Escalante as the Triple OG, Brandon Romano as the Director of Technology and a turnip named Plebian. Turnip Solutions is the dark side of Carrot Creative, where people drink Kool-aid, work hard and play harder. Please eat more turnips to learn more information, but dont eat Plebian. Thanks.'],
    [':turnip:', 'turnip', '#TurnipSolutions'],
    ['REAL FRIENDS', 'yeezy', 'HOW MANY OF US ARE REAL FRIENDS? :yeezy:'],
    ['YOU ARE FIRED', 'the_donald', 'You\'re fired! :the_donald:'],
    ['WHO IS BRIAN BOWMAN?', 'gun', 'Did you even have to ask that? He is someone who always keeps it :100:']
  ]

  for (i = 0; i < messageChecks.length; i++) {
    if (message.text.toUpperCase().indexOf(messageChecks[i][0]) > -1) {
      rxn.push(messageChecks[i][1])
      bot.reply(message, messageChecks[i][2])
    }
  }

  if (message.text.toUpperCase().indexOf('NAH') > -1) {
    if (message.user === 'U08GT2AKC' || message.user === 'U09NPAG11') {
      bot.reply(message, 'http://67.media.tumblr.com/4025b025994a6d2be7814be7ff1b6058/tumblr_n0ntau9Unr1qhcz8uo1_400.gif')
    }
  }
  if (message.text.toUpperCase().indexOf('OH SHIT') > -1) {
    if (message.user === 'U024GG01L' || message.user === 'U09NPAG11' || message.user === 'U09NPMD9D') {
      bot.reply(message, 'http://i.imgur.com/aMgG2jh.gif')
    }
  }
  if (message.text.toUpperCase().indexOf('FIGURE IT OUT') > -1) {
    if (message.user === 'U024GG01L' || message.user === 'U09NPAG11') {
      bot.reply(message, 'http://imgur.com/38bP71C.gif')
    }
  }

  var reactionPoints = [
    ['LOL', 'laughing'],
    ['GET HIGH', 'weed'],
    ['CARROT', 'carrot'],
    ['SHAME', 'shame'],
    ['IDK', 'shrug'],
    ['RUNNING', 'shame'],
    ['SHOTS FIRED', 'running'],
    ['420', 'weed'],
    ['311', '311'],
    ['?', 'question']
  ]

  for (i = 0; i < reactionPoints.length; i++) {
    if (message.text.toUpperCase().indexOf(reactionPoints[i][0]) > -1) {
      rxn.push(reactionPoints[i][1])
    }
  }

  if (message.text.toUpperCase().indexOf('SUCK IT') > -1) {
    rxn.push('eggplant', 'open_mouth')
  }
  if (message.text.indexOf(':weed:') > -1) {
    rxn.push('weed', 'lifted')
  }
  if (message.text.toUpperCase().indexOf('BOOK') > -1) {
    pushBooks()
  }
  if (message.text.toUpperCase().indexOf('ILLITERATE') > -1) {
    pushBooks()
  }
  if (message.text.toUpperCase().indexOf('FOOD') > -1) {
    pushFood()
  }
  if (message.text.toUpperCase().indexOf('FARMIGO') > -1) {
    pushFood()
  }
  reaction(bot, rxn, message)
}

/**
 * Gets the train's status. You never would have guessed this based on the
 * function name so good thing I added this jsdoc block!
 * @param {String} train - name of the train line
 * @param {Function} callback - passes back the result
 */
function getTrainStatus (train, callback) {
  request('http://web.mta.info/status/serviceStatus.txt', (err, res, body) => {
    if (err) throw err
    parseString(body, (err, res) => {
      if (err) throw err
      res.service.subway[0].line.map((line) => {
        if (train === line.name[0]) {
          callback(line.name, line.status, line.text, line.Date, line.Time)
          return
        }
      })
    })
  })
}

function reaction (aBot, rxn, message) {
  for (var i = 0; i < rxn.length; i++) {
    console.log(message)
    aBot.api.reactions.add({
      name: rxn[i],
      channel: message.channel,
      timestamp: message.ts
    }, function (err, resp) {
      if (err) {
        console.log(err)
      }
    })
  }
}
