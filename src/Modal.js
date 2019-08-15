import React from 'react';
import PropTypes from 'prop-types';
import RedEye from './redeye.js';
import Orientation from './orientation.js';
import CropperWrapper from './Cropper';
import Filter from './Filter';
import * as imageEditorLauncher from './js/imageEditorLauncher.js';
import * as utils from './redeye/RedEyeCorrect.js';
import * as filterUtils from './filter/filterFunctions.js';
import * as cropperUtils from './cropper/cropperFunctions.js';
import Adjust from './Adjust';
import CloseSubEditor from './CloseSubEditor';
import SaveEditor from './SaveEditor';
import CloseEditor from './CloseEditor';
import closeIcon from './images/CloseIcon.svg';
import cropIcon from './images/MaterialIcon - Crop.svg';
import orientationIcon from './images/MaterialIcon - Orientation.svg';
import redEyeIcon from './images/MaterialIcon  - Redeye.svg';
import filterIcon from './images/MaterialIcon  - Photo Filter.svg';
import adjustIcon from './images/MaterialIcon  - Adjust.svg';
import undoIcon from './images/FontAwesome47 1.svg';
import redoIcon from './images/FontAwesome47 2.svg';
import resetIcon from './images/MaterialIcon - Reset.svg';
import './css/ImageEditor.css';
//import myImage from './images/demo.jpg';
import myImage from './images/demo.jpg';
import Cropper from './react-cropper';
import $ from 'jquery';

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.editorType = 'main';
    this.onClickCropper = this.onClickCropper.bind(this);
    this.onClickOrientation = this.onClickOrientation.bind(this);
    this.onClickRedEye = this.onClickRedEye.bind(this);
    this.onClickFilter = this.onClickFilter.bind(this);
    this.onClickAdjust = this.onClickAdjust.bind(this);
    this.closeSubEditor = this.closeSubEditor.bind(this);
    this.resumeSubEditor = this.resumeSubEditor.bind(this);
    this.applySubEditor = this.applySubEditor.bind(this);
    this.closeSave = this.closeSave.bind(this);
    this.saveAsACopy = this.saveAsACopy.bind(this);
    this.overwriteOriginal = this.overwriteOriginal.bind(this);
    this.closeEditor = this.closeEditor.bind(this);
    this.resumeEditor = this.resumeEditor.bind(this);
    this.saveEditor = this.saveEditor.bind(this);
    this.state = { 'isCropperVisible': false };
    this.state = { 'isRedEyeVisible': false };
    this.state = { 'isFilterVisible': false };
    this.state = { 'isAdjustVisible': false };
    this.state = { 'isCloseSubEditorVisible': false };
    this.state = { 'isSaveEditorVisible': false };
    this.state = { 'isCloseEditorVisible': false };
    this.state = { 'isOrientationVisible': false };
  }
  onClickCropper() {
    this.setState({ 'isCropperVisible': true });
    this.setState({ 'isRedEyeVisible': false });
    this.setState({ 'isFilterVisible': false });
    this.setState({ 'isAdjustVisible': false });
    this.setState({ 'isCloseSubEditorVisible': false });
    this.setState({ 'isSaveEditorVisible': false });
    this.setState({ 'isCloseEditorVisible': false });
    this.setState({ 'isOrientationVisible': false });
    this.editorType = 'cropper';
    $('#hidEditorType').val('cropper');
  }

  onClickOrientation() {
    this.setState({ 'isOrientationVisible': true });
    this.setState({ 'isCropperVisible': false });
    this.setState({ 'isRedEyeVisible': false });
    this.setState({ 'isFilterVisible': false });
    this.setState({ 'isAdjustVisible': false });
    this.setState({ 'isCloseSubEditorVisible': false });
    this.setState({ 'isSaveEditorVisible': false });
    this.setState({ 'isCloseEditorVisible': false });
    this.editorType = 'orientation';
  }

  onClickRedEye() {
    this.setState({ 'isRedEyeVisible': true });
    this.setState({ 'isCropperVisible': false });
    this.setState({ 'isFilterVisible': false });
    this.editorType = 'redeye';
    this.setState({ 'isAdjustVisible': false });
    this.setState({ 'isCloseSubEditorVisible': false });
    this.setState({ 'isSaveEditorVisible': false });
    this.setState({ 'isCloseEditorVisible': false });
    this.setState({ 'isOrientationVisible': false });

    const myCanvas = this.refs.imgEditorCanvas;
    const myCtx = myCanvas.getContext("2d")
    myCtx.saveHistory(true);
  }

  onClickFilter() {
    this.setState({ 'isRedEyeVisible': false });
    this.setState({ 'isCropperVisible': false });
    this.setState({ 'isAdjustVisible': false });
    this.setState({ 'isFilterVisible': true });
    this.setState({ 'isOrientationVisible': false });
    this.editorType = 'filter';
    this.setState({ 'isCloseSubEditorVisible': false });
    this.setState({ 'isSaveEditorVisible': false });
    this.setState({ 'isCloseEditorVisible': false });
    $('#hidFilterSelected').val("");
  }
  componentDidUpdate() {
    if (this.props.show) {
      $('#undoDiv').addClass('disabled');
      $('#redoDiv').addClass('disabled');
      $('#resetDiv').addClass('disabled');

      if (this.state.isRedEyeVisible) {
        $('#imageEditorRedEyeOptions').removeClass('imageEditorHeaderDisplay');
        $('#cropDiv').addClass('imageEditorHeaderDisplay');
        $('#orientationDiv').addClass('imageEditorHeaderDisplay');
        $('#redEyeDiv').addClass('imageEditorHeaderDisplay');
        $('#filterDiv').addClass('imageEditorHeaderDisplay');
        $('#adjustDiv').addClass('imageEditorHeaderDisplay');
        $('#editorSave').addClass('imageEditorHeaderDisplay');
      }

      if (this.state.isFilterVisible) {
        $('#imageEditorFilterOptions').removeClass('imageEditorHeaderDisplay');
        $('#cropDiv').addClass('imageEditorHeaderDisplay');
        $('#orientationDiv').addClass('imageEditorHeaderDisplay');
        $('#redEyeDiv').addClass('imageEditorHeaderDisplay');
        $('#filterDiv').addClass('imageEditorHeaderDisplay');
        $('#adjustDiv').addClass('imageEditorHeaderDisplay');
        $('#editorSave').addClass('imageEditorHeaderDisplay');
      }

      if (this.state.isAdjustVisible) {
        $('#imageEditorAdjustOptions').removeClass('imageEditorHeaderDisplay');
        $('#cropDiv').addClass('imageEditorHeaderDisplay');
        $('#orientationDiv').addClass('imageEditorHeaderDisplay');
        $('#redEyeDiv').addClass('imageEditorHeaderDisplay');
        $('#filterDiv').addClass('imageEditorHeaderDisplay');
        $('#adjustDiv').addClass('imageEditorHeaderDisplay');
        $('#editorSave').addClass('imageEditorHeaderDisplay');
      }
      if (this.state.isCropperVisible) {
        $('#imageEditorCropOptions').removeClass('imageEditorHeaderDisplay');
        $('#cropDiv').addClass('imageEditorHeaderDisplay');
        $('#orientationDiv').addClass('imageEditorHeaderDisplay');
        $('#redEyeDiv').addClass('imageEditorHeaderDisplay');
        $('#filterDiv').addClass('imageEditorHeaderDisplay');
        $('#adjustDiv').addClass('imageEditorHeaderDisplay');
        $('#editorSave').addClass('imageEditorHeaderDisplay');
      }

      if (this.state.isCloseSubEditorVisible) {
        imageEditorLauncher.closeEditImageSubEditor();
      }

      if (this.state.isSaveEditorVisible) {
        imageEditorLauncher.saveEditImageNewEditor();
      }

      var loadImage = true;

      if (this.state.isFilterVisible && $('#hidFilterSelected').val() != '') {
        loadImage = false;
      }

      if (this.state.isAdjustVisible && $('#hidAdjustmentSelected').val() != '') {
        loadImage = false;
      }

      if (loadImage) {
        //need to resize the preview image first
        const mmyImage = myImage;
        imageEditorLauncher.resizePreviewImageToFitWindow(mmyImage);

        const canvas = this.refs.imgEditorCanvas
        const ctx = canvas.getContext("2d")
        const img = this.refs.myImage
        const width = img.width;
        const height = img.height;

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0)
          ctx.saveHistory(true);
          imageEditorLauncher.setAvailabilityOfUndoRedoReset(ctx);
          $(canvas).css('cursor', '');
          //$(canvas).panzoom("disable");
          imageEditorLauncher.InitializeImageZoom(); 
          utils.onRedEyeLoad();        
           
        }
      }
    }
  }
  correctRedEye(event) {
    if (this.state.isRedEyeVisible) {
      const myCanvas = this.refs.imgEditorCanvas;
      const myCtx = myCanvas.getContext("2d")
      const cursorSize = $('#redEyeCursorSize').val();
      const myImage = this.refs.imgPreviewImage;
      var mousePos = utils.onCanvasClick(event, myImage, myCtx, myCanvas, cursorSize);
      $("#hidIsImageRedEyeChanged").val("true");
    }
  }
  onClickAdjust() {
    this.setState({ 'isRedEyeVisible': false });
    this.setState({ 'isCropperVisible': false });
    this.setState({ 'isFilterVisible': false });
    this.setState({ 'isAdjustVisible': true });
    this.editorType = 'adjust';
    this.setState({ 'isCloseSubEditorVisible': false });
    this.setState({ 'isSaveEditorVisible': false });
    this.setState({ 'isCloseEditorVisible': false });
  }
  onClickRedEyeApply() {
    $("#hidIsImageRedEyeChanged").val("true");
    const myCanvas = this.refs.imgEditorCanvas;
    const ctx = myCanvas.getContext("2d")
    ctx.saveHistory();

    this.setState({ 'isRedEyeVisible': false });
    $("#hidEditorType").val("master");
    $('#imageEditorRedEyeOptions').addClass('imageEditorHeaderDisplay');
    $('#cropDiv').removeClass('imageEditorHeaderDisplay');
    $('#orientationDiv').removeClass('imageEditorHeaderDisplay');
    $('#redEyeDiv').removeClass('imageEditorHeaderDisplay');
    $('#filterDiv').removeClass('imageEditorHeaderDisplay');
    $('#adjustDiv').removeClass('imageEditorHeaderDisplay');
    $('#editorSave').removeClass('imageEditorHeaderDisplay');

    //remove redeye canvas changes
    $('#redeyeZoomAlign').prop("disabled", true);
    //disable zoom
    window.$("#imgPreviewImage").panzoom("disable");
    //remove inactive cursor
    $('#redEyeBrush').addClass('zoom-cursor-deactivated');
    //remove zoom cursor
    $('#imgPreviewImage').removeClass('zoom-cursor');

    $("#imgPreviewImage").removeClass('circle16');
    $("#imgPreviewImage").removeClass('circle48');
    $("#imgPreviewImage").removeClass('circle24');
  }
  onClickRedEyeUndo() {
    const myCanvas = this.refs.imgEditorCanvas;
    const ctx = myCanvas.getContext("2d")
    ctx.undo();
  }
  onClickRedEyeCancel() {
    if ($('#hidIsImageRedEyeChanged').val() != '') {
      this.setState({ 'isCloseSubEditorVisible': true });
    }
    else {
      this.setState({ 'isRedEyeVisible': false });
      $("#hidEditorType").val("master");
      $('#imageEditorRedEyeOptions').addClass('imageEditorHeaderDisplay');
      $('#cropDiv').removeClass('imageEditorHeaderDisplay');
      $('#orientationDiv').removeClass('imageEditorHeaderDisplay');
      $('#redEyeDiv').removeClass('imageEditorHeaderDisplay');
      $('#filterDiv').removeClass('imageEditorHeaderDisplay');
      $('#adjustDiv').removeClass('imageEditorHeaderDisplay');
      $('#editorSave').removeClass('imageEditorHeaderDisplay');
    }
  }
  onClickFilterApply() {
    var filter = "";
    if ($('#hidFilterSelected').val() != '') {
      filter = $('#hidFilterSelected').val();
    }

    if (filter != "") {
      filterUtils.ApplySelectedFilter(filter);
    }
    this.setState({ 'isFilterVisible': false });
    $("#hidEditorType").val("master");
    $('#imageEditorFilterOptions').addClass('imageEditorHeaderDisplay');
    $('#cropDiv').removeClass('imageEditorHeaderDisplay');
    $('#orientationDiv').removeClass('imageEditorHeaderDisplay');
    $('#redEyeDiv').removeClass('imageEditorHeaderDisplay');
    $('#filterDiv').removeClass('imageEditorHeaderDisplay');
    $('#adjustDiv').removeClass('imageEditorHeaderDisplay');
    $('#editorSave').removeClass('imageEditorHeaderDisplay');
  }
  onClickFilterCancel() {
    if ($('#hidFilterSelected').val() != '') {
      this.setState({ 'isCloseSubEditorVisible': true });
    }
    else {
      this.setState({ 'isFilterVisible': false });
      $("#hidEditorType").val("master");
      $('#imageEditorFilterOptions').addClass('imageEditorHeaderDisplay');
      $('#cropDiv').removeClass('imageEditorHeaderDisplay');
      $('#orientationDiv').removeClass('imageEditorHeaderDisplay');
      $('#redEyeDiv').removeClass('imageEditorHeaderDisplay');
      $('#filterDiv').removeClass('imageEditorHeaderDisplay');
      $('#adjustDiv').removeClass('imageEditorHeaderDisplay');
      $('#editorSave').removeClass('imageEditorHeaderDisplay');
    }
  }

  onClickAdjustApply() {
    if ($('#hidAdjustmentSelected').val() != '') {
      var dictSelectedAdjustments = {};
      dictSelectedAdjustments = JSON.parse($('#hidAdjustmentSelected').val());
      filterUtils.ApplyAdjustments(dictSelectedAdjustments);
    }

    this.setState({ 'isAdjustVisible': false });
    $("#hidEditorType").val("master");
    $('#imageEditorAdjustOptions').addClass('imageEditorHeaderDisplay');
    $('#cropDiv').removeClass('imageEditorHeaderDisplay');
    $('#orientationDiv').removeClass('imageEditorHeaderDisplay');
    $('#redEyeDiv').removeClass('imageEditorHeaderDisplay');
    $('#filterDiv').removeClass('imageEditorHeaderDisplay');
    $('#adjustDiv').removeClass('imageEditorHeaderDisplay');
    $('#editorSave').removeClass('imageEditorHeaderDisplay');
  }

  onClickAdjustCancel() {
    if ($('#hidAdjustmentSelected').val() != '') {
      this.setState({ 'isCloseSubEditorVisible': true });
    }
    else {
      this.setState({ 'isAdjustVisible': false });
      $("#hidEditorType").val("master");
      $('#imageEditorAdjustOptions').addClass('imageEditorHeaderDisplay');
      $('#cropDiv').removeClass('imageEditorHeaderDisplay');
      $('#orientationDiv').removeClass('imageEditorHeaderDisplay');
      $('#redEyeDiv').removeClass('imageEditorHeaderDisplay');
      $('#filterDiv').removeClass('imageEditorHeaderDisplay');
      $('#adjustDiv').removeClass('imageEditorHeaderDisplay');
      $('#editorSave').removeClass('imageEditorHeaderDisplay');
    }
  }
  onClickCropApply() {
    if ($('#hidIsImageCropped').val() != '') {
      //this will be where i apply the crop as opposed to the currect crop option on that page
    }
    var myCanvas = this.refs.cropper.getCroppedCanvas().toDataURL();
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

  onClickCropCancel() {
    if ($('#hidIsImageCropped').val() != '') {//|| $('#hidRedEyeUsed').val() != '' || $('#hidCropperOrOrientationUsed').val() != '' || $('#hidAdjustmentSelected').val() != ''){
      this.setState({ 'isCloseSubEditorVisible': true });
    }
    else {
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
  }

  closeSubEditor() {
    this.setState({ 'isCloseSubEditorVisible': false });

    var editorType = $("#hidEditorType").val();
    if (editorType == "cropper") {

    }
    else if (editorType == "orientation") {

    }
    else if (editorType == "filter") {
      this.setState({ 'isFilterVisible': false });
      $('#imageEditorFilterOptions').addClass('imageEditorHeaderDisplay');
    }
    else if (editorType == "redeye") {
      //remove redeye canvas changes
      $('#redeyeZoomAlign').prop("disabled", true);
      //disable zoom
      window.$("#imgPreviewImage").panzoom("disable");
      //remove inactive cursor
      $('#redEyeBrush').addClass('zoom-cursor-deactivated');
      //remove zoom cursor
      $('#imgPreviewImage').removeClass('zoom-cursor');

      $("#imgPreviewImage").removeClass('circle16');
      $("#imgPreviewImage").removeClass('circle48');
      $("#imgPreviewImage").removeClass('circle24');

      //since changes take place on click need to undo red eye
      const myCanvas = this.refs.imgEditorCanvas;
      const ctx = myCanvas.getContext("2d")
      ctx.undo();
  
      var editedImage = ctx.canvas.toDataURL();
  
      $("#imgPreviewImage").attr("src", editedImage);
    }
    else if (editorType == "adjust") {
      this.setState({ 'isAdjustVisible': false });
      $('#imageEditorAdjustOptions').addClass('imageEditorHeaderDisplay');
    }

    $("#hidEditorType").val("master");
    
    $('#cropDiv').removeClass('imageEditorHeaderDisplay');
    $('#orientationDiv').removeClass('imageEditorHeaderDisplay');
    $('#redEyeDiv').removeClass('imageEditorHeaderDisplay');
    $('#filterDiv').removeClass('imageEditorHeaderDisplay');
    $('#adjustDiv').removeClass('imageEditorHeaderDisplay');
    $('#editorSave').removeClass('imageEditorHeaderDisplay');
  }

  resumeSubEditor() {
    this.setState({ 'isCloseSubEditorVisible': false });
  }

  applySubEditor() {
    var editorType = $("#hidEditorType").val();
    if (editorType == "cropper") {
      cropperUtils.ApplyCrop();
    }
    else if (editorType == "orientation") {

    }
    else if (editorType == "filter") {
      var filter = window.$('#hidFilterSelected').val();
      filterUtils.ApplySelectedFilter(filter);
      this.setState({ 'isFilterVisible': false });
      $('#imageEditorFilterOptions').addClass('imageEditorHeaderDisplay');
    }
    else if (editorType == "redeye") {
      this.setState({ 'isRedEyeVisible': false });
      $('#imageEditorRedEyeOptions').addClass('imageEditorHeaderDisplay'); 
      //remove redeye canvas changes
      $('#redeyeZoomAlign').prop("disabled", true);
      //disable zoom
      window.$("#imgPreviewImage").panzoom("disable");
      //remove inactive cursor
      $('#redEyeBrush').addClass('zoom-cursor-deactivated');
      //remove zoom cursor
      $('#imgPreviewImage').removeClass('zoom-cursor'); 
      $("#imgPreviewImage").removeClass('circle16');
      $("#imgPreviewImage").removeClass('circle48');
      $("#imgPreviewImage").removeClass('circle24');
    }
    else if (editorType == "adjust") {
      var dictSelectedAdjustments = {};
      dictSelectedAdjustments = JSON.parse($('#hidAdjustmentSelected').val());
      filterUtils.ApplyAdjustments(dictSelectedAdjustments);
      this.setState({ 'isAdjustVisible': false });
      $('#imageEditorAdjustOptions').addClass('imageEditorHeaderDisplay');
    }

    this.setState({ 'isCloseSubEditorVisible': false });
    $("#hidEditorType").val("master");
    $('#cropDiv').removeClass('imageEditorHeaderDisplay');
    $('#orientationDiv').removeClass('imageEditorHeaderDisplay');
    $('#redEyeDiv').removeClass('imageEditorHeaderDisplay');
    $('#filterDiv').removeClass('imageEditorHeaderDisplay');
    $('#adjustDiv').removeClass('imageEditorHeaderDisplay');
    $('#editorSave').removeClass('imageEditorHeaderDisplay');
  }

  onClickSave() {
    this.setState({ 'isSaveEditorVisible': true });
  }

  closeSave() {
    this.setState({ 'isSaveEditorVisible': false });
  }

  saveAsACopy() {
    imageEditorLauncher.saveSelection(false);

    setTimeout(() => {
      this.setState({ 'isSaveEditorVisible': false });
      this.props.onClose();
    }, 1000);
  }

  overwriteOriginal() {
    imageEditorLauncher.saveSelection(true);

    setTimeout(() => {
      this.setState({ 'isSaveEditorVisible': false });
      this.props.onClose();
    }, 1000);
  }

  onClickClose() {
    var editorType = $("#hidEditorType").val();
    if (editorType == "master" || editorType == "") {
      if ($("#hidIsImageCropped").val() == "true" || $("#hidIsImageOrientationChanged").val() == "true" || $("#hidIsImageRedEyeChanged").val() == "true" || $("#hidDoesImageHasFilter").val() == "true" || $("#hidDoesImageHasAdjustments").val() == "true") {
        this.setState({ 'isCloseEditorVisible': true });
      }
      else {
        this.props.onClose();
        $("#imgPreviewImage").css("width", '');
      }
    }
    else {
      var editorType = $("#hidEditorType").val();
      if (editorType == "cropper") {

      }
      else if (editorType == "orientation") {

      }
      else if (editorType == "filter") {
        if ($('#hidFilterSelected').val() != '') {
          this.setState({ 'isCloseSubEditorVisible': true });
        }
        else {
          this.setState({ 'isFilterVisible': false });
          $("#hidEditorType").val("master");
          $('#imageEditorFilterOptions').addClass('imageEditorHeaderDisplay');
          $('#cropDiv').removeClass('imageEditorHeaderDisplay');
          $('#orientationDiv').removeClass('imageEditorHeaderDisplay');
          $('#redEyeDiv').removeClass('imageEditorHeaderDisplay');
          $('#filterDiv').removeClass('imageEditorHeaderDisplay');
          $('#adjustDiv').removeClass('imageEditorHeaderDisplay');
          $('#editorSave').removeClass('imageEditorHeaderDisplay');
        }
      }
      else if (editorType == "redeye") {

      }
      else if (editorType == "adjust") {
        if ($('#hidAdjustmentSelected').val() != '') {
          this.setState({ 'isCloseSubEditorVisible': true });
        }
        else {
          this.setState({ 'isAdjustVisible': false });
          $("#hidEditorType").val("master");
          $('#imageEditorAdjustOptions').addClass('imageEditorHeaderDisplay');
          $('#cropDiv').removeClass('imageEditorHeaderDisplay');
          $('#orientationDiv').removeClass('imageEditorHeaderDisplay');
          $('#redEyeDiv').removeClass('imageEditorHeaderDisplay');
          $('#filterDiv').removeClass('imageEditorHeaderDisplay');
          $('#adjustDiv').removeClass('imageEditorHeaderDisplay');
          $('#editorSave').removeClass('imageEditorHeaderDisplay');
        }
      }
    }
  }

  closeEditor() {
    this.setState({ 'isCloseEditorVisible': false });
    this.props.onClose();
  }

  resumeEditor() {
    this.setState({ 'isCloseEditorVisible': false });
  }

  saveEditor() {
    this.setState({ 'isCloseEditorVisible': false });
    this.setState({ 'isSaveEditorVisible': true });
  }

  onClickUndo() {
    var canvas = document.getElementById('imgEditorCanvas');
    var ctx = canvas.getContext('2d');
    ctx.undo();
    imageEditorLauncher.setAvailabilityOfUndoRedoReset(ctx);
  }

  onClickRedo() {
    var canvas = document.getElementById('imgEditorCanvas');
    var ctx = canvas.getContext('2d');
    ctx.redo();
    imageEditorLauncher.setAvailabilityOfUndoRedoReset(ctx);
  }

  onClickReset() {
    var canvas = document.getElementById('imgEditorCanvas');
    var ctx = canvas.getContext('2d');
    ctx.reset();
    imageEditorLauncher.setAvailabilityOfUndoRedoReset(ctx);
  }

  render() {
    // Render nothing if the "show" prop is false
    if (!this.props.show) {
      return null;
    }

    // The gray background
    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 50
    };
    const imgPreviewStyle = {
      'margin-top': '4%'
    }
    const imageStyle = {

    }
    // The modal "window"
    const modalStyle = {
      backgroundColor: '#fff',
      padding: 30,
      display: "block"
    };


    return (
      <div className="backdrop" style={backdropStyle}>
        <div className="modal right fade in" style={modalStyle} id="imageEditor" ref="imageEditor">
          <div className="modal-header" id="modalHeader" ref="modalHeader">
            <div id="imageEditorOptions" tabindex="-1">
              <div id="closeDiv" class="editor-tool-option" onClick={(e) => { this.onClickClose(e) }}>
                <img id="menuImg" class="closeModal" src={closeIcon} />
                <label class="modal-editor-label-txt">Close</label>
              </div>
              <div id="cropDiv" class="editor-tool-option" onClick={this.onClickCropper}>
                <img class="menuImg" src={cropIcon} />
                <label id="cropLbl" class="modal-editor-label-txt">Crop</label>
              </div>
              <div id="orientationDiv" class="editor-tool-option" onClick={this.onClickOrientation}>
                <img class="menuImg" src={orientationIcon} />
                <label id="orientationLbl" class="modal-editor-label-txt">Orientation</label>
              </div>
              <div id="redEyeDiv" class="editor-tool-option" onClick={this.onClickRedEye}>
                <img class="menuImg" src={redEyeIcon} />
                <label id="redEyeLbl" class="modal-editor-label-txt">Red Eye</label>
              </div>
              <div id="filterDiv" class="editor-tool-option" onClick={this.onClickFilter}>
                <img class="menuImg" src={filterIcon} />
                <label id="filterLbl" class="modal-editor-label-txt">Photo Filters</label>
              </div>
              <div id="adjustDiv" class="editor-tool-option" onClick={this.onClickAdjust}>>
                <img class="menuImg" src={adjustIcon} />
                <label id="adjustLbl" class="modal-editor-label-txt">Adjust</label>
              </div>
              <div class="editor-tool-option" id="editorSave" onClick={(e) => { this.onClickSave(e) }}>
                <label id="saveLbl" class="modal-editor-label-txt">Save</label>
                {/* <input type="button" id="saveEditBtn" value="Save" class="modal-editor-button-primary hide" onclick="saveEditImageNewEditor();" /> */}
              </div>
              <div id="imageEditorRedEyeOptions" class="tool-header imageEditorHeaderDisplay">
                <div id="redeyeDivActive" class="tool-title">
                  <img class="redEyeImg" src={redEyeIcon} />
                  <label class="modal-editor-label-txt">Red Eye</label>
                </div>
                <div class="docs-buttons modal-editor-save-div " onClick={(e) => { this.onClickRedEyeApply(e) }}>
                  <input type="button" id="applyRedEyeBtn" value="Apply" class="modal-editor-button-primary" />
                </div>
                <div class="modal-editor-save-div " onClick={(e) => { this.onClickRedEyeCancel(e) }}>
                  <input type="button" id="cancelRedEyeBtn" value="Cancel" class="modal-editor-button-primary" />
                </div>
                <input type="hidden" value="" name="hidIsImageRedEyeChanged" id="hidIsImageRedEyeChanged" />
              </div>
              <div id="imageEditorFilterOptions" class="tool-header imageEditorHeaderDisplay">
                <div id="filterDivActive" class="tool-title">
                  <img class="filterImg" src={filterIcon} />
                  <label class="modal-editor-label-txt">Photo Filters</label>
                </div>
                <div class="docs-buttons modal-editor-save-div " onClick={(e) => { this.onClickFilterApply(e) }}>
                  <input type="button" id="applyFilterBtn" value="Apply" class="modal-editor-button-primary" />
                </div>
                <div class="modal-editor-save-div " onClick={(e) => { this.onClickFilterCancel(e) }}>
                  <input type="button" id="cancelFilterBtn" value="Cancel" class="modal-editor-button-secondary" />
                </div>
                <input type="hidden" name="hidDoesImageHasFilter" id="hidDoesImageHasFilter" />
              </div>
              <div id="imageEditorAdjustOptions" class="tool-header imageEditorHeaderDisplay">
                <div id="adjustDivActive" class="tool-title">
                  <img class="adjustImg" src={adjustIcon} />
                  <label class="modal-editor-label-txt">Adjust</label>
                </div>
                <div class="docs-buttons modal-editor-save-div " onClick={(e) => { this.onClickAdjustApply(e) }}>
                  <input type="button" id="applyAdjustBtn" value="Apply" class="modal-editor-button-primary" />
                </div>
                <div class="modal-editor-save-div " onClick={(e) => { this.onClickAdjustCancel(e) }}>
                  <input type="button" id="cancelAdjustBtn" value="Cancel" class="modal-editor-button-secondary" />
                </div>
                <input type="hidden" name="hidDoesImageHasAdjustments" id="hidDoesImageHasAdjustments" />
              </div>
              <div id="imageEditorCropOptions" class="tool-header imageEditorHeaderDisplay">
                <div id="filterDivActive" class="tool-title">
                  <img class="filterImg" src={cropIcon} />
                  <label class="modal-editor-label-txt">Crop</label>
                </div>
                {/* <div class="docs-buttons modal-editor-save-div " onClick={(e) => { this.onClickCropApply(e) }}>
                  <input type="button" id="applyCropBtn" value="Apply" class="modal-editor-button-primary" />
                </div> */}
                <div class="modal-editor-save-div " onClick={(e) => { this.onClickCropCancel(e) }}>
                  <input type="button" id="cancelCropBtn" value="Cancel" class="modal-editor-button-secondary" />
                </div>
                <input type="hidden" name="hidIsImageCropped" id="hidIsImageCropped" />
              </div>
            </div>
          </div>
          <div id="modalBody" className="modal-body">
            <div id="divCanvas" className="canvas-container">
              <canvas id="imgEditorCanvas" ref="imgEditorCanvas" data-caman-hidpi-disabled="true"></canvas>
              <img ref="myImage" style={imageStyle} src={myImage} />
              <input type="hidden" ref="hidMaxSupportedResolution" />
            </div>
            <div ref="divPreviewImage" id="divPreviewImage" className="preview-image">
              <img ref="imgPreviewImage" id="imgPreviewImage" src={myImage} alt="Picture" style={imgPreviewStyle} className="previewImage" onClick={(e) => { this.correctRedEye(e) }} />
            </div>
            {this.state.isRedEyeVisible && <RedEye />}
            {this.state.isCropperVisible && <CropperWrapper />}
            {this.state.isFilterVisible && <Filter />}
            {this.state.isAdjustVisible && <Adjust />}
            {this.state.isCloseSubEditorVisible && <CloseSubEditor close={this.closeSubEditor} resume={this.resumeSubEditor} apply={this.applySubEditor} />}
            {this.state.isSaveEditorVisible && <SaveEditor close={this.closeSave} saveAsACopy={this.saveAsACopy} overwriteOriginal={this.overwriteOriginal} />}
            {this.state.isCloseEditorVisible && <CloseEditor close={this.closeEditor} resume={this.resumeEditor} save={this.saveEditor} />}
            {this.state.isOrientationVisible && <Orientation />}
          </div>
          <div className="footer">
            <div>
              <input type="hidden" id="hidEditorType" />
            </div>
          </div>
          <div class="modal-footer">
                    <div id="divFooterContents" class="footer-contents">
                        <div class="oper-div">
                            <div id="undoDiv" onClick={(e) => { this.onClickUndo(e) }}>
                                <img id="undoImg" src={undoIcon} class="modal-editor-footer-img" />
                                <label id="undoLbl" class="modal-editor-footer-txt">Undo</label>
                            </div>
                            <div class="image-editor-footer-bar"></div>
                            <div id="redoDiv" onClick={(e) => { this.onClickRedo(e) }}>
                                <img id="redoImg" src={redoIcon} class="modal-editor-footer-img" />
                                <label id="redoLbl" class="modal-editor-footer-txt">Redo</label>
                            </div>
                            <div class="image-editor-footer-bar"></div>
                            <div id="resetDiv" onClick={(e) => { this.onClickReset(e) }}>
                                <img id="resetImg" src={resetIcon} class="modal-editor-footer-img" />
                                <label id="resetLbl" class="modal-editor-footer-txt">Reset</label>
                            </div>
                        </div>
                        <div class="status-div">
                            <label id="statusLbl" class="status-label">Image Editor</label>
                        </div>
                        <div id="footerZoom" class="zoom-div">
                            <span class="zoom-text">Zoom</span><input type="range" class="zoom-range zoom-slider zoom-footer"></input>
                        </div>
                    </div>
            </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node
};

export default Modal;
