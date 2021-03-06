import {handleFile, SubirFotoVehiculo, SubirFotoConductor, SubirFotoCobrador} from '../Utilities/archivos'

Template.Empresas.onCreated(() => {
    let template = Template.instance();

    template.searchQuery = new ReactiveVar();
    template.searching = new ReactiveVar(false);
    template.rutaId = new ReactiveVar(false);

    template.autorun(() => {

        template.subscribe('BuscaadorDeEmpresas', template.searchQuery.get(), () => {
            setTimeout(() => {
                template.searching.set(false);
            }, 300);
        });

        template.subscribe('rutas');
    });
});

Template.Empresas.onRendered(() => {
  this.$('.tooltipped').tooltip()
})

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
    rutas( empresaId ) {
        return Rutas.find({ empresaId: empresaId });
    },
    rutaId(){
        return Template.instance().rutaId.get();
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
    'click .editar-empresa'() {
      Session.set('datos_empresa', this._id)
      Modal.show('EditarEmpresa')
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
    'change .ruta'(e,t){
      t.rutaId.set( e.currentTarget.value );
      console.log('.e' + this._id);
      //$('.e' + this._id).css( "background", 'red' );
    }

});

Template.ListaDeVehiculosPorEmpresas.onCreated(() => {
    let template = Template.instance();

    template.searchQuery = new ReactiveVar();
    template.searching = new ReactiveVar(false);

    template.empresaId = new ReactiveVar(null)

    let rutaId = FlowRouter.getParam('rutaId');

    template.subscribe("rutaSingle", rutaId );

    Session.set('editarVehiculo', null);



    template.autorun(() => {
        let empresaId = FlowRouter.getParam('empresaId');

        if (empresaId === undefined) {
          empresaId = template.empresaId.get()
        }

        template.subscribe('VehiculosPorEmpresa2', empresaId, template.searchQuery.get(), () => {
            setTimeout(() => {
                template.searching.set(false);
            }, 300);
        });
        template.subscribe('rutasPorEmpresa', empresaId, () => {
            setTimeout(() => {
                template.searching.set(false);
            }, 300);
        });

        template.subscribe('Empresas')
    });
});

Template.ListaDeVehiculosPorEmpresas.helpers({
    empresas() {
      return Empresas.find({})
    },
    searching() {
        return Template.instance().searching.get();
    },
    query() {
        return Template.instance().searchQuery.get();
    },
    ruta() {
        let rutaId = FlowRouter.getParam('rutaId');
        if (rutaId === undefined) {
          rutaId = null;
          //return Rutas.findOne({ _id: rutaId });
        }
        return Rutas.findOne({ _id: rutaId });
    },
    hayRuta() {
      if (FlowRouter.getParam('rutaId') === undefined) {
        return false
      } else {
        return true;
      }
    },
    vehiculo: function () {
        let empresaId = FlowRouter.getParam('empresaId');
        if (empresaId === undefined) {
          empresaId = Template.instance().empresaId.get()

          return Vehiculos.find({});
        }

        //console.log(Vehiculos.find().fetch());
        return Vehiculos.find({empresaId: empresaId});
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
    'click [name="borrar_vehiculos"]'() {
      if ($("[name='empresa']").val() !== "0") {
        swal({
          title: "Seguro que deseas eliminar",
          text: "Los datos se borraran",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Si, borrar todo",
          closeOnConfirm: false
        },
        function(){
          Meteor.call('eliminarVehiculosEmpresa', $("[name='empresa']").val(), (err) => {
            if (err) {
              Bert.alert(err, 'danger')
              swal("Error", "Hubo un error.", "success");
            } else {
              swal("Eliminado", "Los datos se eliminaron.", "success");
              Bert.alert('Vehiculos Elininados', 'success')
            }
          })
        });

      } else {
        Bert.alert('Seleccione una Empresa', 'warning')
      }
    },
    'click .printVehicle'(event, template) {

        //console.log($(event.target).parent().find('a img')[0].src);
        var windowUrl = 'MyPage.aspx';
        var uniqueName = new Date();
        var windowName = "MyPage" + uniqueName.getTime();
        console.log($('.imprimir' + this._id).attr('href'));
        var printWindow = window.open(windowUrl, windowName, 'location=1,status=1,scrollbars=1,width=800,height=600');

        printWindow.document.write("<div style='width:100%;text-align: center;'>");
        printWindow.document.write("<img id='img' style='max-width: 100%' src='" + $('.imprimir' + this._id).attr('href') + "'/>");
        printWindow.document.write("</div>");

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        return false;
    },
    'click .print_pdf'() {
      let getMyFrame = document.getElementById('print' + this._id);
      getMyFrame.focus();
      getMyFrame.contentWindow.print();
    },
    'change #routeVehicle' (event, template) {
        let value = event.currentTarget.value;
        template.searchQuery.set(value);
        template.searching.set(true);
    },
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
    'change .fotovehiculo1'(e, t) {
        SubirFotoVehiculo(e, t, this._id, 'foto', 'fotovehiculo1');
    },
    'change .fotovehiculo2'(e, t) {
        SubirFotoVehiculo(e, t, this._id, 'foto2', 'fotovehiculo2');
    },
    'change .fotovehiculo3'(e, t) {
        SubirFotoVehiculo(e, t, this._id, 'foto3', 'fotovehiculo3');
    },
    'change .fotovehiculo4'(e, t) {
        SubirFotoVehiculo(e, t, this._id, 'foto4', 'fotovehiculo4');
    },
    'change .fotovehiculo5'(e, t) {
        SubirFotoVehiculo(e, t, this._id, 'foto5', 'fotovehiculo5');
    },
    'change .fotovehiculo6'(e, t) {
        SubirFotoVehiculo(e, t, this._id, 'foto6', 'fotovehiculo6');
    },
    'change .vehiculo-activo'(e, t) {
        if ($("#sw" + this._id).is(':checked')) {
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
        let rutaId =  FlowRouter.getParam('rutaId');
        template.subscribe('Empresas')
        template.subscribe('ConductoresPorEmpresa', rutaId, template.searchQuery.get(), () => {
            setTimeout(() => {
                template.searching.set(false);
            }, 300);
        });
    });
});

Template.ListaDeConductoresPorEmpresa.helpers({
    empresas() {
      return Empresas.find()
    },
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

            if (empresaId === undefined) {
              return Conductores.find();
            } else {
              return Conductores.find({empresaId: empresaId});

            }

        }

    }
});

Template.ListaDeConductoresPorEmpresa.events({
    'click [name="borrar_conductores"]'() {
      if ($("[name='empresa']").val() !== "0") {
        swal({
          title: "Seguro que deseas eliminar",
          text: "Los datos se borraran",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Si, borrar todo",
          closeOnConfirm: false
        },
        function() {
          Meteor.call('eliminarConductoresEmpresa', $("[name='empresa']").val(), (err) => {
            if (err) {
              Bert.alert(err, 'danger')
              swal("Error", "Hubo un error.", "success");
            } else {
              Bert.alert('Conductores Elininados', 'success')
              swal("Eliminado", "Los datos se eliminaron.", "success");
            }
          })

        });

      } else {
        Bert.alert('Seleccione una Empresa', 'warning')
      }
    },
    'click [name="ver_datos_mtc"]'() {
      Meteor.call('infracciones_conductores_mtc', this._id, (err, res) => {
        if (err) {
          alert(err)
        } else {
          console.log(res);
        }
      })
    },
    'click .printDriver'(event, template) {
        var windowUrl = 'MyPage.aspx';
        var uniqueName = new Date();
        var windowName = "MyPage" + uniqueName.getTime();

        var printWindow = window.open(windowUrl, windowName, 'location=1,status=1,scrollbars=1,width=800,height=600');

        printWindow.document.write("<div style='width:100%;text-align: center;'>");
        printWindow.document.write("<img id='img' style='max-width: 100%' src='" + $(event.currentTarget).parent().find('a img')[0].src + "'/>");
        printWindow.document.write("</div>");

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        return false;
    },
    'click .print_pdf'() {
      let getMyFrame = document.getElementById('print' + this._id);
      getMyFrame.focus();
      getMyFrame.contentWindow.print();
    },
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
    'change .fotoconductor1'(e, t) {
        console.log('hola');
        SubirFotoConductor(e, t, this._id, 'fotoconductor1', 1);
    },
    'change .fotoconductor2'(e, t) {
        SubirFotoConductor(e, t, this._id, 'fotoconductor2', 2);
    },
    'change .fotoconductor3'(e, t) {
        SubirFotoConductor(e, t, this._id, 'fotoconductor3', 3);
    },
    'change .fotoconductor4'(e, t) {
        SubirFotoConductor(e, t, this._id, 'fotoconductor4', 4);
    }
});

Template.ListaDeCobradoresPorEmpresa.onCreated(() => {
    let template = Template.instance();

    template.searchQuery = new ReactiveVar();
    template.searching = new ReactiveVar(false);
    template.rutaId = new ReactiveVar(undefined)

    Session.set('editarCobrador', null);

    template.autorun(() => {
        let empresaId = FlowRouter.getParam('empresaId');
        let rutaId =  FlowRouter.getParam('rutaId');

        template.subscribe('Empresas')
        template.subscribe('CobradoresPorEmpresa', rutaId, template.searchQuery.get(), () => {
            setTimeout(() => {
                template.searching.set(false);
            }, 300);
        });
        template.subscribe('rutasPorEmpresa', empresaId, () => {
            setTimeout(() => {
                template.searching.set(false);
            }, 300);
        });
    });
});

Template.ListaDeCobradoresPorEmpresa.helpers({
    empresas() {
      return Empresas.find()
    },
    searching() {
        return Template.instance().searching.get();
    },
    ruta() {
        let empresaId = FlowRouter.getParam('empresaId');
        return Rutas.find({empresasId: empresaId});
    },
    query() {
        return Template.instance().searchQuery.get();
    },
    cobradores: function () {
        let vehiculos = Cobradores.find();

        if (vehiculos) {
            let empresaId = FlowRouter.getParam('empresaId');

            if (empresaId === undefined) {
              return Cobradores.find();
            } else {
              return Cobradores.find({empresaId: empresaId});
            }

        }

    }
});

Template.ListaDeCobradoresPorEmpresa.events({
    'click [name="borrar_cobradores"]'() {

      if ($("[name='empresa2']").val() !== "0") {
        swal({
          title: "Seguro que deseas eliminar",
          text: "Los datos se borraran",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Si, borrar todo",
          closeOnConfirm: false
        },
        function() {
          Meteor.call('eliminarCobradoresEmpresa', $("[name='empresa2']").val(), (err) => {
            if (err) {
              Bert.alert(err, 'danger')
              swal("Error", "Hubo un error.", "success");
            } else {
              Bert.alert('Cobradores Elininados', 'success')
              swal("Eliminado", "Los datos se eliminaron.", "success");
            }
          })
          
        });

      } else {
        Bert.alert('Seleccione una Empresa', 'warning')
      }
    },
    'click .printCollector'(event, template) {
        var windowUrl = 'MyPage.aspx';
        var uniqueName = new Date();
        var windowName = "MyPage" + uniqueName.getTime();

        var printWindow = window.open(windowUrl, windowName, 'location=1,status=1,scrollbars=1,width=800,height=600');

        printWindow.document.write("<div style='width:100%;text-align: center;'>");
        printWindow.document.write("<img id='img' style='max-width: 100%' src='" + $(event.currentTarget).parent().find('a img')[0].src + "'/>");
        printWindow.document.write("</div>");

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        return false;
    },
    'click .print_pdf'() {
      let getMyFrame = document.getElementById('print' + this._id);
      getMyFrame.focus();
      getMyFrame.contentWindow.print();
    },
    'change #routeCollector' (event, template) {
        let value = event.currentTarget.value;
        template.searchQuery.set(value);
        template.searching.set(true);
    },
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
    'change .fotocobrador1'(e, t) {
        console.log('holaaadsdr443');
        SubirFotoCobrador(e, t, this._id, 'fotocobrador1', 1);
    },
    'change .fotocobrador2'(e, t) {
        SubirFotoCobrador(e, t, this._id, 'fotocobrador2', 2);
    },
    'change .fotocobrador3'(e, t) {
        SubirFotoCobrador(e, t, this._id, 'fotocobrador3', 3);
    },
    'change .fotocobrador4'(e, t) {
        SubirFotoCobrador(e, t, this._id, 'fotocobrador4', 4);
    }
});

Template.EditarVehiculo.onCreated(() => {

    let template = Template.instance();

    template.autorun(() => {

        let vehiculo = Session.get('editarVehiculo');

        template.subscribe('DetalleDeVehiculos', vehiculo);
        template.subscribe('Entidades');

    });

});

Template.EditarVehiculo.helpers({
    vehiculo() {
        let vehiculo = Session.get('editarVehiculo');
        return Vehiculos.findOne({_id: vehiculo});
    },
    entidades() {
        return Entidades.find({});
    },
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
            TC: [],
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

        let entityArray = [];

        let listedEntities = $('#editarVehiculo .Entity__toggle');

        for (var i = 0; i < listedEntities.length; i++) {
            let entity = $( listedEntities[i] );

            if ( entity.find(".select__entity:checked").length > 0 ){
              let data = {
                  entidad: entity.data('name'),
                  numero: entity.find("input[name='tc']")[0].value,
                  emision: entity.find("input[name='emisiontc']")[0].value,
                  caducidad: entity.find("input[name='caducidadtc']")[0].value,
              };
              entityArray.push(data);
            }
        }

        datos.TC = entityArray;

        console.log( entityArray );

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
    template.empresaId = new ReactiveVar(undefined)
    template.autorun(() => {

        if (FlowRouter.getParam('empresaId') === undefined) {
          template.empresaId.set(Session.get('datos_empresa'))
        } else {
          template.empresaId.set(FlowRouter.getParam('empresaId'))
        }

        template.subscribe('DetalleDeEmpresa', template.empresaId.get());
        template.subscribe('listas')

    });

});

Template.EditarEmpresa.helpers({
    empresa() {
        return Empresas.findOne({_id: Template.instance().empresaId.get()});
    },
    listas() {
      return Listas.find();
    },
    select() {

      if ($('.' + this._id).val() === this._id) {
        return 'selected'
      } else {
        return ''
      }
    },
    fecha(fecha) {

      if (fecha) {

        var date = fecha;
        var d  = new Date(date.split("/").reverse().join("-"));

        var dd = d.getDate();
        var mm = d.getMonth()+1;

        if (mm <= 9) {
          mm = '0' + mm
        }

        if (dd <= 9) {
          dd = '0' + dd
        }

        var yy = d.getFullYear();
        var newdate = yy + "-" + mm + "-" + dd;
          console.log(newdate);
        return newdate
      }

    }
});

Template.EditarEmpresa.events({
    'click .guardar'(e, t) {
        e.preventDefault()
        let re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        let datos = {
            nombre: t.find("[name='nombre']").value,
            ruc: t.find("[name='ruc']").value,
            domicilio: t.find("[name='domicilio']").value,
            representante: t.find("[name='representante']").value,
            telefono: t.find("[name='telefono']").value,
            movil: t.find("[name='movil']").value,
            fecha_inicio: t.find("[name='fecha_inicio']").value,
            email: t.find("[name='email']").value
        };

        if (datos.nombre !== "" && datos.fecha_inicio && datos.ruc !== "" && datos.domicilio !== "" && datos.representante !== "" && datos.telefono !== "" && datos.movil !== "" && re.test(t.find("[name='email']").value)) {
            Meteor.call('editarEmpresa', datos, t.empresaId.get(), (err) => {
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
    'change .subirFlota2'(e, t) {
        let id = 'subirFlota' + this._id;
        let empresasId = this._id;
        let rutaId = $("#listarutas" + this._id).val();
        console.log(rutaId);
        console.log(id);
        Session.set('filtroRuta', rutaId);

        if (rutaId === '1') {
            Bert.alert('Seleccione una ruta', 'success');
        } else {
            handleFile(e, id, empresasId, rutaId);

        }

    },
    'change .listarutas'() {
        let rutaId = $("#listarutas").val();
        Session.set('filtroRuta', rutaId);
    }
});

Template.agregarEmpresa.onCreated(() => {

  let template = Template.instance()

  template.autorun( () => {
    template.subscribe('listas')
    template.subscribe('Entidades')
  })

})

Template.agregarEmpresa.helpers({
  listas() {
    return Listas.find();
  },
  entidades() {
    return Entidades.find()
  }
})

Template.agregarEmpresa.events({
    'click [name="agregar_entidad"]'() {
      $( ".ae" ).remove();
      $( "#entidades_container" ).append( $( '<br><br><input type="text" name="nombre_entidad" style="width: 165px; margin-left: 110px;margin-right: 5px" placeholder="Nombre de Entidad"  class="form-control" id="entidades"><button type="button" class="btn btn-primary agregar_entidad">Agregar</button>' ) );
    },
    'click .agregar_entidad'(e, t) {
      var datos = {
          nombre: t.find('[name="nombre_entidad"]').value
      }

      if (datos.nombre != "") {
          Meteor.call('agregarEntidad', datos, (err) => {
              if (err) {
                Bert.alert('Hubo un error', 'danger')
                t.find('[name="nombre_entidad"]').value = ""
              } else {
                t.find('[name="nombre_entidad"]').value = ""
                Bert.alert('Entidad Agregada', 'success')
              }
          })
      } else {
          Bert.alert('Ingrese el nombre de la entidad', 'warning')
      }
    },
    'submit form'(e, t) {
        e.preventDefault();
        let re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        let datos = {
            nombre: t.find("[name='nombre']").value,
            ruc: t.find("[name='ruc']").value,
            domicilio: t.find("[name='domicilio']").value,
            representante: t.find("[name='representante']").value,
            telefono: t.find("[name='telefono']").value,
            movil: t.find("[name='movil']").value,
            fecha_inicio: t.find("[name='fecha_inicio']").value,
            email: t.find("[name='email']").value,
            plan: $('#plan').val(),
            entidadId: $('#entidad').val()
        };

        datos.telefono = $('[name="codigo_provincia"]').val() +  datos.telefono
        //console.log(datos.fecha_inicio);

        let parts = datos.fecha_inicio.split("-");

        datos.fecha_inicio = parts[2] + '/' + parts[1] + '/' + parts[0];

        if (datos.entidadId === "0") {
          Bert.alert('Seleccione o agregue una entidad')
          return;
        }

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
    console.log( );

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
    },
    empresaId(){
      return FlowRouter.getParam('empresaId');
    },
    rutaId(){
      return FlowRouter.getParam('rutaId');
    }
});

Template.DetalleDeEmpresa.events({
    'click .edit'() {
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
        } else if (r === "22" ) {
            rol = 22;
        } else {
          rol = 4
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
