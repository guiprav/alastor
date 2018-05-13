let Collection = require('nedb');
let makeService = require('feathers-nedb');

let services = exports.services = {};

exports.getService = name => {
  if (services[name]) {
    return services[name];
  }

  let collection = new Collection({
    filename: `${__dirname}/collections/${name}.json`,
    autoload: true,
  });

  return services[name] = makeService({
    Model: collection,
  });
};

for (let k of [
  'get',
  'find',
  'create',
  'update',
  'patch',
  'remove',
]) {
  exports[k] = (name, ...args) =>
    exports.getService(name)[k](...args);
}
