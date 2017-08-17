app.controller('HomeCtrl', [
  '$scope',
  '$state',

  function ($scope,
            $state) {

    $scope.title = 'Home'

    $scope.disciplinesList = function () {
      $state.go('disciplines-list')
    }
  }
])