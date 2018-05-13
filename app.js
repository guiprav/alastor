let express = require('express');

let app = module.exports = express();
let publicPath = `${__dirname}/client/public`;

app.use(express.static(publicPath));

app.get('/*', (req, res) => {
  res.sendFile(`${publicPath}/index.html`);
});

{
  let port = process.env.PORT || 3000;

  app.listen(port);
  console.log(`Server listening on port ${port}.`);
}
