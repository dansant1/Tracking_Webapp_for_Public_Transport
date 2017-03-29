function getHorarioNuevo (rango, dia, ida, rutaId, opcion) {
  let r1 = rango.hi.slice(0, 2)
  let r2 = rango.hf.slice(0, 2)
  r1 = parseInt(r1)
  r2 = parseInt(r2)

  let horas = _.range(r1, r2 + 1);

  let u = [];

  let inicio;

  if (opcion === true) {
    if (r1 + 1 > 9) {
      inicio = r1 + ':00'
    }  else {
      inicio = '0' + r1 + ':00'
    }
  } else {
    if (r1 + 1 > 9) {
      inicio = r1 + ':01'
    }  else {
      inicio = '0' + r1 + ':01'
    }
  }





  horas.map( d => {

    if (d > 9) {
      u.push(d + ':00')
    } else {
      u.push( '0' + d + ':00')
    }

  })

  u.shift()

  u.unshift(inicio)

  let horario = HorasPorDia.findOne({dia: dia, ida: ida, rutaId}).horas

  horario.shift();

  let nuevo_horario = []

  nuevo_horario = _.union(u, horario)

  return nuevo_horario
}

Meteor.methods({
  agregarPlanHorario(datos) {

    if (this.userId) {

      datos.frecuencia = parseInt(datos.frecuencia);
      datos.createdAt = new Date();
      datos.createdBy = this.userId;

      let numero = PlanesHorarios.find({ida: datos.ida}).fetch().length;

      datos.numero = numero + 1;

      if (datos.hi !== "" && datos.hf !== "") {

        let planId = PlanesHorarios.insert(datos);

      } else {

        return;

      }

    } else {

      return;

    }

  },
  add_plan_horario(programacion, validacion) {

    let arreglo = []
    programacion.hora = programacion.hi + ':' + programacion.hf;
    let frec = PlanesHorarios.findOne({_id: validacion.phId}).frecuencia;
    programacion.frecuencia = frec;
    arreglo.push(programacion)

    let hi = programacion.hi.slice(0, 2);
    let hf = programacion.hf.slice(0, 2)
    if (hi === '00') {
      hi = programacion.hi.slice(0, 2) + ":00:00"
    } else {
      if (parseInt(programacion.hi.slice(0, 2)) > 9) {
        hi = programacion.hi.slice(0, 2) + ":00:00"
      } else {
        //console.log(programacion.hi);
        hi = programacion.hi.slice(0, 2) + ":00:00"
      }

    }

    if (hf === '00') {
      hf = programacion.hf.slice(0, 2) + ":00:00"
    } else {
      if (parseInt(programacion.hf.slice(0, 2)) > 9) {
        hf = programacion.hf.slice(0, 2) + ":00:00"
      } else {
        console.log(programacion.hf);
        hf = programacion.hf.slice(0, 2) + ":00:00"
      }

    }

    if (Plan.find({ activo: false, dia: validacion.dia, rutaId: validacion.rutaId}).fetch().length > 0) {
      Plan.update({ activo: false, dia: validacion.dia, rutaId: validacion.rutaId}, {
        $push: {
          programacion: programacion
        }
      })

      CalendarioPlaneamiento.find({dia: validacion.dia}).forEach( c => {
        CalendarioPlaneamiento.update({_id: c._id}, {
          $set: {
            permitir: false
          }
        })
      })

      let calendario = CalendarioPlaneamiento.insert({
        ida: validacion.ida,
        dia: validacion.dia,
        hora: programacion.hi + ':' + programacion.hf,
        planId: Plan.findOne({ activo: false, dia: validacion.dia, rutaId: validacion.rutaId})._id,
        rutaId: validacion.rutaId,
        title: 'H: ' + programacion.hi + ' - ' + programacion.hf + ' F: ' + programacion.frecuencia,
        start: validacion.dia + 'T' + hi,
        end: validacion.dia + 'T' + hf,
        hi: programacion.hi,
        hf: programacion.hf,
        editable: false,
        permitir: true
      })


    } else {
      let planId = Plan.insert({
        activo: false,
        rutaId: validacion.rutaId,
        ida: validacion.ida,
        dia: validacion.dia,
        programacion: arreglo
      });

      if (planId) {


        CalendarioPlaneamiento.find({dia: validacion.dia}).forEach( c => {
          CalendarioPlaneamiento.update({_id: c._id}, {
            $set: {
              permitir: false
            }
          })
        })

        CalendarioPlaneamiento.insert({
          ida: validacion.ida,
          dia: validacion.dia,
          hora: programacion.hi + ':' + programacion.hf,
          planId: planId,
          rutaId: validacion.rutaId,
          title: 'H: ' + programacion.hi + ' - ' + programacion.hf  + ' F: ' + programacion.frecuencia,
          start: validacion.dia + 'T' + hi,
          end: validacion.dia + 'T' + hf,
          hi: programacion.hi,
          hf: programacion.hf,
          editable: false,
          permitir: true
        })
      }

    }

  },
  removePlan2(calendarioId) {
    console.log(calendarioId);

    if (CalendarioPlaneamiento.findOne({_id: calendarioId}).permitir === true) {
      let planId = CalendarioPlaneamiento.findOne({_id: calendarioId}).planId
      let dia = CalendarioPlaneamiento.findOne({_id: calendarioId}).dia;
      let ida = CalendarioPlaneamiento.findOne({_id: calendarioId}).ida;
      let rutaId = CalendarioPlaneamiento.findOne({_id: calendarioId}).rutaId;
      let hora = CalendarioPlaneamiento.findOne({_id: calendarioId}).hora;
      let hi = CalendarioPlaneamiento.findOne({_id: calendarioId}).hi;
      let hf = CalendarioPlaneamiento.findOne({_id: calendarioId}).hf;
      console.log(hora);

      let rango = {
        hi: hi,
        hf: hf
      }

      let nuevoRangoDeHoras = getHorarioNuevo(rango, dia, ida, rutaId, false)

      HorasPorDia.update({dia: dia, ida: ida, rutaId: rutaId}, {
        $set: {
            horas: nuevoRangoDeHoras
        }
      });

      let id = Plan.find( {_id: planId, programacion: { $elemMatch: { hora: hora} } }).fetch()
      console.log(id);
      Plan.update( {_id: planId, programacion: { $elemMatch: { hora: hora} } }, {
        $pull: {
          "programacion": { hora: hora }
        }
      })

      let plan = Plan.findOne({_id: planId})

      CalendarioPlaneamiento.remove({_id: calendarioId})

      let numeroCalendarios = CalendarioPlaneamiento.find({dia: dia}).fetch().length;

      if (numeroCalendarios > 0) {
        let ultimoCalendario = CalendarioPlaneamiento.find({dia: dia}).fetch()[numeroCalendarios - 1]._id;

        if (ultimoCalendario !== undefined) {
          CalendarioPlaneamiento.update({_id: ultimoCalendario}, {
            $set: {
              permitir: true
            }
          })
        }
      } else {
        rango.hi = '00:00';
        let nuevoRangoDeHoras = getHorarioNuevo(rango, dia, ida, rutaId, true)

        HorasPorDia.update({dia: dia, ida: ida, rutaId: rutaId}, {
          $set: {
              horas: nuevoRangoDeHoras,
              primera: false
          }
        });
      }


      return {
        mensaje: 'Planeamiento Eliminado',
        eliminado: true
      }
    } else {
      return {
        mensaje: 'Planeamiento no se puede eliminar',
        eliminado: false
      }

    }


    // let nuevoRangoDeHoras = getHorarioNuevo(hora, plan.dia, plan.ida, plan.rutaId)
    //
    // HorasPorDia.update({dia: plan.dia, ida: plan.ida, rutaId: plan.rutaId}, {
    //   $set: {
    //     horas: nuevoRangoDeHoras
    //   }
    // });

  },
  editarPlanHorario(id, datos) {

    if (this.userId) {

      datos.frecuencia = parseInt(datos.frecuencia);

      if (datos.hi !== "" && datos.hf !== "") {

        PlanesHorarios.update({_id: id}, {
          $set: {
            hi: datos.hi,
            hf: datos.hf,
            frecuencia: datos.frecuencia
          }
        });

      } else {

        return;

      }

    } else {

      return;

    }

  },
  eliminarPlanHorario(id) {
    if (this.userId) {
      PlanesHorarios.remove({_id: id})
    } else {
      return;
    }
  },
  actualizarFrecuencia(frec, id) {
    PlanesHorarios.update({_id: id}, {
      $set: {
        frecuencia: frec
      }
    })
  },
  crearPlan(datos) {
    if (this.userId) {
       datos.createdAt = new Date();
       datos.createdBy = this.userId;

       let hay = Plan.find({rutaId: datos.rutaId, ida: datos.ida}).fetch().length

       if (hay <= 0) {

         Plan.insert(datos)
       } else {

       }
    } else {
      return;
    }
  },
  editarPlan(plan, id) {
    if (this.userId) {
      Plan.update({_id: id}, {
        $set: {
          plan: plan
        }
      })
    } else {
      return;
    }
  },
  removePlan(id) {
    if (this.userId) {
      Plan.remove({_id: id})
    } else {
      return;
    }
  }
})
