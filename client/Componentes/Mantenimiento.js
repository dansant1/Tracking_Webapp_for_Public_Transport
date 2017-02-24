Template.Mantenimiento.onCreated(() => {
  let template = Template.instance()

  template.autorun( () => {
    console.log('hola')
    template.subscribe('Requisitos')
  })
})

Template.Mantenimiento.events({
  'click .add__mantenimiento'() {
    Modal.show('agregarRequisitoVehicular')
  },
  'click .delete'() {

    Meteor.call('eliminarRequisito', this._id, function (err) {
      if (err) {
        Bert.alert('Hubo un error', 'danger')
      } else {
        Bert.alert('Eliminaste el requisito', 'success')
      }
    })
  }
})

Template.Mantenimiento.helpers({
  requisitos () {
    return Requisitos.find();
  }
})
