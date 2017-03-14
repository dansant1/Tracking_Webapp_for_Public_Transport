function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  let R = 6371;
  let dLat = deg2rad(lat2-lat1);
  let dLon = deg2rad(lon2-lon1);
  let a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)

  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  let d = R * c; // Distancia in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

Template.mapa_esquematico.onRendered( () => {
  let template = Template.instance()

  template.ida = new ReactiveVar();
  template.vuelta = new ReactiveArray();

  template.DistanciaRutaIda = 0;
  template.DistanciaRutaVuelta = 0;

  template.largoIda = new ReactiveVar(0)
  template.largoVuelta = new ReactiveVar(0)

  template.autorun( () => {
    template.canvas = document.getElementById('mapa_esquematico')
    let contexto = template.canvas.getContext("2d")
    template.subscribe('rutaSingle', Session.get('esquematicoRuta'), () => {

        template.ida.set(Rutas.find({_id: Session.get('esquematicoRuta')}).fetch()[0].ida)
        template.vuelta.set(Rutas.find({_id: Session.get('esquematicoRuta')}).fetch()[0].vuelta)

        if (typeof template.ida.get() != "undefined" && template.ida.get() != null && template.ida.get().length > 0) for (var i = 1; i < template.ida.get().length; i++) template.DistanciaRutaIda = template.DistanciaRutaIda + getDistanceFromLatLonInKm(template.ida.get()[i - 1].lat, template.ida.get()[i - 1].lng, template.ida.get()[i].lat, template.ida.get()[i].lng)

        if (typeof template.vuelta.get() != "undefined" && template.vuelta.get() != null && template.vuelta.get().length > 0) for (var i = 1; i < template.vuelta.get().length; i++)   template.DistanciaRutaVuelta = template.DistanciaRutaVuelta + getDistanceFromLatLonInKm(template.vuelta.get()[i - 1].lat, template.vuelta.get()[i - 1].lng, template.vuelta.get()[i].lat, template.vuelta.get()[i].lng)


        template.largoIda.set(template.DistanciaRutaIda);
        template.largoVuelta.set(template.DistanciaRutaVuelta);




        // Ida
        contexto.beginPath();
        contexto.moveTo(15, 30);
        contexto.lineTo(template.largoIda.get() * 16, 30);
        Session.set('removeLargoIda', template.largoIda.get() * 16)
        contexto.strokeStyle = '#e67e22';
        contexto.stroke();

        // vuelta
        contexto.beginPath();
        contexto.moveTo(15, 110);
        contexto.lineTo(template.largoVuelta.get() * 16, 110);
        Session.set('removeLargoVuelta', template.largoVuelta.get() * 16)
        contexto.strokeStyle = '#3498db';
        contexto.stroke();


    });

    //let contexto = template.canvas.getContext("2d")

    template.subscribe('Vehiculos', () => {


        let i = 0

        let a = Rutas.find({_id: Session.get('esquematicoRuta') }).fetch()[0].ida[0]

        let d;
        let arreglo = []

        Vehiculos.find({rutaId: Session.get('esquematicoRuta')}, {limit: 50}).forEach( (v) => {

          d = getDistanceFromLatLonInKm(a.lat, a.lng, v.posicion.lat, v.posicion.lng)

          arreglo.push({
            vehiculoId: v._id,
            distancia: d
          })

        })

        let arregloOrdenado = _.sortBy(arreglo, 'distancia')
        let h = 1
        arregloOrdenado.forEach( (a) => {
          var img = document.getElementById("scream");
          h++
          console.log(h);
          contexto.drawImage( img , a.distancia * 10 + 15, 19, 12, 10);
        })



        contexto.beginPath();
        contexto.moveTo(15, 30);
        contexto.lineTo(15, 65);
        contexto.strokeStyle = '#e67e22';
        contexto.stroke();

        contexto.beginPath();
        contexto.moveTo(15, 80);
        contexto.lineTo(15, 110);
        contexto.strokeStyle = '#3498db';
        contexto.stroke();

        contexto.beginPath();
        contexto.moveTo(template.largoIda.get() * 16, 30);
        contexto.lineTo(template.largoIda.get() * 16, 65);
        contexto.strokeStyle = '#e67e22';
        contexto.stroke();

        contexto.beginPath();
        contexto.moveTo(template.largoVuelta.get() * 16, 80);
        contexto.lineTo(template.largoVuelta.get() * 16, 110);
        contexto.strokeStyle = '#3498db';
        contexto.stroke();



    });

    contexto.font = "7px Arial";
    contexto.fillStyle = "#e67e22";
    contexto.fillText("Inicial" , 0, 75);
    contexto.fillStyle = "#3498db";
    contexto.fillText("Final" , 280, 75);
  })

})
