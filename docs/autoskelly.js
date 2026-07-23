// Auto Skelly!
"use strict";

// DEVELOPER FUNCTIONALITY ------------------

(function (global, document, $) {
  function AutoSkelly() {
    this.color = "#e3e3e3";
    this.animation = "pulse";
    this.gradientColors = ["#ee7752", "#e73c7e", "#23a6d5", "#23d5ab"];
    this.active = true;
  }

  AutoSkelly.prototype = {
    setSkelly: function (_color = this.color, _animation = this.animation) {
      // skellify every instance of skelly-text
      $(".skelly-text").each(function () {
        $(this).replaceWith(
          "<div class='" +
            _animation +
            " skelly-text' style='background-color: " +
            _color +
            "; border-radius: 5px; min-height: " +
            $(this).height() +
            "px; min-width: " +
            $(this).width() +
            "px'; >  </div>"
        );
      });

      // skellify every instance of skelly-image
      $(".skelly-image").each(function () {
        $(this).replaceWith(
          "<div class='" +
            _animation +
            " skelly-image' style='background-color: " +
            _color +
            "; min-height: " +
            $(this).height() +
            "px; min-width: " +
            $(this).width() +
            "px' >  </div>"
        );
      });

      // skellify each instance of skelly-circle
      $(".skelly-circle").each(function () {
        $(this).replaceWith(
          "<div class='" +
            _animation +
            " skelly-circle' style='background-color: " +
            _color +
            "; border-radius: 100%; min-height: " +
            $(this).height() +
            "px; min-width: " +
            $(this).width() +
            "px' >  </div>"
        );
      });

      // skellify each instance of a button
      $(".skelly-button").each(function () {
        $(this).replaceWith(
          "<div class='" +
            _animation +
            " skelly-button' style='background-color: " +
            _color +
            "; border-radius: 5px; min-height: " +
            $(this).outerHeight() +
            "px; min-width: " +
            $(this).outerWidth() +
            "px' >  </div>"
        );
      });
    },

    // USER INTERACTION --------------------

    // change the skeleton color theme dynamically
    changeSkellyColor: function (newColor) {
      this.color = newColor;
      this.setSkelly(newColor);
    },

    // change the animation for the whole theme dynamically
    changeSkellyAnimation: function (animation) {
      if (animation === "standard") {
        this.animation = "pulse";
        this.setSkelly(undefined, "pulse");
      } else if (animation === "bigPulse") {
        this.animation = "extraPulse";
        this.setSkelly(undefined, "extraPulse");
      } else if (animation === "gradient") {
        this.animation = "gradient";
        this.setSkelly(undefined, "gradient");
      } else if (animation === "none") {
        this.animation = "none";
        this.setSkelly(undefined, "none");
      }
    },

    // deactivate autoskelly if users prefer
    activateSkelly: function (boolean) {
      if (boolean) {
        this.animation = "pulse";
        this.setSkelly(undefined, "pulse");
      } else {
        this.animation = "none";
        this.setSkelly(undefined, "none");
      }
    },
  };

  global.AutoSkelly = global.AutoSkelly || AutoSkelly;
})(window, window.document, $);

// dynamically load in Auto Skelly CSS file
$("head").append(
  $('<link rel="stylesheet" type="text/css" />').attr(
    "href",
    "./autoskelly.css"
  )
);

// initialize skelly on page load automatically
const _skelly = new AutoSkelly();
_skelly.setSkelly("#e5e5e5");
