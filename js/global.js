// global.js

var createUrl = function(url, query)
{
    var new_url

    query = encodeURIComponent(query)
    query = query.replace(/%20/g, '+')

    new_url = url.replace(/\{search\}/g, query)
    new_url = new_url.replace(/\{%search\}/g, query.replace(/\+/g, '%20'))

    return new_url
}

var handleQuery = function(e)
{
    var SavedSites = new Backbone.LocalStorage('omnikey-sites')
    var SitesList = SavedSites.findAll()

    var sites = Omnikey.default_sites

    var search_site = localStorage.default_search

    if(SitesList.length > 0)
    {
        sites = {}
        for(var i = 0; i < SitesList.length; i++)
        {
            sites[SitesList[i].key] = SitesList[i].url

            if(SitesList[i].default)
            {
                search_site = SitesList[i].url
            }
        }
    }

    var full_query = e.query
    var parts = full_query.split(' ')
    var key = parts[0]
    var query = parts.splice(1).join(' ')
    var search_url

    if(sites[key])
    {
        e.preventDefault()

        search_url = createUrl(sites[key], query)

        e.target.url = search_url
    }else if(key[0] === '!'){
        e.preventDefault()

        e.target.url = 'https://www.google.com/search?q=' + escape(full_query.slice(1))
    }else if(search_site){
        e.preventDefault()

        e.target.url = createUrl(search_site, full_query)
    }
}

safari.application.addEventListener("beforeSearch", handleQuery, false)