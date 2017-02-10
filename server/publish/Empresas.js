Meteor.publish('Empresas', function () {
	if (this.userId) {
		return Empresas.find();
	} else {
		this.stop();
		return;
	}
});

Meteor.publish('Vehiculos', function () {
  if (this.userId) {
    return Vehiculos.find();
  } else {
    this.stop();
    return;
  }
});

Meteor.publish('Conductores', function () {
  if (this.userId) {
    return Conductores.find();
  } else {
    this.stop();
    return;
  }
});

Meteor.publish('rutas', function () {
  if (this.userId) {
    return Rutas.find();
  } else {
    this.stop();
    return;
  }
});

Meteor.publish('Cobradores', function () {
  if (this.userId) {
    return Cobradores.find();
  } else {
    this.stop();
    return;
  }
});

Meteor.publish('DetalleDeEmpresa', function (empresaId) {
	if (this.userId) {
		return Empresas.find({_id: empresaId});
	} else {
		this.stop();
		return
	}
});



Meteor.publish('RutasPorEmpresa', function () {
  if (this.userId) {
    return Rutas.find({});
  } else {
    this.stop();
    return
  }
});

Meteor.publish('Rutas', function () {
  if (this.userId) {
    return Rutas.find({});
  } else {
    this.stop();
    return
  }
});

Meteor.publish('DetalleDeEmpresaPlaneamiento', function (empresaId) {
  if (this.userId) {
    return Planeamiento.find({empresaId: empresaId});
  } else {
    this.stop();
    return
  }
});

Meteor.publish('DetalleDeVehiculos', function (vehiculoId) {
	if (this.userId) {
		return Vehiculos.find({_id: vehiculoId});
	} else {
		this.stop();
		return
	}
});

Meteor.publish('DetalleDeConductores', function (vehiculoId) {
	if (this.userId) {
		return Conductores.find({_id: vehiculoId});
	} else {
		this.stop();
		return
	}
});

Meteor.publish('DetalleDeCobradores', function (vehiculoId) {
	if (this.userId) {
		return Cobradores.find({_id: vehiculoId});
	} else {
		this.stop();
		return
	}
});

Meteor.publish( 'VehiculosPorEmpresa', function(empresaId, search ) {
  let query      = {},
      projection = { limit: 1, sort: { placa: 1 } };

   	console.log(empresaId);
   	console.log(search);

  if ( search ) {
    let regex = new RegExp( search, 'i' );
    
    query = {
      $or: [
        { placa: regex },
        { padron: regex}
      ]
    };

    projection.limit = 200;
  }

  console.log(Vehiculos.find(query, projection ).fetch().length);

  return Vehiculos.find(query, projection );
});

Meteor.publish( 'ConductoresPorEmpresa', function(empresaId, search ) {
  let query      = {},
      projection = { limit: 1, sort: { placa: 1 } };

   	console.log(empresaId);
   	console.log(search);

  if ( search ) {
    let regex = new RegExp( search, 'i' );
    console.log(regex);
    query = {
      $or: [
        { 'datos.dni': regex }
      ]
    };

    projection.limit = 200;
  }

  return Conductores.find(query, projection );
});

Meteor.publish( 'CobradoresPorEmpresa', function(empresaId, search ) {
  let query      = {},
      projection = { limit: 1, sort: { placa: 1 } };

   	console.log(empresaId);
   	console.log(search);

  if ( search ) {
    let regex = new RegExp( search, 'i' );
    console.log(regex);
    query = {
      $or: [
        { 'datos.dni': regex }
      ]
    };

    projection.limit = 200;
  }

  return Cobradores.find(query, projection );
});

Meteor.publish('OperadoresPorEmpresa', function (empresaId) {
	if (this.userId) {
		return Operadores.find({empresaId: empresaId});
	} else {
		this.stop();
		return;
	}
});

Meteor.publish('DirectoresPorEmpresa', function (empresaId) {
	if (this.userId) {
		return Directores.find({empresaId: empresaId});
	} else {
		this.stop();
		return;
	}
});

Meteor.publish('FotosDeVehiculosPorEmpresa', function () {
	if (this.userId) {
		return FotosDeVehiculos.find();
	} else {
		this.stop();
		return;
	}
});

Meteor.publish('FotosDeConductoresPorEmpresa', function () {
	if (this.userId) {
		return FotosDeConductores.find();
	} else {
		this.stop();
		return;
	}
});

Meteor.publish('FotosDeCobradoresPorEmpresa', function () {
	if (this.userId) {
		return FotosDeCobradores.find();
	} else {
		this.stop();
		return;
	}
});

Meteor.publish( 'BuscaadorDeEmpresas', function( search ) {
  let query      = {},
      projection = { limit: 40, sort: { nombre: 1 } };

   	console.log(search);

  if ( search ) {
    let regex = new RegExp( search, 'i' );
    console.log(regex);
    query = {
      $or: [
        { nombre: regex },
        { ruc: regex }
      ]
    };

    projection.limit = 200;
  }

  return Empresas.find(query, projection );
});