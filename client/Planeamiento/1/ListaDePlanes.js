Template.ListaDePlanes.onCreated( () => {
  let template = Template.instance()

  template.autorun( () => {
    template.subscribe('planes')
    template.subscribe('rutas')
  })
})

Template.ListaDePlanes.helpers({
  planesida() {
    return Plan.find({ida: true})
  },
  planesvuelta() {
    return Plan.find({ida: false})
  },
  ruta() {
    return Rutas.findOne({_id: this.rutaId}).nombre
  }
})

Template.ListaDePlanes.events({
  'click [name="remove"]'() {
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
      Meteor.call('removePlan', this._id, (err) => {
        if (err) {
          Bert.alert('Hubo un error,', 'danger')
        } else {
          Bert.alert('Eliminaste el Planeamiento', 'success')
        }
      })
    });

  }
})
