import React, {Component} from 'react';
import * as cornerstone from "cornerstone-core";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneTools from "cornerstone-tools";
import * as dicomParser from 'dicom-parser';
import Hammer from "hammerjs";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

var config = {
    webWorkerPath : '/dist/cornerstoneWADOImageLoaderWebWorker.js',
    taskConfiguration: {
        'decodeTask' : {
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

export default class ImageUpload extends Component{
constructor(props){
    super(props);
    this.state = {
        files: [],
        viewport: cornerstone.getDefaultViewport(null,undefined),
        loaded: false
    }
    this.handleFileChange = this.handleFileChange.bind(this)
    this.loadAndViewImage = this.loadAndViewImage.bind(this)
    this.handleImageRender = this.handleImageRender.bind(this)
}


componentDidMount(){
    const element = this.element
    cornerstone.enable(element)

    //found an event handler cornerstone has for when the image renders
    //Used the event handler to handle when the image fully renders on the canvas
    element.addEventListener('cornerstoneimagerendered', this.handleImageRender)
}

componentWillUnmount(){
    const element = this.element

    element.removeEventListener("cornerstoneimagerendered", this.handleImageRender)

    cornerstone.disable(element)
}

handleFileChange(e){
        e.stopPropagation()
        e.preventDefault()
  
        // Add the file to the cornerstoneFileImageLoader and get unique
        // number for that file
        const file = e.target.files[0];
        console.log(file)
        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
        console.log('imageID here : ', imageId)
        this.loadAndViewImage(imageId);
}

 /*
    upon full image render on Canvas:
    get its 64byte stream through toDataURL
    obtain important looking header information
    make an axios post in the database
*/

handleImageRender(){
    console.log('here')
    let canvas = this.canvas
    let copy = this.copy
    copy.src = canvas.toDataURL()
}

loadAndViewImage(imageId) {
    const element = this.element
    const start = new Date().getTime();
    cornerstone.loadImage(imageId).then( (image) => {
        console.log(image);
        const viewport = cornerstone.getDefaultViewportForImage(element, image);
        this.setState({viewport})
        cornerstone.displayImage(element, image, viewport)
        if(this.state.loaded === false) {
            console.log(image.minPixelValue, image.maxPixelValue)
            this.setState({loaded : true})
        }
       
        console.log('study description',image.data.string('x00081030'))
        console.log('patients name', image.data.string('x00100010'))
        console.log('patients id', image.data.string('x00100020') )
        console.log('study Id', image.data.string('x00200010'))
    

    })
    .catch(console.error)
}

render(){
    return(
        <div>
            <input type = 'file' id = 'select-file' onChange = {this.handleFileChange}></input>
            <div
            className = 'viewportElement'
            style = {divStyle}
            ref = {input => {
                this.element = input
            }}
            >
                <canvas className = "cornerstone-canvas" ref = {input => {this.canvas = input}}/>
            </div>

            <img className = 'cornerstone-copy' ref = {input => {this.copy = input}}></img>

        </div>
    )
}
}

 