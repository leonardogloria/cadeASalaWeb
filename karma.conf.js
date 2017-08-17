module.exports = function (config) {
  config.set({
    basePath: './',
    files: [
      "src/lib/angular-mocks/angular-mocks.js",
      "src/lib/angular-ui-router/release/angular-ui-router.js",
      'src/js/**/*.js',
      'spec/unit/**/*.js'
    ],
    autoWatch: true,
    frameworks: ['jasmine'],
    browsers: ['Chrome'],
    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine'
    ]
  })
}