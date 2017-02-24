Template.AgregarVehiculo.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        template.subscribe('rutas');
        template.subscribe('Entidades');
    });
});

Template.AgregarVehiculo.helpers({
    entidades() {
        return Entidades.find({});
    },
    rutas() {
        return Rutas.find();
    }
});

Template.AgregarVehiculo.events({
    'click .guardar'(e, t) {

        var entidades = Entidades.find();
        var entityArray = [];
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
            rutaId: $('#listaruta').val(),
            codigoDeRuta: Rutas.find({_id: $('#listaruta').val()}).nombre,
            fechaDePermanenciaEnLaEmpresa: t.find("[name='fechaDePermanenciaEnLaEmpresa']").value,
            TC: [],
            SOAT: {
                numero: t.find("[name='soat']").value,
                inicio: t.find("[name='emisionsoat']").value,
                fin: t.find("[name='caducidadsoat']").value,
                aseguradora: t.find("[name='aseguradorasoat']").value
            },
            CITV: {
                numero: t.find("[name='rt']").value,
                inicio: t.find("[name='emisionrt']").value,
                fin: t.find("[name='caducidadrt']").value,
                entidad: t.find("[name='entidadrt']").value
            },
            RC: {
                numero: t.find("[name='rc']").value,
                inicio: t.find("[name='emisionrc']").value,
                fin: t.find("[name='caducidadrc']").value,
                aseguradora: t.find("[name='aseguradorarc']").value
            },
            padron: t.find("[name='padron']").value,
            createdAt: new Date(),

            empresaId: FlowRouter.getParam('empresaId')
        };

        for (var i = 0; i < $('.select__entity').length; i++) {
            if ($('.select__entity')[i].checked == true) {
                var entityId = $('.select__entity')[i].value;
                var block = $('#'+entityId)[0];
                var data = {
                    numero: $(block).find("input[name='tc']")[0].value,
                    emision: $(block).find("input[name='emisiontc']")[0].value,
                    caducidad: $(block).find("input[name='caducidadtc']")[0].value
                };
                entidades.forEach(entidad=> {
                    if(entidad._id == entityId) {
                        data.entidad = entidad.nombre;
                    }
                });
                entityArray.push(data);
            }
        }
        datos.TC = entityArray;

        if (datos.placa !== "") {
            Meteor.call('agregarVehiculo', datos, function (err) {
                if (err) {
                    alert(err);
                } else {
                    Modal.hide('AgregarVehiculo');
                    swal("¡Listo!", "El vehículo ha sido agregado.", "success");
                }
            });
        }

    }
});


Template.AgregarVehiculoBorrador.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        template.subscribe('rutas');
    });
});

Template.AgregarVehiculoBorrador.helpers({
    rutas() {
        return Rutas.find();
    }
});

Template.AgregarVehiculoBorrador.events({
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
            compania: t.find("[name='compania']").value,
            rutaId: $('#listaruta').val(),
            codigoDeRuta: Rutas.find({_id: $('#listaruta').val()}).nombre,
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
            aseguradora: t.find("[name='aseguradora']").value,
            RC: {
                numero: t.find("[name='rc']").value,
                inicio: t.find("[name='emisionrc']").value,
                fin: t.find("[name='caducidadrc']").value
            },
            TCH: {
                numero: t.find("[name='tch']").value,
                emision: t.find("[name='emisiontch']").value,
                caducidad: t.find("[name='caducidadtch']").value
            },
            padron: t.find("[name='padron']").value,
            createdAt: new Date(),

            empresaId: Meteor.user().profile.empresaId
        }

        if (datos.placa !== "") {
            Meteor.call('agregarVehiculoBorrador', datos, function (err) {
                if (err) {
                    alert(err);
                } else {
                    Modal.hide('AgregarVehiculoBorrador');
                    swal("¡Listo!", "El vehículo ha sido enviado al director para su aprobacion", "success");
                }
            });
        }

    }
});

Template.AgregarVehiculo1.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        template.subscribe('rutas');
    });
});

Template.AgregarVehiculo1.helpers({
    rutas() {
        return Rutas.find();
    }
});

Template.AgregarVehiculo1.events({
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
            compania: t.find("[name='compania']").value,
            rutaId: $('#listaruta').val(),
            codigoDeRuta: Rutas.find({_id: $('#listaruta').val()}).nombre,
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
            aseguradora: t.find("[name='aseguradora']").value,
            RC: {
                numero: t.find("[name='rc']").value,
                inicio: t.find("[name='emisionrc']").value,
                fin: t.find("[name='caducidadrc']").value
            },
            TCH: {
                numero: t.find("[name='tch']").value,
                emision: t.find("[name='emisiontch']").value,
                caducidad: t.find("[name='caducidadtch']").value
            },
            padron: t.find("[name='padron']").value,
            createdAt: new Date(),

            empresaId: Meteor.user().profile.empresaId
        }

        if (datos.placa !== "") {
            Meteor.call('agregarVehiculo', datos, function (err) {
                if (err) {
                    alert(err);
                } else {
                    Modal.hide('AgregarVehiculo1');
                    swal("¡Listo!", "El vehículo ha sido agregado.", "success");
                }
            });
        }

    }
});
