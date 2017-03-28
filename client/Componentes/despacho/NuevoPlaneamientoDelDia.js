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

function cantidad (empresaId, cantidad) {
  return Vehiculos.find({
    empresaId: empresaId,
    sancionActiva: {$not: true}
  }).count() / cantidad;
}

Template.NuevoPlaneamientoDelDia.onCreated(() => {
    let template = Template.instance();

    template.planeamientoHoy = new ReactiveVar([]);
    template.totalVehicles = new ReactiveVar(null);
    template.programacion = new ReactiveVar();
    template.cantidadVehiculos = new ReactiveVar(2);
    template.vehiculos = new ReactiveVar([])
    template.empresaId = new ReactiveVar();

    template.autorun(() => {
          template.subscribe('rutas', () => {
            if (Roles.userIsInRole(Meteor.userId(), ['gerente'], 'Administracion')) {
              template.empresaId.set(Rutas.findOne({_id: FlowRouter.getParam('rutaId')}).empresasId);
            } else {
              template.empresaId.set(Meteor.user().profile.empresaId)
            }
          })

        template.subscribe('VehiculosEmpresa', () => {

          template.subscribe('ProgramacionHoy', true, function () {

            let programacion = crearProgramacion(cantidad(template.empresaId.get(), template.cantidadVehiculos.get()))
            template.programacion.set(programacion)
          });

        });
    })
});

Template.NuevoPlaneamientoDelDia.onRendered( () => {
  $(window).bind("beforeunload", function() {

    let r = confirm("Deseas salir de esta pagina, los cambios no se guardaran");

    if (r == true) {
      Meteor.call('vehiculosNoGuardado', template.empresaId.get(), (err) => {
        if (!err) {
          console.log('salio');
        }
      })

    }
  })

})

Template.NuevoPlaneamientoDelDia.onDestroyed( () => {
  let template = Template.instance()

    Meteor.call('vehiculosNoGuardado', template.empresaId.get(), (err) => {
      if (!err) {
        //console.log('salio');
      }
    })
})

Template.NuevoPlaneamientoDelDia.helpers({
    planeamientoHoy() {

        let programacion = Template.instance().programacion.get();
        if (programacion) {
          return programacion
        }

    },
    vehicles() {
      let vehiculos = Vehiculos.find({
        empresaId: Template.instance().empresaId.get(),
        sancionActiva: {$not: true}})

      if (vehiculos) {
        return vehiculos
      }
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
    'change .vehicle'(e, t) {


        Meteor.call('seleccionarVehiculo', $(e.target).val(), (err, res) => {
          if (err) {
            Bert.alert(err, 'danger')
          } else {

            if (res.disponible === false) {
              Bert.alert(res.mensaje, 'warning')
              $(e.target).val('?')
            }

          }
        })


    },
    'click .guardar'(e, t) {

        let planeamientoHoy = t.programacion.get();
        let programaciones = [];

        let permitido = true

        $( "li#programaciones" ).each(function( index ) {
            if ($(this).find('#v').val() === "?") {
              Bert.alert('Ingrese los datos de los vehiculos correctamente', 'warning')
              permitido = false
            }
              programaciones.push({
                  vehiculoId: $(this).find('#v').val(),
                  despachado: false,
                  hora:  $(this).find('#h').html()
              });


        });


        if (permitido === true) {
          let data = {
              empresaId: t.empresaId.get(),
              rutaId: FlowRouter.getParam('rutaId'),
              createdAt: new Date(),
              dia: hoy(),
              ida: true,
              programacion: programaciones
          }

          console.log(data);

          Meteor.call('crearProgramacionVehiculo', data, (err) => {
              if (err) {
                  Bert.alert('Hubo un error, vuelva a intentarlo', 'danger')
              } else {
                  FlowRouter.go('/');
                  Bert.alert('Planeamiento de hoy agregado', 'success')
              }
          })
        }






    }
});
