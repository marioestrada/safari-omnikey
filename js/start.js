var sites = {
    'amazon': 'http://www.amazon.com/s/?tag=httpmariec-20&link_code=wsw&_encoding=UTF-8&search-alias=aps&field-keywords={search}&Submit.x=0&Submit.y=0&Submit=Go',
    'ne': 'http://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=BESTMATCH&N=-1&isNodeId=1&Description={search}&x=0&y=0',
    'zap': 'http://www.zappos.com/search?term={search}',
    'yt': 'http://www.youtube.com/results?search_query={search}',
    'ddg': 'http://duckduckgo.com/?q={search}',
    'eb': 'http://www.ebay.com/sch/i.html?_trksid=p5197.m570.l1313&_nkw={search}&_sacat=0',
    'rt': 'http://www.rottentomatoes.com/search/search.php?search={search}&sitesearch=rt',
    'tw': 'http://search.twitter.com/search?q={search}',
    'wiki': 'http://en.wikipedia.org/w/index.php?title=Special:Search&search={search}',
    'wa': 'http://www.wolframalpha.com/input/?i={search}'
}

if(window.top === window)
{
    var url = window.location.href

    matches = /q=([^&]+)/i.exec(url)

    if(/client=safari/i.test(url) && matches && matches[1] && matches[1].charAt(1) !== '!')
    {
        var full_query = decodeURIComponent(matches[1]).replace(/\+/g, ' ')
        var parts = full_query.split(' ')
        var key = parts[0]
        var query = parts.splice(1).join(' ')

        if(sites[key])
        {
            query = query.replace(/\s/g, '+')
            window.location = sites[key].replace(/\{search\}/g, query)
        }
    }
}