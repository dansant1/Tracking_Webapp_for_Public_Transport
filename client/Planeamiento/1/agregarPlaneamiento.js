function isDateBeforeToday(date) {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;

  var yyyy = today.getFullYear();
  if(dd<10){
      dd='0'+dd - 1;
  }
  if(mm<10){
      mm='0'+mm;
  }
  var today = yyyy + '-' + mm + '-' + dd;
  return new Date(date.toDateString()) < new Date(new Date(today).toDateString());
}

Template.agregarPlaneamientoIda.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
    template.subscribe('rutas')
    template.subscribe('calendario')
    template.subscribe('GruposHorarios', true);
  })

})

Template.agregarPlaneamientoIda.events({
  'click [name="crear_grupo"]'(e, t) {

    if (t.rutaId.get() !== undefined) {
      Session.set('asignar_ida', true)
      Modal.show('CrearGrupo')
    } else {
      Bert.alert('Seleccione una Ruta', 'warning')
    }

  },
  'click [name="asignar_grupo"]'(e, t) {
    if (t.rutaId.get() !== undefined) {
      Session.set('asignar_ruta', t.rutaId.get())
      Modal.show('ImportarGrupo')
    } else {
      Bert.alert('Seleccione una Ruta', 'warning')
    }
  }
})

Template.agregarPlaneamientoVuelta.events({
  'click [name="crear_grupo"]'(e, t) {

    if (t.rutaId.get() !== undefined) {
      Session.set('asignar_ida', false)

      Modal.show('CrearGrupo')
    } else {
      Bert.alert('Seleccione una Ruta', 'warning')
    }

  },
  'click [name="asignar_grupo"]'(e, t) {
    if (t.rutaId.get() !== undefined) {
      Session.set('asignar_ruta', t.rutaId.get())
      Modal.show('ImportarGrupo')
    } else {
      Bert.alert('Seleccione una Ruta', 'warning')
    }
  }
})


Template.ImportarGrupo.onCreated( () => {

})

Template.ImportarGrupo.events({
  'click [name="importar_grupo"]'(e, t) {
    let grupoId = t.find('[name="grupo_horario"]').value
    let fecha = process(t.find('[name="fecha"]').value.slice(0, 10))
    let rutaId = Session.get('asignar_ruta')
    if (grupoId !== "" && fecha !== "") {

      Meteor.call('importarGrupoHorario', grupoId, rutaId, fecha, (err) => {
        if (err) {
          Bert.alert(err, 'danger')
        } else {
          Modal.hide('ImportarGrupo')
          Bert.alert('Grupo Horario de Planeamiento Asignado', 'success')
        }
      })

    } else {
      Bert.alert('Complete los datos', 'warning')
    }
  }
})

Template.ImportarGrupo.helpers({
  grupos() {
    return GruposHorarios.find({});
  }
})

Template.agregarPlaneamientoIda.onRendered( () => {
  let template = Template.instance();
  template.rutaId = new ReactiveVar(undefined)
  $( "#ruta" ).change(function(e) {
    template.rutaId.set($(this).val())
  });



  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;

  var yyyy = today.getFullYear();
  if(dd<10){
      dd='0'+dd;
  }
  if(mm<10){
      mm='0'+mm;
  }
  var today = yyyy + '-' + mm + '-' + dd;

  $( '#planeamiento' ).fullCalendar({
    lang: 'es',
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'basicWeek'
    },
    defaultView: 'basicWeek',
    defaultDate: today,
    events( start, end, timezone, callback ) {
      let data = CalendarioPlaneamiento.find({ida: true, rutaId: template.rutaId.get()}).fetch().map( ( event ) => {
        event.editable = false
        return event;
      });

      if ( data ) {
        callback( data );
      }
    },
    eventRender: function(event, element) {
      element.find(".fc-event-title").remove();
      element.find(".fc-event-time").remove();
      element.append( "<span> <span class='closeon'>X</span> </span>" );
            element.find(".closeon").click(function() {
              console.log(event._id);
              Meteor.call('removePlan2', event._id, function (err, result) {
                if (err) {
                  Bert.alert('Hubo un error', 'danger')
                } else {
                  Bert.alert(result.mensaje, 'success')

                  if (result.eliminado === true) {
                    $('#calendar').fullCalendar('removeEvents', event._id);
                  }

                }
              })

            });

    },
    dayClick(date, jsEvent, view) {

        if (template.rutaId.get() !== undefined) {

          let dia = new Date(date)
          if (isDateBeforeToday(dia) === false) {
            Session.set('date', date.format())
            Session.set('rutaPorHora', template.rutaId.get())
            Meteor.call('agregarHoraPorDia', date.format(), true, template.rutaId.get(), (err) => {
                if (err) {
                  console.log(err);
                } else {
                  Modal.show('ConfigurarPlaneamiento')
                }
            })
          } else {
            Bert.alert('No puedes agregar planeamientos de dias anteriores a hoy día', 'warning')
          }


        } else {
          Bert.alert('Seleccione una ruta', 'warning');
        }

    }
  });

  Tracker.autorun( () => {
    CalendarioPlaneamiento.find().fetch();
    $( '#planeamiento' ).fullCalendar( 'refetchEvents' );
  });
})

Template.agregarPlaneamientoIda.helpers({
  rutas() {
    return Rutas.find()
  },
  eliminar() {
    if (this.permitir === true) {
      return true
    } else {
      return false
    }
  }
})


Template.agregarPlaneamientoVuelta.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
    template.subscribe('rutas')
    template.subscribe('calendario')
    template.subscribe('GruposHorarios', false);
  })

})

Template.agregarPlaneamientoVuelta.onRendered( () => {
  let template = Template.instance();
  template.rutaId = new ReactiveVar(undefined)
  $( "#ruta2" ).change(function(e) {
    template.rutaId.set($(this).val())
  });

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;

  var yyyy = today.getFullYear();
  if(dd<10){
      dd='0'+dd;
  }
  if(mm<10){
      mm='0'+mm;
  }
  var today = yyyy + '-' + mm + '-' + dd;

  $( '#planeamiento2' ).fullCalendar({
    lang: 'es',
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'basicWeek'
    },
    defaultView: 'basicWeek',
    defaultDate: today,
    events( start, end, timezone, callback ) {
      let data = CalendarioPlaneamiento.find({ida: false, rutaId: template.rutaId.get()}).fetch().map( ( event ) => {
        event.editable = false
        return event;
      });

      if ( data ) {
        callback( data );
      }
    },
    eventRender: function(event, element) {
      element.find(".fc-event-title").remove();
      element.find(".fc-event-time").remove();
      element.append( "<span class='closeon'>X</span>" );
            element.find(".closeon").click(function() {
              console.log(event._id);
              Meteor.call('removePlan2', event._id, function (err) {
                if (err) {
                  Bert.alert('Hubo un error', 'danger')
                } else {
                  Bert.alert('Plan Horario eliminado', 'success')
                }
              })
               $('#calendar').fullCalendar('removeEvents', event._id);
            });

    },
    dayClick(date, jsEvent, view) {
        console.log(date.format());
        if (template.rutaId.get() !== undefined) {
          let dia = new Date(date)
          if (isDateBeforeToday(dia) === false) {
            Session.set('date', date.format())
            Session.set('rutaPorHora', template.rutaId.get())
            Meteor.call('agregarHoraPorDia', date.format(), false, template.rutaId.get(), (err) => {
                if (err) {
                  console.log(err);
                } else {
                  Modal.show('ConfigurarPlaneamientoVuelta')
                }
            })
          } else {
            Bert.alert('No puedes agregar planeamientos de dias anteriores a hoy día', 'warning')
          }


        } else {
          Bert.alert('Seleccione una ruta', 'warning');
        }

    }
  });

  Tracker.autorun( () => {
    CalendarioPlaneamiento.find().fetch();
    $( '#planeamiento2' ).fullCalendar( 'refetchEvents' );
  });
})

Template.agregarPlaneamientoVuelta.helpers({
  rutas() {
    return Rutas.find()
  }
})

Template.ConfigurarPlaneamiento.onCreated( () => {
  let template = Template.instance()

  template.autorun( () => {
    template.subscribe('HorasPorDia', true);
    template.subscribe('PlanesHorarios')
  })

})

Template.ConfigurarPlaneamiento.helpers({
  activo() {
    let hoy = Session.get('date')
    let ruta = Session.get('rutaPorHora')
    let primera = HorasPorDia.findOne({dia: hoy, ida: true, rutaId: ruta}).primera;

    console.log(primera);
    if (primera === true) {
      return 'disabled';
    } else {
      return '';
    }
  },
  horas() {
    let hoy = Session.get('date')
    let ruta = Session.get('rutaPorHora')
    return HorasPorDia.findOne({dia: hoy, ida: true, rutaId: ruta}).horas;
  },
  horarios() {
    return PlanesHorarios.find();
  }
})

Template.ConfigurarPlaneamiento.events({
  'click [name="guardar_planeamiento"]'(e, t) {

    let programacion = {
      hi: t.find('[name="hi"]').value,
      hf: t.find('[name="hf"]').value,
    }

    let validacion = {
      rutaId: $('#ruta').val(),
      ida: true,
      activo: false,
      dia: Session.get('date').slice(0, 10),
      phId: $('#ph1').val()
    }


    if (programacion.hi !== "" && programacion.hf !== "") {

      let h1 = programacion.hi.slice(0, 2)
      h1 = parseInt(h1)
      let h2 = programacion.hf.slice(0, 2)
      h2 = parseInt(h2)
      if (h1 === h2 || h1 > h2) {
          Bert.alert('Ingrese un rango de horas valido', 'warning')
      } else {
        Meteor.call('add_plan_horario', programacion, validacion, (err) => {
          if (err) {
            Bert.alert('Hubo un Error', 'danger');
            Modal.hide('ConfigurarPlaneamiento')

          } else {
            Meteor.call('ActualizarRangoHorarioPorDia', validacion.dia, validacion.ida, programacion, validacion.rutaId, (err) => {
              if (err) {
                console.log(err);
              } else {
                Modal.hide('ConfigurarPlaneamiento')
                Bert.alert('Planeamiento Agregado', 'success');
              }
            })
          }
        })
      }

    } else {
      Bert.alert('Complete los datos')
    }

  }
})


Template.ConfigurarPlaneamientoVuelta.onCreated( () => {
  let template = Template.instance()

  template.autorun( () => {
    template.subscribe('HorasPorDia', false);
    template.subscribe('PlanesHorarios')
  })

})

Template.ConfigurarPlaneamientoVuelta.helpers({
  activo() {
    let hoy = Session.get('date')
    let ruta = Session.get('rutaPorHora')
    let primera = HorasPorDia.findOne({dia: hoy, ida: false, rutaId: ruta}).primera;
    console.log(HorasPorDia.findOne({dia: hoy, ida: false, rutaId: ruta}));
    console.log(primera);
    if (primera === true) {
      return 'disabled';
    } else {
      return '';
    }
  },
  horas() {
    let hoy = Session.get('date')
    let ruta = Session.get('rutaPorHora')
    return HorasPorDia.findOne({dia: hoy, ida: false, rutaId: ruta}).horas;
  },
  horarios() {
    return PlanesHorarios.find()
  }
})

Template.ConfigurarPlaneamientoVuelta.events({
  'click [name="guardar_planeamiento"]'(e, t) {

    let programacion = {
      hi: t.find('[name="hi"]').value,
      hf: t.find('[name="hf"]').value
    }

    let validacion = {
      rutaId: $('#ruta2').val(),
      ida: false,
      activo: false,
      dia: Session.get('date').slice(0, 10),
      phId: $('#ph').val()
    }

    console.log(validacion.ida);

    if (programacion.hi !== "" && programacion.hf !== "") {

      let h1 = programacion.hi.slice(0, 2)
      h1 = parseInt(h1)
      let h2 = programacion.hf.slice(0, 2)
      h2 = parseInt(h2)
      if (h1 === h2) {
          Bert.alert('Ingrese un rango de horas valido', 'warning')
      } else {
        Meteor.call('add_plan_horario', programacion, validacion, (err) => {
          if (err) {
            Bert.alert('Hubo un Error', 'danger');
            Modal.hide('ConfigurarPlaneamientoVuelta')

          } else {
            Meteor.call('ActualizarRangoHorarioPorDia', validacion.dia, validacion.ida, programacion, validacion.rutaId, (err) => {
              if (err) {
                console.log(err);
              } else {
                Modal.hide('ConfigurarPlaneamientoVuelta')
                Bert.alert('Planeamiento Agregado', 'success');
              }
            })
          }
        })
      }

    } else {
      Bert.alert('Complete los datos')
    }

  }
})

Template.ImportarGrupo.onRendered( () => {
  let template = Template.instance()
  template.$('.datetimepicker').datetimepicker();
})

Template.CrearGrupo.onRendered( () => {
  let template = Template.instance()
  template.$('.datetimepicker').datetimepicker();
})

function process(date) {
    if (date === null || date === undefined) {
        return '';
    } else {
        let parts;
        if (date.search("/") !== -1) {
            parts = date.split("/");
            //format dd/mm/yyyy
            return    parts[2] + '-' +
                      parts[0] + '-' +
                      parts[1]
        }
    }

}

Template.CrearGrupo.events({
  'click [name="crear_grupo"]'(e, t) {
    let datos = {
      nombre: t.find('[name="nombre"]').value,
      fecha:  process(t.find('[name="fecha"]').value.slice(0, 10)),
      ida: Session.get('asignar_ida')
    }

    if (datos.nombre !== "" && datos.fecha !== "") {
      Meteor.call('crearGrupoHorario', datos.nombre, datos.fecha, datos.ida, (err) => {
        if (err) {
          Bert.alert(err, 'Danger')
        } else {
          Bert.alert('Grupo Horario Agregado', 'success')
          Modal.hide('CrearGrupo')
        }
      })
    } else {
      Bert.alert('Complete los datos', 'warning')
    }
  }
})
