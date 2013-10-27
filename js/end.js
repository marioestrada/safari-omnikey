if(window.top === window) {

    var href = document.location.href

    // Only look inside the search engines
    if(href.match(/^https?:\/\/((search|www)\.)?(google|yahoo|bing)(\.[a-zA-Z][a-zA-Z0-9]{1,2}){1,2}/i)) {
        var supported_links = document.querySelectorAll('[href^="http://www.amazon.com"]')
        var link, separator;

        for(var i = supported_links.length - 1; i >= 0; i -= 1)
        {
            link = supported_links[i]
            separator = link.href.indexOf('?') >= 0 ? '&' : '?'

            link.href = link.href + separator + 'tag=httpmariec-20'
        }
    }

    if(href.match(/^https?:\/\/(www\.)?amazon(\.[a-zA-Z][a-zA-Z0-9]{1,2}){1,2}/i)) {
        var form = document.querySelector('[role=search]')
        var input = document.createElement('input')
        input.type = "hidden"
        input.value = "httpmariec-20"
        input.name = "tag"

        form.appendChild(input)
    }

}