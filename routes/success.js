var express = require('express');
var request = require('request');
var router = express.Router();
var mysql = require('mysql');
var models = require('../models');


router.get("/:id", function(req, res) {
  res.render('success', { title: '购买成功',transactions_id:req.params.id });
});

module.exports = router;
