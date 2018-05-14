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
  'find',
  'create',
  'patch',
  'remove',
]) {
  exports[k] = async params => {
    let service = exports.getService(params.service);

    if (service.requestFilter) {
      await service.requestFilter(params);
    }

    let feathersParams = {
      query: params.query,
      // TODO: Implement other params.
    };

    let feathersArgs;

    switch (k) {
      case 'find':
      case 'remove':
        feathersArgs = [feathersParams];
        break;

      case 'create':
      case 'patch':
        feathersArgs = [params.body, feathersParams];
        break;

      default:
        throw new Error('Bug');
    }

    params.results = await service[k](...feathersArgs);

    if (!Array.isArray(params.results)) {
      params.results = [params.results];
    }

    if (service.responseFilter) {
      await service.responseFilter(params);
    }

    return params.results;
  };
}
