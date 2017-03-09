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

function crearProgramaciones(template) {
    if (template.totalVehicles.get() === null) {

        template.totalVehicles.set(Vehiculos.find({
                empresaId: Meteor.user().profile.empresaId,
                sancionActiva: {$not: true}
            }).count() / 2);

    }
    let fecha = new Date();
    let hoyEs = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"][fecha.getDay()];

    let plan_dia = Plan.findOne({rutaId: FlowRouter.getParam('rutaId')});

    if (plan_dia) {

        let id_rangos = plan_dia.plan[hoyEs];

        let plan_rangos = id_rangos.map(id=> {
            let ph = PlanesHorarios.findOne({_id: id});
            return {
                hora_inicio: ph.hi,
                hora_fin: ph.hf,
                frecuencia: ph.frecuencia
            };
        });

        let programacion_rangos = [];

        let index = 0;

        for (let i in plan_rangos) {
            let r = plan_rangos[i];
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
                if (index >= template.totalVehicles.get()) {
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

            programacion_rangos.push(group);

            if (index >= template.totalVehicles.get()) {
                break;
            }
        }

        template.planeamientoHoy.set(programacion_rangos);
    } else {
        template.planeamientoHoy.set(null);
    }
}


Template.NuevoPlaneamientoDelDiaVuelta.onCreated(() => {
    let template = Template.instance();

    template.planeamientoHoy = new ReactiveVar([]);
    template.totalVehicles = new ReactiveVar(null);

    template.autorun(() => {
        let empresaId = Meteor.user().profile.empresaId;
        template.subscribe('DetalleDeEmpresaPlaneamiento', empresaId);
        template.subscribe('VehiculosEmpresa', () => {
            template.subscribe('planes', false, function () {
                template.subscribe('PlanesHorarios2', false, function () {
                    crearProgramaciones(template);
                });
            });
        });
    })
});

Template.NuevoPlaneamientoDelDiaVuelta.onRendered(() => {
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


Template.NuevoPlaneamientoDelDiaVuelta.helpers({
    planeamientoHoy(){
        return Template.instance().planeamientoHoy.get();
    },
    matchVehicle(vehicleId, _id){
        return vehicleId === _id;
    }
});

Template.NuevoPlaneamientoDelDiaVuelta.events({
    'change .total_vehicles'(e, t){
        Template.instance().totalVehicles.set(parseInt(e.target.value));
        crearProgramaciones(Template.instance());
    },
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
                    despachado: false,
                    hora: h.time
                });
            });
        });

        let data = {
            empresaId: Meteor.user().profile.empresaId,
            rutaId: FlowRouter.getParam('rutaId'),
            createdAt: new Date(),
            dia: today,
            ida: false,
            programacion: programaciones
        };

        Meteor.call('crearProgramacionVehiculo', data, (err) => {
            if (err) {
                Bert.alert('Hubo un error, vuelva a intentarlo', 'danger')
            } else {
                FlowRouter.go('/');
                Bert.alert('Planeamiento de hoy agregado', 'success')
            }
        })
    }
});
