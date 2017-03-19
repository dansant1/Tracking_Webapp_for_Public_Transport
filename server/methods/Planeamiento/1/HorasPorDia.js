const HORAS = [ '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00',
                '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
                '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
                '19:00', '20:00', '21:00', '22:00', '23:00', '23:59'];

let getHorario = (rango, dia, ida, rutaId) => {

  let r1 = rango.hi;
  let r2 = rango.hf;

  r1.slice(0, 2)
  r2.slice(0, 2)
  r1 = parseInt(r1)
  r2 = parseInt(r2)

  let numeros_menos =  _.range(r1, r2)
  let numeros_apareceran1, numeros_apareceran2, nuevo_horario;
  let horario = []

  if (r1 === 0) {

    numeros_apareceran1 = _.range(r2 + 1, 24)
    numeros_apareceran2 = _.range(0, r1)

  } else {
    let u = HorasPorDia.find({dia: dia, ida: ida, rutaId: rutaId}).fetch()[0].horas.length;
    // console.log(u);
    let ultimo = HorasPorDia.findOne({dia: dia, ida: ida, rutaId: rutaId}).horas[u - 1]
    console.log(ultimo);
    ultimo.slice(0, 2)
    ultimo = parseInt(ultimo)
    numeros_apareceran1 = _.range(r2 + 1, 24)
    console.log(numeros_apareceran1);
    //console.log(HorasPorDia.findOne({dia: dia, ida: ida, rutaId: rutaId}).horas);
    numeros_apareceran2 = _.range(0, 23)
    console.log(numeros_apareceran2);
  }



  nuevo_horario = numeros_apareceran1//_.union(numeros_apareceran1, numeros_apareceran2)

  if (r2 > 9) {
    horario.push( r2 + ':01')
  } else {
    horario.push( '0' + r2 + ':01')
  }

  nuevo_horario.map( h => {
    let hora;
    console.log('HORA: ' + h);
    if (h > 9) {
      hora = h + ':00'
      console.log('nueva hora: ' + hora);
    } else {
      hora = '0' + h + ':00'
    }

    horario.push(hora)
  })

  horario.push('23:59')
  // if (r1 === 0) {
  //   horario.push('23:59')
  // } else {
  //   horario.push(r1 - 1 + ':59')
  // }


  return horario
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
          createdAt: new Date()
        }

        HorasPorDia.insert(data)

      }

    } else {
      return;
    }

  },
  ActualizarRangoHorarioPorDia(dia, ida, rango, rutaId) {

    let nuevoRangoDeHoras = getHorario(rango, dia, ida, rutaId)

    HorasPorDia.update({dia: dia, ida: ida, rutaId}, {
      $set: {
        horas: nuevoRangoDeHoras
      }
    })

  }
})
