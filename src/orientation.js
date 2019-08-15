import React, { Component } from 'react';
import $ from 'jquery';
//import img from './images/RedSquare.jpg';
import img from './images/demo.jpg'
import './redeye/RedEye.css';
import * as utils from './redeye/RedEyeCorrect.js';
import * as imageEditorLauncher from './js/imageEditorLauncher.js';

import PropTypes from 'prop-types';
import 'cropperjs/dist/cropper.css';
import Cropper from './react-cropper';
import ReactCropper from './ReactCropperJS';
// shift + alt + F

class Orientation extends Component {
    constructor(props) {
        super(props);
        this.state = { 'isFlipped': false };
        this.state = { 'isMirror': false };
        this.state = {
            src: img,
            cropResult: img,
            cropRatio: 16 / 9,
            orientationOperation: null
        };
    }
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
    rotateLeft() {

    }
    flipOrientation(param, e) {
        this.setState({
            orientationOperation: 'flip ' + param
        });

        if (param == 'vertical') {
            if(this.state.isFlipped)
            {
                this.setState({ 'isFlipped': false });
                this.refs.cropper.scaleY(1);
            }
            else
            {
                this.setState({ 'isFlipped': true });
                this.refs.cropper.scaleY(-1);
            }           

        } else {
            if(this.state.isMirror)
            {
                this.setState({ 'isMirror': false });
                this.refs.cropper.scaleX(1);
            }
            else
            {
                this.setState({ 'isMirror': true });
                this.refs.cropper.scaleX(-1);
            }
        }


    }
    changeRotation(param, e) {
        this.setState({
            orientationOperation: 'rotate ' + param
        });
        var rotatedImage = this.refs.cropper.rotate(param);

    }
    changeCropRatio(param, e) {
        this.setState({
            cropRatio: this.props.aspectRatio
        });
        this.cropper.setAspectRatio(param);
    }
    crop = (event) => {
        let details = document.querySelector('.crop-details');
        details.innerHTML = JSON.stringify(event.detail, null, 2);
    
        const myImage = this.refs.image
      }
      cropImg(event) {
        var canvas = $("#imgEditorCanvas"),
          context = canvas.get(0).getContext("2d"),
          $result = $('#result');

          var myCanvas = this.refs.cropper.getCroppedCanvas().toDataURL();
          var size = $( ".cropper-canvas" );
          const croppedCanvas = this.refs.myCroppedCanvas
          croppedCanvas.height = size[0].clientHeight;
          croppedCanvas.width = size[0].clientWidth; 

          document.getElementById("myCroppedCanvas").src=myCanvas;
        //var croppedImageDataURL = canvas.cropper('getCroppedCanvas').toDataURL("image/png");
        //$result.append($('<img>').attr('src', croppedImageDataURL));
      }
    cropImage() {
        if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
            return;
        }
        this.setState({
            cropResult: this.cropper.getCroppedCanvas().toDataURL(),
        });
    }
    getCroppedCanvasTest() {
        //var canvas = this.cropper.getCroppedCanvas();
    }
    onChange(e) {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            this.setState({ src: reader.result });
        };
        reader.readAsDataURL(files[0]);
    }
    componentWillMount() {
        
    }
    componentDidMount() {
        utils.setupPage();
        $('#hidEditorType').val("redeye");
        const myImage = document.getElementById("imgPreviewImage");
        imageEditorLauncher.resizePreviewImageToFitWindow(myImage);
        imageEditorLauncher.setupRotatePage();
        this.refs.cropper.clear();
        this.refs.cropper.disable();
    }
    componentDidUpdate() {
        this.refs.cropper.clear();
        //this.refs.cropper.disable();
    }
    render() {
        // The image 
        const imageStyle = {
            maxHeight: 600,
            margin: '0 auto',
            padding: 30,
            display: 'none'
        };
        const canvasStyle = {
            maxHeight: 600,
            margin: '0 auto',
        };
        const buttonStyle = {
            maxHeight: 600,
            margin: '0 auto'
        };
        const redEyeBrush = {
            width: 210,
            height: 60,
            position: 'relative'
        };
        const croppedCanvas = {
            marginTop: '-21%',
            marginRight: '15%',
            float: 'right',
            position: 'relative'
        }
        return (
            <div class="redeye-tool">
                <div id="divCropper">
                    <div className="cropperjs-wrapper">
                        <div className="preview-container">
                            <div className="crop-preview crop-preview__normal"></div>
                            <div className="crop-preview crop-preview__smaller"></div>
                            <pre className="crop-details"></pre>
                        </div>
                        <ReactCropper ref="cropper" {...this.cropperProps} crop={this.crop} />
                    </div>
                </div>
                <div id="rotationButtons" class="btn-group">
                    <div>
                        <button type="button" class="btn btn-rotate" data-method="rotate" data-option="-90" title="Rotate Left" onClick={(e) => this.changeRotation('-90', e)}>
                            <span class="docs-tooltip" data-toggle="tooltip" title="cropper.rotate(-90)">
                                <span class="rotate-left-icon"></span>
                            </span>
                        </button>
                        &nbsp;&nbsp;
                                            <button type="button" class="btn btn-rotate" data-method="rotate" data-option="90" title="Rotate Right" onClick={(e) => this.changeRotation('90', e)}>
                            <span class="docs-tooltip" data-toggle="tooltip" title="cropper.rotate(90)">
                                <span class="rotate-right-icon"></span>
                            </span>
                        </button>
                    </div>
                    <div>
                        <label class="rotate-text">Rotate</label>
                    </div>
                </div>
                <div id="flipButtons" class="btn-group">
                    <div>
                        <button type="button" class="btn btn-flip" data-method="scaleY" data-option="-1" title="Flip Vertical" onClick={(e) => this.flipOrientation('vertical', e)}>
                            <span class="docs-tooltip" data-toggle="tooltip" title="cropper.scaleY(-1)">
                                <span class="flip-vertical-icon"></span>
                            </span>
                        </button>
                        &nbsp;&nbsp;
                                            <button type="button" class="btn btn-flip" data-method="scaleX" data-option="-1" title="Flip Horizontal" onClick={(e) => this.flipOrientation('horizontal', e)}>
                            <span class="docs-tooltip" data-toggle="tooltip" title="cropper.scaleX(-1)">
                                <span class="flip-horizontal-icon"></span>
                            </span>
                        </button>
                    </div>
                    <div>
                        <label class="mirror-text">Mirror</label>
                    </div>
                    <input type="hidden" value="" id="cropClear" />
                </div>
                <div>
                    <input type="hidden" ref="redEyeCursorSize" id="redEyeCursorSize" value="" />
                    <input type="hidden" ref="redEyeTransformationsScale" id="redEyeTransformationsScale" value="" />
                </div>
            </div>
        );
    }
}

export default Orientation;
