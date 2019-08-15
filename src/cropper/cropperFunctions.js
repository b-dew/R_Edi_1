import $ from 'jquery';
export function ApplyCrop() {
        var canvas = document.getElementById('imgEditorCanvas');
        var ctx = canvas.getContext('2d');
        ctx.saveHistory();
    
}
export function CropImg() {
    var canvas = $("#imgEditorCanvas"),
    context = canvas.get(0).getContext("2d"),
    $result = $('#result');
    $('#hidIsImageCropped').val('true');

    var myCanvas = this.refs.cropper.getCroppedCanvas().toDataURL();
    var size = $( ".cropper-canvas" );
    const croppedCanvas = this.refs.myCroppedCanvas
    croppedCanvas.height = size[0].clientHeight;
    croppedCanvas.width = size[0].clientWidth; 

    document.getElementById("myCroppedCanvas").src=myCanvas;
}
