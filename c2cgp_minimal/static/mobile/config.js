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
App.info = '${info | n}';

App.themes = '${themes | n}';

App.WFSTypes = '${wfs_types | n}';

// define the map and layers
App.map = new OpenLayers.Map({
    fallThrough: true, // required for longpress queries
    theme: null,
    projection: 'EPSG:3857',
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
        new OpenLayers.Layer.OSM("OpenStreetMap", null, {
            transitionEffect: 'resize'
        }),
        new OpenLayers.Layer.OSM(
            "Cycle Map",
            [
                "http://a.tile.opencyclemap.org/cycle/${'${z}/${x}/${y}'}.png",
                "http://b.tile.opencyclemap.org/cycle/${'${z}/${x}/${y}'}.png",
                "http://c.tile.opencyclemap.org/cycle/${'${z}/${x}/${y}'}.png"
            ],
            {
                transitionEffect: 'resize'
            }
        ),
        new OpenLayers.Layer.OSM(
            "Transport Map",
            [
                "http://a.tile2.opencyclemap.org/transport/${'${z}/${x}/${y}'}.png",
                "http://b.tile2.opencyclemap.org/transport/${'${z}/${x}/${y}'}.png",
                "http://c.tile2.opencyclemap.org/transport/${'${z}/${x}/${y'}}.png"
            ],
            {
                transitionEffect: 'resize'
            }

        )
    ]
});
