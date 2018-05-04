import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ImageUpload from './ImageUpload'
import { resetSave } from '../store'

/**
 * COMPONENT
 */
export class UserHome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      files: []
    }
    this.handleFileChange = this.handleFileChange.bind(this)
  }

  handleFileChange(e) {
    e.stopPropagation()
    e.preventDefault()

    // Add the file to the cornerstoneFileImageLoader and get unique
    // number for that file
    const files = Array.from(e.target.files)

    this.setState({ files })
  }


  render() {
    return (
      <div>
        <h3>Welcome, {this.props.email}. When the save button appears you can save your files </h3>
        Select DICOMS : <input onChange={this.handleFileChange} type='file' ref={input => this.input = input} multiple></input>
        {this.state.files.length && this.state.files.length === this.props.saveCounter ? <button onClick={this.props.handleSave.bind(this)}>Save</button> : null}
        {this.state.files.length ? this.state.files.map((file, key) => {
          return (
            <ImageUpload key={key} file={file} />
          )
        }) : null
        }
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    email: state.user.email,
    saveCounter: state.dicom.saveCounter
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleSave() {
      dispatch(resetSave())
      this.input.value = ''
      this.setState({ files: [] })
    }
  }
}


export default connect(mapState, mapDispatch)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}

