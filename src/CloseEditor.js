import React from 'react';

class CloseEditor extends React.Component {
  constructor(props) {
    super(props);       
} 

componentDidMount() {
    
}


  render() {
    return (
        <div id="modalEditCloseNewEditor">
            <div class="vertical-alignment-helper">
                <div class="vertical-align-center">
                    <div class="popup">
                        <img class="close-modal" src="/css/i/popup-close.svg" onClick={this.props.close} />
                        <div class="modal-message">Wait! You didn't save your work. Are you certain that you want to close this editor?</div>

                        <input type="button" id="btnClose" value="Close" class="btn btn-close" onClick={this.props.close} />
                        <input type="button" id="btnResume" value="Resume" class="btn btn-resume" onClick={this.props.resume} />
                        <input type="button" id="btnSave" value="Save" class="btn btn-save" onClick={this.props.save} />
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default CloseEditor;
