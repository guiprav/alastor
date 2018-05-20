let m = require('mithril');

require('bulma/css/bulma.css');
require('./app.css');

window.m = m;

m.route.prefix('/');

m.route(document.body, 'buyerHome', {
  buyerHome: require('./pages/BuyerHome'),
});
