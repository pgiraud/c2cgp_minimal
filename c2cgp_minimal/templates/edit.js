Ext.onReady(function() {
    // Ext global settings
    Ext.BLANK_IMAGE_URL = "${request.static_url('c2cgp_minimal:static/lib/cgxp/ext/Ext/resources/images/default/s.gif')}";
    Ext.QuickTips.init();

    // OpenLayers global settings
    OpenLayers.Number.thousandsSeparator = ' ';
    OpenLayers.DOTS_PER_INCH = 96;
    OpenLayers.ProxyHost = "${request.route_url('ogcproxy')}?url=";
    OpenLayers.ImgPath = "${request.static_url('c2cgp_minimal:static/lib/cgxp/core/src/theme/img/ol/')}";
    OpenLayers.Lang.setCode("${lang}");

    // GeoExt global settings
    GeoExt.Lang.set("${lang}");

    <% json_extent = user.role.json_extent if user else None %>
    % if json_extent:
    var INITIAL_EXTENT = ${json_extent};
    % else:
    var INITIAL_EXTENT = [600000.000000, 194000.000000, 604000.000000, 198000.000000];
    % endif
    var RESTRICTED_EXTENT = [420000, 30000, 900000, 350000];

    // Themes definitions
    var THEMES = {
        "local": ${themes | n}
    % if external_themes:
        , "external": ${external_themes | n}
    % endif
    };

    // Server errors (if any)
    var serverError = ${serverError | n};

    var wmtsLayerOptions = {
        url: [
            'http://tile1-sitn.ne.ch/mapproxy/wmts',
            'http://tile2-sitn.ne.ch/mapproxy/wmts',
            'http://tile3-sitn.ne.ch/mapproxy/wmts',
            'http://tile4-sitn.ne.ch/mapproxy/wmts',
            'http://tile5-sitn.ne.ch/mapproxy/wmts'
        ],
        matrixSet: 'swiss_grid_new',
        style: 'default',
        requestEncoding: 'REST',
        maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 360000),
        transitionEffect: 'resize'
    };

    app = new gxp.Viewer({

        // viewer config
        portalConfig: {
            layout: 'border',
            items: [
                'app-map',
            {
                id: 'left-panel',
                region: 'west',
                width: 300
            }]
        },

        // tools
        tools: [{
            ptype: 'cgxp_editing',
            layerTreeId: 'layertree',
            layersURL: "${request.route_url('layers_root')}"
        },
        {
            ptype: 'cgxp_themeselector',
            outputTarget: 'left-panel',
            outputConfig: {
                layout: 'fit',
                style: 'padding: 3px;'
            },
            layerTreeId: 'layertree',
            themes: THEMES
        },
        {
            ptype: "cgxp_layertree",
            id: "layertree",
            outputConfig: {
                header: false,
                flex: 1,
                layout: 'fit',
                autoScroll: true,
                themes: THEMES,
                wmsURL: '${request.route_url('mapserverproxy')}'
            },
            outputTarget: 'left-panel'
        },
        {
            ptype: "cgxp_menushortcut",
            type: '->'
        },
        {
            ptype: "cgxp_login",
            actionTarget: "map.tbar",
    % if user:
            username: "${user.username}",
    % endif
            loginURL: "${request.route_url('login', path='')}",
            logoutURL: "${request.route_url('logout', path='')}"
        },
        {
            ptype: "cgxp_mapopacityslider",
            defaultBaseLayerRef: "${functionality['default_basemap'][0] | n}"
        }],

        sources: {
            "olsource": {
                ptype: "gxp_olsource"
            }
        },

        // map and layers
        map: {
            id: "app-map", // id needed to reference map in portalConfig above
            stateId: "map",
            xtype: 'cgxp_mappanel',
            projection: "EPSG:21781",
            extent: INITIAL_EXTENT,
            maxExtent: RESTRICTED_EXTENT,
            restrictedExtent: RESTRICTED_EXTENT,
            units: "m",
            resolutions: [1000,500,250,100,50,20,10,5,2.5,1,0.5,0.25,0.1,0.05],
            controls: [
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.KeyboardDefaults(),
                new OpenLayers.Control.PanZoomBar({panIcons: false}),
                new OpenLayers.Control.ArgParser(),
                new OpenLayers.Control.Attribution(),
                new OpenLayers.Control.ScaleLine({
                    geodesic: true,
                    bottomInUnits: false,
                    bottomOutUnits: false
                }),
                new OpenLayers.Control.MousePosition({numDigits: 0})
            ],
            layers: [{
                source: "olsource",
                type: "OpenLayers.Layer.WMTS",
                args: [Ext.applyIf({
                    name: OpenLayers.i18n('OpenStreetMap'),
                    ref: 'osm',
                    layer: 'osm',
                    formatSuffix: 'png',
                    opacity: 0
                }, wmtsLayerOptions)]
            }],
            items: []
        }
    });

    app.on('ready', function() {
        // remove loading message
        Ext.get('loading').remove();
        Ext.fly('loading-mask').fadeOut({
            remove: true
        });

        if (serverError.length > 0) {
            cgxp.tools.openWindow({
                html: serverError.join('<br />')
            }, OpenLayers.i18n("Error notice"), 600, 500);
        }
    }, app);
});
