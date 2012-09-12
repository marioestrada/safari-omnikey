// global.js

var SavedSites = new Backbone.LocalStorage('omnikey-sites')

var getMessage = function(msg)
{
    var name = msg.name
    var data = msg.message

    console.log('global: handling message', msg)

    switch(name)
    {
        case 'getSites':
            console.log(SavedSites.findAll())
            safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("setSites", SavedSites.findAll());
            break
    }
}

safari.application.addEventListener("message", getMessage, false)