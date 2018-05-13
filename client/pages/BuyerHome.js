let m = require('mithril');
require('./BuyerHome.css');

module.exports = {
  view: function() {
    return m('.buyerHomePage', [
      m('.searchBox', [
        m('.searchBox-options', [
          m('.searchBox-option', [
            'Geladeira',
          ]),

          m('.searchBox-option', [
            'Lava-roupas',
          ]),

          m('.searchBox-option', [
            'Laptop',
          ]),
        ]),

        m('.searchBox-fakeInput', [
          m('input.searchBox-input'),
        ]),

        m('.searchBox-specs', [
          m('.searchBox-spec', [
            'Fone de ouvido',
          ]),

          m('.searchBox-spec', [
            'Marca Beyerdynamic',
          ]),

          m('.searchBox-spec', [
            'Cor vermelha',
          ]),

          m('.searchBox-spec', [
            'Tipo monitor',
          ]),
        ]),
      ]),
    ]);
  },
};
