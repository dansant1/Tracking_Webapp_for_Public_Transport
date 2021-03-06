import Modules from "/client/Modules";
import geolib from "geolib";

const geofenceRadius = 25;

const getPolygonPoint = (point1, point2) => {
    const bearingDregrees = geolib.getRhumbLineBearing(point1, point2);

    let points = [
        geolib.computeDestinationPoint(point1, geofenceRadius, bearingDregrees - 90),
        geolib.computeDestinationPoint(point1, geofenceRadius, bearingDregrees + 90),
    ];

    return points;
}

const transformPoints = (pointList) => {
    let points = [];
    pointList.forEach((point) => {
        points.push({
          lat: geolib.getLat( point ),
          lng: geolib.getLon( point )
        });
    });
    return points;
}

const orderPoints = (pointList) => {
    let oddPoints = [];
    let evenPoints = [];
    let currentPoint;

    for (let i = 0; i < pointList.length; i++) {
        currentPoint = pointList[i];
        if (i % 2 === 0) {
            evenPoints.push(currentPoint);
        } else {
            oddPoints.push(currentPoint);
        }
    }
    evenPoints.reverse();
    return [].concat(oddPoints, evenPoints);
}


const activateGeofence = (instance, map, goingPoints, returnPoints) => {
    let goingPolygon = []
    let returnPolygon = [];
    let points;

    for (let i = 0; i < goingPoints.length - 1; i++) {
        points = getPolygonPoint(goingPoints[i], goingPoints[i + 1]);
        goingPolygon = _.union(goingPolygon, points);

        //add last point
        if ( i === goingPoints.length - 2 ){
          points = getPolygonPoint( goingPoints[i+1], goingPoints[i] );
          goingPolygon = _.union( goingPolygon, [ points[1] , points[0] ] );
        }

    }

    goingPolygon = orderPoints( goingPolygon );
    goingPolygon = transformPoints( goingPolygon );

    for (let i = 0; i < returnPoints.length - 1; i++) {
        points = getPolygonPoint(returnPoints[i], returnPoints[i + 1]);
        returnPolygon = _.union(returnPolygon, points);

        //add last point
        if ( i === returnPoints.length - 2 ){
          points = getPolygonPoint( returnPoints[i+1], returnPoints[i] );
          returnPolygon = _.union( returnPolygon, [ points[1] , points[0] ] );
        }

    }

    returnPolygon = orderPoints( returnPolygon );
    returnPolygon = transformPoints( returnPolygon );

    let goingPath;
    let returnPath;

    goingPath = new google.maps.Polygon({
        paths: goingPolygon,
        strokeColor: '#FF0000',
        strokeOpacity: 0.35,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
    });

    returnPath = new google.maps.Polygon({
        paths: returnPolygon,
        strokeColor: '#3498db',
        strokeOpacity: 0.35,
        strokeWeight: 2,
        fillColor: '#3498db',
        fillOpacity: 0.35
    });

    goingPath.setMap(map);
    returnPath.setMap(map);

    instance.goingPath = goingPath;
    instance.returnPath = returnPath;

}

Modules.client.activarGeocerca = activateGeofence;
