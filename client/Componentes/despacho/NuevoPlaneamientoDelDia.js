Template.NuevoPlaneamientoDelDia.onCreated(() => {
    let template = Template.instance();

    template.planeamientoHoy = new ReactiveVar([]);

    template.autorun(() => {
        let empresaId = Meteor.user().profile.empresaId;
        template.subscribe('DetalleDeEmpresaPlaneamiento', empresaId);
        template.subscribe('Planeamientos', function () {
            let fecha = new Date();
            let hoyEs = fecha.getDay();

            let planeamientos = Planeamiento.find({"plan.rutaId": FlowRouter.getParam('rutaId')}).fetch();
            let horas = [];

            if (planeamientos.length > 0) {
                let planeamiento = planeamientos[0];
                if (hoyEs === 1) {
                    horas = planeamiento.plan.horas.lunes;
                } else if (hoyEs === 2) {
                    horas = planeamiento.plan.horas.martes;
                } else if (hoyEs === 3) {
                    horas = planeamiento.plan.horas.miercoles;
                } else if (hoyEs === 4) {
                    horas = planeamiento.plan.horas.jueves;
                } else if (hoyEs === 5) {
                    horas = planeamiento.plan.horas.viernes;
                } else if (hoyEs === 6) {
                    horas = planeamiento.plan.horas.sabado;
                } else if (hoyEs === 0) {
                    horas = planeamiento.plan.horas.domingo;
                }
            }

            let planeamientoHoy = [];

            horas.forEach(hora=> {
                let separator = hora.search(":");
                planeamientoHoy.push({
                    time: hora,
                    hours: parseInt(hora.substring(0, separator)),
                    minutes: parseInt(hora.substring(separator + 1)),
                    vehicle: null
                });
            });
            template.planeamientoHoy.set(planeamientoHoy);
        });
    })
});

Template.NuevoPlaneamientoDelDia.onRendered(() => {
    let template = Template.instance();

    template.autorun(() => {
        let empresaId = Meteor.user().profile.empresaId;
        template.subscribe('VehiculosEmpresa', empresaId, () => {

            if (Vehiculos.find().fetch().length > 0) {

                $(".js-example-basic").select2({
                    placeholder: "Asigna a una o más empresas a esta ruta",
                })

            }

        })
    })
})


Template.NuevoPlaneamientoDelDia.helpers({
    vehiculos(hours, minutes) {
        // TODO: constraint by time, each road needs an estimated time
        return Vehiculos.find();
    },
    planeamientoHoy(){
        return Template.instance().planeamientoHoy.get();
    },
    matchVehicle(vehicle, _id){
        return vehicle && vehicle._id === _id;
    }
});

Template.NuevoPlaneamientoDelDia.events({
    'click .guardar'(e, t) {
        let datos = [];

        $('li.planeamiento').each(function (index, obj) {

            if ($(obj).find('.vehicle').val() !== '0') {
                let vehiculo = $(obj).find('.vehicle').val();
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
                let hora = $(obj).find('span.hour').text();

                if (vehiculo !== null) {
                    let registro = {
                        vehiculoId: vehiculo,
                        empresaId: Meteor.user().profile.empresaId,
                        rutaId: FlowRouter.getParam('rutaId'),
                        despachado: false,
                        hora: hora,
                        dia: today,
                        createdAt: new Date()
                    }
                    datos.push(registro)


                }

            }

        });

        Meteor.call('guardarPlaneamientoDeHoy', datos, (err) => {
            if (err) {
                Bert.alert('Hubo un error, vuelva a intentarlo', 'danger')
            } else {
                FlowRouter.go('/')
                Bert.alert('Planeamiento de hoy agregado', 'success')
            }
        })
    }
})
