// http://codepen.io/Lewitje/pen/YybQEP original copy from Lewi Hussay updated to work with multiple divs
// Equal height - by Burfield www.burfield.co.uk
// 2016-30-03 - Changed - Refactored from jQuery to vanilla JS (@jacobwarduk http://www.jacobward.co.uk)
// Example usage use data-match-height="groupName" on anything!!!

(function() {
  var matchHeight = {
    match: function() {
      var groupName = Array.prototype.slice.call(
        document.querySelectorAll('[data-match-height]')
      );
      var groupHeights = {};

      for (var i = 0; i < groupName.length; i++) {
        var item = groupName[i];
        var data = item.getAttribute('data-match-height');
        item.style.minHeight = 'auto';

        if (groupHeights.hasOwnProperty(data)) {
          groupHeights[data] = Math.max(groupHeights[data], item.offsetHeight);
        } else {
          groupHeights[data] = item.offsetHeight;
        }
      }

      var groupHeightsMax = groupHeights;

      Object.keys(groupHeightsMax).forEach(function(value) {
        var elementsToChange = document.querySelectorAll(
          "[data-match-height='" + value + "']"
        );
        var elementsLength = elementsToChange.length;

        for (var i = 0; i < elementsLength; i++) {
          elementsToChange[i].style.height = groupHeightsMax[value] + 'px';
        }
      });
    }
  };

  matchHeight.match(); // Call the match function directly

  // Initializing on DOM load
  if (document.readyState === 'complete') {
    matchHeight.match();
  } else {
    document.addEventListener('DOMContentLoaded', matchHeight.match);
  }
})();