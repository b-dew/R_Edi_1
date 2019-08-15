
export function ApplyFilter(filter) {
    window.$('#hidFilterSelected').val(filter);
    window.$("#divFilter .filterSelected").removeClass("filterSelected");    
    window.Caman('#filterCanvas', function() {
        this.revert(false);
        this[filter]().render();
    });
}

export function ResetFilter() {
    window.$('#hidFilterSelected').val("");
    window.$("#divFilter .filterSelected").removeClass("filterSelected");
    window.$("#originalBtn").addClass("filterSelected");
        window.Caman('#filterCanvas', function() {
            this.revert(false);
            this.render();
        });
}

export function SaveImageFilter() {
    window.Caman('#filterCanvas', function() {
        this.render(function() {
          this.save('png');
        });
      });
}

export function onFilterPageLoad() {  
    InitializeFilterThumbnailSlider();
    BuildFilterThumbnails();   
}
    
function InitializeFilterThumbnailSlider() {  
    window.$('.responsive-img-slider').slick({
        initialSlide: 0,
        infinite: false,
        speed: 300,
        slidesToShow: 14,
        slidesToScroll: 14,
        responsive: [
            {
                breakpoint: 1250,
                settings: {
                    initialSlide: 0,
                    infinite: false,
                    speed: 300,
                    slidesToShow: 9,
                    slidesToScroll: 9
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    initialSlide: 0,
                    infinite: false,
                    speed: 300,
                    slidesToShow: 7,
                    slidesToScroll: 7                   
                }
            },
            {
                breakpoint: 600,
                settings: {
                    initialSlide: 0,
                    infinite: false,
                    speed: 300,
                    slidesToShow: 4,
                    slidesToScroll: 4                  
                }
            },
            {
                breakpoint: 480,
                settings: {
                    initialSlide: 0,
                    infinite: false,
                    speed: 300,
                    slidesToShow: 4,
                    slidesToScroll: 4                  
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });

    window.$(window).resize();
    window.$('.responsive-img-slider').slick('slickGoTo', 0);
}

function BuildFilterThumbnails() {
    window.$("#divFilter .filterSelected").removeClass("filterSelected");
    window.$("#originalBtn").addClass("filterSelected");

    var thumbnailWidth = 100;
    var thumbnailHeight = 100;

    var imgEditorCanvas = document.getElementById('imgEditorCanvas');

    var originalBtn = document.getElementById('originalBtn');
    var originalBtnCtx = originalBtn.getContext('2d');
    originalBtnCtx.clearRect(0, 0, originalBtn.width, originalBtn.height);
    originalBtn.width = thumbnailWidth;
    originalBtn.height = thumbnailHeight;
    originalBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);

    window.Caman('#vintageBtn', function () {       
        var vintageBtn = document.getElementById('vintageBtn');
        var vintageBtnCtx = vintageBtn.getContext('2d');
        vintageBtnCtx.clearRect(0, 0, vintageBtn.width, vintageBtn.height);
        vintageBtn.width = thumbnailWidth;
        vintageBtn.height = thumbnailHeight;
        vintageBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);

        this.reloadCanvasData();
        this.vintage();
        this.render();
      });

    window.Caman('#lomoBtn', function () {
        var lomoBtn = document.getElementById('lomoBtn');
        var lomoBtnCtx = lomoBtn.getContext('2d');
        lomoBtnCtx.clearRect(0, 0, lomoBtn.width, lomoBtn.height);
        lomoBtn.width = thumbnailWidth;
        lomoBtn.height = thumbnailHeight;
        lomoBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);

        this.reloadCanvasData();
        this.lomo();
        this.render();
    });

    window.Caman('#clarityBtn', function () {
        var clarityBtn = document.getElementById('clarityBtn');
        var clarityBtnCtx = clarityBtn.getContext('2d');
        clarityBtnCtx.clearRect(0, 0, clarityBtn.width, clarityBtn.height);
        clarityBtn.width = thumbnailWidth;
        clarityBtn.height = thumbnailHeight;
        clarityBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);

        this.reloadCanvasData();
        this.clarity();
        this.render();
    });

    window.Caman('#sincityBtn', function () {
        var sincityBtn = document.getElementById('sincityBtn');
        var sincityBtnCtx = sincityBtn.getContext('2d');
        sincityBtnCtx.clearRect(0, 0, sincityBtn.width, sincityBtn.height);
        sincityBtn.width = thumbnailWidth;
        sincityBtn.height = thumbnailHeight;
        sincityBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);

        this.reloadCanvasData();
        this.sinCity();
        this.render();
    });

    window.Caman('#sunriseBtn', function () {
        var sunriseBtn = document.getElementById('sunriseBtn');
        var sunriseBtnCtx = sunriseBtn.getContext('2d');
        sunriseBtnCtx.clearRect(0, 0, sunriseBtn.width, sunriseBtn.height);
        sunriseBtn.width = thumbnailWidth;
        sunriseBtn.height = thumbnailHeight;
        sunriseBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);

        this.reloadCanvasData();
        this.sunrise();
        this.render();
    });

    window.Caman('#crossProcessBtn', function () {
        var crossProcessBtn = document.getElementById('crossProcessBtn');
        var crossProcessBtnCtx = crossProcessBtn.getContext('2d');
        crossProcessBtnCtx.clearRect(0, 0, crossProcessBtn.width, crossProcessBtn.height);
        crossProcessBtn.width = thumbnailWidth;
        crossProcessBtn.height = thumbnailHeight;
        crossProcessBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);

        this.reloadCanvasData();
        this.crossProcess();
        this.render();
    });

    window.Caman('#orangePeelBtn', function () {
        var orangePeelBtn = document.getElementById('orangePeelBtn');
        var orangePeelBtnCtx = orangePeelBtn.getContext('2d');
        orangePeelBtnCtx.clearRect(0, 0, orangePeelBtn.width, orangePeelBtn.height);
        orangePeelBtn.width = thumbnailWidth;
        orangePeelBtn.height = thumbnailHeight;
        orangePeelBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);

        this.reloadCanvasData();
        this.orangePeel();
        this.render();
    });

    window.Caman('#loveBtn', function () {
        var loveBtn = document.getElementById('loveBtn');
        var loveBtnCtx = loveBtn.getContext('2d');
        loveBtnCtx.clearRect(0, 0, loveBtn.width, loveBtn.height);
        loveBtn.width = thumbnailWidth;
        loveBtn.height = thumbnailHeight;
        loveBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);

        this.reloadCanvasData();
        this.love();
        this.render();
    });

    window.Caman('#grungyBtn', function () {
        var grungyBtn = document.getElementById('grungyBtn');
        var grungyBtnCtx = grungyBtn.getContext('2d');
        grungyBtnCtx.clearRect(0, 0, grungyBtn.width, grungyBtn.height);
        grungyBtn.width = thumbnailWidth;
        grungyBtn.height = thumbnailHeight;
        grungyBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);

        this.reloadCanvasData();
        this.grungy();
        this.render();
    });

    window.Caman('#jarquesBtn', function () {
        var jarquesBtn = document.getElementById('jarquesBtn');
        var jarquesBtnCtx = jarquesBtn.getContext('2d');
        jarquesBtnCtx.clearRect(0, 0, jarquesBtn.width, jarquesBtn.height);
        jarquesBtn.width = thumbnailWidth;
        jarquesBtn.height = thumbnailHeight;
        jarquesBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);

        this.reloadCanvasData();
        this.jarques();
        this.render();
    });

    window.Caman('#pinHoleBtn', function () {
        var pinHoleBtn = document.getElementById('pinHoleBtn');
        var pinHoleBtnCtx = pinHoleBtn.getContext('2d');
        pinHoleBtnCtx.clearRect(0, 0, pinHoleBtn.width, pinHoleBtn.height);
        pinHoleBtn.width = thumbnailWidth;
        pinHoleBtn.height = thumbnailHeight;
        pinHoleBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);

        this.reloadCanvasData();
        this.pinhole();
        this.render();
    });

    window.Caman('#oldBootBtn', function () {
        var oldBootBtn = document.getElementById('oldBootBtn');
        var oldBootBtnCtx = oldBootBtn.getContext('2d');
        oldBootBtnCtx.clearRect(0, 0, oldBootBtn.width, oldBootBtn.height);
        oldBootBtn.width = thumbnailWidth;
        oldBootBtn.height = thumbnailHeight;
        oldBootBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);

        this.reloadCanvasData();
        this.oldBoot();
        this.render();
    });

    window.Caman('#glowingSunBtn', function () {
        var glowingSunBtn = document.getElementById('glowingSunBtn');
        var glowingSunBtnCtx = glowingSunBtn.getContext('2d');
        glowingSunBtnCtx.clearRect(0, 0, glowingSunBtn.width, glowingSunBtn.height);
        glowingSunBtn.width = thumbnailWidth;
        glowingSunBtn.height = thumbnailHeight;
        glowingSunBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);

        this.reloadCanvasData();
        this.glowingSun();
        this.render();
    });

    window.Caman('#hazyDaysBtn', function () {
        var hazyDaysBtn = document.getElementById('hazyDaysBtn');
        var hazyDaysBtnCtx = hazyDaysBtn.getContext('2d');
        hazyDaysBtnCtx.clearRect(0, 0, hazyDaysBtn.width, hazyDaysBtn.height);
        hazyDaysBtn.width = thumbnailWidth;
        hazyDaysBtn.height = thumbnailHeight;
        hazyDaysBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);

        this.reloadCanvasData();
        this.hazyDays();
        this.render();
    });

    window.Caman('#herMajestyBtn', function () {
        var herMajestyBtn = document.getElementById('herMajestyBtn');
        var herMajestyBtnCtx = herMajestyBtn.getContext('2d');
        herMajestyBtnCtx.clearRect(0, 0, herMajestyBtn.width, herMajestyBtn.height);
        herMajestyBtn.width = thumbnailWidth;
        herMajestyBtn.height = thumbnailHeight;
        herMajestyBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);

        this.reloadCanvasData();
        this.herMajesty();
        this.render();
    });

    window.Caman('#nostalgiaBtn', function () {
        var nostalgiaBtn = document.getElementById('nostalgiaBtn');
        var nostalgiaBtnCtx = nostalgiaBtn.getContext('2d');
        nostalgiaBtnCtx.clearRect(0, 0, nostalgiaBtn.width, nostalgiaBtn.height);
        nostalgiaBtn.width = thumbnailWidth;
        nostalgiaBtn.height = thumbnailHeight;
        nostalgiaBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);

        this.reloadCanvasData();
        this.nostalgia();
        this.render();
    });

    window.Caman('#hemingwayBtn', function () {
        var hemingwayBtn = document.getElementById('hemingwayBtn');
        var hemingwayBtnCtx = hemingwayBtn.getContext('2d');
        hemingwayBtnCtx.clearRect(0, 0, hemingwayBtn.width, hemingwayBtn.height);
        hemingwayBtn.width = thumbnailWidth;
        hemingwayBtn.height = thumbnailHeight;
        hemingwayBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);

        this.reloadCanvasData();
        this.hemingway();
        this.render();
    });

    window.Caman('#concentrateBtn', function () {
        var concentrateBtn = document.getElementById('concentrateBtn');
        var concentrateBtnCtx = concentrateBtn.getContext('2d');
        concentrateBtnCtx.clearRect(0, 0, concentrateBtn.width, concentrateBtn.height);
        concentrateBtn.width = thumbnailWidth;
        concentrateBtn.height = thumbnailHeight;
        concentrateBtnCtx.drawImage(imgEditorCanvas, 0, 0, thumbnailWidth, thumbnailHeight);

        this.reloadCanvasData();
        this.concentrate();
        this.render();
    });
}

export function onAdjustPageLoad() {  
    window.$('#Brightness').val(0);
    window.$('#Saturation').val(0);
    window.$('#Sepia').val(0);
    window.$('#Contrast').val(0);
    window.$('#Exposure').val(0);
    window.$('#Gamma').val(0);
    window.$('#Vibrance').val(0);
    window.$('#Hue').val(0);
    window.$('#Noise').val(0);
    window.$('#Sharpen').val(0);
    window.$('#Clip').val(0);
    window.$('#Blur').val(0);
}

export function ApplyAdjustFilter() {
    var dictSelectedAdjustments = {};
    window.Caman('#adjustCanvas', function() {
        this.revert(false);

        var brightness = parseInt(window.$('#Brightness').val());
        var saturation = parseInt(window.$('#Saturation').val());
        var sepia = parseInt(window.$('#Sepia').val());
        var contrast = parseInt(window.$('#Contrast').val());
        var exposure = parseInt(window.$('#Exposure').val());
        var gamma = parseFloat(window.$('#Gamma').val());
        var vibrance = parseInt(window.$('#Vibrance').val());
        var hue = parseInt(window.$('#Hue').val());
        var noise = parseInt(window.$('#Noise').val());
        var sharpen = parseInt(window.$('#Sharpen').val());
        var clip = parseInt(window.$('#Clip').val());
        var blur = parseInt(window.$('#Blur').val());

        if (brightness != 0) {
            this.brightness(brightness);
            dictSelectedAdjustments.brightness = brightness;
        }
        if (saturation != 0) {
            this.saturation(saturation);
            dictSelectedAdjustments.saturation = saturation;
        }
        if (sepia != 0) {
            this.sepia(sepia);
            dictSelectedAdjustments.sepia = sepia;
        }
        if (contrast != 0) {
            this.contrast(contrast);
            dictSelectedAdjustments.contrast = contrast;
        }
        if (exposure != 0) {
            this.exposure(exposure);
            dictSelectedAdjustments.exposure = exposure;
        }
        if (gamma != 0) {
            this.gamma(gamma);
            dictSelectedAdjustments.gamma = gamma;
        }
        if (vibrance != 0) {
            this.vibrance(vibrance);
            dictSelectedAdjustments.vibrance = vibrance;
        }
        if (hue != 0) {
            this.hue(hue);
            dictSelectedAdjustments.hue = hue;
        }
        if (noise != 0) {
            this.noise(noise);
            dictSelectedAdjustments.noise = noise;
        }
        if (sharpen != 0) {
            this.sharpen(sharpen);
            dictSelectedAdjustments.sharpen = sharpen;
        }
        if (clip != 0) {
            this.clip(clip);
            dictSelectedAdjustments.clip = clip;
        }
        if (blur != 0) {
            this.stackBlur(blur);
            dictSelectedAdjustments.blur = blur;
        }
        window.$('#hidAdjustmentSelected').val(JSON.stringify(dictSelectedAdjustments));
        this.render();
    });
}

export function SaveImageAdjust() {
    window.Caman('#adjustCanvas', function() {
        this.render(function() {
          this.save('png');
        });
      });
}

export function ApplySelectedFilter(filter) {
    //status message
    window.$("#hidDoesImageHasFilter").val("true");   
    window.Caman('#imgEditorCanvas', function() {
        //this.revert(false);  
        this[filter]();     
        this.render(function () {
            //displayImageEditorCanvas();
            //status message

            var canvas = document.getElementById('imgEditorCanvas');
            var ctx = canvas.getContext('2d');
            ctx.saveHistory();
            setAvailabilityOfUndoRedoReset(ctx);
        })
    });
}

export function ApplyAdjustments(dictSelectedAdjustments) {
    //status message
    window.$("#hidDoesImageHasAdjustments").val("true");   
    window.Caman('#imgEditorCanvas', function() {
        //this.revert(false);    
        var brightness = dictSelectedAdjustments.hasOwnProperty("brightness") ? dictSelectedAdjustments.brightness : 0 ;
        var saturation = dictSelectedAdjustments.hasOwnProperty("saturation") ? dictSelectedAdjustments.saturation : 0 ;
        var sepia = dictSelectedAdjustments.hasOwnProperty("sepia") ? dictSelectedAdjustments.sepia : 0 ;
        var contrast = dictSelectedAdjustments.hasOwnProperty("contrast") ? dictSelectedAdjustments.contrast : 0 ;
        var exposure = dictSelectedAdjustments.hasOwnProperty("exposure") ? dictSelectedAdjustments.exposure : 0 ;
        var gamma = dictSelectedAdjustments.hasOwnProperty("gamma") ? dictSelectedAdjustments.gamma : 0 ;
        var vibrance = dictSelectedAdjustments.hasOwnProperty("vibrance") ? dictSelectedAdjustments.vibrance : 0 ;
        var hue = dictSelectedAdjustments.hasOwnProperty("hue") ? dictSelectedAdjustments.hue : 0 ;
        var noise = dictSelectedAdjustments.hasOwnProperty("noise") ? dictSelectedAdjustments.noise : 0 ;
        var sharpen = dictSelectedAdjustments.hasOwnProperty("sharpen") ? dictSelectedAdjustments.sharpen : 0 ;
        var clip = dictSelectedAdjustments.hasOwnProperty("clip") ? dictSelectedAdjustments.clip : 0 ;
        var blur = dictSelectedAdjustments.hasOwnProperty("blur") ? dictSelectedAdjustments.blur : 0 ;

        if (brightness != 0) {
            this.brightness(brightness);
        }
        if (saturation != 0) {
            this.saturation(saturation);
        }
        if (sepia != 0) {
            this.sepia(sepia);
        }
        if (contrast != 0) {
            this.contrast(contrast);
        }
        if (exposure != 0) {
            this.exposure(exposure);
        }
        if (gamma != 0) {
            this.gamma(gamma);
        }
        if (vibrance != 0) {
            this.vibrance(vibrance);
        }
        if (hue != 0) {
            this.hue(hue);
        }
        if (noise != 0) {
            this.noise(noise);
        }
        if (sharpen != 0) {
            this.sharpen(sharpen);
        }
        if (clip != 0) {
            this.clip(clip);
        }
        if (blur != 0) {
            this.stackBlur(blur);
        }
        
        this.render(function () {
            //displayImageEditorCanvas();
            //status message

            var canvas = document.getElementById('imgEditorCanvas');
            var ctx = canvas.getContext('2d');
            ctx.saveHistory();
            setAvailabilityOfUndoRedoReset(ctx);
        })
    });
}

export function setAvailabilityOfUndoRedoReset(ctx) {
    if (ctx.isUndoAvailable()) {  /* If no history, undo and reset not available */
        if (window.$('#undoDiv').hasClass('disabled')) {
            window.$('#undoDiv').removeClass('disabled');
        }

        if (window.$('#resetDiv').hasClass('disabled')) {
            window.$('#resetDiv').removeClass('disabled');
        }
    } else {
        if (!window.$('#undoDiv').hasClass('disabled')) {
            window.$('#undoDiv').addClass('disabled');
        }

        if (!window.$('#resetDiv').hasClass('disabled')) {
            window.$('#resetDiv').addClass('disabled');
        }

    }

    if (ctx.isRedoAvailable()) {  /* If no forward history, redo not available */
        if (window.$('#redoDiv').hasClass('disabled')) {
            window.$('#redoDiv').removeClass('disabled');
        }

    } else {
        if (!window.$('#redoDiv').hasClass('disabled')) {
            window.$('#redoDiv').addClass('disabled');
        }
    }
}

