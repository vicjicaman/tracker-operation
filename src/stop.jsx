import _ from 'lodash'
import * as Query from './query'

export const stop = (operation, {}, cxt) => {
  if (operation) {
    operation.status = Query.status.STOP;
  }
}
