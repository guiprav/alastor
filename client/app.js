let m = require('mithril');

require('bulma/css/bulma.css');
require('./app.css');

m.route(document.body, 'buyerHome', {
  buyerHome: require('./pages/BuyerHome'),
});
