(function()
{
    if(window.top === window)
    {
        var url = window.location.href

        // http-//search.yahoo.com/search?ei=utf-8&fr=aaplw&p=hola+yahoo
        // http-//www.bing.com/search?q=hola+bing&form=APMCS1
        var safari_search_engines = {
            google: {
                referral: /client=safari/i, //.test(url)
                query: /\bq=([^&]+)/i //.exec(url)
            },
            bing: {
                referral: /form=APMCS1/i,
                query: /\bq=([^&]+)/i
            },
            yahoo: {
                referral: /fr=aaplw/i,
                query: /\bp=([^&]+)/i
            }
        }

        var is_safari_search = false
        var matches = false

        for(var engine in safari_search_engines)
        {
            matches = safari_search_engines[engine].query.exec(url)
            is_safari_search = safari_search_engines[engine].referral.test(url)

            if(is_safari_search)
            {
                break
            }
        }

        var handleMessage = function(msg)
        {
            var name = msg.name
            var data = msg.message

            switch(name)
            {
                case 'setSites':
                    var sites = Omnikey.default_sites

                    if(data.length > 0)
                    {
                        sites = {}
                        for(var i = 0; i < data.length; i++)
                        {
                            sites[data[i].key] = data[i].url
                        }
                    }

                    var full_query = decodeURIComponent(matches[1]).replace(/\+/g, ' ')
                    var parts = full_query.split(' ')
                    var key = parts[0]
                    var query = parts.splice(1).join(' ')

                    if(sites[key])
                    {
                        query = query.replace(/\s/g, '+')
                        window.stop()
                        window.location = sites[key].replace(/\{search\}/g, query)
                    }

                    if(parts[0][0] === '!')
                    {
                        window.location = url.replace(parts[0], parts[0].slice(1)) + '&_ok_=1'
                    }

                    break
            }
        }

        if(is_safari_search && !/_ok_=1/i.test(url) && matches && matches[1]) //&& matches[1].charAt(1) !== '!'
        {
            safari.self.tab.dispatchMessage("getSites")
        }

        safari.self.addEventListener("message", handleMessage, false)
    }
})()