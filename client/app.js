let m = require('mithril');
require('./app.css');

m.route(document.body, 'buyerHome', {
  buyerHome: require('./pages/BuyerHome'),
});
