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
        hi = "0" + programacion.hi.slice(0, 2) + "00:00"
      }

    }

    if (hf === '00') {
      hf = programacion.hf.slice(0, 2) + ":00:00"
    } else {
      if (parseInt(programacion.hf.slice(0, 2)) > 9) {
        hf = programacion.hf.slice(0, 2) + ":00:00"
      } else {
        hf = "0" + programacion.hf.slice(0, 2) + "00:00"
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
    CalendarioPlaneamiento.remove({_id: calendarioId})
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
