'use strict';

appResources.factory('Location', ['$resource', 'appConfig', function($resource, appConfig) {
  return $resource(
    '{0}/locations/:locationId'.format([appConfig.backendURL])
  );
}]);