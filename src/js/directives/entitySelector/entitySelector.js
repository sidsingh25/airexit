angular.module('app').directive('entitySelector', ['$timeout', entitySelector]);

/**
The entities are like this:
{
id: String,
name: String,
description: String
}

*/

function entitySelector($timeout) {

  var instances = {};

  var closeOthers = function(id) {
    for (var key in instances) {
      if (key != id) {
        var scope = instances[key];
        scope.expanded = false;
      }
    }
  }

  var directive = {
    scope: {
      entities: '=',
      selected: '=',
      required: '='
    },
    controller: ['$scope', function($scope) {
      $scope.expanded = false;
      $scope.search = {};
      $scope.search.value = '';
      $scope.toggleExpand = function() {
        $scope.expanded = !$scope.expanded;
        if ($scope.expanded) {
          $scope.focusSearchInput();
          closeOthers($scope.$id);
          $scope.resize();
        }
      }
      $scope.select = function(item) {
        if ($scope.selected && item.id === $scope.selected.id) {
          $scope.selected = null;
        } else {
          $scope.selected = item;
          $scope.expanded = false;
        }
      };

      $scope.focused = function() {
        $scope.expanded = true;
        $scope.focusSearchInput();
      };

      $scope.$on('$init', function() {
        scope.resize();
      });

      $scope.$on('$destroy', function() {
        delete instances[$scope.$id];
      });
    }],
    link: function(scope, element, attrs, tabsCtrl) {
      instances[scope.$id] = scope;

      scope.focusSearchInput = function() {
        scope.search.value = '';
        var searchElem = angular.element(element).children().children()[1] && angular.element(element).children().children()[1].children[0].children[0];
        if (searchElem) {
          $timeout(function() {
            searchElem.focus();
          }, 0);
        }
      };

      scope.resize = function() {
        var popup = angular.element(element).children()[1];
        var inputTag = angular.element(element).children()[0];
        if (popup && inputTag) {
          popup.style.width = inputTag.clientWidth + 'px';
        }
      };

      var inputTag = angular.element(element).children()[0];
      inputTag.addEventListener("resize", function() {
        if (scope.expanded) {
          var popup = angular.element(element).children()[1];
          popup.style.width = inputTag.clientWidth + 'px';
          console.log(popup.style.width);
        }
      });
    },
    template: ' <div class="form-control" style="margin-bottom: 0;">' +
      '	  <div class="row">' +
      '  		<div class="col-md-12" ng-click="toggleExpand()" style="cursor:pointer;">' +
      '    		<div ng-if="!selected" class="pull-left">&nbsp;<span style="color:gray;">please select one...</span></div>' +
      '    		<div ng-if="selected" class="pull-left">&nbsp;<span>{{selected.name}}</span></div>' +
      '       <div ng-show="!expanded" class="pull-right"><i class="glyphicon glyphicon-chevron-down"></i></div>' +
      '       <div ng-show="expanded" class="pull-right"><i class="glyphicon glyphicon-chevron-up"></i></div>' +
      '       <button class="pull-right" ng-focus="focused()" ng-blur="expanded=false;"></button>'+
      '  		</div>' +
      '	  </div>' +
      ' </div>' +
      ' <div ng-show="expanded" class="entity-selector-popup">' +
      '   <div ng-show="entities.length" class="row">' +
      '    	<div class="col-md-12" style="margin-bottom: 0px;border-bottom: 1px solid #eee">' +
      '       <input type="text" ng-model="search.value" ng-keyup="$event.keyCode == 13 && select(filteredEntities[0])" placeholder="Type to search..." class="entity-selector-search-input">' +
      '       <span ng-show="search.value" style="position: absolute; right: 5px; color: grey; font-size: 10px; top: 8px;">{{filteredEntities.length ? (filteredEntities[0].id == selected.id ? \'Hit Enter to unselect\' : \'Hit Enter to select\') : \'All items filtered\'}}</span>' +
      '    	</div>' +
      '  	</div>' +
      '   <div style="max-height:200px; overflow: auto;">' +
      '     <div class="list-group" style="margin-bottom: 0px;">' +
      '       <div ng-repeat="item in filteredEntities = (entities | filter:{name: search.value})" class="entity-selector-item" ng-click="select(item)" ng-class="{ \'entity-selector-item-active\': item.id == selected.id}">' +
      '         <div class="list-group-item-heading" style="margin: 0;">{{item.name}} <small style="color:darkgray;">{{item.description}}</small></div>' +
      '       </div>' +
      '       <div ng-show="!entities.length" style="padding: 5px 10px;height: 27px;font-size: 11px;">' +
      '          The are no items' +
      '    	  </div>' +
      '     </div>  ' +
      '	  </div>' +
      ' </div>',
    restrict: 'E'
  };
  return directive;
};
