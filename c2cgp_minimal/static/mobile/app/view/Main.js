/**
 * Copyright (c) 2011-2013 by Camptocamp SA
 *
 * CGXP is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * CGXP is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with CGXP. If not, see <http://www.gnu.org/licenses/>.
 */

Ext.define("App.view.Main", {
    extend: 'Ext.Container',
    xtype: 'mainview',
    requires: [
        'Ext.field.Search',
        'Ext.field.Select',
        'Ext.SegmentedButton',
        'App.model.Layer',
        'App.plugin.StatefulMap',
        'App.view.GeolocateControl',
        'App.view.MobileMeasure'
    ],

    config: {
        map: null,
        layout: 'fit',
        plugins: 'statefulmap',
        vectorLayer: null,
        center: null,
        zoom: null,
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            items: [{
                xtype: 'mysearchfieldnestedinaform',
                flex: 4,
                locales: {
                    placeHolder: 'views.map.search'
                },
                action: 'search'
            }, {
                xtype: 'spacer'
            }, {
                xtype: 'button',
                iconCls: 'layers',
                action: 'layers',
                iconMask: true
            }, {
                xtype: 'button',
                iconCls: 'settings',
                action: 'settings',
                iconMask: true
            }]
        }, {
            id: 'map-container'
        }]
    },

    initialize: function() {
        this.callParent(arguments);

        this.on('painted', this.render, this, {
            single: true
        });
    },

    updateMap: function(map) {
        this.fireEvent('setmap', this, map);
    },


    destroy: function() {
        var map = this.getMap();
        if (map) {
            map.destroy();
        }
        this.callParent();
    },

    setCenterZoomFromQueryParams: function() {
        var queryParams = OpenLayers.Util.getParameters();
        if (queryParams.x && queryParams.y && queryParams.zoom) {
            this.setCenter(
                new OpenLayers.LonLat(queryParams.x, queryParams.y));
            this.setZoom(queryParams.zoom);
        }
    },

    setOverlaysVisibility: function() {
        var map = this.getMap(),
            layers = map.layers,
            numLayers = layers.length,
            layer,
            i;
        for (i=0; i<numLayers; ++i) {
            layer = layers[i];
            if (layer.params && layer.params.hasOwnProperty('LAYERS') &&
                layer.params.LAYERS.length === 0) {
                layer.setVisibility(false);
            }
        }
    },

    // initial rendering
    render: function(component) {
        var map = this.getMap();
        var mapContainer = this.down('#map-container').element;

        map.render(mapContainer.dom);

        this.setOverlaysVisibility();
        this.setCenterZoomFromQueryParams();

        var center = this.getCenter(),
            zoom = this.getZoom();
        if (center && zoom) {
            map.setCenter(center, zoom);
        } else if (!map.getCenter()) {
            map.zoomToMaxExtent();
        }

        mapContainer.on('longpress', function(event, node) {
            var map = this.getMap();
            var el = Ext.get(map.div);
            var pixel = new OpenLayers.Pixel(
                event.pageX - el.getX(),
                event.pageY - el.getY()
            );
            var bounds = this.pixelToBounds(pixel);
            this.fireEvent('longpress', this, bounds, map, event);
        }, this);

        // highlight layer
        this.setVectorLayer(new OpenLayers.Layer.Vector('Vector', {
            styleMap: new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults({
                strokeWidth: 3,
                strokeColor: 'red'
            }, OpenLayers.Feature.Vector.style['default']))
        }));
        map.addLayer(this.getVectorLayer());

        map.addControls([
            new OpenLayers.Control.Zoom(),
            new App.view.GeolocateControl(),
            new App.view.MobileMeasure()
        ]);
    },

    /**
     * Method: pixelToBounds
     * Takes a pixel as argument and creates bounds after adding the
     * <clickTolerance>.
     *
     * Parameters:
     * pixel - {<OpenLayers.Pixel>}
     */
    pixelToBounds: function(pixel) {
        var tolerance = 40;
        var llPx = pixel.add(-tolerance/2, tolerance/2);
        var urPx = pixel.add(tolerance/2, -tolerance/2);
        var ll = this.getMap().getLonLatFromPixel(llPx);
        var ur = this.getMap().getLonLatFromPixel(urPx);
        return new OpenLayers.Bounds(
            parseInt(ll.lon, 10),
            parseInt(ll.lat, 10),
            parseInt(ur.lon, 10),
            parseInt(ur.lat, 10)
        );
    },

    /**
     * Method: recenterOnFeature
     */
    recenterOnFeature: function(f) {
        if (f) {
            var layer = this.getVectorLayer();
            layer.destroyFeatures();
            layer.addFeatures(f);

            var map = this.getMap();
            if (f.geometry instanceof OpenLayers.Geometry.Point) {
                map.setCenter(
                    [f.geometry.x, f.geometry.y],
                    map.baseLayer.numZoomLevels - 3
                );
            } else {
                map.zoomToExtent(f.geometry.getBounds());
            }
            map.events.register('moveend', this, function onmoveend() {
                layer.removeFeatures(f);
                // call the event only once
                map.events.unregister('moveend', this, onmoveend);
            });
        }
    }
});

// see http://www.sencha.com/forum/showthread.php?151529-searchfield-not-showing-quot-Search-quot-button-on-iOS-keyboard.-Bug&p=945810&viewfull=1#post945810
Ext.define('MySearchFieldNestedInAForm', {
    extend: 'Ext.field.Search',
    xtype: 'mysearchfieldnestedinaform',

    getElementConfig: function() {
        var tpl = this.callParent();

        tpl.tag = 'form';
        tpl.onsubmit = 'return false;';

        return tpl;
    }
});
