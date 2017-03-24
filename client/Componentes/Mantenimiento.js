Template.mantenimiento.onCreated(() => {
  let template = Template.instance()

  template.autorun( () => {
    template.subscribe('Requisitos')
    template.subscribe('listas')
  })
})

Template.mantenimiento.events({
  'click .add__mantenimiento_lista'() {
    Modal.show('agregarLista')
  },
  'click .add__mantenimiento_req'() {
    Session.set('listaId', this._id)
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

Template.mantenimiento.helpers({
  requisitos () {
    return Requisitos.find({listaId: this._id});
  },
  listas() {
    return Listas.find()
  }
})

Template.agregarLista.events({
  'click .save'(e, t) {
    if (t.find("[name='nombre']").value !== "") {
      Meteor.call('agregarLista', t.find("[name='nombre']").value, (err) => {
        if (err) {
          Bert.alert('Hubo un error', 'danger')
        } else {
          Modal.hide('agregarLista')
          Bert.alert('Lista Creada', 'success')
        }
      })
    } else {
      Bert.alert('Ingrese un nombre')
    }
  }
})
