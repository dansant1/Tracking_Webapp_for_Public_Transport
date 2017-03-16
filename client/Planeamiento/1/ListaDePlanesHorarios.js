Template.ListaDePlanesHorarios.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.ListaDePlanesHorarios.helpers({
  planesida() {
    return PlanesHorarios.find();
  }
})

Template.ListaDePlanesHorarios.events({
  'keyup [name="frec"]'() {
    let frecuencia = $('.ph' + this._id).val();
    Meteor.call('actualizarFrecuencia', frecuencia, this._id, (err) =>  {
      if (err) {
        alert(err)
      }
    })
  },
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
