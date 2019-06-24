import _ from 'lodash'
import {
  OPERATION_TABLE,
  OPERATION_INDEX
} from '../query'

export const remove = ({
  operationid
}, {}, cxt) => {
  const idx = _.findIndex(OPERATION_TABLE, {
    operationid
  });

  if (idx !== -1) {
    OPERATION_TABLE.slice(idx, 1);
  }

  OPERATION_INDEX[operationid] = null;
}
