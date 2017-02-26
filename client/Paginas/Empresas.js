import {handleFile, SubirFotoVehiculo, SubirFotoConductor, SubirFotoCobrador} from '../Utilities/archivos'

Template.Empresas.onCreated(() => {
    let template = Template.instance();

    template.searchQuery = new ReactiveVar();
    template.searching = new ReactiveVar(false);

    template.autorun(() => {

        template.subscribe('BuscaadorDeEmpresas', template.searchQuery.get(), () => {
            setTimeout(() => {
                template.searching.set(false);
            }, 300);
        });

        template.subscribe('rutas');
    });
});

Template.Empresas.helpers({
    searching() {
        return Template.instance().searching.get();
    },
    query() {
        return Template.instance().searchQuery.get();
    },
    empresas() {
        let query = {},
            projection = {limit: 40, sort: {nombre: 1}};

        let search = Template.instance().searchQuery.get();
        if (search) {
            let regex = new RegExp(search, 'i');
            query = {
                $or: [
                    {nombre: regex},
                    {ruc: regex}
                ]
            };

            projection.limit = 200;
        }

        return Empresas.find(query, projection);
    },
    rutas() {
        return Rutas.find();
    }
});

Template.Empresas.events({
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
    'click .eliminar-empresa'() {
        swal({
                title: "Estas seguro?",
                text: "Se eliminaran todos los datos de la empresa",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Si, Eliminar Empresa",
                closeOnConfirm: false
            },
            () => {
                Meteor.call('eliminarEmpresa', this._id, (err) => {
                    if (err) {
                        alert(err);
                    } else {
                        swal("Eliminado!", "", "success");
                    }
                });
            });

    },

});

Template.ListaDeVehiculosPorEmpresas.onCreated(() => {
    let template = Template.instance();

    template.searchQuery = new ReactiveVar();
    template.searching = new ReactiveVar(false);

    Session.set('editarVehiculo', null);

    template.autorun(() => {
        let empresaId = FlowRouter.getParam('empresaId');
        template.subscribe('VehiculosPorEmpresa', empresaId, template.searchQuery.get(), () => {
            setTimeout(() => {
                template.searching.set(false);
            }, 300);
        });
        template.subscribe('RutasEmpresa', empresaId, ()=> {
            console.log()
        });
    });
});

Template.ListaDeVehiculosPorEmpresas.helpers({
    searching() {
        return Template.instance().searching.get();
    },
    query() {
        return Template.instance().searchQuery.get();
    },
    rutas() {
        let empresaId = FlowRouter.getParam('empresaId');
        return Rutas.find({empresaId: empresaId});
    },
    vehiculo: function () {
        let vehiculos = Vehiculos.find({});

        if (vehiculos) {
            let empresaId = FlowRouter.getParam('empresaId');
            //return Vehiculos.find({empresaId: empresaId rutaId: Session.get('filtroRuta')});
            return Vehiculos.find({empresaId: empresaId});
        }
    },
    fotos() {
        return FotosDeVehiculos.find();
    },
    checked() {
        if (this.activo === false) {
            return 'checked'
        } else {
            return ''
        }
    }
});

Template.ListaDeVehiculosPorEmpresas.events({
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
    'click .remove' () {
        swal({
            title: "¿Estas seguro de eliminar este vehículo?",
            text: "El vehículo no estará disponible una vez eliminado",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, Eliminar",
            closeOnConfirm: false
        }, () => {

            Meteor.call('EliminarVehiculo', this._id, (err) => {
                if (err) {
                    alert(err);
                } else {
                    swal("¡Eliminado!", "El vehículo ha sido eliminado.", "success");
                }
            });

        });
    },
    'click .edit': function () {
        Session.set('editarVehiculo', this._id);
        Modal.show('EditarVehiculo');
    },
    'change [name="fotosubir"]'(e, t) {
        SubirFotoVehiculo(e, t, this._id, 'foto', 'fotovehiculo' + this._id);
    },
    'change #fotovehiculo2'(e, t) {
        SubirFotoVehiculo(e, t, this._id, 'foto2', 'fotovehiculo2');
    },
    'change #fotovehiculo3'(e, t) {
        SubirFotoVehiculo(e, t, this._id, 'foto3', 'fotovehiculo3');
    },
    'change #fotovehiculo4'(e, t) {
        SubirFotoVehiculo(e, t, this._id, 'foto4', 'fotovehiculo4');
    },
    'change #fotovehiculo5'(e, t) {
        SubirFotoVehiculo(e, t, this._id, 'foto5', 'fotovehiculo5');
    },
    'change #fotovehiculo6'(e, t) {
        SubirFotoVehiculo(e, t, this._id, 'foto6', 'fotovehiculo6');
    },
    'change .vehiculo-activo'(e, t) {
        if ($("#sw" + this._id).is(':checked')) {
            console.log($("#sw" + this._id).is(':checked'));
            Meteor.call('estadoVehiculo', this._id, false, (err) => {
                if (err) {
                    Bert.alert('Hubo un error, vuelva a intentarlo', 'danger');
                } else {
                    Bert.alert('El vehículo está inactivo', 'success');
                }
            });
        } else {
            Meteor.call('estadoVehiculo', this._id, true, (err) => {
                if (err) {
                    Bert.alert('Hubo un error, vuelva a intentarlo', 'danger');
                } else {
                    Bert.alert('El vehículo está activo', 'success');
                }
            });
        }
    }
});

Template.ListaDeConductoresPorEmpresa.onCreated(() => {
    let template = Template.instance();

    template.searchQuery = new ReactiveVar();
    template.searching = new ReactiveVar(false);

    Session.set('editarConductor', null);

    template.autorun(() => {
        let empresaId = FlowRouter.getParam('empresaId');
        console.log(empresaId);
        template.subscribe('ConductoresPorEmpresa', empresaId, template.searchQuery.get(), () => {
            setTimeout(() => {
                template.searching.set(false);
            }, 300);
        });
    });
});

Template.ListaDeConductoresPorEmpresa.helpers({
    searching() {
        return Template.instance().searching.get();
    },
    query() {
        return Template.instance().searchQuery.get();
    },
    conductores: function () {
        let vehiculos = Conductores.find();

        if (vehiculos) {
            let empresaId = FlowRouter.getParam('empresaId');
            return Conductores.find({empresaId: empresaId});
        }

    }
});

Template.ListaDeConductoresPorEmpresa.events({
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
    'click .remove' () {
        swal({
            title: "¿Estas seguro de eliminar este conductor?",
            text: "El conductor no estará disponible una vez eliminado",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, Eliminar",
            closeOnConfirm: false
        }, () => {

            Meteor.call('EliminarConductor', this._id, (err) => {
                if (err) {
                    alert(err);
                } else {
                    swal("¡Eliminado!", "El vehículo ha sido eliminado.", "success");
                }
            });

        });
    },
    'click .edit': function () {
        Session.set('editarConductor', this._id);
        Modal.show('EditarConductor');
        console.log(Session.get('editarConductor'));
    },
    'change #fotoconductor1'(e, t) {
        console.log('hola');
        SubirFotoConductor(e, t, this._id, 'fotoconductor1', 1);
    },
    'change #fotoconductor2'(e, t) {
        SubirFotoConductor(e, t, this._id, 'fotoconductor2', 2);
    },
    'change #fotoconductor3'(e, t) {
        SubirFotoConductor(e, t, this._id, 'fotoconductor3', 3);
    },
    'change #fotoconductor4'(e, t) {
        SubirFotoConductor(e, t, this._id, 'fotoconductor4', 4);
    }
});

Template.ListaDeCobradoresPorEmpresa.onCreated(() => {
    let template = Template.instance();

    template.searchQuery = new ReactiveVar();
    template.searching = new ReactiveVar(false);

    Session.set('editarCobrador', null);

    template.autorun(() => {
        let empresaId = FlowRouter.getParam('empresaId');
        template.subscribe('CobradoresPorEmpresa', empresaId, template.searchQuery.get(), () => {
            setTimeout(() => {
                template.searching.set(false);
            }, 300);
        });
    });
});

Template.ListaDeCobradoresPorEmpresa.helpers({
    searching() {
        return Template.instance().searching.get();
    },
    query() {
        return Template.instance().searchQuery.get();
    },
    cobradores: function () {
        let vehiculos = Cobradores.find();

        if (vehiculos) {
            let empresaId = FlowRouter.getParam('empresaId');
            return Cobradores.find({empresaId: empresaId});
        }

    }
});

Template.ListaDeCobradoresPorEmpresa.events({
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
    'click .remove' () {
        swal({
            title: "¿Estas seguro de eliminar este cobrador?",
            text: "El cobrador no estará disponible una vez eliminado",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, Eliminar",
            closeOnConfirm: false
        }, () => {

            Meteor.call('EliminarCobrador', this._id, (err) => {
                if (err) {
                    alert(err);
                } else {
                    swal("¡Eliminado!", "El vehículo ha sido eliminado.", "success");
                }
            });

        });
    },
    'click .edit': function () {
        Session.set('editarCobrador', this._id);
        Modal.show('EditarCobrador');
        console.log(Session.get('editarCobrador'));
    },
    'change #fotocobrador1'(e, t) {
        console.log('holaaadsdr443');
        SubirFotoCobrador(e, t, this._id, 'fotocobrador1', 1);
    },
    'change #fotocobrador2'(e, t) {
        SubirFotoCobrador(e, t, this._id, 'fotocobrador2', 2);
    },
    'change #fotocobrador3'(e, t) {
        SubirFotoCobrador(e, t, this._id, 'fotocobrador3', 3);
    },
    'change #fotocobrador4'(e, t) {
        SubirFotoCobrador(e, t, this._id, 'fotocobrador4', 4);
    }
});

Template.EditarVehiculo.onCreated(() => {

    let template = Template.instance();

    template.autorun(() => {

        let vehiculo = Session.get('editarVehiculo');

        template.subscribe('DetalleDeVehiculos', vehiculo);

    });

});

Template.EditarVehiculo.helpers({
    vehiculo() {
        let vehiculo = Session.get('editarVehiculo');
        return Vehiculos.findOne({_id: vehiculo});
    }
});

Template.Opciones.events({
    'click .agregar-vehiculo'() {
        Modal.show('AgregarVehiculo');
    },
    'click .agregar-conductor'() {
        Modal.show('AgregarConductor');
    },
    'click .agregar-cobrador'() {
        Modal.show('AgregarCobrador');
    }
});

Template.EditarVehiculo.events({
    'click .guardar'(e, t) {

        let datos = {
            placa: t.find("[name='placa']").value,
            propietario: {
                nombre: t.find("[name='propietario']").value,
                dni: t.find("[name='dni']").value,
                domicilio: t.find("[name='domicilio']").value,
                distrito: t.find("[name='distrito']").value,
                telefono: t.find("[name='telefono']").value
            },
            tecnico: {
                marca: t.find("[name='marca']").value,
                modelo: t.find("[name='modelo']").value,
                serie: t.find("[name='serie']").value,
                combustible: t.find("[name='combustible']").value,
                anioDeFabricacion: t.find("[name='anioDeFabricacion']").value,
                longitud: t.find("[name='longitud']").value,
                asientos: t.find("[name='asientos']").value
            },
            codigoDeRuta: t.find("[name='codigoDeRuta']").value,
            fechaDePermanenciaEnLaEmpresa: t.find("[name='fechaDePermanenciaEnLaEmpresa']").value,
            TC: {
                numero: t.find("[name='tc']").value,
                emision: t.find("[name='emisiontc']").value,
                caducidad: t.find("[name='caducidadtc']").value
            },
            SOAT: {
                numero: t.find("[name='soat']").value,
                inicio: t.find("[name='emisionsoat']").value,
                fin: t.find("[name='caducidadsoat']").value
            },
            CITV: {
                numero: t.find("[name='rt']").value,
                inicio: t.find("[name='emisionrt']").value,
                fin: t.find("[name='caducidadrt']").value
            },
            RC: {
                numero: t.find("[name='rc']").value,
                inicio: t.find("[name='emisionrc']").value,
                fin: t.find("[name='caducidadrc']").value
            }
        }

        if (datos) {
            Meteor.call('editarVehiculo', Session.get('editarVehiculo'), datos, function (err) {
                if (err) {
                    alert(err);
                } else {
                    Modal.hide('EditarVehiculo');
                    swal("¡Actualizado!", "El vehículo ha sido actualizado.", "success");
                }
            });
        }

    }
});

Template.EditarEmpresa.onCreated(() => {

    let template = Template.instance();

    template.autorun(() => {

        let empresaId = FlowRouter.getParam('empresaId');

        template.subscribe('DetalleDeEmpresa', empresaId);

    });

});

Template.EditarEmpresa.helpers({
    empresa() {
        let empresaId = FlowRouter.getParam('empresaId');
        console.log(Empresas.findOne({_id: empresaId}).nombre);
        return Empresas.findOne({_id: empresaId});
    }
});

Template.EditarEmpresa.events({
    'click .guardar'(e, t) {
        let re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        let datos = {
            nombre: t.find("[name='nombre']").value,
            ruc: t.find("[name='ruc']").value,
            domicilio: t.find("[name='domicilio']").value,
            representante: t.find("[name='representante']").value,
            telefono: t.find("[name='telefono']").value,
            email: t.find("[name='email']").value
        };

        let empresaId = FlowRouter.getParam('empresaId');

        if (datos.nombre !== "" && datos.ruc !== "" && datos.domicilio !== "" && datos.representante !== "" && datos.telefono !== "" && re.test(t.find("[name='email']").value)) {
            Meteor.call('editarEmpresa', datos, empresaId, (err) => {
                if (err) {
                    sweetAlert("Oops...", "Hubo un error, vuelva a intentarlo", "error");
                } else {
                    Modal.hide('EditarEmpresa');
                    swal("¡Actualizado!", "Los datos de la empresa han sido actualizados.", "success");
                }
            });
        } else {
            swal("Complete los datos")
        }
    }
});

Template.EditarConductor.onCreated(() => {

    let template = Template.instance();

    template.autorun(() => {

        let vehiculo = Session.get('editarConductor');

        template.subscribe('DetalleDeConductores', vehiculo);

    });

});

Template.EditarConductor.helpers({
    conductor() {
        let vehiculo = Session.get('editarConductor');
        return Conductores.findOne({_id: vehiculo});
    }
});

Template.EditarConductor.events({
    'click .guardar'(e, t) {

        let datos = {
            datos: {
                nombre: t.find("[name='nombre']").value,
                apellido: t.find("[name='apellido']").value,
                caducidad: t.find("[name='caducidaddni']").value,
                dni: t.find("[name='dni']").value,
                domicilio: t.find("[name='domicilio']").value,
                distrito: t.find("[name='distrito']").value,
                telefono: t.find("[name='telefono']").value
            },
            licencia: {
                codigo: t.find("[name='codigolicencia']").value,
                categoria: t.find("[name='categoria']").value,
                expedicion: t.find("[name='expedicion']").value,
                revalidacion: t.find("[name='revalidacion']").value
            },
            CEV: {
                codigo: t.find("[name='codigocev']").value,
                emision: t.find("[name='emision']").value,
                caducidad: t.find("[name='caducidad']").value
            },
            credencial: {
                codigo: t.find("[name='codigocredencial']").value,
                emision: t.find("[name='emisionsoat']").value,
                caducidad: t.find("[name='emisionsoat']").value
            }
        }

        if (datos) {
            Meteor.call('editarConductor', Session.get('editarConductor'), datos, function (err) {
                if (err) {
                    alert(err);
                } else {
                    Modal.hide('EditarConductor');
                    swal("¡Actualizado!", "Los datos del conductor han sido actualizados.", "success");
                }
            });
        }

    }
});

Template.EditarCobrador.onCreated(() => {

    let template = Template.instance();

    template.autorun(() => {

        let vehiculo = Session.get('editarCobrador');

        template.subscribe('DetalleDeCobradores', vehiculo);

    });

});

Template.EditarCobrador.helpers({
    cobrador() {
        let vehiculo = Session.get('editarCobrador');
        return Cobradores.findOne({_id: vehiculo});
    }
});

Template.EditarCobrador.events({
    'click .guardar'(e, t) {

        let datos = {

            datos: {
                nombre: t.find("[name='nombre']").value,
                apellido: t.find("[name='apellidos']").value,
                dni: t.find("[name='dni']").value,
                domicilio: t.find("[name='domicilio']").value,
                distrito: t.find("[name='distrito']").value
            },
            CEV: {
                codigo: t.find("[name='codigocev']").value,
                emision: t.find("[name='emisioncev']").value,
                caducidad: t.find("[name='caducidadcev']").value
            },
            credencial: {
                numero: t.find("[name='numerocredencial']").value,
                emision: t.find("[name='emisioncredencial']").value,
                caducidad: t.find("[name='caducidadcredencial']").value,
            }
        }

        if (datos) {
            Meteor.call('editarCobrador', Session.get('editarCobrador'), datos, function (err) {
                if (err) {
                    alert(err);
                } else {
                    Modal.hide('EditarCobrador');
                    swal("¡Actualizado!", "Los datos del cobrador han sido actualizados.", "success");
                }
            });
        }

    }
});

Template.Empresas.events({
    'click .agregar-empresa'() {
        Modal.show('agregarEmpresa');
    },
    'change #subirFlota'(e, t) {
        let id = this._id;
        let rutaId = $("#listarutas" + this._id).val();
        Session.set('filtroRuta', rutaId);

        if (rutaId === '1') {
            Bert.alert('Seleccione una ruta', 'success');
        } else {
            handleFile(e, id, rutaId);

        }

    },
    'change #listarutas'() {
        let rutaId = $("#listarutas").val();
        Session.set('filtroRuta', rutaId);
    }
});


Template.agregarEmpresa.events({
    'submit form'(e, t) {
        e.preventDefault();
        let re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        let datos = {
            nombre: t.find("[name='nombre']").value,
            ruc: t.find("[name='ruc']").value,
            domicilio: t.find("[name='domicilio']").value,
            representante: t.find("[name='representante']").value,
            telefono: t.find("[name='telefono']").value,
            email: t.find("[name='email']").value
        };

        if (datos.nombre !== "" && datos.ruc !== "" && datos.domicilio !== "" && datos.representante !== "" && datos.telefono !== "" && re.test(t.find("[name='email']").value)) {

            if (datos.ruc.length === 11) {
                Meteor.call('agregarEmpresa', datos, (err) => {
                    if (err) {
                        alert(err);
                    } else {
                        Modal.hide('agregarEmpresa');
                    }
                });
            } else {
                Bert.alert('ingrese correctamente el RUC', 'warning', 'growl-top-right');
            }


        } else {

            alert('Ingrese datos validos');
        }
    }
});

Template.DetalleDeEmpresa.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        let empresaId = FlowRouter.getParam('empresaId');

        template.subscribe('DetalleDeEmpresa', empresaId);
    });
});

Template.DetalleDeEmpresa.helpers({
    empresa(){
        let empresaId = FlowRouter.getParam('empresaId');

        let empresa = Empresas.findOne({_id: empresaId});
        return empresa;
    }
});

Template.DetalleDeEmpresa.events({
    'click .edit'() {
        console.log('editar');
        Modal.show('EditarEmpresa');
    }
});

Template.DetalleVehiculos.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        let vehiculoId = FlowRouter.getParam('vehiculoId');

        template.subscribe('DetalleDeVehiculos', vehiculoId);
    });
});

Template.DetalleVehiculos.helpers({
    vehiculo() {
        return Vehiculos.findOne({});
    }
});

Template.GestorAdministradores.events({
    'click .nuevo-usuario'() {
        Modal.show('nuevoUsuario');
    }
});

Template.nuevoUsuario.events({
    'click .agregar-usuario'(e, t) {
        let datos = {
            email: t.find("[name='email']").value,
            password: t.find("[name='password']").value,
            profile: {
                nombre: t.find("[name='nombre']").value,
                empresaId: FlowRouter.getParam('empresaId')
            }
        }

        let r = $("#rol").val();

        let rol;

        if (r === "1") {
            rol = 1;
        } else if (r === "2") {
            rol = 2;
        } else if (r === "3") {
            rol = 3;
        } else {
            rol = 4;
        }

        if (datos.email !== "" && datos.password !== "" && datos.profile.nombre !== "") {
            Meteor.call('agregarUsuario', datos, rol, (err) => {
                if (err) {
                    sweetAlert("Oops...", "Hubo un error, vuelva a intentarlo", "error");
                } else {
                    Modal.hide('nuevoUsuario');
                    Bert.alert('Agregó un Usuario.', 'success', 'growl-top-right');
                }
            });
        } else {
            sweetAlert("Oops...", "Complete los datos", "error");
        }
    }
});

Template.ListaDeDirectoresPorEmpresa.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        let empresaId = FlowRouter.getParam('empresaId');

        template.subscribe('DirectoresPorEmpresa', empresaId);
    });
});

Template.ListaDeDirectoresPorEmpresa.helpers({
    directores() {
        return Directores.find();
    }
});

Template.ListaDeDirectoresPorEmpresa.events({
    'click .edit2'() {
        Modal.show('EditarDirector')
    },
    'click .remove'() {

        swal({
            title: "¿Estas seguro de eliminar este director?",
            text: "El director no estará disponible una vez eliminado",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, Eliminar",
            closeOnConfirm: false
        }, () => {

            Meteor.call('eliminarDirector', this._id, (err) => {
                if (err) {
                    sweetAlert("Oops...", "Hubo un error, vuelva a intentarlo", "error");
                } else {

                    Bert.alert('Eliminó al Director.', 'success', 'growl-top-right');
                }
            });

        });


    }
});

Template.ListaDeOperadoresPorEmpresa.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        let empresaId = FlowRouter.getParam('empresaId');
        template.subscribe('OperadoresPorEmpresa', empresaId);

    });
});

Template.ListaDeOperadoresPorEmpresa.helpers({
    operadores() {
        return Operadores.find();
    }
});

Template.ListaDeOperadoresPorEmpresa.events({
    'click .edit3'() {
        Modal.show('EditarOperador')
    },
    'click .remove'() {

        swal({
            title: "¿Estas seguro de eliminar este Operador?",
            text: "El operador no estará disponible una vez eliminado",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, Eliminar",
            closeOnConfirm: false
        }, () => {

            Meteor.call('eliminarOperador', this._id, (err) => {
                if (err) {
                    sweetAlert("Oops...", "Hubo un error, vuelva a intentarlo", "error");
                } else {

                    Bert.alert('Eliminó al Operador.', 'success', 'growl-top-right');
                }
            });

        });

    }
});

Template.FotosDeCobradores.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        //let empresaId = FlowRouter.getParam('empresaId');
        template.subscribe('FotosDeCobradoresPorEmpresa');

    });
});

Template.FotosDeCobradores.helpers({
    fotos() {
        return FotosDeCobradores.find({'metadata.cobradorId': this._id});
    }
});

Template.FotosDeCobradores.events({
    'click .remove'() {
        $(e.currentTarget).parent().find("input[name='fotosubir']")[0].value = "";
        FotosDeCobradores.remove({_id: this._id});
    }
});

Template.FotosDeCobradores1.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        //let empresaId = FlowRouter.getParam('empresaId');
        template.subscribe('FotosDeCobradoresPorEmpresa');

    });
});

Template.FotosDeCobradores1.helpers({
    fotos() {
        return FotosDeCobradores.find({'metadata.cobradorId': this._id, 'metadata.tipo': 1});
    }
});

Template.FotosDeCobradores1.events({
    'click .remove'(e) {
        $(e.currentTarget).parent().find("input[name='fotosubir']")[0].value = "";
        FotosDeCobradores.remove({_id: this._id});
    }
});

Template.FotosDeCobradores2.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        //let empresaId = FlowRouter.getParam('empresaId');
        template.subscribe('FotosDeCobradoresPorEmpresa');

    });
});

Template.FotosDeCobradores2.helpers({
    fotos() {
        return FotosDeCobradores.find({'metadata.cobradorId': this._id, 'metadata.tipo': 2});
    }
});

Template.FotosDeCobradores2.events({
    'click .remove'(e) {
        $(e.currentTarget).parent().find("input[name='fotosubir']")[0].value = "";
        FotosDeCobradores.remove({_id: this._id});
    }
});

Template.FotosDeCobradores3.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        //let empresaId = FlowRouter.getParam('empresaId');
        template.subscribe('FotosDeCobradoresPorEmpresa');

    });
});

Template.FotosDeCobradores3.helpers({
    fotos() {
        return FotosDeCobradores.find({'metadata.cobradorId': this._id, 'metadata.tipo': 3});
    }
});

Template.FotosDeCobradores3.events({
    'click .remove'(e) {
        $(e.currentTarget).parent().find("input[name='fotosubir']")[0].value = "";
        FotosDeCobradores.remove({_id: this._id});
    }
});

Template.FotosDeConductores.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        template.subscribe('FotosDeConductoresPorEmpresa');
    });
});

Template.FotosDeConductores.helpers({
    fotos() {
        return FotosDeConductores.find({'metadata.conductorId': this._id});
    }
});

Template.FotosDeConductores.events({
    'click .remove'(e) {
        $(e.currentTarget).parent().find("input[name='fotosubir']")[0].value = "";
        FotosDeConductores.remove({_id: this._id});
    }
});

Template.FotosDeConductores1.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        template.subscribe('FotosDeConductoresPorEmpresa');
    });
});

Template.FotosDeConductores1.helpers({
    fotos() {
        return FotosDeConductores.find({'metadata.conductorId': this._id, 'metadata.tipo': 1});
    }
});

Template.FotosDeConductores1.events({
    'click .remove'(e) {
        $(e.currentTarget).parent().find("input[name='fotosubir']")[0].value = "";
        FotosDeConductores.remove({_id: this._id});
    }
});

Template.FotosDeConductores2.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        template.subscribe('FotosDeConductoresPorEmpresa');
    });
});

Template.FotosDeConductores2.helpers({
    fotos() {
        return FotosDeConductores.find({'metadata.conductorId': this._id, 'metadata.tipo': 2});
    }
});

Template.FotosDeConductores2.events({
    'click .remove'(e) {
        $(e.currentTarget).parent().find("input[name='fotosubir']")[0].value = "";
        FotosDeConductores.remove({_id: this._id});
    }
});

Template.FotosDeConductores3.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        template.subscribe('FotosDeConductoresPorEmpresa');
    });
});

Template.FotosDeConductores3.helpers({
    fotos() {
        return FotosDeConductores.find({'metadata.conductorId': this._id, 'metadata.tipo': 3});
    }
});

Template.FotosDeConductores3.events({
    'click .remove'(e) {
        $(e.currentTarget).parent().find("input[name='fotosubir']")[0].value = "";
        FotosDeConductores.remove({_id: this._id});
    }
});

Template.FotosDeConductores4.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        template.subscribe('FotosDeConductoresPorEmpresa');
    });
});

Template.FotosDeConductores4.helpers({
    fotos() {
        return FotosDeConductores.find({'metadata.conductorId': this._id, 'metadata.tipo': 4});
    }
});

Template.FotosDeConductores4.events({
    'click .remove'(e) {
        $(e.currentTarget).parent().find("input[name='fotosubir']")[0].value = "";
        FotosDeConductores.remove({_id: this._id});
    }
});

Template.FotosDeVehiculos.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        //let empresaId = FlowRouter.getParam('empresaId');
        template.subscribe('FotosDeVehiculosPorEmpresa');

    });
});

Template.FotosDeVehiculos.helpers({
    fotos() {
        return FotosDeVehiculos.find({'metadata.vehiculoId': this._id, 'metadata.tipo': 'foto'});
    }
});

Template.FotosDeVehiculos.events({
    'click .remove'(e) {
        $(e.currentTarget).parent().find("input[name='fotosubir']")[0].value = "";
        FotosDeVehiculos.remove({_id: this._id});
    }
});

Template.FotosDeVehiculos2.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        //let empresaId = FlowRouter.getParam('empresaId');
        template.subscribe('FotosDeVehiculosPorEmpresa');

    });
});

Template.FotosDeVehiculos2.helpers({
    fotos() {
        return FotosDeVehiculos.find({'metadata.vehiculoId': this._id, 'metadata.tipo': 'foto2'});
    }
});

Template.FotosDeVehiculos2.events({
    'click .remove'(e) {
        $(e.currentTarget).parent().find("input[name='fotosubir']")[0].value = "";
        FotosDeVehiculos.remove({_id: this._id});
    }
});

Template.FotosDeVehiculos3.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        //let empresaId = FlowRouter.getParam('empresaId');
        template.subscribe('FotosDeVehiculosPorEmpresa');

    });
});

Template.FotosDeVehiculos3.helpers({
    fotos() {
        return FotosDeVehiculos.find({'metadata.vehiculoId': this._id, 'metadata.tipo': 'foto3'});
    }
});

Template.FotosDeVehiculos3.events({
    'click .remove'(e) {
        $(e.currentTarget).parent().find("input[name='fotosubir']")[0].value = "";
        FotosDeVehiculos.remove({_id: this._id});
    }
});

Template.FotosDeVehiculos4.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        //let empresaId = FlowRouter.getParam('empresaId');
        template.subscribe('FotosDeVehiculosPorEmpresa');

    });
});

Template.FotosDeVehiculos4.helpers({
    fotos() {
        return FotosDeVehiculos.find({'metadata.vehiculoId': this._id, 'metadata.tipo': 'foto4'});
    }
});

Template.FotosDeVehiculos4.events({
    'click .remove'(e) {
        $(e.currentTarget).parent().find("input[name='fotosubir']")[0].value = "";
        FotosDeVehiculos.remove({_id: this._id});
    }
});

Template.FotosDeVehiculos5.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        //let empresaId = FlowRouter.getParam('empresaId');
        template.subscribe('FotosDeVehiculosPorEmpresa');

    });
});

Template.FotosDeVehiculos5.helpers({
    fotos() {
        return FotosDeVehiculos.find({'metadata.vehiculoId': this._id, 'metadata.tipo': 'foto5'});
    }
});

Template.FotosDeVehiculos5.events({
    'click .remove'(e) {
        $(e.currentTarget).parent().find("input[name='fotosubir']")[0].value = "";
        FotosDeVehiculos.remove({_id: this._id});
    }
});

Template.FotosDeVehiculos6.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        //let empresaId = FlowRouter.getParam('empresaId');
        template.subscribe('FotosDeVehiculosPorEmpresa');

    });
});

Template.FotosDeVehiculos6.helpers({
    fotos() {
        return FotosDeVehiculos.find({'metadata.vehiculoId': this._id, 'metadata.tipo': 'foto6'});
    }
});

Template.FotosDeVehiculos6.events({
    'click .remove'(e) {
        $(e.currentTarget).parent().find("input[name='fotosubir']")[0].value = "";
        FotosDeVehiculos.remove({_id: this._id});
    }
});
