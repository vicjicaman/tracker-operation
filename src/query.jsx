import _ from 'lodash'
export const OPERATION_TABLE = [];
export const OPERATION_INDEX = {};

export const status = {
  INIT: "init",
  RUNNING: "running",
  PAUSE: "pause",
  FINISH: "finish",
  STOP: "stop",
  ERROR: "error",
  FAILED: "failed"
};

export const get = ({}, {
  operationid
}, cxt) => {
  return OPERATION_INDEX[operationid] || null;
}

export const list = ({}, {
  status,
  visibility
}, cxt) => {

  return _.filter(OPERATION_TABLE, (op) => {

    if ((status && (status === op.status))) {
      return false;
    }

    if ((visibility && (visibility === op.visibility))) {
      return false;
    }

    return true;
  });

}
