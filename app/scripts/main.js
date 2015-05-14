/*global TrueCarTest, window, jQuery*/
(function () {
  'use strict';
  window.TrueCarTest = {
    Models: {}
    , Collections: {}
    , Views: {}
    , Routers: {}
    , Templates: {}
    , init: function (options) {

      var controller = {
        Models: {}
        , Collections: {}
        , Views: {}
        , Routers: {}
      };

      controller.Models.Cms = new TrueCarTest.Models.Cms({wid: 'data/data.json'}, {controller: controller});
      controller.Models.Cms.once('change:ts', _.bind(function () {

        controller.Routers.Router = new TrueCarTest.Routers.Router({controller: controller });
        Backbone.history.start();

      }, this));
      controller.Models.Cms.requestData();

      return this;
    }
  };

  jQuery(document).ready(function ($) {
    TrueCarTest.init({});
  });

})();
