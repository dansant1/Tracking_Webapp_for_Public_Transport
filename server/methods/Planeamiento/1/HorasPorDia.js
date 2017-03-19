const HORAS = [ '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00',
                '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
                '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
                '19:00', '20:00', '21:00', '22:00', '23:00', '23:59'];

let getHorario = (rango) => {

  let r1 = rango.hi;
  let r2 = rango.hf;

  r1.slice(0, 2)
  r2.slice(0, 2)
  r1 = parseInt(r1)
  r2 = parseInt(r2)

  // console.log(r1);
  // console.log(r2);

  let numeros_menos =  _.range(r1, r2)
  let numeros_apareceran1, numeros_apareceran2, nuevo_horario;
  let horario = []

  if (r1 === 0) {
    console.log(r1);
    numeros_apareceran1 = _.range(r2 + 1, 24)
    numeros_apareceran2 = _.range(0, r1)
    console.log(numeros_apareceran2);
  } else {
    numeros_apareceran1 = _.range(r2 + 1, 24)
    console.log(numeros_apareceran1);
    numeros_apareceran2 = _.range(0, r1)
    console.log(numeros_apareceran2);
  }

  nuevo_horario = _.union(numeros_apareceran1, numeros_apareceran2)

  console.log(nuevo_horario);

  nuevo_horario.map( h => {
    let hora = h + ':00'
    horario.push(hora)
  })

  console.log(horario);
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
  ActualizarRangoHorarioPorDia(dia, ida, rango) {

    let nuevoRangoDeHoras = getHorario(rango)

    // HorasPorDia.update({dia: dia, ida: ida}, {
    //   $set: {
    //     horas: nuevoRangoDeHoras
    //   }
    // })

  }
})
