import { time, hoy } from '../../Utilities/Horas';

Template.VistaDespacho.onCreated(() => {
    let template = Template.instance();

    template.autorun( () => {
        template.empresaId = new ReactiveVar();
        template.empresaId.set(Meteor.user().profile.empresaId);
        template.rutaId = new ReactiveVar();
        template.rutaId.set(FlowRouter.getParam('rutaId'))
        if (template.empresaId.get() === undefined) {
          Meteor.call('obtenerEmpresaId', template.rutaId.get(), (err, result) => {
            if (err) {
              console.log(err)
            } else {
              template.empresaId.set(result);
              template.subscribe('VehiculosEmpresaId', template.empresaId.get());
            }
          })
        } else {
          template.subscribe('VehiculosEmpresaId', template.empresaId.get());
        }


        template.ida = new ReactiveVar();

        if (Roles.userIsInRole(Meteor.userId(), ['director'], 'Empresa')) {
            template.ida.set(true)
        } else {

            if (Meteor.user().profile.ida === undefined) {
              template.ida.set(Session.get('Ida'))

            } else {
              template.ida.set(Meteor.user().profile.ida)

            }

        }

        template.subscribe('ProgramacionVehiculoRutaDiaIda', template.rutaId.get(), hoy(), template.ida.get());

    })

})

Template.VistaDespacho.helpers({
    cero() {
      let ida = Template.instance().ida.get()
      let cero = ProgramacionVehiculo.find({ida: ida}).fetch()[0].cero

      return cero;
    },
    programacion() {
      let ida = Template.instance().ida.get()
      let rutaId = Template.instance().rutaId.get()
      console.log(ida);
      console.log(rutaId);
      console.log(hoy());
      let programacion = ProgramacionVehiculo.find({}).fetch()
      console.log(programacion);
      return programacion[0].programacion.filter( (p) => {
        return p.despachado == false;
      })
    },
    despacho() {

        //return ProgramacionVehiculo.find({ida: ida, 'programacion.$.despachado': false}).fetch()[0].programacion;
    },
    despachados() {
      let ida = Template.instance().ida.get()
      let rutaId = Template.instance().rutaId.get()
      console.log(ida);
      console.log(rutaId);
      console.log(hoy());
      let programacion = ProgramacionVehiculo.find({ida: ida}).fetch()
      console.log(programacion);
      return programacion[0].programacion.filter( (p) => {
        return p.despachado == true;
      })
    },
    despachocola() {
        return Vehiculos.find({espera: true});
    },
    vehiculosSancionados() {
        return Vehiculos.find({'sancionActiva': true});
    },
    vehiculo(vehiculoId) {
        return Vehiculos.findOne({_id: vehiculoId})
    },
    rutaId() {
        return FlowRouter.getParam('rutaId')
    },
    placa() {
      return Vehiculos.findOne({_id: this.vehiculoId}).placa;
    },
    padron() {
      return Vehiculos.findOne({_id: this.vehiculoId}).padron;
    }
})

Template.VistaDespacho.events({
    'click .activar_cero'(e, t) {
      let ida = t.ida.get()

      console.log('ID: ', ProgramacionVehiculo.findOne({ida: ida})._id);
      let programacionId = ProgramacionVehiculo.findOne({ida: ida})._id
      Meteor.call('toggleCero', programacionId, true, (err) => {
        if (err) {
          Bert.alert(err, 'danger')
        } else {
          Bert.alert('Modo Cero Activado', 'success')
        }
      })
    },
    'click .desactivar_cero'(e, t) {
      let ida = t.ida.get()

      console.log('ID: ', ProgramacionVehiculo.findOne({ida: ida})._id);
      let programacionId = ProgramacionVehiculo.findOne({ida: ida})._id
      Meteor.call('toggleCero', programacionId, false, (err) => {
        if (err) {
          Bert.alert(err, 'danger')
        } else {
          Bert.alert('Modo Cero Desactivado', 'success')
        }
      })
    },
    'click .despachar'(e, t) {

        let ida = t.ida.get()

        console.log('ID: ', ProgramacionVehiculo.findOne({ida: ida})._id);
        Session.set('RegistroDeVehiculoADespachar', ProgramacionVehiculo.findOne({ida: ida})._id);
        Session.set('vehiculoId', this.vehiculoId);

        Modal.show('Asignar');


    },
    'click [name="volver_salir"]'(e, t) {
      let ida = t.ida.get()
      let programacionId = ProgramacionVehiculo.findOne({ida: ida})._id;
      Meteor.call('volverDeLaEspera', this._id, programacionId, (err, result) => {
        if (err) {
          console.log(err);
          Bert.alert('Hubo un error', 'danger')
        } else {
          console.log(result);
          Bert.alert('Vehiculo volvio a ruta', 'success')
        }
      })
    }
})

Template.Asignar.events({
    'click .asignar-conductor'(e, t) {
        t.conductor.set(this._id);
        let href = e.target;
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
        $('li.reqs').each((index, obj) => {
            let req = $(obj).find('.requisito').is(':checked');
        });

        if ($('.requisito:checked').length == $('.requisito').length) {
            t.despachar.set(true)
        } else {
            t.despachar.set(false)
        }

    },
    'click .cumple'(e, t) {
        let vehiculo = Session.get('vehiculoId');
      //  console.log(vehiculo);
        let registroId = Session.get('RegistroDeVehiculoADespachar');
        //console.log(registroId);
        Meteor.call('RegistrarVehiculoParaDespachar', registroId, vehiculo, t.conductor.get(), t.cobrador.get(), (err) => {
            if (err) {
                Bert.alert('Hubo un error, vuelva a intentarlo', 'danger')
            } else {
                Modal.hide('Asignar');

                Bert.alert('Vehiculo Despachado', 'success')

            }
        })
    },
    'click .reasignar'(e, t) {
        let rutaId = FlowRouter.getParam('rutaId');

        let programacionVehiculoId = Session.get('RegistroDeVehiculoADespachar'); //Session.get('programacionVehiculoId');
        let vehiculoId = Session.get('vehiculoId');

        let target = $(e.currentTarget);

        target.text("Reasignando ...");
        console.log(programacionVehiculoId, vehiculoId);
        target.attr("disabled", "");
        Meteor.call('reasignarVehiculos', programacionVehiculoId, vehiculoId, (err) => {
            target.removeAttr("disabled", "");
             if (err) {
                     Bert.alert('Hubo un error, vuelva a intentarlo', 'danger');
                     console.log(err);
                 } else {
                     Bert.alert('Vehiculos Reasignados', 'success');
                     Modal.hide('Asignar');
                     //location.reload();
                 }
        });
    }
})

Template.Asignar.helpers({
    conductores() {
        //let empresaId = Meteor.user().profile.empresaId;
        return Conductores.find({
            $or: [
                {despachado: {$exists: false}},
                {despachado: false}
            ]
        });
    },
    despachar() {
        if (Template.instance().despachar.get() === true) {
            return ''
        } else {
            return 'disabled';
        }
    },
    cobradores() {
        //let empresaId = Meteor.user().profile.empresaId;
        return Cobradores.find({
            //empresaId: empresaId,
            $or: [
                {despachado: {$exists: false}},
                {despachado: false}
            ]
        });
    },
    checklist() {
      return Template.instance().reqs.get();

    },
    requisitos(id) {
        console.log('id: ', id);
        console.log('reqs: ', Requisitos.find({listaId: this._id}));
        return Requisitos.find({listaId: id});
    }
})


Template.SeleccionarRutaPlaneamiento.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
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


Template.Asignar.onCreated(() => {
    let template = Template.instance();

    template.searchQuery = new ReactiveVar();
    template.reqs = new ReactiveVar([]);
    template.searching = new ReactiveVar(false);

    template.searchQuery2 = new ReactiveVar();
    template.searching2 = new ReactiveVar(false);

    template.conductor = new ReactiveVar();
    template.cobrador = new ReactiveVar();
    template.despachar = new ReactiveVar(false);

    template.autorun(() => {

        template.subscribe('listas', () => {
          let empresaId = Meteor.user().profile.empresaId;
          let rutaId = FlowRouter.getParam('rutaId');
          if (empresaId === undefined) {
            Meteor.call('obtenerEmpresaId', rutaId, (err, result) => {
              if (err) {
                alert(err)
              } else {
                console.log('empresaid: ' ,result);
                empresaId = result;
                // console.log('empresa', Empresas.findOne({_id: empresaId}));
                // console.log('lista: ', Listas.findOne({_id: Empresas.find({_id: empresaId}).plan }));
                console.log(Listas.find({_id: Empresas.findOne({_id: empresaId}).plan }).fetch());
                template.reqs.set(Listas.find({_id: Empresas.findOne({_id: empresaId}).plan }))
              }
            })
            //return Listas.find({_id: Empresas.findOne({_id: empresaId}).plan })
          } else {
            // console.log('empresa', Empresas.findOne({_id: empresaId}));
            // console.log('lista: ', Listas.findOne({_id: Empresas.findOne({_id: empresaId}).plan }));
            template.reqs.set(Listas.find({_id: Empresas.findOne({_id: empresaId}).plan }))
          }
        })
        template.subscribe('Empresas')
        template.subscribe('CobradoresPorEmpresa', FlowRouter.getParam('rutaId'), template.searchQuery2.get(), () => {
            console.log('primero');
            setTimeout(() => {
                template.searching2.set(false);
            }, 300);
        });

        template.subscribe('ConductoresPorEmpresa', FlowRouter.getParam('rutaId'), template.searchQuery.get(), () => {
            console.log('segundo');
            setTimeout(() => {
                template.searching.set(false);
            }, 300);
        });

        template.subscribe('reqs')

    });
});

Template.Asignar.helpers({
    searching() {
        return Template.instance().searching.get();
    },
    query() {
        return Template.instance().searchQuery.get();
    },
    searching2() {
        return Template.instance().searching2.get();
    },
    query2() {
        return Template.instance().searchQuery2.get();
    }
});

Template.Asignar.events({
    'keyup [name="search"]' (event, template) {

        let value = event.target.value.trim();

        //if ( value !== '' && event.keyCode === 13 ) {
        template.searchQuery.set(value);
        template.searching.set(true);
        //}

        if (value === '') {
            template.searchQuery.set(value);
        }
    },
    'keyup [name="search2"]' (event, template) {

        let value = event.target.value.trim();

        //if ( value !== '' && event.keyCode === 13 ) {
        template.searchQuery2.set(value);
        template.searching2.set(true);
        //}

        if (value === '') {
            template.searchQuery2.set(value);
        }
    },

});
