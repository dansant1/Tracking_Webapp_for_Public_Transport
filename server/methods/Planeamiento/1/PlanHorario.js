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
