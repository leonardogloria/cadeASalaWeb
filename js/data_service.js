app.service('DataService', [

  function () {

    var DataService = {
      locations: window.locations,
      courses: window.courses,
      disciplines: window.disciplines
    }

    return DataService
  }
])