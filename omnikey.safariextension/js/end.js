// jshint asi: true
if (window.top === window) {
  safari.self.tab.dispatchMessage('getSettings');

  safari.self.addEventListener('message', function(e) {
    if(e.name === 'setSettings') {
      settings = e.message;
      initialize(settings);
    }
  }, false);
}

var initialize = function (settings) {
  console.log(settings)
  if(settings.referral_enabled) {
      var href = document.location.href
      var search_engines_re = /^https?:\/\/((search|www)\.)?(google|yahoo|bing)(\.[a-zA-Z][a-zA-Z0-9]{1,2}){1,2}/i

      // Only look inside the search engines
      if(href.match(search_engines_re)) {
          var supported_links = document.querySelectorAll('[href^="http://www.amazon.com"]')
          var link, separator;

          for(var i = supported_links.length - 1; i >= 0; i -= 1)
          {
              link = supported_links[i]
              separator = link.href.indexOf('?') >= 0 ? '&' : '?'

              link.href = link.href + separator + 'tag=httpmariec-20'
          }
      }

      // Add referal to Amazon Search
      if(href.match(/^https?:\/\/(www\.)?amazon(\.[a-zA-Z][a-zA-Z0-9]{1,2}){1,2}/i)) {
          var form = document.querySelector('[role=search]')
          var input = document.createElement('input')
          input.type = "hidden"
          input.value = "httpmariec-20"
          input.name = "tag"

          form.appendChild(input)
      }
  }
}
