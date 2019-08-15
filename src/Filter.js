import React from 'react';
import demoImage from './images/car.jpg';
import * as utils from './filter/filterFunctions.js';
import './filter/slick-theme.css';
import './filter/slick.css';
import './filter/filter.css';
import * as imageEditorLauncher from './js/imageEditorLauncher.js';

class Filter extends React.Component {
  constructor(props) {
    super(props);       
} 

componentDidMount() {
  window.$('#hidEditorType').val("filter");

  const myImage = document.getElementById("imgPreviewImage");
  imageEditorLauncher.resizePreviewImageToFitWindow(myImage);

  utils.onFilterPageLoad();
}

applyFilter(filter, e) {
    e.preventDefault();
    utils.ApplyFilter(filter);  
    window.$(e.target).addClass("filterSelected");  
}

resetFilter(e) {
  e.preventDefault();
  utils.ResetFilter();   
}

saveImage(e) {
  e.preventDefault();
  utils.SaveImageFilter();   
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
      <div id="divFilter">
        <div class="img-container">   
          <canvas ref="displayCanvas" style={canvasStyle} width={720} height={488} id="filterCanvas" />  
          <input type="hidden" name="hidFilterSelected" id="hidFilterSelected" />
        </div>   
      <div class="responsive-img-slider">
        <div>
          <div>
            <canvas id="originalBtn" class="filterThumbnail" data-caman-hidpi-disabled="true" width={100} height={100} onClick={(e) => this.resetFilter(e)} />
          </div>
          <div class="filterTitle">Original</div>
        </div>
        <div>
          <div>
            <canvas id="vintageBtn" class="filterThumbnail" data-caman-hidpi-disabled="true" width={100} height={100} onClick={(e) => this.applyFilter('vintage',e)} />
          </div>
          <div class="filterTitle">Vintage</div>
        </div>
        <div>
          <div>
            <canvas id="lomoBtn" class="filterThumbnail" data-caman-hidpi-disabled="true" width={100} height={100} onClick={(e) => this.applyFilter('lomo', e)} />
          </div>
          <div class="filterTitle">Lomo</div>
        </div>
        <div>
          <div>
            <canvas id="clarityBtn" class="filterThumbnail" data-caman-hidpi-disabled="true" width={100} height={100} onClick={(e) => this.applyFilter('clarity', e)} />
          </div>
          <div class="filterTitle">Clarity</div>
        </div>
        <div>
          <div>
            <canvas id="sincityBtn" class="filterThumbnail" data-caman-hidpi-disabled="true" width={100} height={100} onClick={(e) => this.applyFilter('sinCity', e)} />
          </div>
          <div class="filterTitle">Sin City</div>
        </div>
        <div>
          <div>
            <canvas id="sunriseBtn" class="filterThumbnail" data-caman-hidpi-disabled="true" width={100} height={100} onClick={(e) => this.applyFilter('sunrise', e)} />
          </div>
          <div class="filterTitle">Sunrise</div>
        </div>
        <div>
          <div>
            <canvas id="crossProcessBtn" class="filterThumbnail" data-caman-hidpi-disabled="true" width={100} height={100} onClick={(e) => this.applyFilter('crossProcess', e)} />
          </div>
          <div class="filterTitle">Cross Process</div>
        </div>
        <div>
          <div>
            <canvas id="orangePeelBtn" class="filterThumbnail" data-caman-hidpi-disabled="true" width={100} height={100} onClick={(e) => this.applyFilter('orangePeel', e)} />
          </div>
          <div class="filterTitle">Orange Peel</div>
        </div>
        <div>
          <div>
            <canvas id="loveBtn" class="filterThumbnail" data-caman-hidpi-disabled="true" width={100} height={100} onClick={(e) => this.applyFilter('love', e)} />
          </div>
          <div class="filterTitle">Love</div>
        </div>
        <div>
          <div>
            <canvas id="grungyBtn" class="filterThumbnail" data-caman-hidpi-disabled="true" width={100} height={100} onClick={(e) => this.applyFilter('grungy', e)} />
          </div>
          <div class="filterTitle">Grungy</div>
        </div>
        <div>
          <div>
            <canvas id="jarquesBtn" class="filterThumbnail" data-caman-hidpi-disabled="true" width={100} height={100} onClick={(e) => this.applyFilter('jarques', e)} />
          </div>
          <div class="filterTitle">Jarques</div>
        </div>
        <div>
          <div>
            <canvas id="pinHoleBtn" class="filterThumbnail" data-caman-hidpi-disabled="true" width={100} height={100} onClick={(e) => this.applyFilter('pinhole', e)} />
          </div>
          <div class="filterTitle">Pinhole</div>
        </div>
        <div>
          <div>
            <canvas id="oldBootBtn" class="filterThumbnail" data-caman-hidpi-disabled="true" width={100} height={100} onClick={(e) => this.applyFilter('oldBoot', e)} />
          </div>
          <div class="filterTitle">Old Boot</div>
        </div>
        <div>
          <div>
            <canvas id="glowingSunBtn" class="filterThumbnail" data-caman-hidpi-disabled="true" width={100} height={100} onClick={(e) => this.applyFilter('glowingSun', e)} />
          </div>
          <div class="filterTitle">Glowing Sun</div>
        </div>
        <div>
          <div>
            <canvas id="hazyDaysBtn" class="filterThumbnail" data-caman-hidpi-disabled="true" width={100} height={100} onClick={(e) => this.applyFilter('hazyDays', e)} />
          </div>
          <div class="filterTitle">Hazy Days</div>
        </div>
        <div>
          <div>
            <canvas id="herMajestyBtn" class="filterThumbnail" data-caman-hidpi-disabled="true" width={100} height={100} onClick={(e) => this.applyFilter('herMajesty', e)} />
          </div>
          <div class="filterTitle">Her Majesty</div>
        </div>
        <div>
          <div>
            <canvas id="nostalgiaBtn" class="filterThumbnail" data-caman-hidpi-disabled="true" width={100} height={100} onClick={(e) => this.applyFilter('nostalgia', e)} />
          </div>
          <div class="filterTitle">Nostalgia</div>
        </div>
        <div>
          <div>
            <canvas id="hemingwayBtn" class="filterThumbnail" data-caman-hidpi-disabled="true" width={100} height={100} onClick={(e) => this.applyFilter('hemingway', e)} />
          </div>
          <div class="filterTitle">Hemingway</div>
        </div>
        <div>
          <div>
            <canvas id="concentrateBtn" class="filterThumbnail" data-caman-hidpi-disabled="true" width={100} height={100} onClick={(e) => this.applyFilter('concentrate', e)} />
          </div>
          <div class="filterTitle">Concentrate</div>
        </div>
      </div>
      <br /> <br />
      <button onClick={(e) => this.saveImage(e)}>Save Image</button>
           
      <br /> <br /> <br /> <br />                            
      
      </div>
    );
  }
}

export default Filter;
