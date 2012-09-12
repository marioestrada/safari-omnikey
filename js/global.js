// global.js

var SavedSites = new Backbone.LocalStorage('omnikey-sites')

var getMessage = function(msg)
{
    var name = msg.name
    var data = msg.message

    switch(name)
    {
        case 'getSites':
            safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("setSites", SavedSites.findAll());
            break
    }
}

safari.application.addEventListener("message", getMessage, false)