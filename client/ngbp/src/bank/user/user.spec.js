describe('user functionality', function () {

    describe('bankService', function () {

        var httpBackend, scope, service;


        beforeEach(module('bank.user'));
        beforeEach(inject(function ($rootScope, $httpBackend, $injector) {
            httpBackend = $httpBackend;
            scope = $rootScope.$new();
            service = $injector.get("bankService");
        }));

        it('service must be defined', function () {
            expect(service).toBeDefined();
        });

        it('should get amount from server', function () {

            var amount = {amount: 100};

            httpBackend.whenGET("/bankController").respond({amount: 100});

            service.getAmount().then(function (userAmount) {
                expect(amount).toEqual(userAmount);
            });

            httpBackend.flush();
        });

        it('should deposit money', function () {

            var amount = {amount: 100};

            httpBackend.whenPOST('/bankController/d/money').respond({amount: 100});

            service.deposit(100).then(function (userAmount) {
                expect(amount).toEqual(userAmount);
            });

            httpBackend.flush();
        });
    });

    describe('BankController', function () {

        var scope, service, controller, q;
        var amount = {value: 100};

        beforeEach(module('bank.user'));
        beforeEach(inject(function ($rootScope, $q, $injector, $controller) {
            q = $q;
            service = {
                deposit: jasmine.createSpy().andReturn(promiseOf(amount.value + 50)),
                getAmount: jasmine.createSpy().andReturn(promiseOf()),
                withdraw: jasmine.createSpy().andReturn(promiseOf(amount.value))
            };
            scope = $rootScope.$new();
            controller = $controller('BankController', {
                $scope: scope,
                bankService: service
            });
        }));

        it('should make deposit', function () {
            var transactionAmount = 50;

            scope.deposit(transactionAmount);

            scope.$digest();

            expect(service.deposit).toHaveBeenCalledWith(transactionAmount);
            expect(scope.amount).toEqual(amount.value + 50);
        });

        function promiseOf(data) {
            var defer = q.defer();
            defer.resolve(data);
            return defer.promise;
        }

        it('should withdraw from bank account', function () {
            var transactionAmount = 100;

            scope.withdraw(transactionAmount);

            scope.$digest();

            expect(service.withdraw).toHaveBeenCalledWith(transactionAmount);
            expect(scope.amount).toEqual(amount.value);
        });

        it('should assign error message to transactionError scope when try to deposit incorrect value', function () {
            var message = 'error';
            var transactionAmount = 100;

            scope.deposit(transactionAmount);

            scope.$digest();

            expect(service.deposit).toHaveBeenCalledWith(transactionAmount);
            expect(scope.transactionError).toEqual(message);
        });

    });
});