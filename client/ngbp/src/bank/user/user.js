angular.module('bank.user', [
    'ui.router',
    'placeholders',
    'ui.bootstrap'
])

//    .config(function ($httpProvider) {
//
//        $httpProvider.interceptors.push(['$rootScope','$q',function ($rootScope,$q) {
//            return {
//                responseError: function (rejection) {
////                    return $q.reject(rejection);
//                    console.log('Stan');
//                    $rootScope.transactionError = rejection;
//                }
//            };
//        }]);
//    })

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

    .controller('BankController', ['$scope', 'bankService', '$timeout', function ($scope, bankService, $timeout) {

        bankService.getAmount().then(function (amount) {
            $scope.amount = amount;
        });

        $scope.deposit = function (transactionAmount) {

            bankService.deposit(transactionAmount).then(function (amount) {
                    $scope.amount = amount;
                },
                function (error) {
                    $scope.transactionError = error;
                    $timeout(clearErrors(),1000);
                });
        };

        $scope.withdraw = function (transactionAmount) {

            bankService.withdraw(transactionAmount).then(function (amount) {
                    $scope.amount = amount;
                },
                function (error) {
                    $scope.transactionError = error;
                    $timeout(clearErrors, 1000);
                });
        };
        var clearErrors = function () {
            $scope.transactionError = "";
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