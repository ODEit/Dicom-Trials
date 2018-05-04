import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {NavLink} from 'react-router-dom'
import {logout} from '../store'

const Navbar = ({ handleClick, isLoggedIn, counter }) => (
  <div>
    <h1>DICOM Uploader</h1>
    <nav>
      {isLoggedIn ? (
        <div className = 'navbar'>
          {/* The navbar will show these links after you log in */}
          <NavLink className = 'navlinks' to="/uploadingCenter">Dicom Upload Center</NavLink>
          <a className = 'navlinks' href="#" onClick={handleClick}>
            Logout
          </a>
          <NavLink className = 'navlinks counter' to ='/dicomTable'>Table <span>{counter ? counter: null} </span></NavLink>
        </div>
      ) : (
        <div className = 'navbar'>
          {/* The navbar will show these NavLinks before you log in */}
          <NavLink className = 'navlinks' to="/login">Login</NavLink>
          <NavLink className = 'navlinks' to="/signup">Sign Up</NavLink>
        </div>
      )}
    </nav>
    <hr />
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
    counter : state.dicom.counter
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
