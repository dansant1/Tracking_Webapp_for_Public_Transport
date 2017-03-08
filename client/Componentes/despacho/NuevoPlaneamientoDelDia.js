function addMinutes(time/*"hh:mm"*/, minsToAdd/*"N"*/) {
    function z(n) {
        return (n < 10 ? '0' : '') + n;
    }

    let bits = time.split(':');
    let mins = bits[0] * 60 + (+bits[1]) + (+minsToAdd);

    return z(mins % (24 * 60) / 60 | 0) + ':' + z(mins % 60);
}

function converToMinutes(time/*"hh:mm"*/) {
    return parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]);
}


Template.NuevoPlaneamientoDelDia.onCreated(() => {
    let template = Template.instance();

    template.planeamientoHoy = new ReactiveVar([]);

    template.autorun(() => {
        let empresaId = Meteor.user().profile.empresaId;
        template.subscribe('DetalleDeEmpresaPlaneamiento', empresaId);
        template.subscribe('VehiculosEmpresa', () => {
            template.subscribe('PlanHorarioPorRuta', FlowRouter.getParam('rutaId'), function () {

                let totalVehicles = Vehiculos.find({
                    empresaId: Meteor.user().profile.empresaId,
                    sancionActiva: {$not: true}
                }).count();

                let fecha = new Date();
                let hoyEs = fecha.getDay();

                let planHorario = PlanHorario.findOne({"dias": hoyEs});

                let rangos = [];

                let index = 0;

                for (let i in planHorario.rangos) {
                    let r = planHorario.rangos[i];
                    let hora = r.hora_inicio;
                    let minutosAlInicio = converToMinutes(r.hora_inicio);
                    let minutosAlFinal = converToMinutes(r.hora_fin);
                    let minutos = minutosAlInicio;

                    let group = {
                        hora_inicio: r.hora_inicio,
                        hora_fin: r.hora_fin,
                        frecuencia: r.frecuencia,
                        horas: []
                    };

                    group.horas.push({
                        time: hora,
                        vehicleId: null,
                        vehicles: []
                    });
                    index++;

                    while (minutos + r.frecuencia <= minutosAlFinal) {
                        if (index >= totalVehicles) {
                            break;
                        }
                        hora = addMinutes(hora, r.frecuencia);
                        group.horas.push({
                            time: hora,
                            vehicleId: null,
                            vehicles: []
                        });
                        index++;
                        minutos += r.frecuencia;
                    }

                    rangos.push(group);

                    if (index >= totalVehicles) {
                        break;
                    }
                }

                template.planeamientoHoy.set(rangos);
            });
        });
    })
});

Template.NuevoPlaneamientoDelDia.onRendered(() => {
    let template = Template.instance();

    template.autorun(() => {
        template.subscribe('VehiculosEmpresa', () => {

            if (Vehiculos.find().fetch().length > 0) {

                $(".js-example-basic").select2({
                    placeholder: "Asigna a una o más empresas a esta ruta",
                })

            }

        })
    })
})


Template.NuevoPlaneamientoDelDia.helpers({
    planeamientoHoy(){
        return Template.instance().planeamientoHoy.get();
    },
    matchVehicle(vehicleId, _id){
        return vehicleId === _id;
    }
});

Template.NuevoPlaneamientoDelDia.events({
    'click .vehicle'(e, t){
        let planeamientoHoy = Template.instance().planeamientoHoy.get();
        let hora = null;
        for (let i in planeamientoHoy) {
            let r = planeamientoHoy[i];
            for (let j in r.horas) {
                let h = r.horas[j];
                if (h.time === this.time) {
                    hora = h;
                    break;
                }
            }
        }
        let vehiculos = [];
        if (hora) {
            vehiculos = Vehiculos.find({
                empresaId: Meteor.user().profile.empresaId,
                sancionActiva: {$not: true}
            }).fetch().filter(v=> {
                return !planeamientoHoy.some(r=>r.horas.some(h=>h.vehicleId === v._id && h.time !== hora.time));
            });
            hora.vehicles = vehiculos;
        }
        Template.instance().planeamientoHoy.set(planeamientoHoy);
    },
    'change .vehicle'(e, t){
        let planeamientoHoy = Template.instance().planeamientoHoy.get();
        for (let i in planeamientoHoy) {
            let r = planeamientoHoy[i];
            for (let j in r.horas) {
                let h = r.horas[j];
                if (h.time === this.time) {
                    h.vehicleId = e.target.value != '?' ? e.target.value : null;
                    break;
                }
            }
        }
        Template.instance().planeamientoHoy.set(planeamientoHoy)
    },
    'click .guardar'(e, t) {
        let planeamientoHoy = Template.instance().planeamientoHoy.get();

        if (planeamientoHoy.some(r=>r.horas.some(h=>h.vehicleId === null))) {
            Bert.alert('Todas las horas deben tener asignadas un vehículo', 'danger');
            return;
        }
        let hoy = new Date();
        let dd = hoy.getDate();
        var mm = hoy.getMonth() + 1;
        let yyyy = hoy.getFullYear();
        dd = (dd < 10 ? '0' : '') + dd;
        mm = (mm < 10 ? '0' : '') + mm;
        var today = dd + '/' + mm + '/' + yyyy;

        let programaciones = [];

        planeamientoHoy = planeamientoHoy.forEach(r=> {
            return r.horas.forEach(h=> {
                programaciones.push({
                    vehiculoId: h.vehicleId,
                    empresaId: Meteor.user().profile.empresaId,
                    rutaId: FlowRouter.getParam('rutaId'),
                    despachado: false,
                    hora: h.time,
                    dia: today,
                    createdAt: new Date()
                });
            });
        });

        Meteor.call('crearProgramacionVehiculo', programaciones, (err) => {
            if (err) {
                Bert.alert('Hubo un error, vuelva a intentarlo', 'danger')
            } else {
                FlowRouter.go('/');
                Bert.alert('Planeamiento de hoy agregado', 'success')
            }
        })
    }
})
