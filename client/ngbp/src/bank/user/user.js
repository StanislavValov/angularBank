angular.module('bank.user', [
    'ui.router',
    'placeholders',
    'ui.bootstrap'
])

    .config(function ($httpProvider) {

        $httpProvider.interceptors.push(['$rootScope', '$timeout', function ($rootScope, $timeout) {

            var clearErrors = function () {
                $rootScope.error = "";
            };

            return {
                responseError: function (rejection) {
                    $rootScope.error = rejection.data;
                    $timeout(clearErrors, 2000);
                }
            };
        }]);
    })

    .service('bankService', ['$http', '$q', function ($http, $q) {
        return {
            getAmount: function () {
                var defer = $q.defer();
                $http.get('/bankController').success(function (amount) {
                    defer.resolve(amount);
                });
                return defer.promise;
            },

            deposit: function (transactionAmount) {
                var defer = $q.defer();
                $http.post('/bankController/d/money', {transactionAmount: transactionAmount})
                    .success(function (amount) {
                        defer.resolve(amount);
                    })
                    .error(function (error) {
                        defer.reject(error);
                    });
                return defer.promise;
            },

            withdraw: function (transactionAmount) {
                var defer = $q.defer();
                $http.post('/bankController/w/money', {transactionAmount: transactionAmount})
                    .success(function (amount) {
                        defer.resolve(amount);
                    })
                    .error(function (error) {
                        defer.reject(error);
                    });
                return defer.promise;
            }
        };
    }])

    .controller('BankController', ['$scope', 'bankService', '$timeout', function ($scope, bankService) {

        bankService.getAmount().then(function (amount) {
            $scope.amount = amount;
        });

        $scope.deposit = function (transactionAmount) {

            bankService.deposit(transactionAmount).then(function (amount) {
                $scope.amount = amount;
            });
        };

        $scope.withdraw = function (transactionAmount) {

            bankService.withdraw(transactionAmount).then(function (amount) {
                $scope.amount = amount;
            });
        };
    }])

    .controller('LogoutController', ['$scope', '$http', function ($scope, $http) {

        $scope.logout = function () {
            $http.post('/logout').
                success(function () {
                    window.location.href = 'index.html';
                });
        };
    }]);