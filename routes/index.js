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

    res.json(req.user !== undefined ? req.user : false);
});
router.get('/verify', global.steam.verify(), function(req, res) {
    console.log("here")

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
