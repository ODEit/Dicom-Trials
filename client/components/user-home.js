import React from 'react'

import ImageUpload from './ImageUpload'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
/**
 * COMPONENT
 */
export const UserHome = (props) => {
  const {email} = props

  return (
    <div>
      <h3>Welcome, {email}! Time to parse some DICOM!</h3>
      <ImageUpload/>
     </div>
  )
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}

