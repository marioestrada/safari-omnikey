// global.js

var getMessage = function(msg)
{
    var name = msg.name
    var data = msg.message

    switch(name)
    {
        case 'getSites':
            var SavedSites = new Backbone.LocalStorage('omnikey-sites')
            // safari.self.tabs[0].page.dispatchMessage("setSites", SavedSites.findAll())
            msg.target.page.dispatchMessage("setSites", SavedSites.findAll())
            break
    }
}

safari.application.addEventListener("message", getMessage, false)