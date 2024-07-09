import { createSlice } from '@reduxjs/toolkit'

const initialState = { content: '', isError: false }

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showSuccessNotification(state, action) {
      console.log('contenido: ', action)
      return { content: action.payload, isError: false }
    },

    showErrorNotification(state, action) {
      return { content: action.payload, isError: true }
    },

    resetNotification(state, action) {
      return initialState
    },
  },
})

export const {
  showSuccessNotification,
  showErrorNotification,
  resetNotification,
} = notificationSlice.actions

// Time is supposed to be in seconds
export const setSuccessNotification = (content, time) => {
  return (dispatch) => {
    console.log('Entro a settear succeso')
    dispatch(showSuccessNotification(content))

    setTimeout(() => {
      dispatch(resetNotification(content))
    }, time * 1000)
  }
}

export const setErrorNotification = (content, time) => {
  return (dispatch) => {
    dispatch(showErrorNotification(content))

    setTimeout(() => {
      dispatch(resetNotification(content))
    }, time * 1000)
  }
}

export default notificationSlice.reducer
