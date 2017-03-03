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
                    vehicleId: null
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
        let planeamientoHoy = Template.instance().planeamientoHoy.get();

        return Vehiculos.find({empresaId: Meteor.user().profile.empresaId}).fetch().filter(v=> {
            let nonAdmited = planeamientoHoy.filter(p=> {
                let time = hours * 60 + minutes;
                return p.hours * 60 + p.minutes < time && p.hours * 60 + p.minutes > time - 2 * 60; // TODO: just two hours to make available a vehicle again
            }).map(p=>p.vehicleId);
            return !nonAdmited.includes(v._id);
        });
    },
    planeamientoHoy(){
        return Template.instance().planeamientoHoy.get();
    },
    matchVehicle(vehicle, _id){
        return vehicle && vehicle._id === _id;
    }
});

Template.NuevoPlaneamientoDelDia.events({
    'change .vehicle'(e, t){
        let planeamientoHoy = Template.instance().planeamientoHoy.get();
        planeamientoHoy.forEach(p=> {
            if (p.time === this.time) {
                p.vehicleId = e.target.value
            }
        });
        Template.instance().planeamientoHoy.set(planeamientoHoy)
    },
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
