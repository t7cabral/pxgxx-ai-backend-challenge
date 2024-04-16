'use strict';

const R = require('ramda');
const { StatusCodes: HttpStatus } = require('http-status-codes');
const xss = require('xss');

const xss_options = {
  whiteList: [],
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script']
};

let xss_ignore = '';

module.exports = async (req, res, next) => {
  try {
    xss_ignore = res.locals.xss_ignore || '';
    req.body = clean(req.body);
    req.query = clean(req.query);
    req.params = clean(req.params);
    next();
  } catch (error) {
    console.log(error)
    return res.status(HttpStatus.BAD_REQUEST).json({ error });
  }
};

const clean_object = data => {
  let data_is_json = false;
  let data_no_xss = '';
  if (typeof data === 'object') {
    data_no_xss = R.pick(xss_ignore, data);
    data = JSON.stringify(data);
    data_is_json = true;
  } else if (typeof data === 'string') {
    data = xss(data, xss_options);
    return [data][0];
  } else {
    data_no_xss = R.pick(xss_ignore, JSON.parse(data));
  }

  data = xss(data, xss_options);
  data = R.mergeAll(JSON.parse(data), data_no_xss);

  if (!data_is_json) data = JSON.stringify(data);

  return data;
};

const clean = data => {
  if (Array.isArray(data)) {
    return data.map(clean_object);
  }

  return clean_object(data);
};

