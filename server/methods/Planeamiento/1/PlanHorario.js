function getHorarioNuevo (hora, dia, ida, rutaId) {
  let r1 = hora.slice(0, 2)

  let r2 = hora.slice(6, 8)

  r1 = parseInt(r1)
  r2 = parseInt(r2)


  console.log(r1);
  console.log(r2);

  let horario = HorasPorDia.findOne({dia: dia, ida: ida, rutaId}).horas
  let ultimo = horario[0]
  let u = ultimo.slice(0, 2);
  u = parseInt(u)
  //let nuevo_horario = _.range(r1, u + 1)
  let nuevo_horario = _.range(r1, r2 + 1)

  //let index = horario.indexOf(1);
  //horario.splice(1, 2);

  horario.shift()


  if (horario[0].includes(":01")) {
    if (parseInt(horario.slice(0, 2)) > 9) {
      horario[0] = parseInt(horario.slice(0, 2)) + ':00';
    } else {
      horario[0] = '0' + parseInt(horario.slice(0, 2)) + ':00';
    }
  }




  console.log(horario);
  console.log(nuevo_horario);
  let nuevo = [];
  nuevo_horario.map( h => {

    if (h > 9) {
      h = h + ':00'
    } else {
      h = '0' + h + ':00'
    }

    nuevo.push(h)

  })





  nuevo = _.union(nuevo, horario)

  console.log('Nuevo: ' + nuevo);
  return nuevo;
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
        console.log(programacion.hi);
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



      CalendarioPlaneamiento.insert({
        ida: validacion.ida,
        hora: programacion.hi + ':' + programacion.hf,
        planId: Plan.findOne({ activo: false, dia: validacion.dia, rutaId: validacion.rutaId})._id,
        rutaId: validacion.rutaId,
        title: 'H: ' + programacion.hi + ' - ' + programacion.hf + ' F: ' + programacion.frecuencia,
        start: validacion.dia + 'T' + hi,
        end: validacion.dia + 'T' + hf,
        editable: false
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

        CalendarioPlaneamiento.insert({
          ida: validacion.ida,
          hora: programacion.hi + ':' + programacion.hf,
          planId: planId,
          rutaId: validacion.rutaId,
          title: 'H: ' + programacion.hi + ' - ' + programacion.hf  + ' F: ' + programacion.frecuencia,
          start: validacion.dia + 'T' + hi,
          end: validacion.dia + 'T' + hf,
          editable: false
        })
      }

    }

  },
  removePlan2(calendarioId) {
    console.log(calendarioId);
    let planId = CalendarioPlaneamiento.findOne({_id: calendarioId}).planId
    let hora = CalendarioPlaneamiento.findOne({_id: calendarioId}).hora;
    console.log(hora);
    let id = Plan.find( {_id: planId, programacion: { $elemMatch: { hora: hora} } }).fetch()
    console.log(id);
    Plan.update( {_id: planId, programacion: { $elemMatch: { hora: hora} } }, {
      $pull: {
        "programacion": { hora: hora }
      }
    })

    let plan = Plan.findOne({_id: planId})

    CalendarioPlaneamiento.remove({_id: calendarioId})

    let nuevoRangoDeHoras = getHorarioNuevo(hora, plan.dia, plan.ida, plan.rutaId)

    HorasPorDia.update({dia: plan.dia, ida: plan.ida, rutaId: plan.rutaId}, {
      $set: {
        horas: nuevoRangoDeHoras
      }
    });

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
