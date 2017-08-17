var app = angular.module('cederj-calendar', [
  'ui.router',
  'LocalStorageModule'
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
      .state('home', {
        url: '/home',
        controller: 'HomeCtrl',
        templateUrl: '../templates/home.html'
      })

      .state('disciplines-list', {
        url: '/disciplines_list',
        controller: 'DisciplineListCtrl',
        templateUrl: '../templates/disciplines_list.html'
      })

      .state('discipline', {
        url: '/discipline',
        controller: 'DisciplineCtrl',
        templateUrl: '../templates/discipline.html',
        params: {
          discipline: null
        }
      })
  }
])