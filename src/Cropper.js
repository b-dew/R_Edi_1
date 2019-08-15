import React, { Component } from 'react';
import $ from 'jquery';
//import img from './images/RedSquare.jpg';
import img from './images/demo.jpg'
import './redeye/RedEye.css';
import * as utils from './redeye/RedEyeCorrect.js';
import * as cropperUtils from './cropper/cropperFunctions.js';
import * as imageEditorLauncher from './js/imageEditorLauncher.js';
import PropTypes from 'prop-types';
import 'cropperjs/dist/cropper.css';
import Cropper from './react-cropper';
import ReactCropper from './ReactCropperJS';
// shift + alt + F

class Orientation extends Component {
    constructor(props) {
        super(props);
        this.state = {

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
    cropImg(event) {
        var canvas = $("#imgEditorCanvas"),
            context = canvas.get(0).getContext("2d"),
            $result = $('#result');
        $('#hidIsImageCropped').val('true');

        var myCanvas = this.refs.cropper.getCroppedCanvas().toDataURL();
        var size = $(".cropper-canvas");
        document.getElementById("imgPreviewImage").src = myCanvas;

        this.setState({ 'isCropperVisible': false });
        $("#hidEditorType").val("master");
        $('#imageEditorCropOptions').addClass('imageEditorHeaderDisplay');
        $('#cropDiv').removeClass('imageEditorHeaderDisplay');
        $('#orientationDiv').removeClass('imageEditorHeaderDisplay');
        $('#redEyeDiv').removeClass('imageEditorHeaderDisplay');
        $('#filterDiv').removeClass('imageEditorHeaderDisplay');
        $('#adjustDiv').removeClass('imageEditorHeaderDisplay');
        $('#editorSave').removeClass('imageEditorHeaderDisplay');

        $("#divPreviewImage").show();
        $("#divCropper").hide();
    }
    changeCrop(width, height) {
        this.refs.cropper.setAspectRatio(height / width);
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
    componentDidMount() {
        const myImage = document.getElementById("imgPreviewImage");
        imageEditorLauncher.resizePreviewImageToFitWindow(myImage);
        imageEditorLauncher.setupRotatePage();

        $("#divPreviewImage").hide();
        $("#divCropper").show();
    }
    componentDidUpdate() {
        let editor = $('#hidEditorType').val();
        if (editor == 'cropper') {
            //this.refs.cropper.clear();
            // this.refs.cropper.disable();
            const myImage = document.getElementById("imgPreviewImage");
            this.refs.cropper.reset();
            this.refs.cropper.replace(myImage.src);
            imageEditorLauncher.resizePreviewImageToFitWindow(myImage);
            imageEditorLauncher.setupRotatePage();

            $("#divPreviewImage").hide();
            $("#divCropper").show();
        }
    }
    onClickCropApply() {

        this.cropImg();
        this.setState({ 'isCropperVisible': false });
        $("#hidEditorType").val("master");
        $('#imageEditorCropOptions').addClass('imageEditorHeaderDisplay');
        $('#cropDiv').removeClass('imageEditorHeaderDisplay');
        $('#orientationDiv').removeClass('imageEditorHeaderDisplay');
        $('#redEyeDiv').removeClass('imageEditorHeaderDisplay');
        $('#filterDiv').removeClass('imageEditorHeaderDisplay');
        $('#adjustDiv').removeClass('imageEditorHeaderDisplay');
        $('#editorSave').removeClass('imageEditorHeaderDisplay');

        $("#divPreviewImage").show();
        $("#divCropper").hide();
        this.refs.cropper.reset();
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
        const cropRatios = {
            display: 'inline-flex'
        }
        return (
            <div id="divCropper">
                <div class="">
                    <div class="docs-buttons modal-editor-save-div " onClick={(e) => { this.onClickCropApply(e) }}>
                        <input type="button" id="applyCropBtn" value="Apply" class="modal-editor-button-primary" />
                    </div>
                </div>
                <div class="crop-tool">
                    <div id="CropperCanvas">
                        <div className="cropperjs-wrapper">
                            <ReactCropper ref="cropper" {...this.cropperProps} crop={this.crop} />
                        </div>
                    </div>
                    <div id="rotationButtons" class="btn-group">
                        <div style={cropRatios}>
                            <div>
                                <button type="button" class="btn btn-rotate" onClick={(e) => this.changeCrop(10, 10)}>
                                    <span class="docs-tooltip" data-toggle="tooltip" title="squareCrop">Square
                            </span>
                                </button>
                            </div>
                            <div>
                                <button type="button" class="btn btn-rotate" onClick={(e) => this.changeCrop(2, 3)}>
                                    <span class="docs-tooltip" data-toggle="tooltip" title="squareCrop">2x3
                            </span>
                                </button>
                            </div>
                            <div>
                                <button type="button" class="btn btn-rotate" onClick={(e) => this.changeCrop(3, 5)}>
                                    <span class="docs-tooltip" data-toggle="tooltip" title="squareCrop">3x5
                            </span>
                                </button>
                            </div>
                            <div>
                                <button type="button" class="btn btn-rotate" onClick={(e) => this.changeCrop(3, 4)}>
                                    <span class="docs-tooltip" data-toggle="tooltip" title="squareCrop">3x4
                            </span>
                                </button>
                            </div>
                            <div>
                                <button type="button" class="btn btn-rotate" onClick={(e) => this.changeCrop(4, 5)}>
                                    <span class="docs-tooltip" data-toggle="tooltip" title="squareCrop">4x5
                            </span>
                                </button>
                            </div>
                            <div>
                                <button type="button" class="btn btn-rotate" onClick={(e) => this.changeCrop(4, 6)}>
                                    <span class="docs-tooltip" data-toggle="tooltip" title="squareCrop">4x6
                            </span>
                                </button>
                            </div>
                            <div>
                                <button type="button" class="btn btn-rotate" onClick={(e) => this.changeCrop(5, 7)}>
                                    <span class="docs-tooltip" data-toggle="tooltip" title="squareCrop">5x7
                            </span>
                                </button>
                            </div>
                            <div>
                                <button type="button" class="btn btn-rotate" onClick={(e) => this.changeCrop(8, 10)}>
                                    <span class="docs-tooltip" data-toggle="tooltip" title="squareCrop">10x8
                            </span>
                                </button>
                            </div>
                            <div>
                                <button type="button" class="btn btn-rotate" onClick={(e) => this.changeCrop(9, 16)}>
                                    <span class="docs-tooltip" data-toggle="tooltip" title="squareCrop">16x9
                            </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <input type="hidden" ref="redEyeCursorSize" id="redEyeCursorSize" value="" />
                        <input type="hidden" ref="redEyeTransformationsScale" id="redEyeTransformationsScale" value="" />
                    </div>
                </div>
            </div>
        );
    }
}

export default Orientation;
