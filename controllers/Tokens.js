const TokenRouter = require('express').Router();
const mongodb = require('mongodb');
const Token = require('../models/Token');

// get a list of tokens
TokenRouter.get('/list', function(req, res) {
  Token.find(function(err, tokens) {
    if (err) return res.json(err);
    const mappedTokens = tokens.map(q => q.toJSONFor());
    res.json(mappedTokens);
  });
})

// get a specific token
TokenRouter.get('/id/:id', function(req, res) {
  const id = req.params.id;
  Token.findById(id, function(err, token) {
    if (err) return res.status(400).json(err);
    if (!token) return res.json("Token not found!");
    res.json(token);
  });
});

// delete a specific token
TokenRouter.delete('/delete', function(req, res) {
  const ids = req.body.tokenIDs.map(function(id) {
    return new mongodb.ObjectID(id);
  });

  Token.deleteMany({
    _id: {
      $in: ids
    }
  }, function(err) {
    if (err) return res.status(400).send(err);
  });
  res.send({
    "message": "Deleted token/tokens!"
  });
});

// post a new token
TokenRouter.post('/insert', function(req, res) {
  const newToken = new Token();
  newToken.userId = req.body.userId;
  newToken.token = req.body.token;

  newToken.save(function(err) {
    if (err) return res.status(400).json(err);
    else {
      return res.json({
        message: 'Token created!',
        token: newToken
      });
    }
  });
});

// editing an existing token
TokenRouter.put('/edit', function(req, res) {
  const tokenToEdit = req.body;

  Token.findById(tokenToEdit.id, function(err, token) {
    if (err) return res.status(400).send(err);
    else if (!token) return res.send('Token ID not found!');
    token.set({
      userId: tokenToEdit.userId,
      token: tokenToEdit.token
    });
    token.save(function(err, updatedToken) {
      if (err) return err.message;

      res.json({
        message: 'Token updated!',
        token: updatedToken
      });
    });
  });
});

module.exports = TokenRouter;
