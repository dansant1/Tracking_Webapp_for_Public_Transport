Template.AgregarPlanHorarioIda.events({
  'click [name="guardar"]'(event, template) {
    let datos = {
      hi: template.find("[name='hi']").value,
      hf: template.find("[name='hf']").value,
      frecuencia: template.find("[name='frecuencia']").value,
      ida: true
    }

    if (datos.hi !== "" && datos.hf !== "" && datos.frecuencia !== "") {

      if (datos.hi == datos.hf) {
        Bert.alert('Ingrese horarios diferentes', 'danger')
      } else {
        
        Meteor.call('agregarPlanHorario', datos, (err) => {
          if (err) {
            Bert.alert('Hubo un error, vuelva a intentarlo', 'warning')
          } else {
            Bert.alert('Plan Horario Agregado', 'success')
            FlowRouter.go('/admin/listas/planeshorarios')
          }
        })
      }

    } else {
      Bert.alert('Ingrese los datos correctamente', 'danger')
    }


  }
})

Template.AgregarPlanHorarioVuelta.events({
  'click [name="guardar"]'(event, template) {
    let datos = {
      hi: template.find("[name='hi']").value,
      hf: template.find("[name='hf']").value,
      frecuencia: template.find("[name='frecuencia']").value,
      ida: false
    }

    if (datos.hi !== "" && datos.hf !== "" && datos.frecuencia !== "") {

      if (datos.hi == datos.hf) {
        Bert.alert('Ingrese horarios diferentes', 'danger')
      } else {

        Meteor.call('agregarPlanHorario', datos, (err) => {
          if (err) {
            Bert.alert('Hubo un error, vuelva a intentarlo', 'warning')
          } else {
            Bert.alert('Plan Horario Agregado', 'success')
            FlowRouter.go('/admin/listas/planeshorarios')
          }
        })
      }

    } else {
      Bert.alert('Ingrese los datos correctamente', 'danger')
    }


  }
})
