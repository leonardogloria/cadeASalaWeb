'use strict';

appResources.factory('Course', ['$resource', 'appConfig', function($resource, appConfig) {
  return $resource(
    '{0}/locations/:locationId/courses/:courseId'.format([appConfig.backendURL])
  );
}]);