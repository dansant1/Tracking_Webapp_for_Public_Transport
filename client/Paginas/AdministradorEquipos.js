Template.AdministradorEquipo2.onCreated(function () {
  var self = this;

  self.autorun(function () {
    self.subscribe('Administradores')
  })
});

Template.AdministradorEquipo2.helpers({
  Administradores() {
    return Administradores.find()
  }
})

Template.AdministradorEquipo2.events({
  'click .ad'() {
    Modal.show('AgregarAdministrador')
  },
  'click .eliminar'() {
    Meteor.call('eliminarUsuario', this._id, function (err) {
      if (err) {
        alert(err)
      }
    })
  }
})
Template.AgregarAdministrador.events({
  'submit form'(e, t) {
    e.preventDefault()
    let datos = {
      email: t.find('[name="email"]').value,
      password: t.find('[name="password"]').value
    }

    if (datos.email != "" && datos.password !== "") {
        Meteor.call('AgregarAdministrador', datos, (err) => {
          if (err) {
            alert(err)
          } else {
            Modal.hide('AgregarAdministrador')
            alert('Super Administrador Agregado')
          }
        })
    }
  }
})
