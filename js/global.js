// global.js

var handleQuery = function(e)
{
    var SavedSites = new Backbone.LocalStorage('omnikey-sites')
    var SitesList = SavedSites.findAll()

    var sites = Omnikey.default_sites

    if(SitesList.length > 0)
    {
        sites = {}
        for(var i = 0; i < SitesList.length; i++)
        {
            sites[SitesList[i].key] = SitesList[i].url
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
        query = query.replace(/\s+/g, '+')
        
        search_url = sites[key].replace(/\{search\}/g, query)
        search_url = search_url.replace(/\{%search\}/g, query.replace('+', '%20'))

        e.target.url = search_url
    }

    if(key[0] === '!')
    {
        e.preventDefault()
        e.target.url = 'https://www.google.com/search?q=' + full_query.slice(1)
    }
}

safari.application.addEventListener("beforeSearch", handleQuery, false)