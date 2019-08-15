import React from 'react';

class SaveEditor extends React.Component {
  constructor(props) {
    super(props);       
} 

componentDidMount() {
    
}


  render() {
    return (
        <div id="modalEditSaveNewEditor">
        <div class="vertical-alignment-helper">
            <div class="vertical-align-center">
                <div class="popup">
                    <img class="close-modal" id="imgCloseOnSaveModal" src="/css/i/popup-close.svg" onClick={this.props.close} />
                    <div id="modalEditSaveNewEditorMessage" class="modal-message">How would you like to save your edited image?</div>
                    <br />
                    <br />
                    <input type="button" id="btnSaveACopyNewEditor" value="Save as a Copy" class="btn btn-save-copy" onClick={this.props.saveAsACopy} />
                    <input type="button" id="btnOverwriteOriginalNewEditor" value="Overwrite Original" class="btn btn-save-orig" onClick={this.props.overwriteOriginal} />
                </div>
            </div>
        </div>
        </div>
    );
  }
}

export default SaveEditor;
