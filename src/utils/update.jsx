import _ from 'lodash'
import {
  status as Status
} from '../query'
import * as EventApi from 'Api/system/events'

const updateEvent = (operation, cxt) => {

  const {
    operationid,
    status,
    visibility,
    config,
    mapper,
    data,
    message
  } = operation;

  EventApi.send('commands', {
    event: 'operation.update',
    payload: {
      operationid,
      status,
      visibility,
      config,
      data: mapper ?
        mapper(operation) : null,
      message
    }
  }, cxt);

}

export const update = (curr, {
  status,
  visibility
}, cxt) => {

  if (status !== undefined) {
    curr.status = status;
    if (status === Status.FINISH) {
      curr.finishedOn = new Date();
    }
  }

  if (visibility !== undefined) {
    curr.visibility = visibility;
  }

  updateEvent(curr, cxt);
  return true;
}
