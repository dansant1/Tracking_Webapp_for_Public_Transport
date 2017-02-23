Template.Mantenimiento.onCreated(() => {
  let template = Template.instance()

  template.autorun( () => {
    template.subscribe('Requisitos')
  })
})

Template.Mantenimiento.events({
  'click .add__mantenimiento'() {
    Modal.show('agregarRequisitoVehicular')
  }
})

Template.Mantenimiento.helpers({
  requisitos () {
    return Requisitos.find();
  }
})
