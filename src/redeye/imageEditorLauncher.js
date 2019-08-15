
var dkrmImage = null;
var screenHeight = $(window).height();

var featherEditor = new Aviary.Feather({
    apiKey: 'c34c1758f74c4dcc9948e257aa1a5d08',
    isPremiumPartner: true,
    theme: 'light',
    tools: 'all',
    appendTo: '',
    onSaveButtonClicked: function (imageID) {

        if (!checkForceCropRatio()) {
            return false;
        }

        if (imageEditorEx.launchMode == editorLaunchMode.GENERELKIOSK) {
            saveEditImage('#modalEditSave', false);
        }
        else {
            $('#modalEditSave').modal('show');
        }
        return false;
    },
    onSaveHiRes: function (imageID, newURL) {
        // add mask on the x button on the to right of adobe studio and toolbar
        // so that they could not be clicked before saving image complete.
        var opaticy = 0;
        var spec = opaticy * 100;
        var opaticyCSS = 'filter:alpha(opacity=' + spec + ');opacity: ' + opaticy + ';';
        var divHtml = '<div class="divMask" style="position: absolute; width: 100%; height: 100%; left: 0px; top: 0px; background: #fff; ' + opaticyCSS + '"> </div>';
        $('#avpw_control_cancel_pane_inner').parent().append(divHtml);
        $('#avpw_control_cancel_pane_inner').data("mask", "true");
        $('#avpw_tool_main_container').parent().append(divHtml);
        $('#avpw_tool_main_container').data("mask", "true");

        var image = {
            imagePath: newURL,
            saveAsOriginal: getSaveAsOriginal(),
            ID: imageID.replace('thumbnail_', '')
        };
        if (typeof (PhotoView) == "undefined" && featherEditor.EditPhoto) {
            image.ID = featherEditor.EditPhoto.ID;
        }
        showOrHideMessageModal('Processing.<br /> Please wait while we save your photo.', true);

        var json = JSON.stringify(image);
        $.ajax({
            url: '/Albums/Handlers/SaveEditImage.ashx',
            type: 'POST',
            data: { data: json },
            dataType: 'json',
            timeout: 60 * 2000,
            success: function (data, textStatus, jqXHR) {
                if (data.ResultType == 1) {
                    showOrHideMessageModal('Save complete!');
                    if (imageEditorEx.launchMode == editorLaunchMode.ONLINEALBUM) {
                        /*PhotoView - begin*/
                        if (getSaveAsOriginal()) {
                            var img = document.getElementById(imageID);
                            if (featherEditor.EditPhoto) {
                                PhotoView.updatePhotoUrl(featherEditor.EditPhoto.ID, data.ThumbnailUrl, data.ImageUrl, data.ModifiedDate);
                            }
                        } else {
                            if (featherEditor.EditPhoto) {
                                var newPhoto = PhotoView.CreatPhotoEntity();
                                newPhoto.ID = data.ImageID;
                                newPhoto.AlbumID = featherEditor.EditPhoto.AlbumID;
                                newPhoto.Title = data.Title;
                                newPhoto.ThumbnailUrl = data.ThumbnailUrl;
                                newPhoto.ImageUrl = data.ImageUrl;
                                newPhoto.IsNew = true;
                                newPhoto.ModifiedDate = data.ModifiedDate;
                                PhotoView.addPhotoEntity(newPhoto);
                            }
                        }
                        /*PhotoView - end*/
                    }
                    else if (imageEditorEx.launchMode == editorLaunchMode.ONLINEOPTION
                        || imageEditorEx.launchMode == editorLaunchMode.POLAROIDKIOSK) {
                        /*New PrintOptions - begin*/
                        $('#' + imageID).attr("currentImageID", data.ImageID).trigger('ImageEdited');
                        console.log("ImageEdited: Original ImageID is " + imageID + " and New Image ID is " + data.ImageID)
                        /*New PrintOptions - end*/
                    }
                    else {
                        /*New Adobe Editor For Meijer Kiosk - begin*/
                        var time = setTimeout(kioskEditorSuccess(data), 2000);
                        /*New Adobe Editor For Meijer Kiosk  - begin*/
                    }
                    featherEditor.close();
                    showOrHideMessageModal('Save complete!', false);
                    imageEditorEx.saveAndClosed = true;

                } else if (data.ResultType == 2) {
                    showOrHideMessageModal('Session Time out!', false);
                    if (imageEditorEx.launchMode == editorLaunchMode.GENERELKIOSK) {
                        kioskEditorFailed('SessionTimeout');
                    }
                    else {
                        setTimeout(function () { window.location = window.location.href; }, 1000);
                    }
                    featherEditor.close();

                } else {
                    showOrHideMessageModal('Failed!', false);
                    kioskEditorFailed('Failed');
                    featherEditor.close();
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                showOrHideMessageModal('Error occurs!', false);
                kioskEditorFailed('ServerError');
                featherEditor.close();
            }
        });
    },
    onError: function (errorObj) {
        if (imageEditorEx.launchMode == editorLaunchMode.GENERELKIOSK) {
            showOrHideMessageModal("Code4: " + errorObj.code + "\nMessage: " + errorObj.message + "\nDetails: " + errorObj.args, false);
            kioskEditorFailed('AdobeError');
        }
        else {
            alert("Code4: " + errorObj.code + "\nMessage: " + errorObj.message + "\nDetails: " + errorObj.args);
        }
        featherEditor.close();
    },
    onLoad: function () {
        imageEditorEx.loaded = true;
    },
    onReady: function () {
        checkForceCropRatio();
        if (imageEditorEx.launchMode == editorLaunchMode.GENERELKIOSK) {
            $('#avpw_save_button').text('Save as copy')
                .css('width', '82px');

            var fixBtnInterval = setInterval(function () {
                if ($('#avpw_close_save').length > 0) {
                    $('#avpw_close_save').text('Save as copy');
                    clearInterval(fixBtnInterval);
                }
            }, 1000);
        }

        var $CloseButton = $("#avpw_control_cancel_pane_inner").hide();
        var $CloseButtonFake = $($('#avpw_control_cancel_pane_inner_faked')[0] || '<div id="avpw_control_cancel_pane_inner_faked" class="avpw_close_button avpw_main_close"><div class="avpw_close_inner">×</div></div>');

        $CloseButtonFake.insertAfter($CloseButton).click(function (e) {
            simulate(document.getElementById("avpw_all_effects"), "mousedown");
            simulate(document.getElementById("avpw_all_effects"), "mouseup");

            var interval = setInterval(function () {
                if ($("#avpw_tool_options_container:visible").length == 0) {
                    $CloseButton.show().click();
                    clearInterval(interval);
                }
            }, 100);
        });

    },
    onClose: function (isDirty) {
        if (imageEditorEx.launchMode == editorLaunchMode.GENERELKIOSK) {
            if (!imageEditorEx.saveAndClosed) {
                kioskEditorFailed("EditorClosed");
            }
        }
    }

});

var editorLaunchMode = {
    NONE: 0,
    ONLINEALBUM: 1,
    ONLINEOPTION: 2,
    GENERELKIOSK: 3,
    POLAROIDKIOSK: 4
}
var imageEditorEx = {
    loaded: false,
    launchMode: editorLaunchMode.NONE,
    saveAndClosed: false,
    forceCropRatio: ''
};

function getSaveAsOriginal() {
    return featherEditor.saveAsOriginal === undefined ? true : featherEditor.saveAsOriginal;
};



function getHost() {
    return window.location.protocol + "//" + window.location.host;
}

function getCurrentLaunchMode() {
    //Check launch mode
    if (typeof (PhotoView) != "undefined") {
        return editorLaunchMode.ONLINEALBUM;
    }
    else if (typeof (productDisplay) != "undefined") {
        if (typeof (KioskID) != "undefined") {
            return editorLaunchMode.POLAROIDKIOSK;
        }
        else {
            return editorLaunchMode.ONLINEOPTION;
        }
    }
    else if (typeof (KioskID) != "undefined") {
        return editorLaunchMode.GENERELKIOSK;
    }
    return editorLaunchMode.NONE;
}

function launchEditor(id, photoEntity) {
    displayImageEditorCanvas();//Editor Initial State
    $('#statusLbl').text('Loading');
    $('#loadingPhoto').show();
    $("#hidIsImageCropped").val("");
    $("#hidIsImageOrientationChanged").val("");
    $('#redEyeButtons').hide();
    $("#hidDoesImageHasFilter").val("");
    $("#hidDoesImageHasAdjustments").val("");
    $("#hidIsImageRedEyeChanged").val("");
    $('#hidFilterSelected').val("");
    $('#hidAdjustmentSelected').val("");
    $('#hidCropperOrOrientationUsed').val("");

    $("#hidImageId").val(id);
    $("#hidPhotoEntity").val(JSON.stringify(photoEntity));
    $("#hidEditorType").val("master");

    var image = document.getElementById(id);
    dkrmImage = image;
    var clipRatio = 16 / 9; // This is the crop locking ratio
    $("#divSizeCapsule").html(" 16&quot;  x  9&quot;");
    if (image.height > image.width) {
        clipRatio = 9 / 16;
    }

    var fixedCropRatio = false;

    if (image) {
        if (!/maxsize=[^&]/i.test(image.src))
            image.src += "&maxsize=150";

        if (!/maxsize=[^&]/i.test(photoEntity.ThumbnailUrl))
            photoEntity.ThumbnailUrl += "&maxsize=800";
        else
            photoEntity.ThumbnailUrl = photoEntity.ThumbnailUrl.replace(/maxsize=\s*[0-9]+/gi, "maxsize=800");

        if (photoEntity.ImageUrl.indexOf("http") != 0)
            photoEntity.ImageUrl = getHost() + photoEntity.ImageUrl;

        if (photoEntity.ThumbnailUrl.indexOf("http") != 0)
            photoEntity.ThumbnailUrl = getHost() + photoEntity.ThumbnailUrl;


        if (photoEntity.ClipRatioHeight !== undefined) {
            if (photoEntity.ClipRatioHeight) {
                clipRatio = photoEntity.ClipRatioWidth / photoEntity.ClipRatioHeight;
                fixedCropRatio = true;
                $("#divSizeCapsule").html(photoEntity.ClipRatioWidth + " & quot;  x  " + photoEntity.ClipRatioHeight + " & quot; ");
            }
            delete photoEntity.ClipRatioWidth;
            delete photoEntity.ClipRatioHeight;
        }
    }

    if (((image.height > image.width) && clipRatio > 1) || ((image.height < image.width) && clipRatio < 1)) {
        clipRatio = 1 / clipRatio;
    }

    var imgEditorCanvas = document.getElementById('imgEditorCanvas');
    var ctx = imgEditorCanvas.getContext('2d');

    ctx.clearRect(0, 0, imgEditorCanvas.width, imgEditorCanvas.height);

    /* Enable Cross Origin Image Editing */
    var img = new Image();
    img.crossOrigin = '';
    img.src = photoEntity.ImageUrl;
    $("#imgPreviewImage").attr("src", photoEntity.ImageUrl);

    resizePreviewImageToFitWindow();

    $(window).on('resize', function () {
        resizePreviewImageToFitWindow();
    });

    $("#imgPreviewImage").load(function () {
        resizePreviewImageToFitWindow();
    });


    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    $('#undoDiv').click(function () {
        ctx.undo();
        setAvailabilityOfUndoRedoReset(ctx);
    });

    $('#redoDiv').click(function () {
        ctx.redo();
        setAvailabilityOfUndoRedoReset(ctx);
    });

    $('#resetDiv').click(function () {
        ctx.reset();
        setAvailabilityOfUndoRedoReset(ctx);
    });

    img.onload = function () {
        $('#loadingPhoto').hide();
        $('#statusLbl').text('Image Editor');

        var canvasWidth = img.width;
        var canvasHeight = img.height;
        if (canvasWidth > $('#hidMaxSupportedResolution').val() || canvasHeight > $('#hidMaxSupportedResolution').val()) {
            if (canvasWidth > $('#hidMaxSupportedResolution').val()) {
                canvasHeight = canvasHeight * ($('#hidMaxSupportedResolution').val() / canvasWidth);
                canvasWidth = $('#hidMaxSupportedResolution').val();

            } else {
                canvasWidth = canvasWidth * ($('#hidMaxSupportedResolution').val() / canvasHeight);
                canvasHeight = $('#hidMaxSupportedResolution').val();
            }
        }
        imgEditorCanvas.width = canvasWidth;
        imgEditorCanvas.height = canvasHeight;
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        ctx.saveHistory(true);
        setAvailabilityOfUndoRedoReset(ctx);
    }

    $('#cropDiv').click(function () {
        $('#imageEditorOptions').hide();
        $('#imageEditorCropperOptions').show();
        $('#imageEditorOrientationOptions').hide();
        $('#imageEditorRedEyeOptions').hide();
        $('#hidRedEyeUsed').val("");
        $('#hidCropperOrOrientationUsed').val("");
        $('#redEyeButtons').hide();
        $('#imageEditorFilterOptions').hide();
        $('#hidFilterSelected').val("");
        $('#hidAdjustmentSelected').val("");
        $("#hidEditorType").val("cropper");
        if (fixedCropRatio) {
            $('#divRatioToggles').hide();
        } else {
            $('#divRatioToggles').show();
        }

        $('#rotationButtons').hide();
        $('#flipButtons').hide();
        $("#divFooterContents").addClass("disabled");


        var imgEditorCanvas = document.getElementById('imgEditorCanvas');
        var context = imgEditorCanvas.getContext('2d');
        var imageUrl = imgEditorCanvas.toDataURL('image/jpeg');
        $("#image").attr("src", imageUrl);
        $('#initialAspectRatio').val(clipRatio).trigger('change');
        $(".preview-image").hide();
        $("#divCropper").show();
        $('#footerZoom').addClass('zoom-footer-display');
    });

    $('#orientationDiv').unbind().click(function () {
        $('#imageEditorOptions').hide();
        $('#imageEditorCropperOptions').hide();
        $('#imageEditorOrientationOptions').show();
        $('#imageEditorRedEyeOptions').hide();
        $('#hidRedEyeUsed').val("");
        $('#redEyeButtons').hide();
        $('#imageEditorFilterOptions').hide();
        $('#hidFilterSelected').val("");
        $('#hidAdjustmentSelected').val("");
        $("#hidEditorType").val("orientation");
        $('#divRatioToggles').hide();
        $('#rotationButtons').show();
        $('#flipButtons').show();
        $("#divFooterContents").addClass("disabled");

        var imgEditorCanvas = document.getElementById('imgEditorCanvas');
        var context = imgEditorCanvas.getContext('2d');
        var imageUrl = imgEditorCanvas.toDataURL('image/jpeg');
        $("#image").attr("src", imageUrl);
        $('#initialAspectRatio').val(clipRatio).trigger('change');
        $(".preview-image").hide();
        $("#divCropper").show();
        $('#footerZoom').addClass('zoom-footer-display');
        setTimeout(clearCrop(), 500);
    });

    $('#redEyeDiv').unbind().click(function () {
        $('#redeyeZoomAlign').prop("disabled", true);
        $("#imgPreviewImage").panzoom("resetZoom");
        $("#imgPreviewImage").panzoom("resetPan");
        $("#imgPreviewImage").panzoom("zoom", 1.0, { silent: true });
        $("#imgPreviewImage").panzoom("disable");

        $('#imageEditorOptions').hide();
        $('#imageEditorCropperOptions').hide();
        $('#imageEditorOrientationOptions').hide();
        $('#hidFilterSelected').val("");
        $('#hidAdjustmentSelected').val("");
        $('#hidRedEyeUsed').val("");
        $('#hidCropperOrOrientationUsed').val("");
        $('#imageEditorRedEyeOptions').show();
        $("#hidEditorType").val("redeye");
        $('#divRatioToggles').hide();
        $('#rotationButtons').hide();
        $('#flipButtons').hide();
        $('#redEyeButtons').show();
        $("#divFooterContents").addClass("disabled");

        var test = $('.cropper-crop-box');
        $('.cropper-crop-box').addClass('cropper-hidden');

        var imgEditorCanvas = document.getElementById('imgEditorCanvas');
        var context = imgEditorCanvas.getContext('2d');
        var imageUrl = imgEditorCanvas.toDataURL('image/jpeg');
        $("#image").attr("src", imageUrl);
        $('#initialAspectRatio').val(clipRatio).trigger('change');
        //$("#divCropper").height(screenHeight);
        $("#divCropper").hide();
        $(".preview-image").show();
        setTimeout(clearCrop(), 500);

        //set default cursor size
        $('#imgPreviewImage').css('cursor', '');
        $("#redEyeCursorSize").val("10");
        $("#imgPreviewImage").addClass('circle24');
        $("#redEyeBrushMed").attr('class', 'redEyeBrush-selected');
        $("#redEyeBrushSmall").addClass("redEyeBrush-non-selected");
        $("#redEyeBrushLg").addClass("redEyeBrush-non-selected");
        //set tool defaults
        $('#redeyeZoomText').removeClass('redeye-zoom-text');
        $("#redeyeZoomText").addClass("redeye-zoom-text-deactivated");
        $('#redeye-zoom').removeClass('redeye-zoom');
        $("#redeye-zoom").addClass("redeye-zoom-deactivated");
        $('#redeyeZoomRange').removeClass('zoom-redeye-slider');
        $('#redeyeZoomRange').addClass('zoom-redeye-slider-deactivated');

        $('#redEyeBrush').removeClass('redEye-buttons-deactivated');
        $('#redEyeBrushCircleSmall').removeClass('redEyeBrush-circle-deactivated');
        $('#redEyeBrushCircleMed').removeClass('redEyeBrush-circle-deactivated');
        $('#redEyeBrushCircleLg').removeClass('redEyeBrush-circle-deactivated');
        $('#redEyeBrushTextSmall').removeClass('redEyeBrush-text-deactivated');
        $('#redEyeBrushTextMed').removeClass('redEyeBrush-text-deactivated');
        $('#redEyeBrushTextLg').removeClass('redEyeBrush-text-deactivated');

        $('#redEyeBrushSmall').removeClass('redEyeBrush-deactivated');
        $('#redEyeBrushSmall').addClass('redEyeBrushSmall');

        $('#redEyeBrushMed').removeClass('redEyeBrush-deactivated');
        $('#redEyeBrushMed').addClass('redEyeBrushMed');

        $('#redEyeBrushLg').removeClass('redEyeBrush-deactivated');
        $('#redEyeBrushLg').addClass('redEyeBrushLg');

        $('#redeyeZoomAlign').addClass('redeye-zoom-align-deactivated');
        $('#footerZoom').addClass('zoom-footer-display');

        getImageScaleFactor();
    });

    $('#filterDiv').unbind().click(function () {
        $('#imageEditorOptions').hide();
        $('#imageEditorCropperOptions').hide();
        $('#imageEditorOrientationOptions').hide();
        $('#imageEditorRedEyeOptions').hide();
        $('#hidRedEyeUsed').val("");
        $('#hidCropperOrOrientationUsed').val("");
        $('#redEyeButtons').hide();
        $('#imageEditorFilterOptions').show();
        $("#hidEditorType").val("filter");
        $('#hidFilterSelected').val("");
        $('#hidAdjustmentSelected').val("");
        $("#divFooterContents").addClass("disabled");
        $('#footerZoom').addClass('zoom-footer-display');

        var imgEditorCanvas = document.getElementById('imgEditorCanvas');
        var imageUrl = imgEditorCanvas.toDataURL('image/jpeg');

        var filterCanvas = document.getElementById('filterCanvas');
        var filterCtx = filterCanvas.getContext('2d');

        filterCtx.clearRect(0, 0, filterCanvas.width, filterCanvas.height);

        var filterCanvasImg = new Image();
        filterCanvasImg.crossOrigin = '';
        filterCanvasImg.src = imageUrl;

        filterCanvasImg.onload = function () {
            var screenHeightFilter = $(window).height() - 314;
            var scaleRatioFilter = screenHeightFilter / filterCanvasImg.height;
            var drawWidthFilter = filterCanvasImg.width * scaleRatioFilter

            filterCanvas.width = drawWidthFilter;
            filterCanvas.height = screenHeightFilter;
            filterCtx.drawImage(filterCanvasImg, 0, 0, drawWidthFilter, screenHeightFilter);

            $('#hidFilterImageDisplayHeight').val(screenHeightFilter);
            $('#hidFilterImageDisplayWidth').val(drawWidthFilter);
        }

        $('#originalImageFilter').val(imageUrl);

        buildFilterThumbnails();

        $(".preview-image").hide();
        $("#divFilter").height($(window).height() - 284);
        $("#divFilter").show();

    });

    $('#adjustDiv').unbind().click(function () {
        $('#imageEditorOptions').hide();
        $('#imageEditorCropperOptions').hide();
        $('#imageEditorOrientationOptions').hide();
        $('#imageEditorRedEyeOptions').hide();
        $('#hidRedEyeUsed').val("");
        $('#hidCropperOrOrientationUsed').val("");
        $('#redEyeButtons').hide();
        $('#imageEditorFilterOptions').hide();
        $('#hidFilterSelected').val("");

        $('#imageEditorAdjustOptions').show();
        $("#hidEditorType").val("adjust");
        $('#hidAdjustmentSelected').val("");
        $("#divFooterContents").addClass("disabled");
        $('#footerZoom').addClass('zoom-footer-display');

        var imgEditorCanvas = document.getElementById('imgEditorCanvas');
        var imageUrl = imgEditorCanvas.toDataURL('image/jpeg');

        var adjustCanvas = document.getElementById('adjustCanvas');
        var adjustCtx = adjustCanvas.getContext('2d');

        adjustCtx.clearRect(0, 0, adjustCanvas.width, adjustCanvas.height);

        var adjustCanvasImg = new Image();
        adjustCanvasImg.crossOrigin = '';
        adjustCanvasImg.src = imageUrl;

        adjustCanvasImg.onload = function () {
            var screenHeightAdjust = $(window).height() - 314;
            var scaleRatioAdjust = screenHeightAdjust / adjustCanvasImg.height;
            var drawWidthAdjust = adjustCanvasImg.width * scaleRatioAdjust

            adjustCanvas.width = drawWidthAdjust;
            adjustCanvas.height = screenHeightAdjust;
            adjustCtx.drawImage(adjustCanvasImg, 0, 0, drawWidthAdjust, screenHeightAdjust);

            $('#hidAdjustImageDisplayHeight').val(screenHeightAdjust);
            $('#hidAdjustImageDisplayWidth').val(drawWidthAdjust);
        }

        $('#originalImageAdjust').val(imageUrl);

        initializeAdjustSliderValues();

        $(".preview-image").hide();
        $("#divAdjust").height($(window).height() - 284);
        $("#divAdjust").show();

    });

    function clearCrop() {
        $('#cropClear').val(1).trigger('change');
    }

    $('#applyBtnSubEditor').on('click', function (e) {
        $("#hidIsImageCropped").val("true");
        displayImageEditorCanvas();
        setAvailabilityOfUndoRedoReset(ctx);

    });

    $('#applyOrientationBtn').on('click', function (e) {
        $("#hidIsImageOrientationChanged").val("true");
        displayImageEditorCanvas();
        setAvailabilityOfUndoRedoReset(ctx);
    });
    $('#applyRedEyeBtn').on('click', function (e) {
        $("#hidIsImageRedEyeChanged").val("true");
        $('#statusLbl').text('Applying red eye settings, please wait...');
        displayImageEditorCanvas();
        ctx.saveHistory();
        setAvailabilityOfUndoRedoReset(ctx);

    });
    $('#applySelectedRedEyeBtn').on('click', function (e) {
        $('#modalEditImageCloseSubEditor').fadeOut(300);
        $("#hidIsImageRedEyeChanged").val("true");
        $('#statusLbl').text('Applying red eye settings, please wait...');
        displayImageEditorCanvas();
        ctx.saveHistory();
        setAvailabilityOfUndoRedoReset(ctx);

    });

    $('#redEyeBrushSmall').on('click', function (e) {
        $("#redEyeCursorSize").val("6");

        $("#redEyeCursorSmall").attr('class', 'btn btn-success');
        $("#redEyeCursorMed").attr('class', 'btn btn-primary');
        $("#redEyeCursorLarge").attr('class', 'btn btn-primary');

        $("#imgPreviewImage").removeClass('circle24');
        $("#imgPreviewImage").removeClass('circle48');
        $("#imgPreviewImage").addClass('circle16');

        $("#redEyeBrushSmall").attr('class', 'redEyeBrush-selected');
        $('#redEyeBrushMed').removeClass('redEyeBrush-selected');
        $('#redEyeBrushMed').removeClass('redEyeBrush-deactivated');
        $('#redEyeBrushMed').addClass('redEyeBrush-non-selected');
        $('#redEyeBrushLg').removeClass('redEyeBrush-selected');
        $('#redEyeBrushLg').removeClass('redEyeBrush-deactivated');
        $('#redEyeBrushLg').addClass('redEyeBrush-non-selected');

        //deactivate zoom functions
        $('#redeyeZoomText').removeClass('redeye-zoom-text');
        $("#redeyeZoomText").addClass("redeye-zoom-text-deactivated");

        $('#redeye-zoom').removeClass('redeye-zoom');
        $("#redeye-zoom").addClass("redeye-zoom-deactivated");

        $('#redeyeZoomRange').removeClass('zoom-redeye-slider');
        $('#redeyeZoomRange').addClass('zoom-redeye-slider-deactivated');
    });
    $('#redEyeBrushMed').on('click', function (e) {
        $("#redEyeCursorSize").val("10");
        $("#redEyeCursorMed").attr('class', 'btn btn-success');

        $("#redEyeCursorSmall").attr('class', 'btn btn-primary');
        $("#redEyeCursorLarge").attr('class', 'btn btn-primary');

        $("#imgPreviewImage").removeClass('circle16');
        $("#imgPreviewImage").removeClass('circle48');
        $("#imgPreviewImage").addClass('circle24');

        $("#redEyeBrushMed").attr('class', 'redEyeBrush-selected');
        $('#redEyeBrushSmall').removeClass('redEyeBrush-selected');
        $('#redEyeBrushSmall').removeClass('redEyeBrush-deactivated');
        $('#redEyeBrushSmall').addClass('redEyeBrush-non-selected');
        $('#redEyeBrushLg').removeClass('redEyeBrush-selected');
        $('#redEyeBrushLg').removeClass('redEyeBrush-deactivated');
        $('#redEyeBrushLg').addClass('redEyeBrush-non-selected');

        //deactivate zoom functions
        $('#redeyeZoomText').removeClass('redeye-zoom-text');
        $("#redeyeZoomText").addClass("redeye-zoom-text-deactivated");

        $('#redeye-zoom').removeClass('redeye-zoom');
        $("#redeye-zoom").addClass("redeye-zoom-deactivated");

        $('#redeyeZoomRange').removeClass('zoom-redeye-slider');
        $('#redeyeZoomRange').addClass('zoom-redeye-slider-deactivated');
    });
    $('#redEyeBrushLg').on('click', function (e) {
        $("#redEyeCursorSize").val("15");
        $("#redEyeCursorLarge").attr('class', 'btn btn-success');

        $("#redEyeCursorSmall").attr('class', 'btn btn-primary');
        $("#redEyeCursorMed").attr('class', 'btn btn-primary');

        $("#imgPreviewImage").removeClass('circle16');
        $("#imgPreviewImage").removeClass('circle24');
        $("#imgPreviewImage").addClass('circle48');

        $("#redEyeBrushLg").attr('class', 'redEyeBrush-selected');
        $('#redEyeBrushSmall').removeClass('redEyeBrush-selected');
        $('#redEyeBrushSmall').removeClass('redEyeBrush-deactivated');
        $('#redEyeBrushSmall').addClass('redEyeBrush-non-selected');
        $('#redEyeBrushMed').removeClass('redEyeBrush-selected');
        $('#redEyeBrushMed').removeClass('redEyeBrush-deactivated');
        $('#redEyeBrushMed').addClass('redEyeBrush-non-selected');

        //deactivate zoom functions
        $('#redeyeZoomText').removeClass('redeye-zoom-text');
        $("#redeyeZoomText").addClass("redeye-zoom-text-deactivated");

        $('#redeye-zoom').removeClass('redeye-zoom');
        $("#redeye-zoom").addClass("redeye-zoom-deactivated");

        $('#redeyeZoomRange').removeClass('zoom-redeye-slider');
        $('#redeyeZoomRange').addClass('zoom-redeye-slider-deactivated');
    });
    $('#redeye-zoom').on('click', function (e) {
        $('#redeyeZoomAlign').prop("disabled", false);
        $("#imgPreviewImage").panzoom("enable");
        //set cursor
        $("#imgPreviewImage").removeClass('circle16');
        $("#imgPreviewImage").removeClass('circle24');
        $("#imgPreviewImage").removeClass('circle48');
        $("#imgPreviewImage").addClass('zoom-cursor');

        $('#redeye-zoom').removeClass('zoom-cursor-deactivated');
        //deactivate brush
        $('#redEyeBrushSmall').addClass('redEyeBrush-deactivated');
        $("#redEyeBrushSmall").removeClass("redEyeBrushSmall");
        $("#redEyeBrushSmall").removeClass("redEyeBrush-selected");
        $("#redEyeBrushSmall").removeClass("redEyeBrush-non-selected");

        $('#redEyeBrushMed').addClass('redEyeBrush-deactivated');
        $("#redEyeBrushMed").removeClass("redEyeBrushMed");
        $("#redEyeBrushMed").removeClass("redEyeBrush-selected");
        $("#redEyeBrushMed").removeClass("redEyeBrush-non-selected");

        $('#redEyeBrushLg').addClass('redEyeBrush-deactivated');
        $('#redEyeBrushLg').removeClass('redEyeBrushLg');
        $('#redEyeBrushLg').removeClass('redEyeBrush-selected');
        $("#redEyeBrushLg").removeClass("redEyeBrush-non-selected");

        $('#redEyeBrush').addClass('redEye-buttons-deactivated');
        $('#redEyeBrushCircleSmall').addClass('redEyeBrush-circle-deactivated');
        $('#redEyeBrushCircleMed').addClass('redEyeBrush-circle-deactivated');
        $('#redEyeBrushCircleLg').addClass('redEyeBrush-circle-deactivated');
        $('#redEyeBrushTextSmall').addClass('redEyeBrush-text-deactivated');
        $('#redEyeBrushTextMed').addClass('redEyeBrush-text-deactivated');
        $('#redEyeBrushTextLg').addClass('redEyeBrush-text-deactivated');

        $('#redeyeZoomAlign').removeClass('redeye-zoom-align-deactivated');


        //activate zoom functions
        $('#redeyeZoomText').addClass('redeye-zoom-text');
        $("#redeyeZoomText").removeClass("redeye-zoom-text-deactivated");

        $('#redeye-zoom').addClass('redeye-zoom');
        $("#redeye-zoom").removeClass("redeye-zoom-deactivated");

        $('#redeyeZoomRange').addClass('zoom-redeye-slider');
        $('#redeyeZoomRange').removeClass('zoom-redeye-slider-deactivated');
    });
    $('#redeye-zoom').hover(function (e) {
        if ($('#redeyeZoomAlign').hasClass('redeye-zoom-align-deactivated')) {
            //redeye-zoom
            $('#redeye-zoom').addClass('zoom-cursor-deactivated');
        }
    });
    $('#redEyeBrush').hover(function (e) {
        if ($('#redEyeBrush').hasClass('redEye-buttons-deactivated')) {
            //redeye-zoom
            $('#redEyeBrush').addClass('zoom-cursor-deactivated');
        }
    });
    $('#redEyeBrush').on('click', function (e) {
        $('#redeyeZoomAlign').prop("disabled", true);
        //disable zoom
        $("#imgPreviewImage").panzoom("disable");
        //remove inactive cursor
        $('#redEyeBrush').removeClass('zoom-cursor-deactivated');
        //remove zoom cursor
        $('#imgPreviewImage').removeClass('zoom-cursor');
        //general class removes on section click
        $('#redEyeBrushSmall').removeClass('redEyeBrush-deactivated');
        $('#redEyeBrushSmall').addClass('redEyeBrushSmall');

        $('#redEyeBrushMed').removeClass('redEyeBrush-deactivated');
        $('#redEyeBrushMed').addClass('redEyeBrushMed');

        $('#redEyeBrushLg').removeClass('redEyeBrush-deactivated');
        $('#redEyeBrushLg').addClass('redEyeBrushLg');

        $('#redEyeBrush').removeClass('redEye-buttons-deactivated');
        $('#redEyeBrushCircleSmall').removeClass('redEyeBrush-circle-deactivated');
        $('#redEyeBrushCircleMed').removeClass('redEyeBrush-circle-deactivated');
        $('#redEyeBrushCircleLg').removeClass('redEyeBrush-circle-deactivated');
        $('#redEyeBrushTextSmall').removeClass('redEyeBrush-text-deactivated');
        $('#redEyeBrushTextMed').removeClass('redEyeBrush-text-deactivated');
        $('#redEyeBrushTextLg').removeClass('redEyeBrush-text-deactivated');

        $('#redeyeZoomAlign').addClass('redeye-zoom-align-deactivated');

        //redeyeZoomAlign
    });
    $('#imgPreviewImage').on('click', function (e) {
        function getMousePos(image, evt) {
            var image = null;
            var imgScaleFactor = getImageScaleFactor();
            var zoomScaleFactor = $("#redEyeTransformationsScale").val();

            image = document.getElementById('imgPreviewImage');

            var myImgScaleFactor = imgScaleFactor.h;
            //scaleFactor = scaleFactor * scale factor of imgPreview to canvas

            var mouseX = evt.offsetX ? ((evt.offsetX) * myImgScaleFactor) : ((evt.pageX - image.offsetLeft) * myImgScaleFactor);
            var mouseY = evt.offsetY ? ((evt.offsetY) * myImgScaleFactor) : ((evt.pageY - image.offsetTop) * myImgScaleFactor);

            return {
                x: mouseX,
                y: mouseY,
                i: myImgScaleFactor
            };
        }
        if ($("#hidEditorType").val() == 'redeye') {
            if ($('#redeyeZoomRange').hasClass('zoom-redeye-slider-deactivated')) {
                var mousePos = getMousePos(image, e);

                $('#hidRedEyeUsed').val("true");
                var zoomScale = $("#redEyeTransformationsScale").val();
                var ogZoomScale = zoomScale * mousePos.i;
                var zoomedZoomScale = mousePos.i / zoomScale;

                var cursorSize = parseInt($('#redEyeCursorSize').val());
                var cursorDiameter = 0;
                if (zoomScale > 1) {
                    cursorDiameter = Math.round((cursorSize * 2) * zoomedZoomScale);
                }
                else {
                    cursorDiameter = Math.round((cursorSize * 2) * ogZoomScale);
                }

                //find the area to apply the red eye correction
                var redEyeImageArea = ctx.getImageData(mousePos.x - cursorDiameter / 2, mousePos.y - cursorDiameter / 2, cursorDiameter, cursorDiameter);
                var pixels = redEyeImageArea.data;
                var isRedEyePixelsChanged = false;
                diameterOfRedEyeFix = redEyeImageArea.height;

                for (var i = 0; i < pixels.length; i += 4) {
                    var redIntensity = (pixels[i] / ((pixels[i + 1] + pixels[i + 2]) / 2));

                    var xCoordinateOfPixel = (i / 4) % diameterOfRedEyeFix;
                    var yCoordinateOfPixel = Math.floor((i / 4) / diameterOfRedEyeFix);

                    var isPixelWithintheCircle = ((Math.pow((xCoordinateOfPixel - (diameterOfRedEyeFix / 2)), 2) + Math.pow((yCoordinateOfPixel - (diameterOfRedEyeFix / 2)), 2)) < Math.pow(diameterOfRedEyeFix / 2, 2));

                    if ((redIntensity > 1.5) && isPixelWithintheCircle)  // 1.5 because it gives the best results
                    {
                        // reduce red to the average of blue and green
                        var r = (pixels[i + 1] + pixels[i + 2]) / 2;
                        var g = pixels[i + 1];
                        var b = pixels[i + 2];
                        var a = pixels[i + 3];
                        redEyeImageArea.data[i] = r;
                        redEyeImageArea.data[i + 1] = g;
                        redEyeImageArea.data[i + 2] = b;
                        redEyeImageArea.data[i + 3] = a;

                        isRedEyePixelsChanged = true;
                    }
                    //ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
                if (isRedEyePixelsChanged) {
                    ctx.putImageData(redEyeImageArea, mousePos.x - cursorDiameter / 2, mousePos.y - cursorDiameter / 2);
                    var editedImage = ctx.canvas.toDataURL();
                    $('#redEyeImageID').val(editedImage);
                    //update imgPreview

                    $("#imgPreviewImage").attr("src", editedImage);
                }
            }
        }
    });

    $('#btnApplySubEditorPopup').on('click', function (e) {
        var editorType = $("#hidEditorType").val();

        if (editorType == "cropper") {
            $("#hidIsImageCropped").val("true");
        }
        else if (editorType == "orientation") {
            $("#hidIsImageOrientationChanged").val("true");
        }
        else if (editorType == "redeye") {
            $("#hidIsImageRedEyeChanged").val("true");
        }
        $('#modalEditImageCloseSubEditor').fadeOut(300);
        displayImageEditorCanvas();
        setAvailabilityOfUndoRedoReset(ctx);
    });

    $('#originalImage').val(image.src);
    $("#imageEditor").modal({ backdrop: "static" });

    return false;
}

function resizePreviewImageToFitWindow() {
    var editorType = $("#hidEditorType").val();

    /*get the width and height of modal-body div*/
    screenWidth = ($(window).width() - 163 >= 1140) ? 1140 : $(window).width() - 163;
    screenHeight = $(window).height() - 314;

    if (editorType == "redeye") {
        var canvas = document.getElementById('imgEditorCanvas');
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;

        var prvImg = $("#imgPreviewImage");
        var prvImgWidth = prvImg[0].clientWidth;
        var prvImgHeight = prvImg[0].clientHeight;

        var widthRatio = canvasWidth / prvImgWidth;   // get ratio for scaling image
        var heightRatio = canvasHeight / prvImgHeight; // get ratio for scaling image

        //i need to change the width of the image element here to fit the image in order to get the mouse click correct
        //take width / scale factor to update width element
        var scaledImageWidth = canvasWidth / heightRatio;

        $("#imgPreviewImage").css("height", screenHeight);
        $("#imgPreviewImage").css("width", scaledImageWidth);
    }
    else {
        $("#imgPreviewImage").css("height", screenHeight);
    }
    $("#divCropper").height(screenHeight);
}

function getImageScaleFactor() {
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

function displayImageEditorCanvas() {
    $("#hidEditorType").val("master");
    $("#divCropper").hide();
    $("#divFilter").hide();
    $("#divAdjust").hide();
    $(".preview-image").show();
    $('#imageEditorOptions').show();
    $('#imageEditorCropperOptions').hide();
    $('#imageEditorOrientationOptions').hide();
    $('#imageEditorFilterOptions').hide();
    $('#imageEditorRedEyeOptions').hide();
    $('#imageEditorAdjustOptions').hide();
    $('#redEyeButtons').hide();
    $('#imgPreviewImage').removeClass('circle16 circle24 circle48');
    $('#redEyeBrushSmall').removeClass('redEyeBrush-selected');
    $('#redEyeBrushMed').removeClass('redEyeBrush-selected');
    $('#redEyeBrushLg').removeClass('redEyeBrush-selected');
    $("#divFooterContents").removeClass("disabled");

    if ($('#footerZoom').hasClass('zoom-footer-display')) {
        $('#footerZoom').removeClass('zoom-footer-display');
    }
    $('#statusLbl').text('Image Editor');
    //reenable zoom
    $("#imgPreviewImage").panzoom("enable");

    $("#imgPreviewImage").panzoom("resetZoom");
    $("#imgPreviewImage").panzoom("resetPan");
    $("#imgPreviewImage").panzoom("zoom", 1.0, { silent: true });
}

function setAvailabilityOfUndoRedoReset(ctx) {
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

function closeSubEditor() {
    $('#modalEditImageCloseSubEditor').fadeOut();
    var ctx = imgEditorCanvas.getContext('2d');
    ctx.reloadLastSavedImage();

    displayImageEditorCanvas();
    $("#redEyeTransformationsScale").val('');
    $("#redEyeTransformationsPanX").val('');
    $("#redEyeTransformationsPanY").val('');

}

function buildFilterThumbnails() {
    $(window).resize();
    $('.responsive-img-slider').slick('slickGoTo', 0);
    $("#divFilter .filterSelected").removeClass("filterSelected");
    $("#originalBtn").addClass("filterSelected");

    var thumbnailWidth = 100;
    var thumbnailHeight = 100;

    var imgEditorCanvas = document.getElementById('imgEditorCanvas');

    var originalBtn = document.getElementById('originalBtn');
    var originalBtnCtx = originalBtn.getContext('2d');
    originalBtnCtx.clearRect(0, 0, originalBtn.width, originalBtn.height);
    originalBtn.width = thumbnailWidth;
    originalBtn.height = thumbnailHeight;
    originalBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);

    var vintageBtn = document.getElementById('vintageBtn');
    var vintageBtnCtx = vintageBtn.getContext('2d');
    vintageBtnCtx.clearRect(0, 0, vintageBtn.width, vintageBtn.height);
    vintageBtn.width = thumbnailWidth;
    vintageBtn.height = thumbnailHeight;
    vintageBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);
    Caman('#vintageBtn', function () {
        this.reloadCanvasData();
        this.vintage();
        this.render();
    });

    var lomoBtn = document.getElementById('lomoBtn');
    var lomoBtnCtx = lomoBtn.getContext('2d');
    lomoBtnCtx.clearRect(0, 0, lomoBtn.width, lomoBtn.height);
    lomoBtn.width = thumbnailWidth;
    lomoBtn.height = thumbnailHeight;
    lomoBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);
    Caman('#lomoBtn', function () {
        this.reloadCanvasData();
        this.lomo();
        this.render();
    });

    var clarityBtn = document.getElementById('clarityBtn');
    var clarityBtnCtx = clarityBtn.getContext('2d');
    clarityBtnCtx.clearRect(0, 0, clarityBtn.width, clarityBtn.height);
    clarityBtn.width = thumbnailWidth;
    clarityBtn.height = thumbnailHeight;
    clarityBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);
    Caman('#clarityBtn', function () {
        this.reloadCanvasData();
        this.clarity();
        this.render();
    });

    var sincityBtn = document.getElementById('sincityBtn');
    var sincityBtnCtx = sincityBtn.getContext('2d');
    sincityBtnCtx.clearRect(0, 0, sincityBtn.width, sincityBtn.height);
    sincityBtn.width = thumbnailWidth;
    sincityBtn.height = thumbnailHeight;
    sincityBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);
    Caman('#sincityBtn', function () {
        this.reloadCanvasData();
        this.sinCity();
        this.render();
    });

    var sunriseBtn = document.getElementById('sunriseBtn');
    var sunriseBtnCtx = sunriseBtn.getContext('2d');
    sunriseBtnCtx.clearRect(0, 0, sunriseBtn.width, sunriseBtn.height);
    sunriseBtn.width = thumbnailWidth;
    sunriseBtn.height = thumbnailHeight;
    sunriseBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);
    Caman('#sunriseBtn', function () {
        this.reloadCanvasData();
        this.sunrise();
        this.render();
    });

    var crossProcessBtn = document.getElementById('crossProcessBtn');
    var crossProcessBtnCtx = crossProcessBtn.getContext('2d');
    crossProcessBtnCtx.clearRect(0, 0, crossProcessBtn.width, crossProcessBtn.height);
    crossProcessBtn.width = thumbnailWidth;
    crossProcessBtn.height = thumbnailHeight;
    crossProcessBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);
    Caman('#crossProcessBtn', function () {
        this.reloadCanvasData();
        this.crossProcess();
        this.render();
    });

    var orangePeelBtn = document.getElementById('orangePeelBtn');
    var orangePeelBtnCtx = orangePeelBtn.getContext('2d');
    orangePeelBtnCtx.clearRect(0, 0, orangePeelBtn.width, orangePeelBtn.height);
    orangePeelBtn.width = thumbnailWidth;
    orangePeelBtn.height = thumbnailHeight;
    orangePeelBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);
    Caman('#orangePeelBtn', function () {
        this.reloadCanvasData();
        this.orangePeel();
        this.render();
    });

    var loveBtn = document.getElementById('loveBtn');
    var loveBtnCtx = loveBtn.getContext('2d');
    loveBtnCtx.clearRect(0, 0, loveBtn.width, loveBtn.height);
    loveBtn.width = thumbnailWidth;
    loveBtn.height = thumbnailHeight;
    loveBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);
    Caman('#loveBtn', function () {
        this.reloadCanvasData();
        this.love();
        this.render();
    });

    var grungyBtn = document.getElementById('grungyBtn');
    var grungyBtnCtx = grungyBtn.getContext('2d');
    grungyBtnCtx.clearRect(0, 0, grungyBtn.width, grungyBtn.height);
    grungyBtn.width = thumbnailWidth;
    grungyBtn.height = thumbnailHeight;
    grungyBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);
    Caman('#grungyBtn', function () {
        this.reloadCanvasData();
        this.grungy();
        this.render();
    });

    var jarquesBtn = document.getElementById('jarquesBtn');
    var jarquesBtnCtx = jarquesBtn.getContext('2d');
    jarquesBtnCtx.clearRect(0, 0, jarquesBtn.width, jarquesBtn.height);
    jarquesBtn.width = thumbnailWidth;
    jarquesBtn.height = thumbnailHeight;
    jarquesBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);
    Caman('#jarquesBtn', function () {
        this.reloadCanvasData();
        this.jarques();
        this.render();
    });

    var pinHoleBtn = document.getElementById('pinHoleBtn');
    var pinHoleBtnCtx = pinHoleBtn.getContext('2d');
    pinHoleBtnCtx.clearRect(0, 0, pinHoleBtn.width, pinHoleBtn.height);
    pinHoleBtn.width = thumbnailWidth;
    pinHoleBtn.height = thumbnailHeight;
    pinHoleBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);
    Caman('#pinHoleBtn', function () {
        this.reloadCanvasData();
        this.pinhole();
        this.render();
    });

    var oldBootBtn = document.getElementById('oldBootBtn');
    var oldBootBtnCtx = oldBootBtn.getContext('2d');
    oldBootBtnCtx.clearRect(0, 0, oldBootBtn.width, oldBootBtn.height);
    oldBootBtn.width = thumbnailWidth;
    oldBootBtn.height = thumbnailHeight;
    oldBootBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);
    Caman('#oldBootBtn', function () {
        this.reloadCanvasData();
        this.oldBoot();
        this.render();
    });

    var glowingSunBtn = document.getElementById('glowingSunBtn');
    var glowingSunBtnCtx = glowingSunBtn.getContext('2d');
    glowingSunBtnCtx.clearRect(0, 0, glowingSunBtn.width, glowingSunBtn.height);
    glowingSunBtn.width = thumbnailWidth;
    glowingSunBtn.height = thumbnailHeight;
    glowingSunBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);
    Caman('#glowingSunBtn', function () {
        this.reloadCanvasData();
        this.glowingSun();
        this.render();
    });

    var hazyDaysBtn = document.getElementById('hazyDaysBtn');
    var hazyDaysBtnCtx = hazyDaysBtn.getContext('2d');
    hazyDaysBtnCtx.clearRect(0, 0, hazyDaysBtn.width, hazyDaysBtn.height);
    hazyDaysBtn.width = thumbnailWidth;
    hazyDaysBtn.height = thumbnailHeight;
    hazyDaysBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);
    Caman('#hazyDaysBtn', function () {
        this.reloadCanvasData();
        this.hazyDays();
        this.render();
    });

    var herMajestyBtn = document.getElementById('herMajestyBtn');
    var herMajestyBtnCtx = herMajestyBtn.getContext('2d');
    herMajestyBtnCtx.clearRect(0, 0, herMajestyBtn.width, herMajestyBtn.height);
    herMajestyBtn.width = thumbnailWidth;
    herMajestyBtn.height = thumbnailHeight;
    herMajestyBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);
    Caman('#herMajestyBtn', function () {
        this.reloadCanvasData();
        this.herMajesty();
        this.render();
    });

    var nostalgiaBtn = document.getElementById('nostalgiaBtn');
    var nostalgiaBtnCtx = nostalgiaBtn.getContext('2d');
    nostalgiaBtnCtx.clearRect(0, 0, nostalgiaBtn.width, nostalgiaBtn.height);
    nostalgiaBtn.width = thumbnailWidth;
    nostalgiaBtn.height = thumbnailHeight;
    nostalgiaBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);
    Caman('#nostalgiaBtn', function () {
        this.reloadCanvasData();
        this.nostalgia();
        this.render();
    });

    var hemingwayBtn = document.getElementById('hemingwayBtn');
    var hemingwayBtnCtx = hemingwayBtn.getContext('2d');
    hemingwayBtnCtx.clearRect(0, 0, hemingwayBtn.width, hemingwayBtn.height);
    hemingwayBtn.width = thumbnailWidth;
    hemingwayBtn.height = thumbnailHeight;
    hemingwayBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);
    Caman('#hemingwayBtn', function () {
        this.reloadCanvasData();
        this.hemingway();
        this.render();
    });

    var concentrateBtn = document.getElementById('concentrateBtn');
    var concentrateBtnCtx = concentrateBtn.getContext('2d');
    concentrateBtnCtx.clearRect(0, 0, concentrateBtn.width, concentrateBtn.height);
    concentrateBtn.width = thumbnailWidth;
    concentrateBtn.height = thumbnailHeight;
    concentrateBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);
    Caman('#concentrateBtn', function () {
        this.reloadCanvasData();
        this.concentrate();
        this.render();
    });
}

function initializeAdjustSliderValues() {
    $('#Brightness').val(0);
    $('#Saturation').val(0);
    $('#Sepia').val(0);
    $('#Contrast').val(0);
    $('#Exposure').val(0);
    $('#Gamma').val(0);
    $('#Vibrance').val(0);
    $('#Hue').val(0);
    $('#Noise').val(0);
    $('#Sharpen').val(0);
    $('#Clip').val(0);
    $('#Blur').val(0);
}


function RedEyeCursorChange(size) {
    //set hidden field redEyeCursorSize here
    switch (size) {
        case 'redEyeCursorSmall':
            $("#redEyeCursorSize").val("5");

            $("#redEyeCursorSmall").attr('class', 'btn btn-success');
            $("#redEyeCursorMed").attr('class', 'btn btn-primary');
            $("#redEyeCursorLarge").attr('class', 'btn btn-primary');

            $("#divCanvasRedEye").attr('class', 'circle16');


            break;
        case 'redEyeCursorMed':
            $("#redEyeCursorSize").val("10");
            $("#redEyeCursorMed").attr('class', 'btn btn-success');

            $("#redEyeCursorSmall").attr('class', 'btn btn-primary');
            $("#redEyeCursorLarge").attr('class', 'btn btn-primary');
            $("#divCanvasRedEye").attr('class', 'circle24');
            break;
        case 'redEyeCursorLarge':
            $("#redEyeCursorSize").val("20");
            $("#redEyeCursorLarge").attr('class', 'btn btn-success');

            $("#redEyeCursorSmall").attr('class', 'btn btn-primary');
            $("#redEyeCursorMed").attr('class', 'btn btn-primary');
            $("#divCanvasRedEye").attr('class', 'circle48');
            break;
    }
}


function saveEditImageNewEditor() {
    $("#modalEditSaveNewEditorMessage").text("How would you like to save your edited image?");
    $("#imgCloseOnSaveModal").show();
    $('#modalEditSaveNewEditor').fadeIn(300);
}

function closeSavePopupNewEditor() {
    $('#modalEditSaveNewEditor').fadeOut(300);
}

function closeEditImageNewEditor() {
    var editorType = $("#hidEditorType").val();
    if (editorType == "master") {
        if ($("#hidIsImageCropped").val() == "true" || $("#hidIsImageOrientationChanged").val() == "true" || $("#hidIsImageRedEyeChanged").val() == "true" || $("#hidDoesImageHasFilter").val() == "true" || $("#hidDoesImageHasAdjustments").val() == "true") {
            $('#modalEditCloseNewEditor').fadeIn(300);
        }
        else
            $('#imageEditor').modal('hide');
            $("#imgPreviewImage").css("width", '');
    }
    else {
        closeEditImageSubEditor();
    }
}

function closeEditImageSubEditor() {
    var editorType = $("#hidEditorType").val();
    $('#modalEditCloseNewEditorMessage').text('Wait! You didn\'t save your work. Are you certain that you want to close this editor?');

    if (editorType == "cropper") {
        $("#modalEditImageCloseSubEditor .docs-buttons").show();
        $("#modalEditImageCloseSubEditor #filterSave").hide();
        $("#modalEditImageCloseSubEditor #redEyeSave").hide();
        $("#modalEditImageCloseSubEditor #adjustSave").hide();
    }
    else if (editorType == "orientation") {
        $("#modalEditImageCloseSubEditor .docs-buttons").show();
        $("#modalEditImageCloseSubEditor #filterSave").hide();
        $("#modalEditImageCloseSubEditor #redEyeSave").hide();
        $("#modalEditImageCloseSubEditor #adjustSave").hide();
    }
    else if (editorType == "filter") {
        $("#modalEditImageCloseSubEditor .docs-buttons").hide();
        $("#modalEditImageCloseSubEditor #redEyeSave").hide();
        $("#modalEditImageCloseSubEditor #adjustSave").hide();
        $("#modalEditImageCloseSubEditor #filterSave").show();
        $('#modalEditCloseNewEditorMessage').text('Wait! You didn\'t apply your photo filter edits. Are you certain that you want to close the photo filter tool?');
    }
    else if (editorType == "redeye") {
        $("#modalEditImageCloseSubEditor .docs-buttons").hide();
        $("#modalEditImageCloseSubEditor #filterSave").hide();
        $("#modalEditImageCloseSubEditor #adjustSave").hide();
        $("#modalEditImageCloseSubEditor #redEyeSave").show();
        $('#modalEditCloseNewEditorMessage').text('Wait! You didn\'t apply your red eye edits. Are you certain that you want to close the red eye tool?');
    }
    else if (editorType == "adjust") {
        $("#modalEditImageCloseSubEditor .docs-buttons").hide();
        $("#modalEditImageCloseSubEditor #redEyeSave").hide();
        $("#modalEditImageCloseSubEditor #filterSave").hide();
        $("#modalEditImageCloseSubEditor #adjustSave").show();
        $('#modalEditCloseNewEditorMessage').text('Wait! You didn\'t apply your adjust edits. Are you certain that you want to close the adjust tool?');
    }

    if ($('#hidFilterSelected').val() != '' || $('#hidRedEyeUsed').val() != '' || $('#hidCropperOrOrientationUsed').val() != '' || $('#hidAdjustmentSelected').val() != '') {
        $('#modalEditImageCloseSubEditor').fadeIn(300);
    }
    else {
        displayImageEditorCanvas();
    }
}

function closePopupNewEditor() {
    $('#modalEditCloseNewEditor').fadeOut(300);
}

function closePopupSubEditor() {
    $('#modalEditImageCloseSubEditor').fadeOut(300);
}

function launchSaveEditImageNewEditor() {
    $('#modalEditCloseNewEditor').fadeOut(300);
    $("#modalEditSaveNewEditorMessage").text("How would you like to save your edited image?");
    $("#imgCloseOnSaveModal").show();
    $('#modalEditSaveNewEditor').fadeIn(300);
}

function closeNewImageEditor() {
    $('#modalEditCloseNewEditor').fadeOut();
    $('#imageEditor').modal('hide');
}

function saveEditImageDR(modal, saveAsOriginal) {
    $('#modalEditSave').modal('show');
}

function saveEditImageWithFilter() {
    $('#modalMessage').modal('hide');
    $('#modalEditSave').modal('show');
}

function saveSelection(overwriteOriginal) {
    var image = document.getElementById('imgEditorCanvas').toDataURL('image/jpeg');
    image = image.replace("data:image/jpeg;base64,", "");

    saveHiRes(image, overwriteOriginal, dkrmImage);
}

function saveHiRes(myImage, overwriteOriginal, dkrmImageInfo) {
    var photoEntity = JSON.parse($("#hidPhotoEntity").val());

    var image = {
        imagePath: myImage,
        ID: dkrmImageInfo.id.replace('thumbnail_', ''),
        saveAsOriginal: overwriteOriginal
    };

    $("#imgCloseOnSaveModal").hide();

    if (overwriteOriginal) {
        $("#statusLbl").text("Overwriting Original Image, please wait...");
        $("#modalEditSaveNewEditorMessage").text("Overwriting Original Image, please wait...");
    }
    else {
        $("#statusLbl").text("Saving Image as a Copy, please wait...");
        $("#modalEditSaveNewEditorMessage").text("Saving Image as a Copy, please wait...");
    }

    var json = JSON.stringify(image);

    $.ajax({
        url: '/Albums/Handlers/SaveEditImage.ashx',
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        type: 'POST',
        data: { data: json },
        dataType: 'json',
        timeout: 60 * 2000,
        success: function (data, textStatus, jqXHR) {
            if (data.ResultType == 1) {
                $("#statusLbl").text("");
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
                $('#modalEditSaveNewEditor').fadeOut(300);
                $('#imageEditor').modal('hide');
            }
        }
    });
}

function kioskEditorSuccess(data) {
    if (imageEditorEx.launchMode == editorLaunchMode.GENERELKIOSK) {
        var time = setTimeout(function () {
            var kioskData = {
                ID: data.ImageID,
                AlbumID: featherEditor.EditPhoto.AlbumID,
                Title: data.Title,
                ThumbnailUrl: data.ThumbnailUrl,
                ImageUrl: data.ImageUrl,
                ModifiedDate: data.ModifiedDate,
                SaveAsOriginal: getSaveAsOriginal(),
                ResultType: "Done",
                AppImageID: imageEditorEx.AppImageID,
                command: "OnlineEditImage",
                timestamp: new Date().getTime()
            };

            $.get("http://localhost:8099/", kioskData);

            window.location.href = "/buy/kioskloading";

        }, 1000);
    }
}

function kioskEditorFailed(ResultType) {
    if (imageEditorEx.launchMode == editorLaunchMode.GENERELKIOSK) {
        var time = setTimeout(function () {
            var kioskData = {
                ResultType: ResultType,
                AppImageID: imageEditorEx.AppImageID,
                command: "OnlineEditImage",
                timestamp: new Date().getTime()
            };
            //var info = "";
            //for (var prop in kioskData) {
            //    info += prop + ":" + kioskData[prop] + ", ";
            //}
            //WriteToLog("Send xhr Close event:" + info);
            $.get("http://localhost:8099/", kioskData);
        }, 1000);
    }
}

function checkImageUploadCompleted(imageID, timeout, complete) {
    var timeoutClock;
    if (timeout && !isNaN(timeout) && timeout > 0) {
        timeoutClock = setTimeout(function () {
            kioskEditorFailed('Time Out');
            clearTimeout(timeoutClock);
        }, timeout);
    }

    showOrHideMessageModal('Uploading image, please wait a moment...', true);

    var doCheck = function () {
        $.get("/Albums/Handlers/CheckImageUploaded.ashx", { photoID: imageID })
            .done(function (data) {
                if (data) {
                    if (complete && typeof complete === 'function') {
                        showOrHideMessageModal('Uploading image, please wait a moment...', false);
                        complete();
                    }
                }
                else {
                    clockB = setTimeout(doCheck, 1000);
                }
            })
            .fail(function () {
                kioskEditorFailed('Failed');
            });
    };

    var clockB = setTimeout(doCheck, 1000);
}

function showForceCropModal() {
    var msgHTML = '';

    msgHTML += '<div class="modal fade" style="z-index:10000">\r\n'
    msgHTML += '  <div class="modal-dialog">\r\n'
    msgHTML += '    <div class="modal-content">\r\n'
    msgHTML += '      <div class="modal-header">\r\n'
    msgHTML += '        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\r\n'
    msgHTML += '        <h4 class="modal-title">Cropping Message</h4>\r\n'
    msgHTML += '      </div>\r\n'
    msgHTML += '      <div class="modal-body">\r\n'
    msgHTML += '        <h4>Rotate Photo to Desired Orientation Before Cropping<br>Please crop your photo to this size in advance:<strong>' + imageEditorEx.forceCropRatio.replace(':', ' &times; ') + '</strong></h4>\r\n'
    msgHTML += '      </div>\r\n'
    msgHTML += '      <div class="modal-footer">\r\n'
    msgHTML += '        <button type="button" class="btn btn-primary" data-dismiss="modal">Go To Crop</button>\r\n'
    //msgHTML += '        <button type="button" class="btn btn-primary">OK</button>\r\n'
    msgHTML += '      </div>\r\n'
    msgHTML += '    </div> \r\n'
    msgHTML += '  </div> \r\n'
    msgHTML += '</div> \r\n'

    var $modal = $(msgHTML);

    $modal.on('shown.bs.modal', function (e) {
        $(".modal-backdrop").css("z-index", 9999);
    })
        .on('hidden.bs.modal', function (e) {
            $modal.remove();
        })
        .modal('show');

    $modal.find(".btn.btn-primary").click(function (e) {
        //hacking aviary: option crop tool manually.
        $("#avpw_main_crop").click();
        $modal.modal("hide");
    });
}

function checkForceCropRatio() {
    //if we need to force cropping, let's do check on ratio.
    //if not pass, we need to show the force cropping message to user
    if (imageEditorEx.forceCropRatio) {
        var arrRatio = imageEditorEx.forceCropRatio.split(':');
        var ratioWidth = arrRatio[0];
        var ratioHeight = arrRatio[1];
        var Dimensions = featherEditor.getImageDimensions();
        var actualWith = Dimensions.width;
        var actualHeight = Dimensions.height;

        //check ratios 
        if (!(Math.floor(ratioWidth / ratioHeight * 10) == Math.floor(actualWith / actualHeight * 10))) {
            showForceCropModal();
            return false;
        }
        else {
            return true;
        }
    }
    return true;
}

function simulate(element, eventName) {
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers) {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent) {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents') {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
                options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
                options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
        destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}

