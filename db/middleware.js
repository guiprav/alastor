let db = require('./api');

exports.register = app => {
  app.get('/api/:service', (req, res) => {
    db.find({
      service: req.params.service,
      query: req.query,
    })
    .then(data => res.send(data))
    .catch(err => {
      console.error(err);
      res.status(500).send();
    });
  });

  app.post('/api/:service', (req, res) => {
    db.create({
      service: req.params.service,
      body: req.body,
    })
    .then(data => res.send(data))
    .catch(err => {
      console.error(err);
      res.status(500).send();
    });
  });

  app.patch('/api/:service', (req, res) => {
    db.patch({
      service: req.params.service,
      body: req.body,
    })
    .then(data => res.send(data))
    .catch(err => {
      console.error(err);
      res.status(500).send();
    });
  });

  app.delete('/api/:service', (req, res) => {
    db.remove({
      service: req.params.service,
      query: req.query,
    })
    .then(data => res.send(data))
    .catch(err => {
      console.error(err);
      res.status(500).send();
    });
  });
};
