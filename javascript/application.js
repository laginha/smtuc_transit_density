var KEY = "hHRhSfLgXxcrqJvYNVZETrFdehggBmjDhKBBIqLL";
var SHAPE_IDS = {};
var RESULTS_PER_PAGE = 50;

function rangeMoved( ev, minTab, maxTab ){
    SHAPE_IDS = {}
    map.removeLayer( shapes_layer );
    shapes_layer = new L.LayerGroup();
    requestTrips(minTab, maxTab);
    map.addLayer( shapes_layer );
};

function getColor( obj, i ){
    percentil = obj[i][1]/(obj[obj.length-1][1]-obj[0][1]+1) *100;
    if (percentil >= 50) {
        return "#F00";
    } else if (percentil >= 25) {
        return "#FFBB00";
    } else {
        return "#FFEE00";
    };
};

function countStartTimes( times, max ){
    count = 0;
    for (var i=0; i < times.length; i++) {
        time = new Date('01/01/2009 '+times[i])
        if (time <= max.date) {
            count += 1;
        };
    };
    return count;
};

function sortShapes(){
    var sorted = [];
    for (var shape_id in SHAPE_IDS)
        sorted.push([shape_id, SHAPE_IDS[shape_id]])
    sorted.sort(function(a, b) {return a[1] - b[1]})
    return sorted
};

function requestTrips( from, to, offset ){
    offset = offset ? offset : 0;
    $.ajax({
        url:      'https://api.ost.pt/trips',
        dataType: 'jsonp',
        data:     {
            key:       KEY,
            time:      ""+from.date.getHours()+":00:00",
            results:   RESULTS_PER_PAGE,
            offset:    RESULTS_PER_PAGE*offset,
        },
        success:  function( response ) {
            if (response.Meta.paginated_objects) {
                for (var i=0; i < response.Objects.length; i++) {
                    trip = response.Objects[i];
                    if (trip.shape_id) {
                        if (trip.shape_id in SHAPE_IDS) {
                            SHAPE_IDS[ trip.shape_id ] += countStartTimes(trip.start_times, to);
                        } else {
                            count = countStartTimes(trip.start_times, to);
                            if (count) {
                                SHAPE_IDS[ trip.shape_id ] = count;
                            };
                        };
                    };
                };
                requestTrips( from, to, offset+1 );
            } else {
                requestShapes( sortShapes() );
            };
        }
    });
};

function requestShapes( shapes ){
    baseOpacity = 1 / shapes[shapes.length-1][1];
    for (var i in shapes) {
        color = getColor( shapes, i );
        requestShape( shapes[i][0], color, baseOpacity*shapes[i][1] );
    };
};

function requestShape( id, color, opacity ){
   $.ajax({
        url:      'https://api.ost.pt/shapes/'+id,
        dataType: 'jsonp',
        data: {
            key: KEY
        },
        success:  function( response ) {
            drawShape( response.line_string.coordinates, color, opacity );
        }
    });
};

function drawShape( coords, color, opacity ){
    line = [];
    for (var j in coords) {
        line[j] = new L.LatLng( coords[j][1], coords[j][0] );
    };
    shapes_layer.addLayer( new L.Polyline( line, {
        color: color,
        fillOpacity: opacity,
        opacity: opacity,
    }) );
};