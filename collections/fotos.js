// Definimos el storage adapter GridFS
let vehiculos = new FS.Store.GridFS("fvehiculos", {
  maxTries: 3
});


// Creamos la DB
FotosDeVehiculos = new FS.Collection("fvehiculos", {
  stores: [vehiculos],
  filter: {
    maxSize: 1048576, //in bytes
    allow: {
      contentTypes: ['image/*'],
      extensions: ['png']
    },
    onInvalid: function (message) {
      if (Meteor.isClient) {
        console.log(message);
      } else {
        console.log(message);
      }
    }
  }
});

// agregamos los permisos allow/deny
FotosDeVehiculos.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  },
  download: function () {
    return true;
  }
});

// Definimos el storage adapter GridFS
let conductores = new FS.Store.GridFS("fconductores", {
  maxTries: 3
});


// Creamos la DB
FotosDeConductores = new FS.Collection("fconductores", {
  stores: [conductores],
  filter: {
    maxSize: 1048576, //in bytes
    allow: {
      contentTypes: ['image/*'],
      extensions: ['png']
    },
    onInvalid: function (message) {
      if (Meteor.isClient) {
        console.log(message);
      } else {
        console.log(message);
      }
    }
  }
});

// agregamos los permisos allow/deny
FotosDeConductores.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  },
  download: function () {
    return true;
  }
});

// Definimos el storage adapter GridFS
let cobradores = new FS.Store.GridFS("fcobradores", {
  maxTries: 3
});


// Creamos la DB
FotosDeCobradores = new FS.Collection("fcobradores", {
  stores: [cobradores],
  filter: {
    maxSize: 1048576, //in bytes
    allow: {
      contentTypes: ['image/*'],
      extensions: ['png']
    },
    onInvalid: function (message) {
      if (Meteor.isClient) {
        console.log(message);
      } else {
        console.log(message);
      }
    }
  }
});

// agregamos los permisos allow/deny
FotosDeCobradores.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  },
  download: function () {
    return true;
  }
});