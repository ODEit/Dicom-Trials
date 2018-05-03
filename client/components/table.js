import React, {Component} from 'react'
import {connect} from 'react-redux'

import {getDicomsThunk} from '../store'

class Table extends Component{
    constructor(props){
        super(props)
    }

    componentDidMount(){
        this.props.handleGetDicoms()
    }

    render(){
    return(
        <div className = 'table-container'>
        <div className = 'dicom-grid table-header'>
            <div>Image</div>
            <div>Study Description</div>
            <div>Study Id</div>
            <div>Patient Id</div>
        </div>
            {this.props.dicoms.length && this.props.dicoms.map((dicom,key) => {
                return(
                    <div key = {key} className = 'dicom-grid'>
                        <img className = 'thumbnail' src = {dicom.imageURL}></img>
                        <div>{dicom.studyDesc}</div> 
                        <div>{dicom.studyId}</div>
                        <div>{dicom.patientId}</div>
                    </div>
                )
            })}
        </div>
    ) 
    }
}
const mapState = (state) =>{
    return{
        dicoms: state.dicom.dicoms
    }
}
const mapDispatch = dispatch => {
    return{
    handleGetDicoms(){
        dispatch(getDicomsThunk())
    }   
    }
}

export default connect(mapState, mapDispatch)(Table)