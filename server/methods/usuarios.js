Meteor.methods({
  agregarMonitoreoTPI(datos) {
    if (this.userId) {
      let id = Accounts.createUser(datos);

      if (id) {
        Monitoreo.insert({
            email: datos.email,
            userId: id
        });

        Roles.addUsersToRoles(id, ['monitoreo'], 'Administracion');
      }
    } else {
      return;
    }
  },
  eliminarMonitoreoTPI(monitoreoId) {
    if (this.userId) {
      let user = Monitoreo.findOne({_id: monitoreoId}).userId;
      console.log(user);
      Monitoreo.remove({_id: monitoreoId})
      Meteor.users.remove({_id: user})

    } else {
      return;
    }
  },
  eliminarSoporteTPI(soporteId) {
    if (this.userId) {
      let user = Soporte.findOne({_id: soporteId}).userId;
      console.log(user);
      Soporte.remove({_id: soporteId})
      Meteor.users.remove({_id: user})
    } else {
      return;
    }
  },
  agregarSoporteTPI(datos) {
    if (this.userId) {
      let id = Accounts.createUser(datos);

      if (id) {
        Soporte.insert({
            email: datos.email,
            userId: id
        });

        Roles.addUsersToRoles(id, ['soporte'], 'Administracion');
      }
    } else {
      return;
    }
  }
})
