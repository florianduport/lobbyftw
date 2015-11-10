var express = require('express');
var router = express.Router();
var chatController = require('../controllers/chat.controller');



router.get('/authenticate', global.steam.authenticate(), function(req, res) {
    res.redirect('/');
});
router.get('/loadUser',  function(req, res) {
    /*res.json(req.user !== undefined ? req.user : {
      username : "Testeur"
    });*/

    if(req.user !== undefined){
      //console.log("yoooooo")
      //console.log(req.user.steamid)

      req.user.csgo =  global.CSGO.playerProfileRequest(global.CSGO.ToAccountID(req.user.steamid));

      //console.log(req.user.csgo);
    }
    res.json(req.user !== undefined ? req.user : false);
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
