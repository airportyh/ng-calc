angular.module('ng-calc', [])

.directive('sum', function(){
  return {
    restrict: 'E',
    controller: function($scope, $element){
      var ngModel = $element.attr('ng-model')
      var $for = $element.attr('for')
      var match = $for.match(/([a-zA-Z][a-zA-Z0-9]*)\s+in\s+([a-zA-Z][a-zA-Z0-9]*)/)
      if (!match){
          console.error($for, 'didn\'t match')
          return
      }
      var lhs = match[1]
      var rhs = match[2]
      var expr = $element.attr('expr')
      set()
      
      $scope.$watch(set)
      
      function set(){
          $scope[ngModel] = calcSum()
          $element.text($scope[ngModel])
      }
      
      function calcSum(){
          var arr = $scope.$eval(rhs)
          var sum = 0
          for (var i = 0; i < arr.length; i++){
              var scope = $scope.$new()
              scope[lhs] = arr[i]
              sum += Number(scope.$eval(expr) || 0)
          }
          return sum
      }
    }
  }
})

.directive('barchart', function(){
  return {
    restrict: 'E',
    controller: function($scope, $element){
      var ctx = $element.find('canvas')[0].getContext('2d')
      var dataProp = $element.attr('data')
      var labelProp = $element.attr('label')
      var valueProp = $element.attr('value')
      set()
      $scope.$watch(set)
      
      function set(){
        var arr = $scope.$eval(dataProp)

        var values = []
        var labels = []
        for (var i = 0; i < arr.length; i++){
          labels.push(arr[i][labelProp])                        
          values.push(Number(arr[i][valueProp] || 0))
        }
        new Chart(ctx).Bar({
          labels: labels,
          datasets: [{
            data: values
          }]
        })
      }
    },
    template: '<canvas width="300" height="300"></canvas>'
  }
})

.directive('remotedata', function(){
  return {
    restrict: 'E',
    controller: function($scope, $element, $http){
      var url = $element.attr('url')
      var varname = $element.attr('ng-model')
      $http.get(url)
        .success(function(data){
          $scope[varname] = data
        })
    }
  }
})