import $ from 'jquery';
export function getMousePos(evt, image, canvas, myCanvas) {
    var imgScaleFactor = getImageScaleFactor();
    var myCanvasDOM = myCanvas.getBoundingClientRect();

    var myImage = document.getElementById('imgPreviewImage');

    var myImgScaleFactor = imgScaleFactor.h;
    //scaleFactor = scaleFactor * scale factor of imgPreview to canvas

    var mouseX = evt.offsetX ? ((evt.offsetX) * myImgScaleFactor) : ((evt.pageX - image.offsetLeft) * myImgScaleFactor);
    var mouseY = evt.offsetY ? ((evt.offsetY) * myImgScaleFactor) : ((evt.pageY - image.offsetTop) * myImgScaleFactor);

    // var mouseX = (evt.pageX - image.offsetLeft) * myImgScaleFactor;
    // var mouseY = (evt.pageY - image.offsetTop) * myImgScaleFactor;

    var displayRatio = ($(image).width()) ? image.width / $(image).width() : 1;

    return {
        x: mouseX * displayRatio,
        y: mouseY * displayRatio,
        i: myImgScaleFactor
    };
}
export function onCanvasClick(e, image, ctx, myCanvas, cursorSize) {
    var mousePos = getMousePos(e, image, ctx, myCanvas);

    var zoomScale = 1;
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
    var diameterOfRedEyeFix = redEyeImageArea.height;

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
        // $('#redEyeImageID').val(editedImage);
        // //update imgPreview

        $("#imgPreviewImage").attr("src", editedImage);
        ctx.saveHistory();
    }
}
export function onSmallClick(cursorSize, canvas) {
    // $(canvas).panzoom("disable");
    $('#redeyeZoomAlign').prop("disabled", true);
    //disable zoom
    window.$("#imgPreviewImage").panzoom("disable");

    $(cursorSize).val("6");
    $(canvas).css({ "cursor": "" });
    $(canvas).removeClass('circle24');
    $(canvas).removeClass('circle48');
    $(canvas).addClass('circle16');

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

    // //deactivate zoom functions
    $('#redeyeZoomText').removeClass('redeye-zoom-text');
    $("#redeyeZoomText").addClass("redeye-zoom-text-deactivated");

    $('#redeye-zoom').removeClass('redeye-zoom');
    $("#redeye-zoom").addClass("redeye-zoom-deactivated");

    $('#redeyeZoomRange').removeClass('zoom-redeye-slider');
    $('#redeyeZoomRange').addClass('zoom-redeye-slider-deactivated');
}
export function onMedClick(cursorSize, canvas) {
    // $(canvas).panzoom("disable");
    $('#redeyeZoomAlign').prop("disabled", true);
    //disable zoom
    window.$("#imgPreviewImage").panzoom("disable");

    $(cursorSize).val("10");
    $(canvas).css({ "cursor": "" });
    $(canvas).removeClass('circle16');
    $(canvas).removeClass('circle48');
    $(canvas).addClass('circle24');

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

    // //deactivate zoom functions
    $('#redeyeZoomText').removeClass('redeye-zoom-text');
    $("#redeyeZoomText").addClass("redeye-zoom-text-deactivated");

    $('#redeye-zoom').removeClass('redeye-zoom');
    $("#redeye-zoom").addClass("redeye-zoom-deactivated");

    $('#redeyeZoomRange').removeClass('zoom-redeye-slider');
    $('#redeyeZoomRange').addClass('zoom-redeye-slider-deactivated');
}
export function onLargeClick(cursorSize, canvas) {
    // $(canvas).panzoom("disable");
    $('#redeyeZoomAlign').prop("disabled", true);
    //disable zoom
    window.$("#imgPreviewImage").panzoom("disable");

    $(cursorSize).val("15");
    $(canvas).css({ "cursor": "" });
    $(canvas).removeClass('circle16');
    $(canvas).removeClass('circle24');
    $(canvas).addClass('circle48');

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

    // //deactivate zoom functions
    $('#redeyeZoomText').removeClass('redeye-zoom-text');
    $("#redeyeZoomText").addClass("redeye-zoom-text-deactivated");

    $('#redeye-zoom').removeClass('redeye-zoom');
    $("#redeye-zoom").addClass("redeye-zoom-deactivated");

    $('#redeyeZoomRange').removeClass('zoom-redeye-slider');
    $('#redeyeZoomRange').addClass('zoom-redeye-slider-deactivated');
}
export function onZoomCLick(canvas) {
    //window.$(canvas).panzoom("enable");

    $('#redeyeZoomAlign').prop("disabled", false);
    window.$("#imgPreviewImage").panzoom("enable");

    $(canvas).css({ "cursor": "move" });
    $(canvas).removeClass('circle16');
    $(canvas).removeClass('circle24');
    $(canvas).removeClass('circle48');

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

}

export function setupPage() {
    $('#redeyeZoomAlign').prop("disabled", true);
    //disable zoom
    window.$("#imgPreviewImage").panzoom("disable");
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

    // //deactivate zoom functions
    $('#redeyeZoomText').removeClass('redeye-zoom-text');
    $("#redeyeZoomText").addClass("redeye-zoom-text-deactivated");

    $('#redeye-zoom').removeClass('redeye-zoom');
    $("#redeye-zoom").addClass("redeye-zoom-deactivated");

    $('#redeyeZoomRange').removeClass('zoom-redeye-slider');
    $('#redeyeZoomRange').addClass('zoom-redeye-slider-deactivated');
}

function getImageScaleFactor(canvas) {
    var widthRatio = 0;
    var heightRatio = 0;

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
export function onBrushClick() {
    $('#redeyeZoomAlign').prop("disabled", true);
    //disable zoom
    window.$("#imgPreviewImage").panzoom("disable");
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
};
export function onRedEyeLoad() {
    
    //set default cursor size
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
    // $('#footerZoom').addClass('zoom-footer-display');
};
export function toggleModal(modal) {
    var myModal = document.getElementById('imageEditor');
    var state = modal.props.show;
    if (!state) {
        $(myModal).removeClass("hidden").addClass("fade");
    }
    else {
        $(myModal).removeClass("fade").addClass("fade-out");
    }
    return {
        s: state
    };
};
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