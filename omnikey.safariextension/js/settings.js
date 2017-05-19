/* globals Redux, Backbone, safari, _, Omnikey */
(function() {
  var INITIAL_STATE = [];
  var DEFAULT_SITE = {
    key: 'key',
    url: 'http://example.com/?q={search}',
  };

  var $byId = function (id) {
    return document.getElementById(id);
  };
  var arrClone = function(array) {
    return array.slice(0);
  };
  var getName = function(site) {
    var link = document.createElement('a');
    link.href = site.url;

    if (link.hostname.length <= 0) {
      return link.href;
    }

    var domain = link.hostname.replace('www.', '');
    return domain[0].toUpperCase() + domain.slice(1);
  };

  var $doc = $(document);

  var sites = function(state, action) {
    if (state == null) {
      return {
        sites: [],
        active: null,
      };
    }
    var newSites;

    console.log('REDUX', action.type, action, state);
    switch (action.type) {
      case 'ADD':
        newSites = arrClone(state.sites);
        newSites.push(action.site);
        return {
          sites: newSites,
          active: newSites.length - 1
        };
      case 'REMOVE':
        newSites = arrClone(state.sites);
        newSites.splice(action.index, 1);
        safari.extension.globalPage.contentWindow.trackEvent([
          'Removed Site',
          state.sites[action.index].key + '|' + state.sites[action.index].url
        ]);
        return {
          sites: newSites,
          active: null
        };
      case 'MODIFY':
        newSites = arrClone(state.sites);
        newSites.splice(action.index, 1, action.site);
        return {
          sites: newSites,
          active: null,
        };
      case 'MAKE_DEFAULT':
        newSites = arrClone(state.sites);
        newSites.splice(action.index, 1, Object.assign({}, newSites[action.index], {
          default: true
        }));
        return {
          sites: newSites,
          active: null,
        };
      default:
        return state;
    }
  };

  var AppView = Backbone.View.extend({
    option_template: _.template(
      '<option value="<%= url %>"><%= name %></option>'
    ),

    initialize: function() {
      this.$sites = this.$('tbody').html('');
      this.$panels = $('.panel');
      this.$import_data = $('#import_data');
      this.$export_data = $('#export_data');

      this.initStore();

      this.el_set_default = $('#set_default');
      this.el_default_search = $('#default_search');

      if (localStorage.default_search) {
        this.el_set_default.prop('checked', true);
        this.el_default_search
          .prop('disabled', false)
          .val(localStorage.default_search);
      }

      $doc.on('click', '.add-site', this.addSite.bind(this));
      $doc.on('click', '.import-export-toggle', this.togglePanels.bind(this));
      $doc.on('click', '.export-copy', this.exportCopy.bind(this));
      $doc.on('click', '.import-data', this.importData.bind(this));
      $doc.on('click', '#set_default', this.toggleUseDefault.bind(this));
      $doc.on('click', '#default_search', this.changeDefaultSites.bind(this));
    },

    exportCopy: function (e) {
      e.preventDefault();

      $byId('export_data').select();
      document.execCommand('copy');
    },

    importData: function(e) {
      e.preventDefault();

      var json_data = this.$import_data.val();
      // TODO: import data support
      // this.Collections.Sites.importData(json_data);

      this.togglePanels();
      this.$import_data.val('');
    },

    toggleUseDefault: function(e) {
      var me = $(e.currentTarget);

      this.el_default_search.prop('disabled', !me.is(':checked'));

      if (me.is(':checked')) {
        this.setDefaultSite(this.el_default_search.val());
        safari.extension.globalPage.contentWindow.trackEvent([
          'Default Search',
          this.el_default_search.val()
        ]);
      } else {
        this.setDefaultSite(false);
        safari.extension.globalPage.contentWindow.trackEvent([
          'Default Search',
          false
        ]);
      }
    },

    togglePanels: function(e) {
      if (e) {
        e.preventDefault();
      }
      this.$panels.toggle();
    },

    changeDefaultSites: function(e) {
      var me = $(e.currentTarget);

      if (me.is(':enabled')) {
        this.setDefaultSite(me.val());
      }
    },

    setDefaultSite: function(site) {
      if (site) {
        localStorage.default_search = site;
      } else {
        localStorage.removeItem('default_search');
      }
    },

    addSite: function(e) {
      e.preventDefault();

      this.store.dispatch({
        type: 'ADD',
        site: {
          key: DEFAULT_SITE.key,
          url: safari.application.activeBrowserWindow.activeTab.url ||
            DEFAULT_SITE.url
        },
      });
    },

    initStore: function() {
      var data = this.load();
      if (data == null) {
        console.log('Trying to load data from Backbone\' localStorage');
        data = (new Backbone.LocalStorage('omnikey-sites')).findAll();

        if (data && data.length > 0) {
          safari.extension.globalPage.contentWindow.trackEvent([
            'Imported Count:',
            data.length
          ]);
        }
      }
      if (data && data.length === 0) {
        console.log('First time running, populating sites');
        safari.extension.globalPage.contentWindow.trackEvent('Install');
        data = Omnikey.default_sites;
      }
      var loadedSites = data.map(function(site) {
        return {
          key: site.key,
          url: site.url,
          default: site.default
        };
      });
      this.store = Redux.createStore(sites, {
        sites: loadedSites,
        active: null
      })
      this.store.subscribe(this.render.bind(this));
      this.store.subscribe(this.save.bind(this));
      this.store.subscribe(this.fillExportData.bind(this));
      this.save();
      this.render();
      this.fillExportData();
    },

    load: function() {
      try {
        var rawData = localStorage.getItem(Omnikey.STORAGE_KEY);
        if (rawData != null) {
          return JSON.parse(rawData);
        }
        return undefined;
      } catch (e) {
        return undefined;
      }
    },

    save: function() {
      try {
        var serializedState = JSON.stringify(this.store.getState().sites);
        localStorage.setItem(Omnikey.STORAGE_KEY, serializedState);
      } catch (e) {}
    },

    fillExportData: function() {
      this.$export_data.val(
        JSON.stringify(this.store.getState().sites)
      );
    },

    render: function() {
      $('#default_search').empty();
      this.$sites.empty();
      var state = this.store.getState();
      state.sites.forEach(this.renderSite.bind(this));

      if (state.active) {
        $('#sites-scroller')
          .scrollTop($('#sites-scroller').prop('scrollHeight'))
      }
    },

    renderSite: function(site, i) {
      var view = new SiteView({
        model: {
          store: this.store,
          site: site,
          index: i
        }
      });
      this.$sites.append(view.render().el);

      $('#default_search').append(
        this.option_template(Object.assign({name: getName(site)}, site))
      );
    }
  });

  var SiteView = Backbone.View.extend({
    tagName: 'tr',

    template: _.template(
      '<td class="key">\
          <input class="key" data-key="key" value="<%= key %>" />\
          <span class="label"><%= key %></span>\
      </td>\
      <td class="url">\
          <a href="#delete" class="remove">+</a>\
          <input class="url" data-key="url" value="<%= url %>" />\
          <span class="label"><%= name %></span>\
      </td>'
    ),

    events: {
      'click td': 'edit',
      'blur td input': 'done',
      'keypress td input': 'keypress',
      'click .remove': 'removeSite'
    },

    initialize: function() {
      this.store = this.model.store;
    },

    justAdded: function() {
      this.$('td:first').trigger('click');
    },

    removeSite: function(e) {
      e.preventDefault();
      this.clear();
    },

    done: function(e) {
      var me = $(e.currentTarget);
      me.closest('td').removeClass('editing');

      safari.extension.globalPage.contentWindow.trackEvent([
        'Added Site',
        me.attr('data-key') + '|' + me.val()
      ]);

      var newSite = Object.assign({}, this.model.site);
      newSite[me.attr('data-key')] = me.val();

      this.store.dispatch({
        type: 'MODIFY',
        site: newSite,
        index: this.model.index
      });
    },

    keypress: function(e) {
      if (e.keyCode === 13) {
        this.done(e);
      }
    },

    edit: function(e) {
      var me = $(e.currentTarget);
      me.addClass('editing');
      me.find('input')[0].focus();
    },

    startEditing: function () {
      this.$('td:first').addClass('editing');
      this.$('input:first')[0].focus();
    },

    render: function() {
      this.$el.html(
        this.template(
          Object.assign({
            name: getName(this.model.site)
          },
          this.model.site)
        )
      );
      if (this.model.index === this.store.getState().active) {
        this.startEditing();
      }
      return this;
    },

    clear: function() {
      this.store.dispatch({
        type: 'REMOVE',
        index: this.model.index
      });
    }
  });

  $(function() {
    window.App = new AppView({
      el: $('#sites-table')
    });
  });
})();
