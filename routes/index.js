var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/hello', function(req,res) {
  res.send('The time is' + new Date().toDateString());
});

router.get('/u/:user', function(req, res){
  res.send('user: ' + req.params.user);
});
module.exports = router;
