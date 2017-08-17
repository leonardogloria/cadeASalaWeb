'use strict';

appResources.factory('CourseDiscipline', ['$resource', 'appConfig', function($resource, appConfig) {
  return $resource(
    '{0}/locations/:locationId/courses/:courseId/course_disciplines'.format([appConfig.backendURL])
  );
}]);