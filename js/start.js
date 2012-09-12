(function()
{
    if(window.top === window)
    {
        var url = window.location.href
        var matches = /q=([^&]+)/i.exec(url)

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

        if(/client=safari/i.test(url) && !/_ok_=1/i.test(url) && matches && matches[1] && matches[1].charAt(1) !== '!')
        {
            safari.self.tab.dispatchMessage("getSites")
        }

        safari.self.addEventListener("message", handleMessage, false)
    }
})()