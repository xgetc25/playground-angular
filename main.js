var app = angular.module('myApp', []);

app.controller('MyCtrl', MyCtrl);

app.filter('offset', function() {
  return function(input, start) {
    start = parseInt(start, 10);
    return input.slice(start);
  };
});

function MyCtrl($scope, $http) {
    $scope.selectedItem = {};
    $scope.data = [];
    $scope.dataSize = 'small';
    $scope.gridFields = [];
    $scope.gridFieldsNames = [];
    $scope.currentPage = 0;
    $scope.pageSize = 30;

    $scope.numberOfPages=function(){
        return Math.ceil($scope.data.length/$scope.pageSize);                
    }


    $scope.selectRow = function(row) {
        $scope.selectedItem = JSON.stringify(row);
    }

    $http.get('http://thethz.com/dataset.php?type=small').success(function(rawData) {
        var data = prepareData(rawData);


        $scope.data = data;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    });

    function prepareData(rawData) {
        var data = [];
        var row;

        rawData[0].map(function(field) {
            $scope.gridFields.push(field.field);
            $scope.gridFieldsNames.push(field.title);
        });

        for (var i = 1, l = rawData.length; i < l; i++) {
            row = {}
            $scope.gridFields.map(function(fieldName, index) {
                row[fieldName] = rawData[i][index];
            });
            data.push(row);
        }
        return data;
    };

}
app.directive('mygrid', function() {
    return {
        restrict: 'AE',
        templateUrl: 'grid.html',
        scope: {},
        controller: MyCtrl
    };
});