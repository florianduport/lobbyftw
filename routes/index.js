var express = require('express');
var router = express.Router();
var chatController = require('../controllers/chat.controller');


router.get('*', function(req, res, next) {
  if(req.url == "/login" || req.url.indexOf("/verify") > -1 || req.url.indexOf("/authenticate") > -1)
    next();
  else if(req.user == null)
    res.redirect('/login')
  else
    next();
});
router.get('/authenticate', global.steam.authenticate(), function(req, res) {
    res.redirect('/');
});
router.get('/verify', global.steam.verify(), function(req, res) {
    console.log("here")

    res.redirect('/');
    //res.send(req.user).end();
});
router.get('/logout', global.steam.enforceLogin('/'), function(req, res) {
    req.logout();
    res.redirect('/');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  //chatController.addChatUser(req.user.username);
  res.render('chatroom', { chat : chatController.getChat(), chatPseudo : req.user.username});
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});



module.exports = router;
