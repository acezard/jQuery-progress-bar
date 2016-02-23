;
(function($, window, document, undefined) {

  "use strict";

  // Create the defaults once
  var pluginName = "progressBar",
    defaults = {
      easing: "easeOutCubic",
      percentage: 50,
      duration: 6000,
      delay: 3000,
      slantDegree: 5,
      onStart: function() {},
      onComplete: function() {}
    };

  // The actual plugin constructor
  function Plugin(element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  $.extend($.easing, {
    easeOutCubic: function(x, t, b, c, d) {
      return c * ((t = t / d - 1) * t * t + 1) + b;
    }
  });
  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {
    init: function() {
      var $self = this;
      var $elem = $(this.element);
      $self.setDegree();
      setTimeout(function() {
        $self.setText();
      }, this.settings.delay / 2);
      setTimeout(function() {
        $self.animateImage();
        $self.animatePercentage();
        $self.animateSteps();
      }, this.settings.delay);
      setTimeout(function() {
        $elem.css('opacity', '1');
      }, 500);
    },
    // Animating the image
    animateImage: function() {
      var $target = $(this.element).find('.jpb__overlay-container');
      var offsetValue = (Math.tan(this.settings.slantDegree * (Math.PI / 180)) * 100);
      $({
        percentageValue: 100 + offsetValue
      }).animate({
        percentageValue: 100 - this.settings.percentage
      }, {
        duration: this.settings.duration,
        easing: this.settings.easing,
        start: this.settings.onStart,
        step: function() {
          $target.css({
            'width': this.percentageValue + '%'
          });
        },
        complete: this.settings.onComplete
      });
    },
    // Animating the bottom steps
    animateSteps: function() {
      var $target = $(this.element).find('.jpb__steps-highlighted');
      var offsetValue = (Math.tan(this.settings.slantDegree * (Math.PI / 180)) * 100);
      $({
        percentageValue: 0 - offsetValue
      }).animate({
        percentageValue: this.settings.percentage
      }, {
        duration: this.settings.duration,
        easing: this.settings.easing,
        step: function() {
          $target.css({
            'width': this.percentageValue + '%'
          });
        }
      });
    },
    // Animating the percentage circle
    animatePercentage: function() {
      var $container = $(this.element).find('.jpb__percentage-container');
      var $number = $(this.element).find('.jpb__percentage-value');
      var offsetValue = (Math.tan(this.settings.slantDegree * (Math.PI / 180)) * 100);
      $({
        percentageValue: 0
      }).animate({
        percentageValue: this.settings.percentage
      }, {
        duration: this.settings.duration,
        easing: this.settings.easing,
        step: function() {
          $number.text(Math.round(this.percentageValue) + '%');
        },
      });
      $({
        percentageValue: 0 - offsetValue
      }).animate({
        percentageValue: this.settings.percentage + 1
      }, {
        duration: this.settings.duration,
        easing: this.settings.easing,
        step: function() {
          $container.css('left', this.percentageValue + '%');
        },
      });
      $container.addClass('active');
    },
    // Making the motivational text active
    setText: function() {
      var $target = $(this.element).find('.jpb__motivational');
      $target.addClass('active');
    },
    // Setting skew degree and positions offsets
    setDegree: function() {
      var skewValue = this.settings.slantDegree;
      var offsetValue = Math.tan(skewValue * (Math.PI / 180));
      var $elem = $(this.element);
      var containerWidth = $elem.outerWidth();
      var circleWidth = $elem.find('.jpb__percentage-container').outerWidth();
      var $skewedElems = $elem.find('.jpb__overlay-container, .jpb__step, .jpb__steps-highlighted');
      var $unskewedElems = $elem.find('.jpb__overlay-image, .jpb__goal, .jpb__sum-goal');
      var $overlayContainer = $elem.find('.jpb__overlay-container');
      var $percentageContainer = $elem.find('.jpb__percentage-container');

      $skewedElems.css('transform', 'skewX(-' + skewValue + 'deg)');
      $unskewedElems.css('transform', 'skewX(' + skewValue + 'deg)');

      $percentageContainer.css('margin-left', (offsetValue * containerWidth) / 4 - (circleWidth / 2) + 'px');
      $overlayContainer.css('width', 'calc(' + (100 + (offsetValue * 100)) + '%)');
    }
  });

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };

})(jQuery, window, document);
