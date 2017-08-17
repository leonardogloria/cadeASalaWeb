app.controller('DisciplineListCtrl', [
  '$scope',
  '$state',
  'CoursesService',

  function ($scope,
            $state,
            CoursesService) {

    $scope.selected = {
      location: '',
      course: ''
    }

    $scope.courses = []
    $scope.disciplines = []

    $scope.coursesService = CoursesService
    CoursesService.init()

    $scope.updateSelectedLocation = function () {
      $scope.coursesService.term = ''
      $scope.courses = $scope.selected.location.courses
    }

    $scope.updateSelectedCourse = function () {
      $scope.coursesService.term = ''
      $scope.disciplines = $scope.selected.course ?
                              $scope.selected.course.disciplines :
                              []
    }

    $scope.updateDisciplines = function () {
      $scope.disciplines = CoursesService.getFilteredDisciplines($scope.selected.course)
    }

    $scope.goToDiscipline = function (discipline) {
      $state.go('discipline', { discipline: discipline })
    }
  }
])

.controller('DisciplineCtrl', [
  '$scope',
  '$state',
  '$stateParams',

  function ($scope,
            $state,
            $stateParams) {

    $scope.discipline = $stateParams.discipline
  }
])