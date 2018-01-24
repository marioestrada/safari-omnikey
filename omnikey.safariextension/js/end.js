/* globals safari */

var initialize = function(settings) {
  // TODO
};

if (window.top === window) {
  safari.self.tab.dispatchMessage('getSettings');

  safari.self.addEventListener(
    'message',
    function(e) {
      if (e.name === 'setSettings') {
        var settings = e.message;
        initialize(settings);
      }
    },
    false
  );
}
