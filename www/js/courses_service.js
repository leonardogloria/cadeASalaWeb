app.service('CoursesService', [
  'DataService',

  function (DataService) {

    var CoursesService = {
      courses: [],
      selectedCourse: null,
      term: '',
      init: function () {
        var locations = DataService.locations,
            self = this

        this.locations = locations.map(function (location) {
          return self.getCourses(location)
        })

        this.locations = this.locations.filter(function (location) {
          return location.courses.length > 0
        })

        this.locations.forEach(function (location) {
          location.courses.map(function (course) {
            return self.getDisciplines(course)
          })

          location.courses = location.courses.filter(function (course) {
            return course.disciplines.length > 0
          })
        })
      },

      getCourses: function (location) {
        var courses = DataService.courses

        location.courses = courses.filter(function (course) {
          return course.location === location.name
        })

        return location
      },

      getDisciplines: function (course) {
        var disciplines = formatDate(DataService.disciplines)

        course.disciplines = disciplines.filter(function (discipline) {
          return discipline.course === course.name && discipline.location === course.location
        })

        return course
      },

      getFilteredDisciplines: function (course) {
        var search = this.term.split(" ").join("|")
        var regexp = new RegExp(search, "i")

        return _(course.disciplines).filter(function (discipline) {
          return regexp.test(discipline.name)
        })
      }
    }

    function formatDate (disciplines) {
      return disciplines.map(function (discipline) {
        if (discipline.ap1_date) {
          discipline.ap1_date = moment(discipline.ap1_date, "DD/MM/YYYY")
        }

        if (discipline.ap2_date) {
          discipline.ap2_date = moment(discipline.ap2_date, "DD/MM/YYYY")
        }

        if (discipline.ap3_date) {
          discipline.ap3_date = moment(discipline.ap3_date, "DD/MM/YYYY")
        }
        return discipline
      })
    }

    return CoursesService
  }
])