/**
 * Tests sit right alongside the file they are testing, which is more intuitive
 * and portable than separating `src` and `test` directories. Additionally, the
 * build process will exclude all `.spec.js` files from the build
 * automatically.
 */

describe('registration section', function () {

    describe('describe different behaviors when user try to make registration', function () {
        var scope, http, state, httpBackend;

        beforeEach(module('bank.registration'));

        beforeEach(inject(function ($controller, $rootScope, $http, $httpBackend) {
            httpBackend = $httpBackend;
            http = $http;
            state = {go: jasmine.createSpy()};
            scope = $rootScope.$new();

            $controller('RegistrationController', { $scope: scope, $http: http, $state: state });
        }));

        it('should fail to register and go to state "registration" ', function () {
            httpBackend.expectPOST('/registration').respond(400);
            scope.register('Stan', '12');
            httpBackend.flush();
            expect(state.go).toHaveBeenCalledWith('registration');
        });
    });
});