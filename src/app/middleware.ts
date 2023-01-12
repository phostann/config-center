import { message } from 'antd'
import { isRejectedWithValue, Middleware, MiddlewareAPI } from '@reduxjs/toolkit'

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (isRejectedWithValue(action)) {
    void (async () => {
      await message.error(action.payload.data)
    })()
  }

  return next(action)
}
