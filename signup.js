var SignUpModule = angular.module('signUpModule',[]);

SignUpModule.controller('UsersController', function($scope, UserRestService) {

    $scope.users = [];
    $scope.newuser = {};

    $scope.createUser = function() {
        $scope.error_form = false;

        if (!$scope.createUserForm.$valid) {
            $scope.error_form = true;
            return;
        }

        if (exists($scope.newuser)) {
            showAlert('User "' + $scope.newuser.email + '" exists already');
            return;
        }
 
        var newuser = angular.copy($scope.newuser);
        newuser.id = new Date().getTime();

        UserRestService.create(newuser, function(data) {
            $scope.users.push(newuser);
            $scope.newuser = {};
        }, function(data, status) {
            showAlert('Error trying save the user ' + JSON.stringify($scope.newuser) + ' [Status : ' + status + ']');
        });              
    }

    $scope.deleteUser = function(user) {
        var index = indexOf(user);
        if (index == -1) {
            showAlert('Error. User "' + user.email + '" not found');
            return;
        }

        UserRestService.delete(user, function(data, status) {
            $scope.users.splice(index, 1);
        }, function(data, status) {
            showAlert('Error trying delete user "' + user.email +'" [Status: ' + status +']');
        });
    }

    $scope.clean = function() {
        $scope.newuser  = {name : '', email : ''};
        $scope.error = false;
        $scope.error_message = '';
        $scope.error_form = false;
    }

    $scope.change = function() {
        hideAlert();
    }

    function exists(user) {
        return indexOf(user) > -1;
    }

    function indexOf(user) {
        for(i in $scope.users) {
            if($scope.users[i].email == user.email) {
                return i;
            }
        }

        return -1;
    }

    function showAlert(msg) {
        $scope.error = true;
        $scope.error_message = msg
    }

    function hideAlert() {
        $scope.error = false;
        $scope.error_message = '';
    }
});

SignUpModule.service('UserRestService', function ($http) {
    $http.defaults.headers.common.Accept = 'some/mimetype';
    $http.defaults.headers.common['X-SomeDefaultRareHeader'] = 'rare-value';

    this.create = function(user,success, fail) {
        $http({
            method : 'POST',
            url : './signup.html',
            headers : {
                "X-CreateUserRareHeader" : "value",
                "Accept" : "text/plain"
            },
            cache : false,
            timeout : 20000//milliseconds
        }).success(function(data, status, headers, config) {
            success(data, status);
        }).error(function(data, status, headers, config) {
            success(data, status);
        });
    }

    this.delete = function(user,success, fail) {
        $http.post("./signup.html")
        .success(function(data, status, headers, config) {
            success(data, status);
        }).error(function(data, status, headers, config) {
            fail(data,status)
        });
    }
});