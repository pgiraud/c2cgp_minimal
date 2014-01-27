/*
 * This file represents the customization point for the application integrator.
 *
 * After execution of this script an OpenLayers map filled with layers should
 * be available in App.map.
 *
 * This file also contains translations for the application strings.
 */

OpenLayers.Lang.setCode("${lang}");

// App.info includes information that is needed by internal
// components, such as the Login view component.
App.raster = true;

App.info = '${info | n}';

App.themes = '${themes | n}';

App.WFSTypes = '${wfs_types | n}';

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
// define the map and layers
App.map = new OpenLayers.Map({
    fallThrough: true,
    theme: null,
    maxExtent: new OpenLayers.Bounds(600000.000000, 194000.000000, 604000.000000, 198000.000000),
    //maxExtent: new OpenLayers.Bounds(515000, 180000, 580000, 230000),
    projection: new OpenLayers.Projection("EPSG:21781"),
    units: "m",
    resolutions: [250,100,50,20,10,5,2.5,2,1.5,1,0.5,0.25,0.125,0.0625],
    center: new OpenLayers.LonLat(601950, 195690),
    zoom: 4,
    controls: [
        new OpenLayers.Control.TouchNavigation({
            dragPanOptions: {
                interval: 1,
                enableKinetic: true
            }
        }),
        new OpenLayers.Control.Attribution(),
        new OpenLayers.Control.ScaleLine({geodesic: true})
    ],
    layers: [
        new OpenLayers.Layer.WMTS(OpenLayers.Util.extend({
            name: 'OpenStreetMap',
            layer: 'osm',
            format: 'image/png',
        }, wmtsLayerOptions))
    ]
});
