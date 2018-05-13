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
  exports[k] = async (name, ...args) => {
    let service = exports.getService(name);

    if (service.requestFilter) {
      args = (await service.requestFilter(...args)) || args;
    }

    let data = await exports.getService(name)[k](...args);

    if (!Array.isArray(data)) {
      data = [data];
    }

    if (service.responseFilter) {
      data = await service.responseFilter(data, ...args);
    }

    return data;
  };
}
