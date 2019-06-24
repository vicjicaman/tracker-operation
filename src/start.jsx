import _ from 'lodash'
import {
  wait
} from '@nebulario/core-process'
import * as Utils from './utils'
import {
  status as Status
} from './query'

const control = async (cxt) => {
  const {
    operation: {
      status
    }
  } = cxt;

  while (true) {
    if (status === Status.FINISH || status === Status.STOP) {
      break;
    }
    await wait(10);
  }

}

const executor = async function(cxt) {
  const {
    operation
  } = cxt;
  const {
    operationid,
    config,
    handlers,
    opFn
  } = operation;
  const {
    onStarted,
    onFinished,
    onCompleted,
    onError
  } = handlers;

  try {

    if (onStarted) {
      await onStarted(operation, cxt);
    }

    await Utils.update(operation, {
      status: Status.RUNNING
    }, cxt);

    operation.result = await opFn(cxt);

    await Utils.update(operation, {
      status: Status.FINISH
    }, cxt);

    if (onFinished) {
      await onFinished(operation, cxt);
    }

  } catch (e) {
    console.log("#############################################################")
    console.log(e.toString());

    if (e instanceof FlowError) {
      operation.message = {
        messageid: e.message,
        values: e.payload && e.payload.values
      }
    } else {
      operation.message = {
        messageid: "OPERATION_SYSTEM_ERROR",
        values: {
          message: e.message,
          error: e.toString()
        }
      }
    }

    await Utils.update(operation, {
      status: Status.ERROR,
      visibility: "notify"
    }, cxt);

    if (onError) {
      await onError(operation, cxt);
    }

  } finally {
    if (onCompleted) {
      await onCompleted(operation, cxt);
    }
  }

}

const operationFunction = async (cxt) => {
  return await Promise.all([control(cxt), executor(cxt)]);
}

export const start = async (parent, {
  operationid,
  handlers = {},
  mapper,
  data = {},
  config: userConfig
}, opFn, cxt) => {

  const config = userConfig || cxt.operationConfig;

  const operation = await Utils.create(parent, {
    operationid,
    data,
    mapper,
    handlers,
    config,
    opFn
  }, cxt);

  operationFunction({
    ...cxt,
    operation
  }).then(inp => {
    console.log("OPERATION FINISH")
  }).catch(e => {
    console.log("OPERATION ERROR: " + e.toString())
  });

  return operation;
}
