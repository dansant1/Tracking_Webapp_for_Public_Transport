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

  console.log(dia);
  console.log(ida);
  console.log(rutaId);
  let numeros_apareceran1, numeros_apareceran2, nuevo_horario;
  //let longitud = HorasPorDia.findOne({dia: dia, id: ida, rutaId: rutaId}).horas.length;
  let horario = HorasPorDia.find({dia: dia, ida: ida, rutaId: rutaId}).fetch()[0].horas

  console.log('Horario: ' + horario);
  console.log('r1: ' + r1);
  console.log('r2: ' + r2);
  nuevo_horario = [];

  horario.forEach( (h) => {
      h = parseInt(h.slice(0, 2))

      nuevo_horario.push(h)
  })

  console.log('Nuevo horario: ' + nuevo_horario);

  let sacar = _.range(r1, r2);

  console.log('Sacar: ' + sacar);

  let diferencia = _.difference(nuevo_horario, sacar);

  let oficial = [];
  let e;

  diferencia.map( d => {



      if (d === r2) {

        if (d > 0) {
          console.log('caso 2');
          if (d > 9) {
            d = d + ':01'
          } else {
            d = '0' + d + ':01'
          }

        } else {
          d = '0' + d + ':01'
        }


    } else if (d === r1) {
      if (d > 0) {

        if (r1 === 0) {
          console.log('Es: ' + r1);
        } else {
          console.log( "r1: " + r1);
          d = d + 1
          oficial.push('0' + d + ':00')
          d = d + ':59'
        }

      } else {
        let e = d - 1
        oficial.push('0' + e + ':00')
        d = '0' + d + ':59'
      }
    } else {

      if (d > 0) {
        if (d === r1 - 1) {

          //console.log(d);
          //oficial.push(e)
          //console.log(e);
          //d = d + ':59'
        } else {
          if (d > 9) {
            d = d + ':00'
          } else {
            d = '0' +  d + ':00'
          }

        }

      } else {

        if (d === r1 - 1) {
          e = '0' + d + ':59'
          // let e = '0' + d + ':59'
          // oficial.push(d)
          // console.log(d);
          // oficial.push(e)
          // console.log(e);
        } else {
          d = '0' + d + ':00'
        }

      }

    }

    //console.log(r1 - 1);

    if (d === r1 - 1) {
      //console.log('jeje');

      if (d > 9) {
        e = d + ':59';
        d = d + ':00'
      } else {
        e = '0' + d + ':59';
        d = '0' + d + ':00'
      }
      console.log('DE: ' + d);
      oficial.push(d)
      console.log('E: ' + e);
      oficial.push(e)
    } else {
      oficial.push(d)
    }

    console.log('D: ' + d);

  })
  let n = oficial.length - 1

  if (oficial.length > 1) {
    oficial[n] = oficial[n].slice(0, 2) + ':59'
  }


  oficial = _.uniq(oficial);


  if ( oficial[0].includes( '0' + r2 + ':01' ) ) {
    if (oficial[0] === '0'+r2 + ':01' ) {
      if (r1 !== 0) {
          //oficial.shift();
      }



    }

    // if (parseInt(oficial[0].slice(0, 2)) + 1 === parseInt(oficial[1].slice(0, 2))) {
    //   oficial.shift()
    //   oficial[0] = oficial[0].slice(0, 2) + ':01'
    // } else {
    //   oficial[1] = oficial[1].slice(0, 2) + ':01'
    // }

    oficial[1] = oficial[1].slice(0, 2) + ':01'
  }

  console.log(oficial[0]);

  console.log('Diferencia final: ' + oficial);

  if (oficial.length < 3) {
    oficial.shift()
  }



  return oficial;
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
