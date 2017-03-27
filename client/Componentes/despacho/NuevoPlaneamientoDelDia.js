import { time, hoy } from '../../Utilities/Horas';

function crearProgramacion (rango) {

  let programacion = Plan.find({dia: hoy(), ida: true, rutaId: FlowRouter.getParam('rutaId')}).fetch()[0].programacion

  let rangos = [];

  if (programacion) {
    programacion.forEach( p => {
      let rango = time(p.hi, p.hf, p.frecuencia);
      rangos.push(rango);
    })
  }

  let programacion_rangos = [];
  rangos.map( r => {
      programacion_rangos = _.union(programacion_rangos, r)
  })



  return programacion_rangos.slice(0, rango);


}

function addMinutes(time, minsToAdd) {
    function z(n) {
        return (n < 10 ? '0' : '') + n;
    }

    let bits = time.split(':');
    let mins = bits[0] * 60 + (+bits[1]) + (+minsToAdd);

    return z(mins % (24 * 60) / 60 | 0) + ':' + z(mins % 60);
}

function converToMinutes(time) {
    return parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]);
}

function crearProgramaciones(template) {
    if (template.totalVehicles.get() === null) {
      let empresaId;
      if (Roles.userIsInRole(Meteor.userId(), ['gerente'], 'Administracion')) {
        empresaId = Rutas.findOne({_id: FlowRouter.getParam('rutaId')}).empresasId;
      } else {
        empresaId = Meteor.user().profile.empresaId;
      }

      template.totalVehicles.set(Vehiculos.find({
        empresaId: empresaId,
        sancionActiva: {$not: true}
      }).count() / 2);

    }


    let plan_dia = Plan.findOne({dia: hoy(), ida: true, rutaId: FlowRouter.getParam('rutaId')});
    let plan_rangos;
    let programacion_rangos = [];
    let index = 0;

    if (plan_dia) {

        plan_rangos = plan_dia.programacion.map( p => {
            return {
              hora_inicio: p.hi,
              hora_fin: p.hf,
              frecuencia: p.frecuencia
            }
        })

        console.log('Rangos: ', plan_rangos);
        let i = 0;

        for (i in plan_rangos) {

            let r = plan_rangos[i];
            console.log(r);
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

            console.log('primero grupo: ', group.horas);

            group.horas.push({
                time: hora,
                vehicleId: null,
                vehicles: []
            });

            index++;


            let suma = minutos + parseInt(r.frecuencia)

            suma = parseInt(suma)

            minutosAlFinal = parseInt(minutosAlFinal)

            while (suma <= minutosAlFinal) {

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
                //console.log('Horas reales: ', group.horas);
            }

            programacion_rangos.push(group);

            if (index >= template.totalVehicles.get()) {
                console.log('BREAK');
                break;
            }
        }

        template.planeamientoHoy.set(programacion_rangos);

    } else {

        template.planeamientoHoy.set(null);

    }
}



Template.NuevoPlaneamientoDelDia.onCreated(() => {
    let template = Template.instance();

    template.planeamientoHoy = new ReactiveVar([]);
    template.totalVehicles = new ReactiveVar(null);
    template.programacion = new ReactiveVar();
    template.cantidadVehiculos = new ReactiveVar(2);
    template.empresaId = new ReactiveVar();
    template.autorun(() => {
          template.subscribe('rutas', () => {

          if (Roles.userIsInRole(Meteor.userId(), ['gerente'], 'Administracion')) {

            template.empresaId.set(Rutas.findOne({_id: FlowRouter.getParam('rutaId')}).empresasId);
          } else {

            template.empresaId.set(Meteor.user().profile.empresaId)
          }
        })


        // template.subscribe('DetalleDeEmpresaPlaneamiento', empresaId);
        template.subscribe('VehiculosEmpresa', () => {

          template.subscribe('ProgramacionHoy', true, function () {
            let cantidad = Vehiculos.find({
              empresaId: template.empresaId.get(),
              sancionActiva: {$not: true}
            }).count() / template.cantidadVehiculos.get();
            let programacion = crearProgramacion(cantidad)
            template.programacion.set(programacion)
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
    planeamientoHoy() {

        let programacion = Template.instance().programacion.get();
        if (programacion) {
          return programacion
        }


    },
    matchVehicle(vehicleId, _id){
        return vehicleId === _id;
    },
    vehicles() {
      return Vehiculos.find({
        empresaId: Template.instance().empresaId.get(),
        sancionActiva: {$not: true}})
    },
    maximoVehiculos() {
      let cantidad = Vehiculos.find({
        empresaId: Template.instance().empresaId.get(),
        sancionActiva: {$not: true}
      }).count() / Template.instance().cantidadVehiculos.get();

      if (cantidad) {
        return cantidad;
      }
    }
});

Template.NuevoPlaneamientoDelDia.events({
    'change .total_vehicles'(e, t){

        if (e.target.value > 0) {
          t.cantidadVehiculos.set(parseInt(e.target.value));
          let programacion = crearProgramacion(t.cantidadVehiculos.get())
          t.programacion.set(programacion)
        } else {
          let cantidad = Vehiculos.find({
            empresaId: Template.instance().empresaId.get(),
            sancionActiva: {$not: true}
          }).count() / 2;
          let programacion = crearProgramacion(cantidad)
          t.programacion.set(programacion)
        }

    },
    'keyup .total_vehicles'(e, t){

        if (e.target.value > 0) {
          t.cantidadVehiculos.set(parseInt(e.target.value));
          let programacion = crearProgramacion(t.cantidadVehiculos.get())
          t.programacion.set(programacion)
        } else {
          let cantidad = Vehiculos.find({
            empresaId: Template.instance().empresaId.get(),
            sancionActiva: {$not: true}
          }).count() / 2;
          let programacion = crearProgramacion(cantidad)
          t.programacion.set(programacion)
        }
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
          let empresaId;
          if (Roles.userIsInRole(Meteor.userId(), ['gerente'], 'Administracion')) {
            console.log(empresaId);
            empresaId = Rutas.findOne({_id: FlowRouter.getParam('rutaId')}).empresasId;
          } else {
            console.log('holaaa');
            empresaId = Meteor.user().profile.empresaId;
          }
            vehiculos = Vehiculos.find({
                empresaId: empresaId,
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

        let planeamientoHoy = Template.instance().programacion.get();
        let programaciones = [];

        if (planeamientoHoy.some(r => r.horas.some( h => h.vehicleId === null ) ) ) {
            Bert.alert('Todas las horas deben tener asignadas un vehículo', 'danger');
            return;
        }

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
            empresaId: t.empresaId.get(),
            rutaId: FlowRouter.getParam('rutaId'),
            createdAt: new Date(),
            dia: hoy(),
            ida: true,
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
