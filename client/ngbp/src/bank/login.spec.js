describe('login section', function () {

    describe('Login functionality', function () {

        var scope, state, httpBackend, http;

        beforeEach(module('bank'));
        beforeEach(inject(function ($rootScope, $controller, $httpBackend, $injector) {

            httpBackend = $httpBackend;
            scope = $rootScope.$new();
            state = {go: jasmine.createSpy()};
            http = $injector.get("$http");
            $controller('LoginController', {$scope: scope, $http: http, $state: state});
        }));

        it('should fail to login', function () {
            scope.login('Stan', '12');
            httpBackend.expectPOST('/login').respond(401);
            httpBackend.flush();
            expect(state.go).toHaveBeenCalledWith('error');
        });

        it('should login', function () {
            scope.login('Stanislav', '123456');
            httpBackend.expectPOST('/login').respond(200);
            httpBackend.flush();
            expect(state.go).toHaveBeenCalledWith('user');
        });
    });
});