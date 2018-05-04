import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as cornerstone from "cornerstone-core";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneTools from "cornerstone-tools";
import * as dicomParser from 'dicom-parser';
import Hammer from "hammerjs";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";


import { addDicomThunk, changeSaveCounter  } from '../store'

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

var config = {
    webWorkerPath: '/dist/cornerstoneWADOImageLoaderWebWorker.js',
    taskConfiguration: {
        'decodeTask': {
            initializeCodecsOnStartup: true,
            codecsPath: '/dist/cornerstoneWADOImageLoaderCodecs.min.js'
        }
    }
};

const divStyle = {
    width: "512px",
    height: "512px",
    position: "relative",
    color: "white"
};

cornerstoneWADOImageLoader.webWorkerManager.initialize(config)

class ImageUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewport: cornerstone.getDefaultViewport(null, undefined),
            loaded: false,
            patientId: '',
            studyId: '',
            studyDesc: '',
            save: false
        }
        this.loadAndViewImage = this.loadAndViewImage.bind(this)
        this.handleImageRender = this.handleImageRender.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }


    componentDidMount() {
        const element = this.element
        cornerstone.enable(element)

        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(this.props.file)
       
        //found an event handler cornerstone has for when the image renders
        //Used the event handler to handle when the image fully renders on the canvas
       
        element.addEventListener('cornerstoneimagerendered', this.handleImageRender)
        console.log('imageID here : ', imageId)
        this.loadAndViewImage(imageId);
    }

    componentWillUnmount() {

        //unmount happens when save button in USERHOME component is clicked
        this.handleSave()
        
        const element = this.element
        console.log('hi, componentWillUnmount')
        element.removeEventListener("cornerstoneimagerendered", this.handleImageRender)
        cornerstone.disable(element)
    }


    /*
       upon full image render on Canvas:
       add to savecounter's counter in the redux store
   */

    handleImageRender() {
       this.props.handleSaveCounterChange()
    }


     /*
       When this function is called
       get canvas's data in 64byte encoding 
       through toDataURL obtain important looking 
       header information and make an axios post to 
       the database
   */
    handleSave() {
        let canvas = this.canvas
        let dataURL = canvas.toDataURL()
        let dicomInfo = {
            image: dataURL,
            studyDesc: this.state.studyDesc,
            patientId: this.state.patientId,
            studyId: this.state.studyId
        }
        this.props.handleAddDicom(dicomInfo)
    }


    loadAndViewImage(imageId) {
        const element = this.element
        const start = new Date().getTime();
        cornerstone.loadImage(imageId).then((image) => {
            console.log(image);
            const viewport = cornerstone.getDefaultViewportForImage(element, image);
            this.setState({ viewport })
            cornerstone.displayImage(element, image, viewport)
            if (this.state.loaded === false) {
                console.log(image.minPixelValue, image.maxPixelValue)
                this.setState({ loaded: true })
            }

            this.setState({
                patientId: image.data,
                studyDesc: image.data.string('x00081030'),
                patientId: image.data.string('x00100020'),
                studyId: image.data.string('x00200010')
            })
        })
            .catch(console.error)
    }

    render() {
        return (
            <div>
                <div className='buttons-left'>
                </div>
                <div className='dicom-info'>
                    <div
                        className='viewportElement'
                        style={divStyle}
                        ref={input => {
                            this.element = input
                        }}
                    >
                        <canvas className="cornerstone-canvas" ref={input => { this.canvas = input }} />
                    </div>
                    <div >
                        {this.state.patientId && <ul className='dicom-info-string' >
                            <div>
                                <span className='dicom-info-label'>Study Description:</span>
                                <li>{this.state.studyDesc}</li>
                            </div>
                            <div>
                                <span className='dicom-info-label'>Patient Id: </span>
                                <li>{this.state.patientId}</li>
                            </div>
                            <div>
                                <span className='dicom-info-label'>Study Id: </span>
                                <li>{this.state.studyId}</li>
                            </div>
                        </ul>}
                    </div>
                </div>
            </div>
        )
    }
}


const mapState = (state) => {
    return {

    }
}

const mapDispatch = (dispatch) => {
    return {
        handleAddDicom(dicomInfo) {
            dispatch(addDicomThunk(dicomInfo))
        },
        handleSaveCounterChange(){
            dispatch(changeSaveCounter())
        }
    }
}

export default connect(mapState, mapDispatch)(ImageUpload)