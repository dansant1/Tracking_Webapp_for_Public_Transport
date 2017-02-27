Template.VistaDespacho.onCreated( () => {
  let template = Template.instance()

  template.autorun( () => {
    let empresaId = Meteor.user().profile.empresaId;
    let rutaId = FlowRouter.getParam('rutaId');
    template.subscribe('RegistroDeDespachoDeVehiculos', empresaId, rutaId, () => {
      if (RegistroDeDespachoDeVehiculos.find().fetch().length === 0) {
        Meteor.call('AgregarPlaneamientoDelDiaAutomatico', rutaId, (err) => {
          if (err) {
            Bert.alert('Hubo un error al crear el planeamiento de hoy, intentelo manualmente', 'warning')
          } else {
            Bert.alert('El planeamiento del dia se agrego automaticamente.')
          }
        })
      }
    });
    template.subscribe('VehiculosEmpresaId', empresaId);
  })
})

Template.VistaDespacho.helpers({
  despacho() {
    return RegistroDeDespachoDeVehiculos.find();
  },
  despachados() {
    return RegistroDeDespachoDeVehiculos.find({despachado: true});
  },
  despachocola() {
    return RegistroDeDespachoDeVehiculos.find({despachado: false});
  },
  placa() {
    return Vehiculos.findOne({_id: this.vehiculoId}).placa
  },
  padron() {
    return Vehiculos.findOne({_id: this.vehiculoId}).padron
  },
  rutaId() {
    return FlowRouter.getParam('rutaId')
  }
})

Template.VistaDespacho.events({
  'click .despachar'(e, t) {
    Session.set('VehiculoADespachar', this.vehiculoId);
    Session.set('RegistroDeVehiculoADespachar', this._id);
    Modal.show('Asignar');
  }
})

Template.Asignar.onCreated( () => {
  let template = Template.instance();
  template.conductor = new ReactiveVar();
  template.cobrador = new ReactiveVar();
  template.despachar = new ReactiveVar(false);

  template.autorun( () => {
    let empresaId = Meteor.user().profile.empresaId;
    template.subscribe('conductoresEmpresa', empresaId);
    template.subscribe('cobradoresEmpresa', empresaId);
    template.subscribe('reqs')
  })
})

Template.Asignar.events({
  'click .asignar-conductor'(e, t) {
    t.conductor.set(this._id);

    let href = $('.a' + this._id).attr('href')
    let a = this._id;
    Meteor.call('verificarConductorEsAptoParaSalirARuta', this._id, (err, result) => {
      if (err) {
        Bert.alert('Hubo un error, vuelva a intentarlo', 'danger')
      } else {

        if (result.valido) {
          $('a[href="' + $('.a' + a).attr('href') + '"]').tab('show');
          Bert.alert('Conductor Seleccionado para salir a Ruta', 'success')
        } else {
          Bert.alert(result.razon, 'warning')
        }


      }
    })

  },
  'click .asignar-cobrador'(e, t) {

    let href = $('.c' + this._id).attr('href')
    let a = this._id;
    Meteor.call('verificarCobradorEsAptoParaSalirARuta', this._id, (err, result) => {
      if (err) {
        Bert.alert('Hubo un error, vuelva a intentarlo', 'danger')
      } else {

        if (result.valido) {
          t.cobrador.set(this._id);
          $('a[href="' + $('.c' + a).attr('href') + '"]').tab('show');
          Bert.alert('Cobrador Seleccionado para salir a Ruta', 'success')
        } else {
          Bert.alert(result.razon, 'warning')
        }
      }
    })

  },
  'change .requisito'(e, t) {
    console.log(e.target.checked);
    let id = this._id;
    let activar = false;
    $('li.reqs').each( (index, obj) => {
      let req = $(obj).find('.requisito').is(':checked');
    });

    if ($('.requisito:checked').length == $('.requisito').length) {
     t.despachar.set(true)
    } else {
      t.despachar.set(false)
    }

  },
  'click .cumple'(e, t) {
    let vehiculo = Session.get('VehiculoADespachar');
    let registroId = Session.get('RegistroDeVehiculoADespachar')
    Meteor.call('RegistrarVehiculoParaDespachar', registroId, vehiculo, t.conductor.get(), t.cobrador.get(), (err) => {
      if (err) {
        Bert.alert('Hubo un error, vuelva a intentarlo', 'danger')
      } else {
        Modal.hide('Asignar');
        Bert.alert('Vehiculo Despachado', 'success')
      }
    })
  },
  'click .reasignar'() {
    let rutaId = FlowRouter.getParam('rutaId');
    console.log(rutaId);
    Meteor.call('ReasignarVehiculos', rutaId, (err) => {
      if (err) {
        Bert.alert('Hubo un error, vuelva a intentarlo', 'danger')
      } else {
        Bert.alert('Vehiculos Reasignados', 'success')
      }
    })
  }
})

Template.Asignar.helpers({
  conductores() {
    return Conductores.find({despachado: false});
  },
  despachar() {
    if (Template.instance().despachar.get() === true) {
      return ''
    } else {
      return 'disabled';
    }
  },
  cobradores() {
    return Cobradores.find({despachado: false});
  },
  requisitos() {
    return Requisitos.find();
  }
})


Template.SeleccionarRutaPlaneamiento.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    let empresaId = Meteor.user().profile.empresaId
    template.subscribe('DetalleDeEmpresa', empresaId);
    template.subscribe('rutas')
  })
})

Template.SeleccionarRutaPlaneamiento.helpers({
    empresa() {
      let empresaId = Meteor.user().profile.empresaId
      return Empresas.findOne({_id: empresaId}).nombre;
    },
     rutas() {
      let empresaId = Meteor.user().profile.empresaId
      return Rutas.find({empresasId: empresaId})
    }
})
