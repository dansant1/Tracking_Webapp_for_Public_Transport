const getBounds = (obj1, obj2) => {
  let bounds = new google.maps.LatLngBounds();
  let points = _.union( obj1.getPath().getArray(), obj2.getPath().getArray() );

  for (let n = 0; n < points.length ; n++){
      bounds.extend(points[n]);
  }
  return bounds;
}

export default getBounds;
