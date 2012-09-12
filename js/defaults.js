var Omnikey = Omnikey || {}

Omnikey.default_sites = [
    {
        key: 'amazon',
        url: 'http://www.amazon.com/s/?tag=httpmariec-20&link_code=wsw&_encoding=UTF-8&search-alias=aps&field-keywords={search}&Submit.x=0&Submit.y=0&Submit=Go'
    },
    {
        key: 'newegg',
        url: 'http://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=BESTMATCH&N=-1&isNodeId=1&Description={search}&x=0&y=0'
    },
    {
        key: 'zap',
        url: 'http://www.zappos.com/search?term={search}'
    },
    {
        key: 'youtube',
        url: 'http://www.youtube.com/results?search_query={search}'
    },
    {
        key: 'ddg',
        url: 'http://duckduckgo.com/?q={search}'
    },
    {
        key: 'ebay',
        url: 'http://www.ebay.com/sch/i.html?_trksid=p5197.m570.l1313&_nkw={search}&_sacat=0'
    },
    {
        key: 'rt',
        url: 'http://www.rottentomatoes.com/search/search.php?search={search}&sitesearch=rt'
    },
    {
        key: 'tw',
        url: 'http://search.twitter.com/search?q={search}'
    },
    {
        key: 'wiki',
        url: 'http://en.wikipedia.org/w/index.php?title=Special:Search&search={search}'
    },
    {
        key: 'wolfram',
        url: 'http://www.wolframalpha.com/input/?i={search}'
    }
]