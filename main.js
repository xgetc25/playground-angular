var app = angular.module('myApp', []);

app.filter('offset', function() {
    return function(input, start) {
        start = parseInt(start, 10);
        return input.slice(start);
    };
});

app.controller('GridsManager', GridsManager);

function GridsManager($scope) {
    $scope.count = 0
    $scope.items = [-1];

    $scope.add = function() {
        $scope.items.push(++$scope.count)
    };
}

app.directive('grid', function() {
    function Grid($scope, $http) {
        $scope.selectedItem = {};
        $scope.data = [];
        $scope.dataSize = 'small';
        $scope.gridFields = [];
        $scope.gridFieldsNames = [];
        $scope.currentPage = 0;
        $scope.pageSize = 30;

        $scope.$watch('dataSize', function(newVal, oldVal) {
            if (newVal !== oldVal){
                getData();
            }
        });

        getData();

        $scope.numberOfPages = function() {
            return Math.ceil($scope.data.length / $scope.pageSize);
        }

        $scope.selectRow = function(row) {

            $scope.selectedItem = [row.name, row.price,row.bid].join(',');
        }

        function updateGrid(data, status, headers, config) {
            var data = prepareData(data);
            $scope.data = data;
        };

        function getData() {
            $http.get('http://thethz.com/dataset.php?type=' + $scope.dataSize).success(updateGrid).error(function() {
                console.log('error - cant get data');
            });        
        };

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

    return {
        restrict: 'AE',
        templateUrl: 'grid.html',
        scope: {},
        controller: Grid
    };
});