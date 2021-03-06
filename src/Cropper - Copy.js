/*
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ReactCropper from './ReactCropperJS';
import './scss/styles.scss';
import img from './images/demo.jpg'

class Cropper extends Component {
    // constructor(props) {
    //     super(props);       
    // }  

    // render() {
    //     return (
    //         <div>
    //            This is cropper
    //         </div>
    //     );
    // }

    cropperProps = {
        src: img,
        alt: 'Demo Image',
        // 16:9 ratio
        aspectRatio: (16 / 9),
        guides: true,
        preview: '.crop-preview',
        zoomable: false,
        viewMode: 1,
        // Disable toggling drag mode between "crop" and "move" on doubleclick
        toggleDragModeOnDblclick: false,
        dragMode: 'crop',
        minContainerWidth: 600,
        minContainerHeight: 400,
        minCanvasWidth: 600,
        minCanvasHeight: 400,
        autoCrop: true,
        style: {
          width: '600px',
          height: '400px'
        }
      }
    
      crop = (event) => {
        let details = document.querySelector('.crop-details');
        details.innerHTML = JSON.stringify(event.detail, null, 2);
      }
    
      render() {
        return (
          <div className="cropperjs-wrapper">
            <div className="preview-container">
              <div className="crop-preview crop-preview__normal"></div>
              <div className="crop-preview crop-preview__smaller"></div>
              <h3>Data from event.detail</h3>
              <pre className="crop-details"></pre>
            </div>
            <ReactCropper ref="cropper" {...this.cropperProps} crop={this.crop} />
          </div>
        );
      }
}

export default Cropper;

*/