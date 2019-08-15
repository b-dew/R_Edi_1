(function(global){
	var	proto		= 
		bindings	= [];

	function getData(canvas){
		var i, l = bindings.length, data;
		for (i=0; i<l; i++){
			if (bindings[i].c === canvas){
				return bindings[i];
			}
		}
		data = {
			c: canvas,	// canvas
			h: [],		// History
			f: [],		// Future
			s: 25		// Size
		};
		bindings.push(data);
		return data;
	}

	function resizeHistoryPerMaxAllowed(data){
			while(data.h.length > data.s + 1){
				data.h.shift();
			}
			while(data.f.length > data.s){
				data.f.pop();
			}
    }

    function resetHistory(data) {
        while (data.h.length > 1) {
            data.h.pop();
        }
        while (data.f.length > 0) {
            data.f.shift();
        }
    }

    function updatePreviewImage(canvas)
    {
        var imageUrl = canvas.toDataURL('image/jpeg', 0.8);
        $("#imgPreviewImage").attr("src", imageUrl);

    }
    
	function canvasHistory(context){

		context.undo = function(){
			var	context		= this,
				historyObj	= getData(context.canvas),
				imgdata;
			if (historyObj.h.length < 2){
				return;
			}
			historyObj.f.unshift(historyObj.h.pop());
            imgdata = historyObj.h[historyObj.h.length - 1];
            context.canvas.width = imgdata.width;
            context.canvas.height = imgdata.height;
            context.clearRect(0, 0, imgdata.width, imgdata.height);
            context.putImageData(imgdata, 0, 0, 0, 0, imgdata.width, imgdata.height);
            resizeHistoryPerMaxAllowed(historyObj);
            updatePreviewImage(context.canvas);
			return true;
		};

		context.redo = function(){
			var	context		= this,
				historyObj	= getData(context.canvas),
				imgdata;
			if (!historyObj.f.length){
				return;
			}
			imgdata = historyObj.f.shift();
            historyObj.h.push(imgdata);
            context.canvas.width = imgdata.width;
            context.canvas.height = imgdata.height;
            context.clearRect(0, 0, imgdata.width, imgdata.height);
			context.putImageData(imgdata, 0, 0);
            resizeHistoryPerMaxAllowed(historyObj);
            updatePreviewImage(context.canvas);
			return true;
        };

        context.reset = function () {
            var context = this,
                historyObj = getData(context.canvas),
                imgdata;
            if (historyObj.h.length < 2) {
                return;
            }
           
            imgdata = historyObj.h[0];
            context.canvas.width = imgdata.width;
            context.canvas.height = imgdata.height;
            context.clearRect(0, 0, imgdata.width, imgdata.height);
            context.putImageData(imgdata, 0, 0);
            resetHistory(historyObj);
            updatePreviewImage(context.canvas);
            return true;
        };

		context.saveHistory = function(isInitialSave){
		var	context		= this,
			canvas		= context.canvas,
			historyObj	= getData(context.canvas),
            imgdata;

            isInitialSave = isInitialSave || false;
            if (isInitialSave)
            {
                historyObj.h = [];
            }
			historyObj.h.push( context.getImageData(0, 0, canvas.width, canvas.height) );
			historyObj.f = [];
            resizeHistoryPerMaxAllowed(historyObj);
            updatePreviewImage(context.canvas);
        };

        context.reloadLastSavedImage = function () {
            var context = this,
                historyObj = getData(context.canvas),
                imgdata;                      
            imgdata = historyObj.h[historyObj.h.length - 1];
            context.canvas.width = imgdata.width;
            context.canvas.height = imgdata.height;
            context.clearRect(0, 0, imgdata.width, imgdata.height);
            context.putImageData(imgdata, 0, 0);
            updatePreviewImage(context.canvas);
            return true;
        };

        context.isUndoAvailable = function () {
            var context = this,
                historyObj = getData(context.canvas);
            return (historyObj.h.length > 1);
        }

        context.isRedoAvailable = function () {
            var context = this,
                historyObj = getData(context.canvas);
            return (historyObj.f.length > 0);
        }

		context.getHistorySize = function(){
			return getData(this.canvas).s;
		};

		context.setHistorySize = function(val){
			getData(this.canvas).s = val;
		};
	}

	// Imply global
	//global.canvasHistory = canvasHistory;

	/*
		This applies canvasHistory to all contexts, no harm exactly but you may consider it intruding.
		If that's the case, you can just remove this call from the code, and use the canvasHistory() on few and selected contexts instead.
		However, that is pretty much unrecommendable, as that means you will lose the bindings each time the context is destroyed (whenever you change width or height, or do something else to destroy it).
	*/
	canvasHistory(CanvasRenderingContext2D.prototype);
})(this);
