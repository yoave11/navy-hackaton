const express = require('express');
const router = express.Router();
const requestHandler = require('./requestHandler')

/* GET home page. */
router.get('/', async (req, res, next) => {
  const answer = await requestHandler(req.query)
  res.send(answer);
});

module.exports = router;
