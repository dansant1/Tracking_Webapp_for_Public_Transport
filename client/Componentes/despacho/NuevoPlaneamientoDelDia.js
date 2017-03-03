Template.NuevoPlaneamientoDelDia.onCreated(() => {
    let template = Template.instance();

    template.planeamientoHoy = new ReactiveVar([]);

    template.vehiculos = new ReactiveVar([]);

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
    vehiculos() {
        return Template.instance().vehiculos.get();
    },
    planeamientoHoy(){
        return Template.instance().planeamientoHoy.get();
    },
    matchVehicle(vehicleId, _id){
        return vehicleId === _id;
    }
});

Template.NuevoPlaneamientoDelDia.events({
    'click .vehicle'(e, t){
        let {hours, minutes} = this;
        let planeamientoHoy = Template.instance().planeamientoHoy.get();

        let vehiculos = Vehiculos.find({empresaId: Meteor.user().profile.empresaId}).fetch().map(v=> {
            let nonAdmited = planeamientoHoy.filter(p=> {
                let time = hours * 60 + minutes;
                let before = p.hours * 60 + p.minutes <= time && p.hours * 60 + p.minutes > time - 2 * 60;
                let after = p.hours * 60 + p.minutes >= time && p.hours * 60 + p.minutes < time + 2 * 60;
                return before || after;
            }).map(p=>p.vehicleId);
            let disabled = nonAdmited.includes(v._id) ? true : false;
            return {...v, disabled};
        });
        Template.instance().vehiculos.set(vehiculos);
    },
    'change .vehicle'(e, t){
        let planeamientoHoy = Template.instance().planeamientoHoy.get();
        planeamientoHoy.forEach(p=> {
            if (p.time === this.time) {
                p.vehicleId = e.target.value != '?' ? e.target.value : null;
            }
        });
        Template.instance().planeamientoHoy.set(planeamientoHoy)
    },
    'click .guardar'(e, t) {
        let planeamientoHoy = Template.instance().planeamientoHoy.get();

        if (planeamientoHoy.some(p=>p.vehicleId === null)) {
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

        planeamientoHoy = planeamientoHoy.map(ph=> {
            return {
                vehiculoId: ph.vehicleId,
                empresaId: Meteor.user().profile.empresaId,
                rutaId: FlowRouter.getParam('rutaId'),
                despachado: false,
                hora: ph.time,
                dia: today,
                createdAt: new Date()
            };
        });

        Meteor.call('guardarPlaneamientoDeHoy', planeamientoHoy, (err) => {
            if (err) {
                Bert.alert('Hubo un error, vuelva a intentarlo', 'danger')
            } else {
                FlowRouter.go('/');
                Bert.alert('Planeamiento de hoy agregado', 'success')
            }
        })
    }
})
