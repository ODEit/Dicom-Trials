import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_DICOMS = 'GET_DICOMS'
const ADD_DICOM = 'ADD_DICOM'

//For checking if files match to number of components rendered to screen
const CHANGE_SAVE_COUNTER = 'CHANGE_SAVE_COUNTER'
const RESET_SAVE = 'RESET_SAVE'
/**
 * INITIAL STATE
 */
const dicom = {
    dicoms: [],
    counter: 0,
    saveCounter: 0
}

/**
 * ACTION CREATORS
 */

 
const getDicoms = (dicoms) => ({type: GET_DICOMS, dicoms})

// Since the dicoms are recieved upon opening up table component,
// this will just add to counter variable
const addDicom = () => ({type: ADD_DICOM})

//For the save button
export const changeSaveCounter = () => ({type: CHANGE_SAVE_COUNTER})
export const resetSave = () => ({type: RESET_SAVE})
/**
 * THUNK CREATORS
 */
export const getDicomsThunk = () =>
  dispatch =>
    axios.get('/api/dicomInfo')
      .then(res =>
        dispatch(getDicoms(res.data)))
      .catch(err => console.log(err))

export const addDicomThunk = (body) =>
 dispatch =>
        axios.post('/api/dicomInfo', body)
         .then(res =>
         dispatch(addDicom()))
         .catch(err => console.log(err))

/**
 * REDUCER
 */
export default function (state = dicom, action) {
  switch (action.type) {
    case GET_DICOMS:
      return Object.assign({}, state, {dicoms : action.dicoms, counter: 0})
    case ADD_DICOM:
        let counter = state.counter + 1
      return Object.assign({}, state, {counter})
    case RESET_SAVE:
        return Object.assign({}, state, {saveCounter: 0})
    case CHANGE_SAVE_COUNTER:
        console.log('hello')
        let saveCounter = state.saveCounter +1
        return Object.assign({}, state, {saveCounter})
    default:
      return state
  }
}
