const express = require('express');
const redis = require('redis');
const app = express();
const redisClient = redis.createClient();


// http://localhost:4000/api/doSomething?userId=abc&text=hello

app.get('/api/doSomething', (req, res) => {
  console.log('Got message.');
  const redisData = {
    type: 'USER_SENT_MESSAGE',
    userId: req.query.userId,
    text: req.query.text,
  };
  // console.log('userID: ' + redisData.userId);
  redisClient.publish('testPublish', JSON.stringify(redisData));
  redisClient.publish('testPublish', JSON.stringify(redisData));
  res.status(200).send(redisData);
});

module.exports = app;

if (require.main === module) {
  console.log('Starting app');
  app.listen(4000);
}
