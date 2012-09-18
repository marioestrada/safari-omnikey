(function()
{

    var AppView = Backbone.View.extend({

        initialize: function()
        {
            this.$sites = this.$('tbody').html('')

            this.initViews()
            this.initCollections()

            $(document).on('click', '.add-site', _.bind(this.addSite, this))
        },

        addSite: function(e)
        {
            e.preventDefault()

            // console.log(safari.application.activeBrowserWindow.activeTab.url)
            var model = this.Collections.Sites.create({ key: 'key', url: safari.application.activeBrowserWindow.activeTab.url })
            // var model = this.Collections.Sites.create()
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
            this.Collections.Sites.on('all', this.render, this)

            this.Collections.Sites.fetch()
        },

        addOne: function(site)
        {
            var view = new SiteView({ model: site })
            this.$sites.append(view.render().el)
        },

        addAll: function()
        {
            if(this.Collections.Sites.length === 0)
            {
                console.log('First time running, populating sites')
                this.Collections.Sites.add(Omnikey.default_sites)
                this.Collections.Sites.each(function(Site)
                {
                    Site.save()
                })
            }else{
                this.Collections.Sites.each(_.bind(this.addOne, this))
            }
        },

        render: function()
        {

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

            if(!this.get('url'))
                this.set({ url: this.defaults.url })

            if(!this.get('key'))
                this.set({ key: this.defaults.key })

            this.set('name', this.getName(this.get('url')))

            this.view = new SiteView({ model: this })
        },

        setName: function()
        {
            this.set('name', this.getName(this.get('url')))
        },

        clear: function()
        {
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

        localStorage: new Backbone.LocalStorage("omnikey-sites")
    })

    var SiteView = Backbone.View.extend({
        tagName: 'tr',

        template: _.template('\
            <td class="key">\
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
            this.model.save(obj)
        },

        keypress: function(e)
        {
            if(e.keyCode === 13)
                this.done(e)
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
            el: $('#sites')
        })
    })
})()