$(document).ready(function () {

   $('.responsive-img-slider').slick({
       initialSlide: 0,
       infinite: false,
       speed: 300,
       slidesToShow: 10,
       slidesToScroll: 10,
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


});
