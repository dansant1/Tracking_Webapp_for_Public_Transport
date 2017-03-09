Template.EditarPlanHorario.onCreated( () => {
  let template = Template.instance()

  template.autorun( () => {
    let PlanHorarioId = FlowRouter.getParam('planHorarioId');
    template.subscribe('PlanHorario', PlanHorarioId)
  })

})

Template.EditarPlanHorario.helpers({
  plan() {
    let PlanHorarioId = FlowRouter.getParam('planHorarioId');
    return PlanesHorarios.findOne({_id: PlanHorarioId})
  }
})

Template.EditarPlanHorario.events({
  'click [name="guardar"]'(event, template) {
    let datos = {
      hi: template.find("[name='hi']").value,
      hf: template.find("[name='hf']").value,
      frecuencia: template.find("[name='frecuencia']").value
    }

    let PlanHorarioId = FlowRouter.getParam('planHorarioId');

    if (datos.hi !== "" && datos.hf !== "" && datos.frecuencia !== "") {

      if (datos.hi == datos.hf) {
        Bert.alert('Ingrese horarios diferentes', 'danger')
      } else {

        Meteor.call('editarPlanHorario', PlanHorarioId, datos, (err) => {
          if (err) {
            Bert.alert('Hubo un error, vuelva a intentarlo', 'warning')
          } else {
            Bert.alert('Plan Horario Editado', 'success')
            FlowRouter.go('/admin/listas/planeshorarios')
          }
        })
      }

    } else {
      Bert.alert('Ingrese los datos correctamente', 'danger')
    }

  }
})
