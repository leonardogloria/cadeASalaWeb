app.controller('MainCtrl', [
  '$state',

  function ($state) {

    $state.go('disciplines-list')
  }
])