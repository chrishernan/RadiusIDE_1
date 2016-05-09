/**
 * Created by Phuongy on 5/9/16.
 */
var app = angular.module('main',[])

.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
