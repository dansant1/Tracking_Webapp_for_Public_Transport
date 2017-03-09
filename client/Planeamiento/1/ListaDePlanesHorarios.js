Template.ListaDePlanesHorarios.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.ListaDePlanesHorarios.helpers({
  planesida() {
    return PlanesHorarios.find({ida: true});
  },
  planesvuelta() {
    return PlanesHorarios.find({ida: false});
  }
})

Template.ListaDePlanesHorarios.events({
  'click [name="remove"]'(e, t) {

    swal({
      title: "¿Estas Seguro?",
      text: "No podras recuperarlo luego de eliminarlo",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Si, eliminarlo",
      closeOnConfirm: true
    },
    () => {
      Meteor.call('eliminarPlanHorario', this._id)
    });

  }
})
