/* jshint asi: true */
(function()
{

    var AppView = Backbone.View.extend({

        option_template: _.template('<option value="<%= url %>"><%= name %></option>'),

        initialize: function()
        {
            this.$sites = this.$('tbody').html('')
            this.$panels = $('.panel')
            this.$import_data = $('#import_data')
            this.$export_data = $('#export_data')

            this.initViews()
            this.initCollections()

            this.el_set_default = $('#set_default')
            this.el_default_search = $('#default_search')

            if(localStorage.default_search)
            {
                this.el_set_default.prop('checked', true)
                this.el_default_search.prop('disabled', false)
                    .val(localStorage.default_search)
            }

            $(document).on('click', '.add-site', _.bind(this.addSite, this))
            $(document).on('click', '.import-export-toggle', _.bind(this.togglePanels, this))
            $(document).on('click', '.import-data', _.bind(this.importData, this))
            $(document).on('click', '#set_default', _.bind(this.toggleUseDefault, this))
            $(document).on('click', '#default_search', _.bind(this.changeDefaultSites, this))
        },

        importData: function (e) {
            e.preventDefault()

            this.Collections.Sites.importData(this.$import_data.val())

            this.togglePanels()
        },

        toggleUseDefault: function(e)
        {
            var me = $(e.currentTarget)

            this.el_default_search.prop('disabled', !me.is(':checked'))

            if(me.is(':checked'))
            {
                this.setDefaultSite(this.el_default_search.val())
                safari.extension.globalPage.contentWindow.trackEvent(['Default Search', this.el_default_search.val()])
            }else{
                this.setDefaultSite(false)
                safari.extension.globalPage.contentWindow.trackEvent(['Default Search', false])
            }
        },

        togglePanels: function (e) {
            if (e) { e.preventDefault() }
            this.$panels.toggle()
        },

        changeDefaultSites: function(e)
        {
            var me = $(e.currentTarget)

            if(me.is(':enabled')) {
                this.setDefaultSite(me.val())
            }
        },

        setDefaultSite: function(site)
        {
            if(site) {
                localStorage.default_search = site
            } else {
                localStorage.removeItem('default_search')
            }
        },

        addSite: function(e)
        {
            e.preventDefault()

            var model = this.Collections.Sites.create({ key: 'key', url: safari.application.activeBrowserWindow.activeTab.url })
            model.trigger('justAdded')

            model.save()
        },

        initViews: function()
        {
            this.Subviews = {}
        },

        initCollections: function()
        {
            this.Collections = {}

            this.Collections.Sites = new Sites

            this.Collections.Sites.on('add', this.addOne, this)
            this.Collections.Sites.on('reset', this.addAll, this)
            this.Collections.Sites.on('all', this.fillExportData, this)
            // this.Collections.Sites.on('all', this.render, this)

            this.Collections.Sites.fetch()
        },

        fillExportData: function () {
            this.$export_data.val(this.Collections.Sites.exportData())
        },

        addOne: function(site)
        {
            var view = new SiteView({ model: site })
            this.$sites.append(view.render().el)

            $('#default_search').append( this.option_template( site.toJSON() ) )
        },

        addAll: function()
        {
            if(this.Collections.Sites.length === 0)
            {
                console.log('First time running, populating sites')
                safari.extension.globalPage.contentWindow.trackEvent('Install')
                this.Collections.Sites.add(Omnikey.default_sites)
                this.Collections.Sites.each(function(Site)
                {
                    Site.save()
                })
            }else{
                this.Collections.Sites.each(_.bind(this.addOne, this))
            }
        }
    })

    var Site = Backbone.Model.extend({

        defaults: {
            key: 'example',
            url: 'http://example.com/?q={search}'
        },

        initialize: function()
        {
            this.on('change:url', this.setName, this)

            if(!this.get('url')) {
                this.set({ url: this.defaults.url })
            }

            if(!this.get('key')) {
                this.set({ key: this.defaults.key })
            }

            this.set('name', this.getName(this.get('url')))

            this.view = new SiteView({ model: this })
        },

        setName: function()
        {
            this.set('name', this.getName(this.get('url')))
        },

        clear: function()
        {
            safari.extension.globalPage.contentWindow.trackEvent(['Removed Site', this.get('key') + '|' + this.get('url')])
            this.destroy()
        },

        parseUrl: function(url)
        {
            var a = document.createElement('a')
            a.href = url
            return a
        },

        getName: function(url)
        {
            var link = this.parseUrl(url)

            return this.capitalize(link.hostname.replace('www.', ''))
        },

        capitalize: function(string)
        {

            return string[0].toUpperCase() + string.slice(1)
        }
    })

    var Sites = Backbone.Collection.extend({
        model: Site,

        localStorage: new Backbone.LocalStorage("omnikey-sites"),

        comparator: function(site)
        {
            return site.get('key').toLowerCase().charCodeAt(0)
        },

        exportData: function () {
            var data = _(this.toJSON()).map(function (obj) {
                return _(obj).pick('key', 'url')
            })

            return JSON.stringify(data)
        },

        importData: function (json_data) {
            this.add(json_data)
            this.each(function(Site)
            {
                Site.save()
            })
        }
    })

    var SiteView = Backbone.View.extend({
        tagName: 'tr',

        template: _.template('<td class="key">\
                <input class="key" data-key="key" value="<%= key %>" />\
                <span class="label"><%= key %></span>\
            </td>\
            <td class="url">\
                <a href="#delete" class="remove">+</a>\
                <input class="url" data-key="url" value="<%= url %>" />\
                <span class="label"><%= name %></span>\
            </td>'),

        events: {
            'click td': 'edit',
            'blur td input': 'done',
            'keypress td input': 'keypress',
            'click .remove': 'removeSite',
            'keydown td input': 'keydown'
        },

        initialize: function()
        {
            this.model.on('change', this.render, this)
            this.model.on('destroy', this.remove, this)
            this.model.on('justAdded', this.justAdded, this)
        },

        justAdded: function()
        {
            this.$('td:first').trigger('click')
        },

        removeSite: function(e)
        {
            e.preventDefault()
            this.clear()
        },

        done: function(e)
        {
            var me = $(e.currentTarget)
            me.closest('td').removeClass('editing')

            var obj = {}
            obj[me.attr('data-key')] = me.val()

            safari.extension.globalPage.contentWindow.trackEvent(['Added Site', me.attr('data-key') + '|' + me.val()])

            this.model.save(obj)
        },

        keypress: function(e)
        {
            if(e.keyCode === 13) {
                this.done(e)
            }
        },

        keydown: function(e)
        {
            var me = $(e.currentTarget)

            if(e.keyCode === 9)
            {
                _.defer(function()
                {
                    me.closest('td').next('td').trigger('click')
                })
            }
        },

        edit: function(e)
        {
            var me = $(e.currentTarget)
            me.addClass('editing')
            me.find('input')[0].focus()
        },

        render: function()
        {
            this.$el.html(this.template(this.model.toJSON()))

            return this
        },

        clear: function()
        {
            this.model.clear()
        }
    })

    $(function()
    {
        window.App = new AppView({
            el: $('#sites-table')
        })
    })
})()
