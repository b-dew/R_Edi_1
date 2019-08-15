import React from 'react';
import * as imageEditorLauncher from './js/imageEditorLauncher.js';

class CloseSubEditor extends React.Component {
  constructor(props) {
    super(props);       
} 

componentDidMount() {
    
}


  render() {
    return (
      <div id="modalEditImageCloseSubEditor">
        <div class="vertical-alignment-helper">
            <div class="vertical-align-center">
                <div class="popup">
                    <img class="close-modal" src="/css/i/popup-close.svg" onClick={this.props.resume} />
                    <div id="modalEditCloseNewEditorMessage" class="modal-message">Wait! You didn't save your work. Are you certain that you want to close this editor?</div>

                    <input type="button" id="btnCloseSubEditor" value="Close" class="btn btn-close" onClick={this.props.close} />
                    <input type="button" id="btnResumeSubEditor" value="Resume" class="btn btn-resume" onClick={this.props.resume} />
                    <div class="docs-buttons">
                        <input type="button" id="btnApplySubEditorPopup" value="Apply" class="btn btn-save" data-method="getCroppedCanvas" data-option="{ &quot;maxWidth&quot;: 4096, &quot;maxHeight&quot;: 4096 }" />
                    </div>
                    <div id="filterSave">
                        <input type="button" id="applySelectedFilterBtn" value="Apply" class="btn btn-save" onClick={this.props.apply} />
                    </div>
                    <div id="redEyeSave">
                        <input type="button" id="applySelectedRedEyeBtn" value="Apply" class="btn btn-save" onClick={this.props.apply}/>
                    </div>
                    <div id="adjustSave">
                        <input type="button" id="applyAdjustmentBtn" value="Apply" class="btn btn-save" onClick={this.props.apply} />
                    </div>
                    <div id="cropperSave">
                        <input type="button" id="applyCropBtn" value="Apply" class="btn btn-save" onClick={this.props.apply}/>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
  }
}

export default CloseSubEditor;
