import _ from 'lodash'
import {
  OPERATION_TABLE,
  OPERATION_INDEX
} from '../query'
import * as Query from '../query'


export const create = (parent, {
  operationid: paramOperationid,
  data,
  mapper = null,
  handlers,
  config = {},
  opFn
}, cxt) => {

  const {
    operationid: configOperationid
  } = config;
  const operationid = paramOperationid || configOperationid;

  const curr = Query.get({}, {
    operationid
  }, cxt);

  if (curr) {
    return curr;
  }

  const operation = {
    id: operationid,
    operationid,
    startedOn: new Date(),
    finishedOn: null,
    status: Query.status.INIT,
    visibility: "shown",
    config,
    handlers: handlers || {},
    data,
    mapper,
    opFn,
    result: null,
    parent
  };

  OPERATION_TABLE.push(operation);
  OPERATION_INDEX[operationid] = operation;
  const nop = Query.get({}, {
    operationid
  }, cxt);
  return nop;
}
