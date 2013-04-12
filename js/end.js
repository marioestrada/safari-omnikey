// Only look inside the search engines
if(window.top === window && document.location.href.match(/^https?:\/\/((search|www).)?(google|yahoo|bing)(.[a-zA-Z][a-zA-Z0-9]{1,2}){1,2}?/i))
{
	supported_links = document.querySelectorAll('[href^="http://www.amazon.com"]')

	for(var i = supported_links.length - 1; i >= 0; i -= 1)
	{
		var link = supported_links[i]
		var separator = link.href.indexOf('?') >= 0 ? '&' : '?'

		link.href = link.href + separator + 'tag=httpmariec-20'
	}
}