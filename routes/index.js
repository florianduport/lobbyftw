var express = require('express');
var router = express.Router();
var chatController = require('../controllers/chat.controller');



router.get('/authenticate', global.steam.authenticate(), function(req, res) {
    res.redirect('/');
});
router.get('/loadUser',  function(req, res) {

    res.json(req.user !== undefined ? req.user : false);
});
router.get('/resetredis',  function(req, res) {
  var chat = {
    channels : {
      "général" : {
        id : 0,
        messages : [{
          channelId : 0,
          date : new Date(),
          displayDate : "00:00",
          messages : ["Bonjour et bienvenue sur NeedLast.com !"],
          user : {
            name : "Bot",
            profile : "#",
            username : "Bot",
            avatar : {
              small : "/images/csgo-logo.png",
              medium : "/images/csgo-logo.png"
            }
          }
        }]
      },
      "room 1" : {
        id : 1,
        messages : [{
          channelId : 0,
          date : new Date(),
          displayDate : "00:00",
          messages : ["Bonjour et bienvenue sur NeedLast.com !"],
          user : {
            name : "Bot",
            profile : "#",
            username : "Bot",
            avatar : {
              small : "/images/csgo-logo.png",
              medium : "/images/csgo-logo.png"
            }
          }
        }]
      },
      "room 2" : {
        id : 2,
        messages : [{
          channelId : 0,
          date : new Date(),
          displayDate : "00:00",
          messages : ["Bonjour et bienvenue sur NeedLast.com !"],
          user : {
            name : "Bot",
            profile : "#",
            username : "Bot",
            avatar : {
              small : "/images/csgo-logo.png",
              medium : "/images/csgo-logo.png"
            }
          }
        }]
      },
      "room 3" : {
        id : 3,
        messages : [{
          channelId : 0,
          date : new Date(),
          displayDate : "00:00",
          messages : ["Bonjour et bienvenue sur NeedLast.com !"],
          user : {
            name : "Bot",
            profile : "#",
            username : "Bot",
            avatar : {
              small : "/images/csgo-logo.png",
              medium : "/images/csgo-logo.png"
            }
          }
        }]
      }
    },
    users : []
  };
  global.redis.set('chat', JSON.stringify(chat));
  global.redis.set('clientSockets', "{}");
  res.send('ok');
});
router.get('/verify', global.steam.verify(), function(req, res) {
    //console.log("here")

    res.redirect('/#/general');
    //res.send(req.user).end();
});
router.get('/logout', global.steam.enforceLogin('/'), function(req, res) {
    req.logout();
    res.redirect('/');
});
router.get('*', function(req, res, next) {
  res.render('index');
});


module.exports = router;
