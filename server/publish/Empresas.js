Meteor.publish('Requisitos', function () {
    if (this.userId) {
        return Requisitos.find();
    } else {
        this.stop();
        return;
    }
});

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

Meteor.publish('Administradores', function () {
    if (this.userId) {
        return Administradores.find();
    } else {
        this.stop();
        return;
    }
});

Meteor.publish('VehiculosLista', function (empresaId, borrador) {
    if (this.userId) {
        return Vehiculos.find({empresaId: empresaId, borrador: borrador});
    } else {
        this.stop();
        return;
    }
});

Meteor.publish('ConductoresLista', function (empresaId, borrador) {
    if (this.userId) {
        return Conductores.find({empresaId: empresaId, borrador: borrador});
    } else {
        this.stop();
        return;
    }
});

Meteor.publish('CobradoresLista', function (empresaId, borrador) {
    if (this.userId) {
        return Cobradores.find({empresaId: empresaId, borrador: borrador});
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

Meteor.publish('rutaSingle', function ( rutaId ) {
    if (this.userId) {
        return Rutas.find({ _id: rutaId });
    } else {
        this.stop();
        return;
    }
});

Meteor.publish('rutasPorEmpresa', function (empresaId) {
    if (this.userId) {
        return Rutas.find({empresasId: empresaId});
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


Meteor.publish('RutasPorEmpresa', function (empresaId) {
    if (this.userId) {
        let query = Rutas.find({
            $or: [
                {"empresasId.0": empresaId},
                {empresaId: empresaId},
                {empresasId: empresaId}
            ]
        });

        return query;
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

Meteor.publish('Planeamientos', function () {
    if (this.userId) {
        return Planeamiento.find();
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

Meteor.publish('VehiculosPorEmpresa', function (empresaId, search) {
    let query = {},
        projection = {limit: 1, sort: {placa: 1}};

    if (search) {
        let regex = new RegExp(search, 'i');

        query = {
            $or: [
                {placa: regex},
                {padron: regex},
                {codigoDeRuta: regex}
            ]
        };

        projection.limit = 200;
    }

    return Vehiculos.find(query, projection);
});

Meteor.publish('VehiculosPorEmpresa2', function (empresaId, search) {
    let query = {},
        projection = {sort: {placa: 1}, limit: 5};

    if (search) {
        let regex = new RegExp(search, 'i');

        query = {
            $or: [
                {placa: regex},
                {padron: regex},
                {codigoDeRuta: regex}
            ]
        };

        projection.limit = 200;
    }
    //console.log(Vehiculos.find(query, projection).fetch());
    return Vehiculos.find(query, projection);
});

Meteor.publish('VehiculosPorEmpresaId', function (empresaId) {
    return Vehiculos.find({'empresaId': empresaId});
});

Meteor.publish('RutasEmpresa', function (empresaId) {
    return Rutas.find({empresasId: empresaId});
});

Meteor.publish('ConductoresPorEmpresa', function (rutaId, search) {
    //console.log(rutaId);
    let  empresaId;
    let query;
    let projection = {limit: 4}
    if (rutaId === null) {
      empresaId = undefined;
      query = {}
    } else {

      empresaId = Rutas.findOne({_id: rutaId}).empresasId;

        query = {empresaId}
    }

    //console.log(empresaId);



    if (search) {
        let regex = new RegExp(search, 'i');
        query = {
            ...query,
            $or: [
                {'datos.dni': regex},
                {'datos.nombre': regex}
            ]
        };
        projection = {limit: 200};

        if (empresaId === undefined) {

          return Conductores.find({$or: [
              {'datos.dni': regex},
              {'datos.nombre': regex}
          ]}, projection);
        } else {
          return Conductores.find(query, projection);
        }
    }

    return Conductores.find(query, projection);




});

Meteor.publish('CobradoresPorEmpresa', function (rutaId, search) {

  //console.log(rutaId);
  let  empresaId;
  let query;
  let projection = {limit: 4}
  if (rutaId === null) {
    empresaId = undefined;
    query = {}
  } else {

    empresaId = Rutas.findOne({_id: rutaId}).empresasId

    query = {empresaId}
  }

    // let  empresaId = Rutas.findOne({_id: rutaId}).empresasId
    // let query = {empresaId: empresaId},
    //     projection = {limit: 4};

    if (search) {
        let regex = new RegExp(search, 'i');
        query = {
            //...query,
            $or: [
                {'datos.dni': regex},
                {'datos.nombre': regex},
                {'datos.apellido': regex}
            ]
        };
        projection = {limit: 200};

        if (empresaId === undefined) {

          return Cobradores.find({$or: [
              {'datos.dni': regex},
              {'datos.nombre': regex},
              {'datos.apellido': regex}
          ]}, projection);
        } else {
          return Cobradores.find(query, projection);
        }
    }

    //console.log(query);

    //console.log(Cobradores.find(query, projection).fetch());
    return Cobradores.find(query, projection);
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

Meteor.publish('BuscaadorDeEmpresas', function (search) {
    let query = {},
        projection = {limit: 40, sort: {nombre: 1}};

    //console.log(search);

    if (search) {
        let regex = new RegExp(search, 'i');
      //  console.log(regex);
        query = {
            $or: [
                {nombre: regex},
                {ruc: regex}
            ]
        };

        projection.limit = 200;
    }

    return Empresas.find(query, projection);
});

//ENTIDADES

Meteor.publish('BuscadorEntidades', function (search) {
    let query = {},
        projection = {limit: 40, sort: {nombre: 1}};

    if (search) {
        let regex = new RegExp(search, 'i');
        query = {
            $or: [
                {nombre: regex}
            ]
        };

        projection.limit = 200;
    }

    return Entidades.find(query, projection);
});

Meteor.publish('VehiculosEmpresa', function () {

    if (this.userId) {
        return Vehiculos.find();
    } else {
        this.stop()
    }

});

Meteor.publish('VehiculosEmpresaId', function (empresaId) {
    //console.log(empresaId);
    if (this.userId) {
        //console.log(Vehiculos.find({empresaId: empresaId}).fetch());
        return Vehiculos.find({empresaId: empresaId});
    } else {
        this.stop()
    }

});

Meteor.publish('Entidades', function () {

    if (this.userId) {
        return Entidades.find();
    } else {
        this.stop()
    }

});

Meteor.publish('planes_horarios', function (ida) {
    return PlanHorario.find({ida});
});

Meteor.publish('RequisitosPorVehiculo', function (vehiculoId) {
    let vehiculo = Vehiculos.findOne({_id: vehiculoId});
    return Requisitos.find({_id: {$in: vehiculo.idRequisitos}});
});

Meteor.publish('ProgramacionVehiculoPorRuta', function (rutaId) {
    if (this.userId) {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var hoy = dd + '/' + mm + '/' + yyyy;
        return ProgramacionVehiculo.find({dia: hoy, rutaId: rutaId});
    } else {
        this.stop()
        return;
    }
})

Meteor.publish('cobradoresEmpresa', function (empresaId) {
    if (this.userId) {
        
        return Cobradores.find({empresaId: empresaId})
    } else {
        this.stop();
        return;
    }
})

Meteor.publish('conductoresEmpresa', function (empresaId) {
    if (this.userId) {
        return Conductores.find({empresaId: empresaId})
    } else {
        this.stop();
        return;
    }
})

Meteor.publish('reqs', function () {
    if (this.userId) {
        return Requisitos.find();
    } else {
        this.stop();
        return;
    }
})

Meteor.publish('vehiculosGPS', function (empresaId) {
    if (this.userId) {
        return Vehiculos.find({empresaId: empresaId, borrador: false});
    } else {
        this.stop();
        return;
    }
})

Meteor.publish('soporte', function () {
    if (this.userId) {
        return Soporte.find();
    } else {
        this.stop();
        return;
    }
})

Meteor.publish('monitoreo', function () {
    if (this.userId) {
        return Monitoreo.find();
    } else {
        this.stop();
        return;
    }
})

Meteor.publish('checklist', function () {
    if (this.userId) {
        return Checklist.find();
    } else {
        this.stop();
        return;
    }
})

Meteor.publish('RecaudacionTPI', function () {
    if (this.userId) {
        let hoy = new Date();
        let dd = hoy.getDate();
        var mm = hoy.getMonth() + 1;

        let yyyy = hoy.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = dd + '/' + mm + '/' + yyyy;
        return RecaudacionTPI.find({dia: today});
    } else {
        this.stop();
        return;
    }
})

Meteor.publish('listas', function () {
  return Listas.find();
})
