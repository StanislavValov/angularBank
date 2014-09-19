angular.module('bank', [
    'templates-app',
    'templates-common',
    'bank.registration',
    'bank.user',
    'ui.router'
])

    .config(function myAppConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
        $stateProvider

            .state("user", {
                url: '/user',
                views: {
                    '': { templateUrl: 'user/user.tpl.html'}
                }
            });
    })

    .controller('LoginController', ['$scope', '$http', '$state',
        function ($scope, $http, $state) {

            $scope.login = function (username, password) {
                $http.post('/login', {userName: username, password: password}).
                    success(function () {
                        $state.go('user');
                    });
            };
        }]);