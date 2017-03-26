const HORAS = [ '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00',
                '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
                '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
                '19:00', '20:00', '21:00', '22:00', '23:00'];

let getHorario = (rango, dia, ida, rutaId) => {

  let r1 = rango.hi;
  let r2 = rango.hf;

  let aux = r1;
  let aux2 = r2;
  console.log('AUX: ', aux);
  let horario = HorasPorDia.find({dia: dia, ida: ida, rutaId: rutaId}).fetch()[0].horas
  let horario_oficial = [];
  let nuevo_horario = [];
  let rangos = [];
  r1.slice(0, 2)
  r2.slice(0, 2)

  r1 = parseInt(r1)
  r2 = parseInt(r2)

  console.log('r1: ', r1);
  console.log('r2: ', r2);

  let diferencia = _.range(0, r2 + 1);



  let inicio;

  if (r2 + 1 > 9) {
    inicio = r2 + ':01'
  }  else {
    inicio = '0' + r2 + ':01'
  }

  //console.log(diferencia);

  diferencia.map( d => {

    if (d > 9) {
      rangos.push(d + ':00')
    } else {
      rangos.push( '0' + d + ':00')
    }

  })

  console.log(rangos);

  let h = _.difference(horario, rangos);

  if (aux === h[0]) {
    h.shift()
  }

  h.unshift(inicio);

  console.log(h);

  return h;

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
          horas: HORAS,
          primera: false,
          createdAt: new Date()
        }

        HorasPorDia.insert(data)

      }

    } else {
      return;
    }

  },
  ActualizarRangoHorarioPorDia(dia, ida, rango, rutaId) { // inicio del metodo actualizar rango

  let nuevoRangoDeHoras = getHorario(rango, dia, ida, rutaId)


  let primera = HorasPorDia.findOne({dia: dia, ida: ida, rutaId}).primera
  if (primera === false) {
    HorasPorDia.update({dia: dia, ida: ida, rutaId: rutaId}, {
      $set: {
          horas: nuevoRangoDeHoras,
          primera: true
      }
    })
  } else {
    HorasPorDia.update({dia: dia, ida: ida, rutaId: rutaId}, {
      $set: {
          horas: nuevoRangoDeHoras
      }
    })
  }

  } // Fin del Metodo Actualzar Rango
})
