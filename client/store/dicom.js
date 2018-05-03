import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_DICOMS = 'GET_DICOMS'
const REMOVE_DICOM = 'REMOVE_DICOM'
const ADD_DICOM = 'ADD_DICOM'

/**
 * INITIAL STATE
 */
const dicom = {
    dicoms: []
}

/**
 * ACTION CREATORS
 */
const getDicoms = (dicoms) => ({type: GET_DICOMS, dicoms})
const removeDicom = (id) => ({type: REMOVE_DICOM, id})
const addDicom = (dicom) => ({type: ADD_DICOM, dicom})

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
         dispatch(addDicom(res.data)))
         .catch(err => console.log(err))

/**
 * REDUCER
 */
export default function (state = dicom, action) {
  switch (action.type) {
    case GET_DICOMS:
        console.log(action.dicoms)
      return Object.assign({}, state, {dicoms : action.dicoms})
    case ADD_DICOM:
      return Object.assign({}, state, {dicoms : state.dicoms.concat(action.dicom)})
    default:
      return state
  }
}
