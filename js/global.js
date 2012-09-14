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

    if(sites[key])
    {
        e.preventDefault()
        query = query.replace(/\s/g, '+')
        e.target.url = sites[key].replace(/\{search\}/g, query)
    }

    if(key[0] === '!')
    {
        e.preventDefault()
        e.target.url = 'https://www.google.com/search?q=' + full_query.slice(1)
    }
}

safari.application.addEventListener("beforeSearch", handleQuery, false)