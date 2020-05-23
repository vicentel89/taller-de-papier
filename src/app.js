$(function() {
  //Don't write code above this.

  AOS.init(); //Init Animation On Scroll

  ////////////////////////Lazy load /////////////////////////
  lazyLoadScroll();

  function lazyLoadScroll() {
    let options = {
      rootMargin: '0px',
      threshold: 0
    }

    let observer = new IntersectionObserver(function(entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if ($(entry.target).attr("src") != $(entry.target).attr("data-src")) {
            $(entry.target).attr("src", $(entry.target).attr("data-src"));
          }
        }
      });
    }, options);

    const imgs = document.querySelectorAll('[data-src]');
    imgs.forEach(img => {
      observer.observe(img);
    });
  }
  //////////////////////// End - Lazy load /////////////////////////

  /*=================================
  ---------Header Animations---------
  ===================================*/

  ////===Position logo to the corner when scrolling===////
  positionLogo(250, 22, 0, 25, 0, 3, 1);

  function positionLogo(topPositionTarget, initialX, targetX, initialY, targetY, initialScale, targetScale) {
    let translateX = initialX;
    let translateY = initialY;
    let scale = initialScale;
    let newX;
    let newY;
    let newScale;

    $(window).scroll(function() {
      newX = initialX - ($(window).scrollTop() * ((initialX - targetX) / topPositionTarget));
      newY = initialY - ($(window).scrollTop() * ((initialY - targetY) / topPositionTarget));
      newScale = initialScale - ($(window).scrollTop() * ((initialScale - targetScale) / topPositionTarget));

      translateX = newX > targetX ? newX : targetX;
      translateY = newY > targetY ? newY : targetY;
      scale = newScale > targetScale ? newScale : targetScale;

      $(".logo").css("transform", "translate(" + translateX + "vw, " + translateY + "vh) scale(" + scale + ")");
    });
  }
  ////===End - Position logo to the corner when scrolling===////


  ////===Nav bar animations===////
  ////-Change the nav bar opacity when scrolling-//// (The initial opacity must be the same in the styles sheet)
  typeof window.orientation == 'undefined' ? changeNavBarOpacity(0, 0.8, 0, 50) : //On desktops
    $(".navbar").css("background-color", "rgba(233, 203, 186, " + 0.8 + ")"); //On mobile
  changeNavBarOpacity(0.8, 1);

  function changeNavBarOpacity(initialOpacity, targetOpacity,
    initialTopPosition = $(".header-container").outerHeight() - (2 * $(".navbar").outerHeight()),
    targetTopPosition = $(".header-container").outerHeight() - $(".navbar").outerHeight()) {
    let opacity;
    let newOpacity;

    $(window).scroll(function() {

      newOpacity = initialOpacity + (($(window).scrollTop() - initialTopPosition) *
        ((targetOpacity - initialOpacity) / (targetTopPosition - initialTopPosition)));
      opacity = newOpacity < initialOpacity ?
        initialOpacity : newOpacity < targetOpacity ?
        newOpacity : targetOpacity;
      $(window).scrollTop() >= initialTopPosition &&
        $(".navbar").css("background-color", "rgba(233, 203, 186, " + opacity + ")");
    });
  }
  ////-End - Change the nav bar opacity when scrolling-////

  ////-Add shadow class to the navbar when scrolling-////
  addNavBarShadow();

  function addNavBarShadow() {
    $(window).scroll(function() {
      if ($(window).scrollTop() > 25) {
        if ($(".navbar").hasClass("navbar-shadow-reverse")) {
          $(".navbar").removeClass("navbar-shadow-reverse")
        }
        $(".navbar").addClass("navbar-shadow");
      }

      if ($(window).scrollTop() < 25 && $(".navbar").hasClass("navbar-shadow")) {
        $(".navbar").removeClass("navbar-shadow").addClass("navbar-shadow-reverse");
      }
    });
  }
  ////-End - Add shadow class to the navbar when scrolling-////

  ////Mobile - Hide navbar collapse when nav link is clicked-////
  $(".nav-item").click(function() {
    $(".navbar-collapse").hasClass("show") && $(".navbar-collapse").removeClass("show");
    $("body").removeClass("noscroll");
    $("#navbar-scrim").fadeToggle();
  });
  ////-End - Mobile - Hide navbar collapse when nav link is clicked-////

  ////Mobile - Add shadow class to the navbar when press toggle button-////
  $(".navbar-toggler").click(function() {
    !$(".navbar").hasClass("navbar-shadow") ? $(".navbar").addClass("navbar-shadow") :
      $(window).scrollTop() < 25 && $(".navbar").removeClass("navbar-shadow");
    $(".navbar").hasClass("navbar-shadow-reverse") && $(".navbar").removeClass("navbar-shadow-reverse");
    $("body").toggleClass("noscroll");
    $("#navbar-scrim").fadeToggle(); //Add scrim when collapse
  });
  ////-End - Mobile - Add shadow class to the navbar when press toggle button-////
  ////===End - Nav bar animations===////


  ////===Header Carousel===////
  //Make the carousel slide whitin a time interval//
  let slideTimer;

  typeof window.orientation == 'undefined' && startSlideTimer(); //Start only on desktops

  function startSlideTimer() {
    let targetRow;
    slideTimer = setInterval(function() {
      targetRow = (findCurrentRow() + 1) % $(".header-row").length;
      changeRow(targetRow, "left");
      changeCarouselControl(targetRow, 1002);
    }, 5400);
  }

  function stopSlideTimer() {
    clearInterval(slideTimer);
  }
  //End - Make the carousel slide whitin a time interval//

  //Stop carousel when mouse over links inside the carousel//
  $(".header-row a").mouseover(function() {
    stopSlideTimer();
  });

  typeof window.orientation == 'undefined' && $(".header-row a").mouseout(function() {
    stopSlideTimer();
    startSlideTimer();
  });
  // End - Stop carousel when mouse over links inside the carousel//

  //Make control work. When a circle is clicked, the row is changed//
  activateControl();

  function activateControl() {
    $(".carousel-control").click(function() {
      let currentRow = findCurrentRow();
      let targetRow = $(".carousel-control").index(this);
      let side = targetRow < currentRow ? "right" : "left";
      if (currentRow != targetRow) {
        changeCarouselControl(targetRow, 2005);
        stopSlideTimer();
        setTimeout(function() {
          changeRow(targetRow, side);
          setTimeout(function() {
            stopSlideTimer();
            startSlideTimer();
          }, 2500);
        }, 1003);
      }
    });
  }

  function deactivateControl() {
    $(".carousel-control").off("click");
  }
  //End - Make control work. When a circle is clicked, the row is changed//

  function changeRow(targetRow, side, outAnimDuration = 1002) {
    //(targetRow(index of the target row), side("right" | "left"), outAnimDuration(I am not sure why it can be less than the out animation duration))
    let currentRow = findCurrentRow();
    if (currentRow != targetRow) {
      slideOut(currentRow, side);
      setTimeout(function() {
        slideIn(targetRow, side == "right" ? "left" : "right");
      }, outAnimDuration)
    }
  }

  function changeCarouselControl(targetRow, time) {
    let currentRow = findCurrentRow();
    //Add filled only to the selected circle
    $(".carousel-control-circle").removeClass("carousel-control-circle-filled");
    $(".carousel-control-circle:eq(" + targetRow + ")").addClass("carousel-control-circle-filled");

    //Make all circles unclickable
    $(".carousel-control").addClass("no-pointer");
    $(".carousel-control").removeClass("carousel-control-hover");
    deactivateControl();

    setTimeout(function() {
      //Make circles clickable again
      $(".carousel-control").addClass("carousel-control-hover");
      $(".carousel-control").removeClass("no-pointer");
      activateControl();

      //Deactivate pointer to the selected circle
      $(".carousel-control:eq(" + targetRow + ")").addClass("no-pointer");
    }, time);
  }

  function findCurrentRow() {
    let currentRow;
    for (let i = 0; i < $(".header-row").length; i++) {
      if (!/display:\snone/.test($(".header-row:eq(" + i + ")").attr("style"))) {
        currentRow = i;
      }
    }
    return currentRow;
  }

  function slideOut(row, side, animDuration = 1001) {
    //(row(index of the header row to add animations), side("right" | "left"), animDuration(animation duration plus 1))
    addAnimations(row, side, "out");
    $(".header-row:eq(" + row + ")").delay(animDuration).queue(function() {
      $(this).hide().dequeue();
      removeAnimations(row, side, "out");
    })
  }

  function slideIn(row, side, animDuration = 1001) {
    //(row(index of the header row to add animations), side("right" | "left"), animDuration(animation duration plus 1))
    $(".header-row:eq(" + row + ")").show();
    addAnimations(row, side, "in");
    $(".header-row:eq(" + row + ")").delay(animDuration).queue(function() {
      removeAnimations(row, side, "in");
      $(this).dequeue();
    });
  }

  function addAnimations(row, side, direction, elementsArr = ["header-img", "back-img", "front-img", "header-heading"]) {
    //(row(index of the header row to add animations), side("right" | "left"), direction("in" | "out"), elementsArr([elements classes to animate]))
    //It would not work if two classes that use the same keyframes are added. Solve 1: Delete other class before adding. Solve 2: Use different keyframes.
    elementsArr.forEach(function(element) {
      $(".header-row:eq(" + row + ") ." + element).addClass(element + "-animation-" + direction + "-" + side);
    });
  }

  function removeAnimations(row, side, direction, elementsArr = ["header-img", "back-img", "front-img", "header-heading"]) {
    //(row(index of the header row to add animations), side("right" | "left"), direction("in" | "out"), elementsArr([elements classes to animate]))
    elementsArr.forEach(function(element) {
      $(".header-row:eq(" + row + ") ." + element).removeClass(element + "-animation-" + direction + "-" + side);
    });
  }

  ////===End - Header Carousel===////

  /*=================================
  ------End - Header Animations------
  ===================================*/


  /*=================================
  ------Main Section Animations------
  ===================================*/
  ////======Parallax======////
  if (typeof window.orientation == 'undefined') { //Only in desktop
    parallax("#mainImg1", -0.7, -45);
    parallax("#mainImg2", -0.7, -75);
    parallax("#mainImg3", -0.7, -60);

    parallax("#backImg1", -0.45, 40);
    parallax("#backImg2", -0.45, 70);
    parallax("#backImg3", -0.45, 70);

    parallax("#middleImg1", -0.35, 360);
    parallax("#middleImg2", -0.35, 365);
  }

  function parallax(selector, velocity, offset) {
    //(selector(use jquery syntax), velocity(recomended from -0.95 to 0.35. Negative number move the element upwards. Positive number move the element downwards), offset)
    let elementTopPosition;

    $(window).scroll(function() {
      elementTopPosition = $(selector).parent().offset().top;
      let translate = (($(window).scrollTop() - elementTopPosition) * velocity) + offset;
      $(selector).css("transform", "translateY(" + translate + "px)")
    });
  }
  ////====End - Parallax====////
  /*=================================
  ---End - Main Section Animations---
  ===================================*/


  /*=================================
  --------------Gallery--------------
  ===================================*/
  function animateClick(event) {
    $("#scrim-circle").css({
      "left": event.pageX - 5 + "px",
      "top": event.pageY - $(window).scrollTop() + "px"
    }).addClass("scrim-circle-animated").delay(700).queue(function() {
      $(this).removeClass("scrim-circle-animated").dequeue();
    });
  }
  ////==========Gallery Overlay==========////
  let galleryChosen = {
    regalosButton: "regalosGallery",
    tarjetasButton: "tarjetasGallery",
    brandingButton: "brandingGallery"
  }
  let clickedButton;

  //Show Overlay when click on a specific button//
  $(".bttn-primary").click(showGalleryOverlay);

  function showGalleryOverlay(event) {
    clickedButton = $(this).attr('id');
    $("body").addClass("noscroll");
    $(".gallery-container").fadeIn();
    animateClick(event);
    $("#" + galleryChosen[clickedButton]).delay(450).queue(function() {
      $(this).show().dequeue();
    });

    //Lazy Load for the images in the selected gallery//
    $("#" + galleryChosen[clickedButton] + " .gallery-img").each(function(i, obj) {
      if ($(this).attr("src") != $(this).attr("src-data")) {
        $(this).attr("src", $(this).attr("src-data"))
      }
    });
  }


  //End - Show overlay when click on a specific button//

  //Hide Overlay//
  $("#close-button-gallery, #close-area-gallery").click(hideOverlay);

  function hideOverlay() {
    $("#" + galleryChosen[clickedButton]).fadeOut();
    $(".gallery-container").fadeOut();
    $("body").removeClass("noscroll");
  }
  //End - Hide Overlay//
  ////========End - Gallery Overlay========////

  ////===========Zoom Overlay==========////
  //Show zoom overlay//
  $(".gallery-img-container").on("click", showZoomOverlay);

  function showZoomOverlay(event) {
    $(".img-zoom-container img").attr("src", $(this).children("img").attr("src")); //Add the same source of the clicked image
    $("#scrim-circle").addClass("scrim-circle-light");
    animateClick(event);
    $(".img-zoom-container").fadeIn().queue(function() {
      $(".img-zoom").fadeIn();
      $(this).dequeue();
    });
  }
  //End - Show zoom overlay//

  //Hide zoom overlay//
  $("#close-button-zoom, #close-area-zoom").click(hideZoomOverlay);

  function hideZoomOverlay() {
    $(".img-zoom-container").fadeOut();
    $(".img-zoom").hide();
    $("#scrim-circle").removeClass("scrim-circle-light")
  }
  //End - Hide zoom overlay//
  ////========End - Zoom Overlay=======////
  /*=================================
  ------------End - Gallery----------
  ===================================*/

  /*=================================
  -------------Responsive------------
  ===================================*/

  if (typeof window.orientation != 'undefined') {
    $(".header-img-container").removeClass("justify-content-center");

    //Change images on mobile//
    $(".header-container .back-img").attr("src", "src\\images\\picture-back-1-mobile.png");
    $(".header-container .front-img").attr("src", "src\\images\\picture-front-1-mobile.png");

    //change AOS on mobile//
    $("[data-aos]").attr("data-aos", "");
    $("#regalos, #tarjetas, #branding").attr("data-aos", "fade-up");
  }

  /*=================================
  ----------End - Responsive---------
  ===================================*/

  /*=================================
  ----------Additional bugs----------
  ===================================*/
  //Bug: The images of the first main section make a strange movement//
  $(window).scroll(function() {
    if ($(window).scrollTop() > ($(".header-container").outerHeight() / 2)) {
      $(".fix-bug-fast-scroll").removeClass("fix-bug-fast-scroll");
    }
  });
  /*=================================
  -------End - Additional bugs-------
  ===================================*/

  /*=================================
  --------------DEBUGGING------------
  ===================================*/
  /*
    $(window).scroll(function() {
      console.log($(window).scrollTop());

    });
  */

  /*
    $(document).on('keypress', function(e) {
      if (e.which == 113) { //Press "Q"

        //$("#asd").hide();
        console.log($("#asd").attr("data-src"));
        //$("#asd").attr("src", $("#asd").attr("data-src"));
      }
      if (e.which == 119) { //Press "W"

      }

    });

  */

  /*=================================
  -----------End - DEBUGGING---------
  ===================================*/
  //Don't write code below this.
});