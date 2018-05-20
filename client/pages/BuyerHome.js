let m = require('mithril');
require('./BuyerHome.css');

module.exports = {
  view: function() {
    return m('.buyerHomePage', [
      m('.searchBox', [
        m('.searchBox-options.tags', [
          m('.searchBox-option.tag.is-rounded.is-warning', [
            'Geladeira',
          ]),

          m('.searchBox-option.tag.is-rounded.is-warning', [
            'Lava-roupas',
          ]),

          m('.searchBox-option.tag.is-rounded.is-warning', [
            'Laptop',
          ]),
        ]),

        m('.searchBox-fakeInput', [
          m('input.searchBox-input', {
            placeholder: 'O que você procura?',
          }),
        ]),

        m('.searchBox-specs.tags', [
          m('.searchBox-spec.tag.is-rounded.is-danger', [
            'Fone de ouvido',
            m('.delete.is-small'),
          ]),

          m('.searchBox-spec.tag.is-rounded.is-danger', [
            'Marca Beyerdynamic',
            m('.delete.is-small'),
          ]),

          m('.searchBox-spec.tag.is-rounded.is-danger', [
            'Cor vermelha',
            m('.delete.is-small'),
          ]),

          m('.searchBox-spec.tag.is-rounded.is-danger', [
            'Tipo monitor',
            m('.delete.is-small'),
          ]),
        ]),
      ]),
    ]);
  },
};
