import $ from 'jquery';
var REGEXP_DECIMALS = /\.\d*(?:0|9){12}\d*$/i;
export function resizePreviewImageToFitWindow(image) {
    var editorType = $("#hidEditorType").val();

    /*get the width and height of modal-body div*/
    var myScreenWidth = $(window).width();
    var myScreenHeight = $(window).height();
    var screenWidth = ($(window).width() - 163 >= 1140) ? 1140 : $(window).width() - 163;
    var screenHeight = $(window).height() - 314;

    if (editorType == "redeye") {
        $("#imgPreviewImage").show();
        var canvas = document.getElementById('imgEditorCanvas');
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;

        var prvImg = image;
        var prvImgWidth = prvImg.clientWidth;
        var prvImgHeight = prvImg.clientHeight;

        var widthRatio = canvasWidth / prvImgWidth;   // get ratio for scaling image
        var heightRatio = canvasHeight / prvImgHeight; // get ratio for scaling image

        //i need to change the width of the image element here to fit the image in order to get the mouse click correct
        //take width / scale factor to update width element
        var scaledImageWidth = canvasWidth / heightRatio;

        $("#imgPreviewImage").css("height", screenHeight);
        // $("#imgPreviewImage").css("width", scaledImageWidth);
        $('#footerZoom').addClass('zoom-footer-display');
    }
    // if (editorType == "orientation" || editorType == "cropper") {

    //     $("#image").css("height", screenHeight);
    // }
    else {
        $("#imgPreviewImage").css("height", screenHeight);
        $("#imgPreviewImage").css("width", "auto");
        $("#imgPreviewImage").show();
    }


    switch (editorType) {
        case 'cropper':
        case 'orientation':
            $('#initialAspectRatio').trigger('change');
            $('#footerZoom').addClass('zoom-footer-display');
            break;
        case 'filter':
            
            var imgEditorCanvas = document.getElementById('imgEditorCanvas');
            var imageUrl = imgEditorCanvas.toDataURL('image/jpeg');
    
            var filterCanvas = document.getElementById('filterCanvas');
            var filterCtx = filterCanvas.getContext('2d');
    
            filterCtx.clearRect(0, 0, filterCanvas.width, filterCanvas.height);
       
            var screenHeightFilter = $(window).height() - 314;
            var scaleRatioFilter = screenHeightFilter / imgEditorCanvas.height;
            var drawWidthFilter = imgEditorCanvas.width * scaleRatioFilter;
    
            /*if ($(window).width() <= MOBILE_BREAK_POINT) {
                scaleRatioFilter = 1;
    
                if ($(window).width() <= $(window).height()) {
                    scaleRatioFilter = Math.min($(window).width(), imgEditorCanvas.width) / imgEditorCanvas.width;
                }
                else {
                    scaleRatioFilter = Math.min($(window).height(), imgEditorCanvas.height) / imgEditorCanvas.height;
                }
    
                screenHeightFilter = imgEditorCanvas.height * scaleRatioFilter;
                drawWidthFilter = imgEditorCanvas.width * scaleRatioFilter;
            }*/
    
            filterCanvas.width = drawWidthFilter;
            filterCanvas.height = screenHeightFilter;
            filterCtx.drawImage(imgEditorCanvas, 0, 0, drawWidthFilter, screenHeightFilter);           
    
            //$('#originalImageFilter').val(imageUrl);
    
            //buildFilterThumbnails();

            $("#imgPreviewImage").hide();
            //$("#divFilter").height($(window).height() - 284);
            $("#divFilter").css('display', 'flex');
            $('#footerZoom').addClass('zoom-footer-display');

            break;
            case 'adjust':

            var imgEditorCanvas = document.getElementById('imgEditorCanvas');
            var imageUrl = imgEditorCanvas.toDataURL('image/jpeg');
    
            var adjustCanvas = document.getElementById('adjustCanvas');
            var adjustCtx = adjustCanvas.getContext('2d');
    
            adjustCtx.clearRect(0, 0, adjustCanvas.width, adjustCanvas.height);
    
            var screenHeightAdjust = $(window).height() - 314;
            var scaleRatioAdjust = screenHeightAdjust / imgEditorCanvas.height;
            var drawWidthAdjust = imgEditorCanvas.width * scaleRatioAdjust
    
            /*if ($(window).width() <= MOBILE_BREAK_POINT) {
                drawWidthAdjust = imgEditorCanvas.width;
                screenHeightAdjust = imgEditorCanvas.height;
            }
    
            if ($(window).width() <= MOBILE_BREAK_POINT) {
                scaleRatioAdjust = 1;
    
                if ($(window).width() <= $(window).height()) {
                    scaleRatioAdjust = Math.min($(window).width(), imgEditorCanvas.width) / imgEditorCanvas.width;
                }
                else {
                    scaleRatioAdjust = Math.min($(window).height(), imgEditorCanvas.height) / imgEditorCanvas.height;
                }
    
                screenHeightAdjust = imgEditorCanvas.height * scaleRatioAdjust;
                drawWidthAdjust = imgEditorCanvas.width * scaleRatioAdjust;
            }*/
    
            adjustCanvas.width = drawWidthAdjust;
            adjustCanvas.height = screenHeightAdjust;
            adjustCtx.drawImage(imgEditorCanvas, 0, 0, drawWidthAdjust, screenHeightAdjust);
               
            //$('#originalImageAdjust').val(imageUrl);
    
            //initializeAdjustSliderValues();
    
            $("#imgPreviewImage").hide();
            //$("#divAdjust").height($(window).height() - 284);
            $("#divAdjust").css('display', 'flex');
            $('#footerZoom').addClass('zoom-footer-display');
            break;
    }

    //$("#divCropper").height(screenHeight);

    if (editorType == "master") {
        if ($('#footerZoom').hasClass('zoom-footer-display')) {
            $('#footerZoom').removeClass('zoom-footer-display');
        }     
        
        window.$("#imgPreviewImage").panzoom("enable");
        window.$("#imgPreviewImage").panzoom("resetZoom");
        window.$("#imgPreviewImage").panzoom("resetPan");
        window.$("#imgPreviewImage").panzoom("zoom", 1.0, { silent: true });
        window.$("#imgPreviewImage").removeClass('redeye');
    }
    else if (editorType == "redeye")
    {
        $('#redeyeZoomAlign').prop("disabled", true);
        window.$("#imgPreviewImage").panzoom("resetZoom");
        window.$("#imgPreviewImage").panzoom("resetPan");
        window.$("#imgPreviewImage").panzoom("zoom", 1.0, { silent: true });
        window.$("#imgPreviewImage").panzoom("disable");
        $("#imgPreviewImage").addClass("redeye");
    }
}

export function getImageScaleFactor() {
    var widthRatio = 0;
    var heightRatio = 0;

    var canvas = document.getElementById('imgEditorCanvas');
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    var prvImg = $("#imgPreviewImage");
    var prvImgWidth = prvImg[0].clientWidth;
    var prvImgHeight = prvImg[0].clientHeight;

    widthRatio = canvasWidth / prvImgWidth;   // get ratio for scaling image
    heightRatio = canvasHeight / prvImgHeight; // get ratio for scaling image

    //i need to change the width of the image element here to fit the image in order to get the mouse click correct
    //take width / scale factor to update width element
    var scaledImageWidth = canvasWidth / heightRatio;

    $("#imgPreviewImage").css("width", scaledImageWidth);

    return {
        w: widthRatio,
        h: heightRatio
    };

}
export function ApplyCrop() {
    var test = 'test';
}
export function displayImageEditorCanvas() {
    // $("#hidEditorType").val("master");
    // $("#divCropper").hide();
    // $("#divFilter").hide();
    // $("#divAdjust").hide();
    // $(".preview-image").css({ display: 'flex' });
    // $('#imageEditorOptions').show();
    // $('#mbMenuTrigger').removeClass('hide');
    // $('#imageEditorCropperOptions').hide();
    // $('#imageEditorOrientationOptions').hide();
    // $('#imageEditorFilterOptions').hide();
    // $('#imageEditorRedEyeOptions').hide();
    // $('#imageEditorAdjustOptions').hide();
    // $('#redEyeButtons').hide();
    // $('#imgPreviewImage').removeClass('circle16 circle24 circle48');
    // $('#redEyeBrushSmall').removeClass('redEyeBrush-selected');
    // $('#redEyeBrushMed').removeClass('redEyeBrush-selected');
    // $('#redEyeBrushLg').removeClass('redEyeBrush-selected');
    // $("#divFooterContents").removeClass("disabled");

    // if ($('#footerZoom').hasClass('zoom-footer-display')) {
    //     $('#footerZoom').removeClass('zoom-footer-display');
    // }
    // $('#statusLbl, .status-text').text('Image Editor');
    // //reenable zoom
    // $("#imgPreviewImage").panzoom("enable");

    // $("#imgPreviewImage").panzoom("resetZoom");
    // $("#imgPreviewImage").panzoom("resetPan");
    // $("#imgPreviewImage").panzoom("zoom", 1.0, { silent: true });
    // $("#imgPreviewImage").removeClass('redeye');
}

export function saveEditImageNewEditor() {
       $("#modalEditSaveNewEditorMessage").text("How would you like to save your edited image?");
       $("#imgCloseOnSaveModal").show();    
}

export function closeEditImageSubEditor() {   
    var editorType = $("#hidEditorType").val();
    $('#modalEditCloseNewEditorMessage').text('Wait! You didn\'t save your work. Are you certain that you want to close this editor?');

    if (editorType == "cropper") {
        $("#modalEditImageCloseSubEditor .docs-buttons").hide();
        $("#modalEditImageCloseSubEditor #filterSave").hide();
        $("#modalEditImageCloseSubEditor #redEyeSave").hide();
        $("#modalEditImageCloseSubEditor #adjustSave").hide();
        $("#modalEditImageCloseSubEditor #cropperSave").show();

        //reset crop options
        var selectedRadio = $("#divRatioButtons input[type='radio']:checked");
        if (selectedRadio.length > 0) {
            var selectedRatio = selectedRadio[0].id;
            $(selectedRadio[0]).parents().removeClass('active');
        }
        //set pill text
        // document.getElementById("divSizeCapsule").innerHTML = '';
        // $('#customAspectRatioHeight').val('4');
        // $('#customAspectRatioWidth').val('6');
    }
    else if (editorType == "orientation") {
        $("#modalEditImageCloseSubEditor .docs-buttons").show();
        $("#modalEditImageCloseSubEditor #filterSave").hide();
        $("#modalEditImageCloseSubEditor #redEyeSave").hide();
        $("#modalEditImageCloseSubEditor #adjustSave").hide();
        $("#modalEditImageCloseSubEditor #cropperSave").hide();
    }
    else if (editorType == "filter") {
        $("#modalEditImageCloseSubEditor .docs-buttons").hide();
        $("#modalEditImageCloseSubEditor #redEyeSave").hide();
        $("#modalEditImageCloseSubEditor #adjustSave").hide();
        $("#modalEditImageCloseSubEditor #filterSave").show();
        $("#modalEditImageCloseSubEditor #cropperSave").hide();
        $('#modalEditCloseNewEditorMessage').text('Wait! You didn\'t apply your photo filter edits. Are you certain that you want to close the photo filter tool?');
    }
    else if (editorType == "redeye") {
        $("#modalEditImageCloseSubEditor .docs-buttons").hide();
        $("#modalEditImageCloseSubEditor #filterSave").hide();
        $("#modalEditImageCloseSubEditor #adjustSave").hide();
        $("#modalEditImageCloseSubEditor #redEyeSave").show();
        $("#modalEditImageCloseSubEditor #cropperSave").hide();
        $('#modalEditCloseNewEditorMessage').text('Wait! You didn\'t apply your red eye edits. Are you certain that you want to close the red eye tool?');
    }
    else if (editorType == "adjust") {
        $("#modalEditImageCloseSubEditor .docs-buttons").hide();
        $("#modalEditImageCloseSubEditor #redEyeSave").hide();
        $("#modalEditImageCloseSubEditor #filterSave").hide();
        $("#modalEditImageCloseSubEditor #adjustSave").show();
        $("#modalEditImageCloseSubEditor #cropperSave").hide();
        $('#modalEditCloseNewEditorMessage').text('Wait! You didn\'t apply your adjust edits. Are you certain that you want to close the adjust tool?');
    }
}

export function setupRotatePage(){
    $("#divPreviewImage").hide();
    $("#divCropper").show();
}

export function getCroppedCanvasTest() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    
        if (!this.ready || !window.HTMLCanvasElement) {
          return null;
        }
    
        var canvasData = this.canvasData;
    
        var source = getSourceCanvas(this.image, this.imageData, canvasData, options);
    
        // Returns the source canvas if it is not cropped.
        if (!this.cropped) {
          return source;
        }
    
        var _getData = this.getData(),
            x = _getData.x,
            y = _getData.y,
            initialWidth = _getData.width,
            initialHeight = _getData.height;
    
        var aspectRatio = initialWidth / initialHeight;
        var maxSizes = getContainSizes({
          aspectRatio: aspectRatio,
          width: options.maxWidth || Infinity,
          height: options.maxHeight || Infinity
        });
        var minSizes = getContainSizes({
          aspectRatio: aspectRatio,
          width: options.minWidth || 0,
          height: options.minHeight || 0
        });
    
        var _getContainSizes = getContainSizes({
          aspectRatio: aspectRatio,
          width: options.width || initialWidth,
          height: options.height || initialHeight
        }),
            width = _getContainSizes.width,
            height = _getContainSizes.height;
    
        width = Math.min(maxSizes.width, Math.max(minSizes.width, width));
        height = Math.min(maxSizes.height, Math.max(minSizes.height, height));
    
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
    
        canvas.width = normalizeDecimalNumber(width);
        canvas.height = normalizeDecimalNumber(height);
    
        context.fillStyle = options.fillColor || 'transparent';
        context.fillRect(0, 0, width, height);
    
        var _options$imageSmoothi = options.imageSmoothingEnabled,
            imageSmoothingEnabled = _options$imageSmoothi === undefined ? true : _options$imageSmoothi,
            imageSmoothingQuality = options.imageSmoothingQuality;
    
    
        context.imageSmoothingEnabled = imageSmoothingEnabled;
    
        if (imageSmoothingQuality) {
          context.imageSmoothingQuality = imageSmoothingQuality;
        }
    
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage
        var sourceWidth = source.width;
        var sourceHeight = source.height;
    
        // Source canvas parameters
        var srcX = x;
        var srcY = y;
        var srcWidth = void 0;
        var srcHeight = void 0;
    
        // Destination canvas parameters
        var dstX = void 0;
        var dstY = void 0;
        var dstWidth = void 0;
        var dstHeight = void 0;
    
        if (srcX <= -initialWidth || srcX > sourceWidth) {
          srcX = 0;
          srcWidth = 0;
          dstX = 0;
          dstWidth = 0;
        } else if (srcX <= 0) {
          dstX = -srcX;
          srcX = 0;
          srcWidth = Math.min(sourceWidth, initialWidth + srcX);
          dstWidth = srcWidth;
        } else if (srcX <= sourceWidth) {
          dstX = 0;
          srcWidth = Math.min(initialWidth, sourceWidth - srcX);
          dstWidth = srcWidth;
        }
    
        if (srcWidth <= 0 || srcY <= -initialHeight || srcY > sourceHeight) {
          srcY = 0;
          srcHeight = 0;
          dstY = 0;
          dstHeight = 0;
        } else if (srcY <= 0) {
          dstY = -srcY;
          srcY = 0;
          srcHeight = Math.min(sourceHeight, initialHeight + srcY);
          dstHeight = srcHeight;
        } else if (srcY <= sourceHeight) {
          dstY = 0;
          srcHeight = Math.min(initialHeight, sourceHeight - srcY);
          dstHeight = srcHeight;
        }
    
        // All the numerical parameters should be integer for `drawImage`
        // https://github.com/fengyuanchen/cropper/issues/476
        var params = [srcX, srcY, srcWidth, srcHeight];
    
        // Avoid "IndexSizeError"
        if (dstWidth > 0 && dstHeight > 0) {
          var scale = width / initialWidth;
    
          params.push(dstX * scale, dstY * scale, dstWidth * scale, dstHeight * scale);
        }
    
        context.drawImage.apply(context, [source].concat(toConsumableArray(params.map(function (param) {
          return Math.floor(normalizeDecimalNumber(param));
        }))));
    
        return canvas;
}
export function getSourceCanvas(image, _ref6, _ref7, _ref8) {
    var imageNaturalWidth = _ref6.naturalWidth,
    imageNaturalHeight = _ref6.naturalHeight,
    _ref6$rotate = _ref6.rotate,
    rotate = _ref6$rotate === undefined ? 0 : _ref6$rotate,
    _ref6$scaleX = _ref6.scaleX,
    scaleX = _ref6$scaleX === undefined ? 1 : _ref6$scaleX,
    _ref6$scaleY = _ref6.scaleY,
    scaleY = _ref6$scaleY === undefined ? 1 : _ref6$scaleY;
var aspectRatio = _ref7.aspectRatio,
    naturalWidth = _ref7.naturalWidth,
    naturalHeight = _ref7.naturalHeight;
var _ref8$fillColor = _ref8.fillColor,
    fillColor = _ref8$fillColor === undefined ? 'transparent' : _ref8$fillColor,
    _ref8$imageSmoothingE = _ref8.imageSmoothingEnabled,
    imageSmoothingEnabled = _ref8$imageSmoothingE === undefined ? true : _ref8$imageSmoothingE,
    _ref8$imageSmoothingQ = _ref8.imageSmoothingQuality,
    imageSmoothingQuality = _ref8$imageSmoothingQ === undefined ? 'low' : _ref8$imageSmoothingQ,
    _ref8$maxWidth = _ref8.maxWidth,
    maxWidth = _ref8$maxWidth === undefined ? Infinity : _ref8$maxWidth,
    _ref8$maxHeight = _ref8.maxHeight,
    maxHeight = _ref8$maxHeight === undefined ? Infinity : _ref8$maxHeight,
    _ref8$minWidth = _ref8.minWidth,
    minWidth = _ref8$minWidth === undefined ? 0 : _ref8$minWidth,
    _ref8$minHeight = _ref8.minHeight,
    minHeight = _ref8$minHeight === undefined ? 0 : _ref8$minHeight;

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
var maxSizes = getContainSizes({
  aspectRatio: aspectRatio,
  width: maxWidth,
  height: maxHeight
});
var minSizes = getContainSizes({
  aspectRatio: aspectRatio,
  width: minWidth,
  height: minHeight
});
var width = Math.min(maxSizes.width, Math.max(minSizes.width, naturalWidth));
var height = Math.min(maxSizes.height, Math.max(minSizes.height, naturalHeight));
var params = [-imageNaturalWidth / 2, -imageNaturalHeight / 2, imageNaturalWidth, imageNaturalHeight];

canvas.width = normalizeDecimalNumber(width);
canvas.height = normalizeDecimalNumber(height);
context.fillStyle = fillColor;
context.fillRect(0, 0, width, height);
context.save();
context.translate(width / 2, height / 2);
context.rotate(rotate * Math.PI / 180);
context.scale(scaleX, scaleY);
context.imageSmoothingEnabled = imageSmoothingEnabled;
context.imageSmoothingQuality = imageSmoothingQuality;
context.drawImage.apply(context, [image].concat(toConsumableArray(params.map(function (param) {
  return Math.floor(normalizeDecimalNumber(param));
}))));
context.restore();
return canvas;
}
function getContainSizes(_ref4) {
    var aspectRatio = _ref4.aspectRatio,
        height = _ref4.height,
        width = _ref4.width;
  
    var isValidNumber = function isValidNumber(value) {
      return isFinite(value) && value > 0;
    };
  
    if (isValidNumber(width) && isValidNumber(height)) {
      if (height * aspectRatio > width) {
        height = width / aspectRatio;
      } else {
        width = height * aspectRatio;
      }
    } else if (isValidNumber(width)) {
      height = width / aspectRatio;
    } else if (isValidNumber(height)) {
      width = height * aspectRatio;
    }
  
    return {
      width: width,
      height: height
    };
  }
  function normalizeDecimalNumber(value) {
    var times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100000000000;
  
    return REGEXP_DECIMALS.test(value) ? Math.round(value * times) / times : value;
  }
  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
  
      return arr2;
    } else {
      return Array.from(arr);
    }
  };

var imageId = null;

export function saveSelection(overwriteOriginal) {
    var image = document.getElementById('imgEditorCanvas').toDataURL('image/jpeg');
    image = image.replace("data:image/jpeg;base64,", "");

    saveHiRes(image, overwriteOriginal, imageId);
}

function saveHiRes(myImage, overwriteOriginal, imageId) {
    /*var photoEntity = JSON.parse($("#hidPhotoEntity").val());

    var image = {
        imagePath: myImage,
        ID: imageId,
        saveAsOriginal: overwriteOriginal
    };*/

    $("#imgCloseOnSaveModal").hide();

    if (overwriteOriginal) {
        //$("#statusLbl, .status-text").text("Overwriting Original Image, please wait...");
        $("#modalEditSaveNewEditorMessage").text("Overwriting Original Image, please wait...");
    }
    else {
        //$("#statusLbl, .status-text").text("Saving Image as a Copy, please wait...");
        $("#modalEditSaveNewEditorMessage").text("Saving Image as a Copy, please wait...");
    }

    /*var json = JSON.stringify(image);

    $.ajax({
        url: '/Albums/Handlers/SaveEditImage.ashx',
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        type: 'POST',
        data: { data: json },
        dataType: 'json',
        timeout: 60 * 2000,
        success: function (data, textStatus, jqXHR) {
            if (data.ResultType == 1) {
                if (launchMode == editorLaunchMode.ONLINEALBUM) {
                    $("#statusLbl, .status-text").text("");
                    if (overwriteOriginal) {
                        PhotoView.updatePhotoUrl(photoEntity.ID, data.ThumbnailUrl, data.ImageUrl, data.ModifiedDate);
                    }
                    else {
                        var newPhoto = PhotoView.CreatPhotoEntity();
                        newPhoto.ID = data.ImageID;
                        newPhoto.AlbumID = photoEntity.AlbumID;
                        newPhoto.Title = data.Title;
                        newPhoto.ThumbnailUrl = data.ThumbnailUrl;
                        newPhoto.ImageUrl = data.ImageUrl;
                        newPhoto.IsNew = true;
                        newPhoto.ModifiedDate = data.ModifiedDate;
                        PhotoView.addPhotoEntity(newPhoto);
    
                    }
                }
                else if (launchMode == editorLaunchMode.GENERELKIOSK) {
                    $("#statusLbl").text("");

                    //Trigger kiosk success
                    var time = setTimeout(kioskEditorSuccess(data, overwriteOriginal), 2000);
                }
            }

            $('#modalEditSaveNewEditor').fadeOut(300);
            $('#imageEditor').modal('hide');
        }
    });*/
}

export function setAvailabilityOfUndoRedoReset(ctx) {
    if (ctx.isUndoAvailable()) {  /* If no history, undo and reset not available */
        if ($('#undoDiv').hasClass('disabled')) {
            $('#undoDiv').removeClass('disabled');
        }

        if ($('#resetDiv').hasClass('disabled')) {
            $('#resetDiv').removeClass('disabled');
        }
    } else {
        if (!$('#undoDiv').hasClass('disabled')) {
            $('#undoDiv').addClass('disabled');
        }

        if (!$('#resetDiv').hasClass('disabled')) {
            $('#resetDiv').addClass('disabled');
        }

    }

    if (ctx.isRedoAvailable()) {  /* If no forward history, redo not available */
        if ($('#redoDiv').hasClass('disabled')) {
            $('#redoDiv').removeClass('disabled');
        }

    } else {
        if (!$('#redoDiv').hasClass('disabled')) {
            $('#redoDiv').addClass('disabled');
        }
    }
}

export function InitializeImageZoom() {
    window.$("#imgPreviewImage").panzoom({
        $zoomRange: $(".zoom-range")
    });  
}

