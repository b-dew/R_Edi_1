import React from 'react';
import demoImage from './images/car.jpg';
import * as utils from './filter/filterFunctions.js';
import * as imageEditorLauncher from './js/imageEditorLauncher.js';

class Adjust extends React.Component {
  constructor(props) {
    super(props);       
} 

componentDidMount() {
  window.$('#hidEditorType').val("adjust");
 
  const myImage = document.getElementById("imgPreviewImage");
  imageEditorLauncher.resizePreviewImageToFitWindow(myImage);
  
  utils.onAdjustPageLoad();
}

applyAdjustFilter(e) {
    e.preventDefault();
    utils.ApplyAdjustFilter();  
}

saveImage(e) {
  e.preventDefault();
  utils.SaveImageAdjust();   
}

  render() {
    const imageStyle = {
      margin: '0 auto',
      display: 'none'
    };
    const canvasStyle = {
      margin: '0 auto',
      padding: 30
    };
    return (
      <div id="divAdjust">
        <div class="img-container">
        <canvas ref="displayCanvas" style={canvasStyle} width={720} height={488} id="adjustCanvas" />
        <input type="hidden" name="hidAdjustmentSelected" id="hidAdjustmentSelected" />   
        </div> 
        <div id="divAdjustSliders" class="adjust-slider">
          <div class="sliders adjust-slider-content">
            <div class="col-xs-12 col-sm-6 col-md-4"><span class="slider-text">Brightness</span><input type="range" class="adjust-slider" min="-100" max="100" step="1" defaultValue ="0" id="Brightness" name="Brightness" onChange={(e) => this.applyAdjustFilter(e)} /></div>  
            <div class="col-xs-12 col-sm-6 col-md-4"><span class="slider-text">Saturation</span><input type="range" class="adjust-slider" min="-100" max="100" step="1" defaultValue ="0" id="Saturation" name="Saturation" onChange={(e) => this.applyAdjustFilter(e)} /></div>
            <div class="col-xs-12 col-sm-6 col-md-4"><span class="slider-text">Sepia</span><input type="range" class="adjust-slider" min="0" max="100" step="1" defaultValue ="0" id="Sepia" name="Sepia" onChange={(e) => this.applyAdjustFilter(e)} /></div>
            <div class="col-xs-12 col-sm-6 col-md-4"><span class="slider-text">Contrast</span><input type="range" class="adjust-slider" min="-100" max="100" step="1" defaultValue ="0" id="Contrast" name="Contrast" onChange={(e) => this.applyAdjustFilter(e)} /></div>
            <div class="col-xs-12 col-sm-6 col-md-4"><span class="slider-text">Exposure</span><input type="range" class="adjust-slider" min="-100" max="100" step="1" defaultValue ="0" id="Exposure" name="Exposure" onChange={(e) => this.applyAdjustFilter(e)} /></div>
            <div class="col-xs-12 col-sm-6 col-md-4"><span class="slider-text">Gamma</span><input type="range" class="adjust-slider" min="0" max="10" step="0.1" defaultValue ="0" id="Gamma" name="Gamma" onChange={(e) => this.applyAdjustFilter(e)} /></div>
            <div class="col-xs-12 col-sm-6 col-md-4"><span class="slider-text">Vibrance</span><input type="range" class="adjust-slider" min="-100" max="100" step="1" defaultValue ="0" id="Vibrance" name="Vibrance" onChange={(e) => this.applyAdjustFilter(e)} /></div>
            <div class="col-xs-12 col-sm-6 col-md-4"><span class="slider-text">Hue</span><input type="range" class="adjust-slider" min="0" max="100" step="1" defaultValue ="0" id="Hue" name="Hue" onChange={(e) => this.applyAdjustFilter(e)} /></div>
            <div class="col-xs-12 col-sm-6 col-md-4"><span class="slider-text">Noise</span><input type="range" class="adjust-slider" min="0" max="100" step="1" defaultValue ="0" id="Noise" name="Noise" onChange={(e) => this.applyAdjustFilter(e)} /></div>
            <div class="col-xs-12 col-sm-6 col-md-4"><span class="slider-text">Sharpen</span><input type="range" class="adjust-slider" min="0" max="100" step="1" defaultValue ="0" id="Sharpen" name="Sharpen" onChange={(e) => this.applyAdjustFilter(e)} /></div>
            <div class="col-xs-12 col-sm-6 col-md-4"><span class="slider-text">Clip</span><input type="range" class="adjust-slider" min="0" max="100" step="1" defaultValue ="0" id="Clip" name="Clip" onChange={(e) => this.applyAdjustFilter(e)} /></div>
            <div class="col-xs-12 col-sm-6 col-md-4"><span class="slider-text">Blur</span><input type="range" class="adjust-slider" min="0" max="20" step="1" defaultValue ="0" id="Blur" name="Blur" onChange={(e) => this.applyAdjustFilter(e)} /></div>                             
          </div>
        </div>

      <br /> <br />
      <button onClick={(e) => this.saveImage(e)}>Save Image</button>
           
      <br /> <br /> <br /> <br />                            
      
      </div>
    );
  }
}

export default Adjust;
