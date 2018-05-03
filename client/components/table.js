import React, {Component} from 'react'
import {connect} from 'react-redux'

const Table = (props) =>{

    return(
        <div>
            {/* {props.dicoms.length && props.dicoms.map((dicom,key) => {
                return(
                    <div key = {key}>
                        <span>{dicom.studyDesc}</span>
                        <img src = {dicom.imageURL}></img>
                    </div>
                )
            })} */}
            {/* <img src = 'https://s3.amazonaws.com/dicom-trial/9u5NILUK8gvFCQSmbsWUJ'></img> */}
            <img src = 'https://s3.amazonaws.com/dicom-trial/ppVeucOMHEcf28QBNvu20'></img>
        </div>
    ) 
}

const mapState = (state) =>{
    return{
        dicoms: state.dicom.dicoms
    }
}

export default connect(mapState)(Table)