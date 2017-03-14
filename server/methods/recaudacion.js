
Meteor.methods({
  vehiculoCobrado(pagado, vehiculoId) {
    let hoy = new Date();
    let dd = hoy.getDate();
    var mm = hoy.getMonth() + 1;

    let yyyy = hoy.getFullYear();

    if ( dd < 10 ) {
        dd='0'+dd;
    }

    if ( mm < 10 ) {
        mm='0'+mm;
    }
    var today = dd+'/'+mm+'/'+yyyy;

    let precio = 0;

    let plan = Empresas.findOne({ _id: Vehiculos.findOne({_id: vehiculoId}).empresaId }).plan;

    if (plan === 1) {
      precio = 5;
    } else {
      precio = 8;
    }

    let empresaId = Vehiculos.findOne({_id: vehiculoId}).empresaId

    let hayVehiculoPagadoDeHoy = RecaudacionTPI.find({vehiculoId: vehiculoId, dia: today}).fetch().length;

    if (hayVehiculoPagadoDeHoy > 0) {
      RecaudacionTPI.update({vehiculoId: vehiculoId}, {
        $set: {
          pagado: true
        }
      })
    } else {
      if (pagado) {
        RecaudacionTPI.insert({
          createdAt: new Date(),
          empresaId: empresaId,
          dia: today,
          precio: precio,
          vehiculoId: vehiculoId,
          pagado: true
        })
      } else {
        RecaudacionTPI.update({vehiculoId: vehiculoId, dia: today}, {
          $set: {
            pagado: false
          }
        })
      }
    }

  },
  vehiculoNoCobrado(vehiculoId) {

    let hoy = new Date();
    let dd = hoy.getDate();
    var mm = hoy.getMonth() + 1;

    let yyyy = hoy.getFullYear();

    if ( dd < 10 ) {
        dd='0'+dd;
    }

    if ( mm < 10 ) {
        mm='0'+mm;
    }
    var today = dd+'/'+mm+'/'+yyyy;

    RecaudacionTPI.update({vehiculoId: vehiculoId, dia: today}, {
      $set: {
        pagado: false
      }
    })
  }
})
