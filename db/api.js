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

exports.superQuery = async cmds => {
  let ret = {
    total: null,
    limit: null,
    skip: null,

    main: null,
    auxiliary: {},
  };

  let slots = {};

  for (let [i, cmd] of cmds.entries()) {
    cmd.query = expandSlots(cmd.query, slots);
    console.log(JSON.stringify(cmd, null, 2));

    let results = await exports.find(cmd);

    if (!ret.main) {
      Object.assign(ret, {
        total: results.total,
        limit: results.limit,
        skip: results.skip,
      });

      slots[cmd.service] = ret.main = results.data;

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
      ret.auxiliary[cmd.service] =
      results.data;
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
