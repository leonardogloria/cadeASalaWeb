'use strict';

var format = function(str, data) {
  return str.replace(/{([^{}]+)}/g, function(match, val) {
    var prop = data;
    val.split('.').forEach(function(key) {
      prop = prop[key];
    });

    return prop;
  });
};

String.prototype.format = function(data) {
  return format(this, data);
};

String.prototype.slugify = function() {
  function dasherize(str) {
    return str.trim().replace(/[-_\s]+/g, '-').toLowerCase();
  }

  function clearSpecial(str) {
    var from  = 'ąàáäâãåæăćčĉęèéëêĝĥìíïîĵłľńňòóöőôõðøśșşšŝťțţŭùúüűûñÿýçżźž',
      to    = 'aaaaaaaaaccceeeeeghiiiijllnnoooooooossssstttuuuuuunyyczzz';
    to = to.split('');
    return str.replace(/.{1}/g, function(c){
      var index = from.indexOf(c);
      return index === -1 ? c : to[index];
    });
  }

  return clearSpecial(dasherize(this));
};

var appResources = angular.module('cederj-calendar.resources', []);

var app = angular.module('cederj-calendar', [
  'ui.router',
  'ngResource',
  'LocalStorageModule',
  'cederj-calendar.resources'
])

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  'localStorageServiceProvider',

  function ($stateProvider,
            $urlRouterProvider,
            localStorageServiceProvider) {

    localStorageServiceProvider
      .setPrefix('cederj-calendar')

    $stateProvider
      .state('disciplines-list', {
        url: '/',
        controller: 'DisciplineListCtrl',
        templateUrl: '../templates/disciplines_list.html'
      })
  }
])

app.constant('appConfig', {
  backendURL: 'https://ab9la9wbm9.execute-api.us-east-1.amazonaws.com/v1',
  
  env: 'production'
})

app.run(function() {
  moment.locale('pt-BR')
})