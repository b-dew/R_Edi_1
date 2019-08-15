import React, { Component } from 'react';
import $ from 'jquery';
// import image1 from './images/RedEye.jpg';
import image1 from './images/RedSquare.jpg';
import './redeye/RedEye.css';
import * as utils from './redeye/RedEyeCorrect.js';
import * as imageEditorLauncher from './js/imageEditorLauncher.js';
import scriptLoader from 'react-async-script-loader'
// shift + alt + F

class RedEye extends Component {
  constructor(props) {
    super(props);
  }
  correctRedEye(event) {
    const myCanvas = this.refs.canvas
    const myCtx = myCanvas.getContext("2d")
    const cursorSize = this.refs.redEyeCursorSize;
    var mousePos = utils.onCanvasClick(event, image1, myCtx, myCanvas, cursorSize);
  }
  smallBrush(event) {
    const cursorSize = this.refs.redEyeCursorSize;
    const myCanvas = $('#imgPreviewImage')
    var mousePos = utils.onSmallClick(cursorSize, myCanvas);
  }
  medBrush(event) {
    const cursorSize = this.refs.redEyeCursorSize
    const myCanvas = $('#imgPreviewImage')
    var mousePos = utils.onMedClick(cursorSize, myCanvas);
  }
  largeBrush(event) {
    const cursorSize = this.refs.redEyeCursorSize
    const myCanvas = $('#imgPreviewImage')
    var mousePos = utils.onLargeClick(cursorSize, myCanvas);
  }
  zoomClick(event) {
    const myCanvas = this.refs.canvas
    window.$(myCanvas).panzoom("enable");
    utils.onZoomCLick(myCanvas);
  }
  brushClick(event) {
    const myCanvas = this.refs.canvas
    // $(myCanvas).panzoom("disable");
    utils.onBrushClick(myCanvas);
  }
  componentDidMount() {  
    utils.setupPage();
    $('#hidEditorType').val("redeye");
    const myImage = document.getElementById("imgPreviewImage");
    imageEditorLauncher.resizePreviewImageToFitWindow(myImage);

    $('#imgPreviewImage').addClass('circle24');
    $('#redEyeCursorSize').val("10");
    $('#imageEditorRedEyeOptions').removeClass('circle24');   

    window.$("#imgPreviewImage").panzoom("option", {
      $zoomRange: $(".zoom-range")
    });
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
      // border-radius: 3,
      position: 'relative'
    };
    return (
      <div class="redeye-tool">
        <div id="redEyeButtons" class="btn-group">
          <div onClick={this.brushClick.bind(this)}>
            <div id="redEyeBrush" class="redEyeBrush">
              <div id="redEyeBrushSmall" class="redEyeBrushSmall" onClick={this.smallBrush.bind(this)}>
                <div class="redeye-small-align">
                  <div id="redEyeBrushCircleSmall" class="redeye-brush-circle-small"></div>
                  <label id="redEyeBrushTextSmall" class="redeye-cursor-text">Small</label>
                </div>
              </div>
              <div id="redEyeBrushMed" class="redEyeBrushMed" onClick={this.medBrush.bind(this)}>
                <div class="redeye-med-align">
                  <div id="redEyeBrushCircleMed" class="redeye-brush-circle-med"></div>
                  <label id="redEyeBrushTextMed" class="redeye-cursor-text">Medium</label>
                </div>
              </div>
              <div id="redEyeBrushLg" class="redEyeBrushLg" onClick={this.largeBrush.bind(this)}>
                <div class="redeye-lg-align">
                  <div id="redEyeBrushCircleLg" class="redeye-brush-circle-lg"></div>
                  <label id="redEyeBrushTextLg" class="redeye-cursor-text">Large</label>
                </div>
              </div>
            </div>
          </div>
          <div onClick={this.zoomClick.bind(this)}>
            <div class="redeye-zoom" id="redeye-zoom">
              <div id="redeyeZoomAlign" class="redeye-zoom-align">
                <span id="redeyeZoomText" class="zoom-text redeye-zoom-text">Zoom</span>
                <input type="range" ref="redeyeZoomRange" id="redeyeZoomRange" class="zoom-range zoom-slider zoom-redeye-slider" />
              </div>
            </div>
          </div>
        </div>
        <div>
          <input type="hidden" ref="redEyeCursorSize" id="redEyeCursorSize" value="" />
          <input type="hidden" ref="redEyeTransformationsScale" id="redEyeTransformationsScale" value="" />
        </div>
      </div>
    );
  }
}

export default RedEye;