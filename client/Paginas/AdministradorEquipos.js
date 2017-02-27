Template.AdministradorEquipo2.onCreated(function () {
  var self = this;

  self.autorun(function () {
    self.subscribe('Administradores')
    self.subscribe('monitoreo')
    self.subscribe('soporte')
  })
});

Template.AdministradorEquipo2.helpers({
  Administradores() {
    return Administradores.find()
  },
  monitores() {
    return Monitoreo.find();
  },
  soportes() {
    return Soporte.find()
  }
})

Template.AdministradorEquipo2.events({
  'click .ad'() {
    Modal.show('AgregarAdministrador')
  },
  'click .as'() {
    Modal.show('AgregarSoporte')
  },
  'click .am'() {
    Modal.show('AgregarMonitoreo')
  },
  'click .eliminar'() {
    Meteor.call('eliminarUsuario', this._id, function (err) {
      if (err) {
        alert(err)
      }
    })
  },
  'click .es'() {
    Meteor.call('eliminarSoporteTPI', this._id, (err) => {
      if (err) {
        Bert.alert('Hubo un error, vuelva a intentarlo', 'danger')
      } else {
        Bert.alert('Usuario de Soporte Eliminado', 'success')
      }
    })
  },
  'click .em'() {
    Meteor.call('eliminarMonitoreoTPI', this._id, (err) => {
      if (err) {
        Bert.alert('Hubo un error, vuelva a intentarlo', 'danger')
      } else {
        Bert.alert('Usuario de Monitoreo Eliminado', 'success')
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
            Bert.alert('Super Administrador Agregado', 'success')
          }
        })
    }
  }
})

Template.AgregarMonitoreo.events({
  'click .am'(e, t) {
    e.preventDefault()
    let datos = {
      email: t.find("[name='email']").value,
      password: t.find("[name='password']").value
    }

    if (datos.email !== "" && datos.password !== "") {
      Meteor.call('agregarMonitoreoTPI', datos, (err) => {
        if (err) {
          Bert.alert(err, 'danger')
        } else {
          Modal.hide('AgregarMonitoreo')
          Bert.alert('Usuario de Monitoreo Agregado', 'success')
        }
      })
    } else {
      Bert.alert('Complete los datos', 'warning')
    }

  }
})

Template.AgregarSoporte.events({
  'click .as'(e, t) {
    e.preventDefault()
    let datos = {
      email: t.find("[name='email']").value,
      password: t.find("[name='password']").value
    }

    if (datos.email !== "" && datos.password !== "") {
      Meteor.call('agregarSoporteTPI', datos, (err) => {
        if (err) {
          Bert.alert(err, 'danger')
        } else {
          Modal.hide('AgregarSoporte')
          Bert.alert('Usuario de Soporte Agregado', 'success')
        }
      })
    } else {
      Bert.alert('Complete los datos', 'warning')
    }

  }
})
