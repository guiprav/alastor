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

  let service = services[name] = makeService({
    Model: collection,
  });

  service.paginate = {
    default: 100,
    max: 100,
  };

  return service;
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

      paginate: params.paginate == null
        ? service.paginate
        : params.paginate,

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

    if (service.responseFilter) {
      await service.responseFilter(params);
    }

    return params.results;
  };
}

exports.superQuery = async queries => {
  let ret = {};

  for (let [k, cmds] of Object.entries(queries)) {
    ret[k] = {
      total: null,
      limit: null,
      skip: null,

      main: null,
      auxiliary: {},
    };

    let slots = {};

    for (let cmd of cmds) {
      cmd.query = expandSlots(cmd.query, slots);

      let results = await exports.find(cmd);

      if (!ret[k].main) {
        Object.assign(ret[k], {
          total: results.total,
          limit: results.limit,
          skip: results.skip,
        });

        slots[cmd.service] = ret[k].main = results.data;

        continue;
      }

      let { paginate } = cmd.paginate == null
        ? exports.getService(cmd.service)
        : cmd;

      if (results.total > paginate.max) {
        throw new Error(
          `Auxiliary query pagination is not allowed`,
        );
      }

      slots[cmd.service] =
        ret[k].auxiliary[cmd.service] =
        results.data;
    }
  }

  return ret;
};

function expandSlots(q, slots) {
  if (typeof q !== 'object') {
    return q;
  }

  if (Array.isArray(q)) {
    return q.map(x => expandSlots(x, slots));
  }

  if (!q.$pluck) {
    for (let [k, v] of Object.entries(q)) {
      q[k] = expandSlots(v, slots);
    }

    return q;
  }

  if (q.$pluck) {
    let data = slots[q.$pluck];

    if (q.key) {
      data = data.map(x => x[q.key]);
    }

    return data;
  }
}
