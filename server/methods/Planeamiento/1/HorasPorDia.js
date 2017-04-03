let getHorario = (rango, dia, ida, rutaId) => {

  let hi = rango.hi;
  let hf = rango.hf;

  console.log('hi: ', hi)
  console.log('hf: ', hf);
  var resultado = [];

      var now = moment.unix(hf.toString()); //todays date
      var end =  moment.unix(hi.toString()); // another date

      let horasAnteriores = HorasPorDia.findOne({dia: dia, ida: ida, rutaId: rutaId}).horas;



      var duration = moment.duration(now.diff(end));
      var horas = duration.asHours();

      var newHour = end.format('X');

        for (var i = 0; i <= horas; i++) {
          resultado.push(newHour);
          newHour = moment.unix(newHour).add(1,"hours").format('X');
        }

        console.log(resultado);

      horasAnteriores.map( h => {
        resultado.push(h)
      })

      return resultado;

}

Meteor.methods({
  agregarHoraPorDia(dia, ida, rutaId) {

    if (this.userId) {

      let hora = HorasPorDia.find({dia: dia, ida: ida, rutaId: rutaId});

      if (hora.fetch().length === 0) {

        let data = {
          dia: dia,
          ida: ida,
          rutaId: rutaId,
          horas: [],
          primera: false,
          createdAt: new Date()
        }

        HorasPorDia.insert(data)

      }

    } else {
      return;
    }

  },
  ActualizarRangoHorarioPorDia(dia, ida, rango, rutaId) {

    let nuevoRangoDeHoras = getHorario(rango, dia, ida, rutaId);

    HorasPorDia.update({dia: dia, ida: ida, rutaId: rutaId}, {
      $set: {
          horas: nuevoRangoDeHoras
      }
    })

  }
})
