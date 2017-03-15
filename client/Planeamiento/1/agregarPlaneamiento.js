// vuelta
let plunes = new ReactiveArray([])
let pmartes = new ReactiveArray([])
let pmiercoles = new ReactiveArray([])
let pjueves = new ReactiveArray([])
let pviernes = new ReactiveArray([])
let psabado = new ReactiveArray([])
let pdomingo = new ReactiveArray([])

// Ida
let alunes = new ReactiveArray([])
let amartes = new ReactiveArray([])
let amiercoles = new ReactiveArray([])
let ajueves = new ReactiveArray([])
let aviernes = new ReactiveArray([])
let asabado = new ReactiveArray([])
let adomingo = new ReactiveArray([])

Template.agregarPlaneamientoIda.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
    template.subscribe('rutas')
    template.subscribe('calendario')
  })

})

Template.agregarPlaneamientoIda.onRendered( () => {
  let template = Template.instance();
  template.rutaId = new ReactiveVar()
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
        Session.set('date', date.format())
        Modal.show('ConfigurarPlaneamiento')
    }
  });

  Tracker.autorun( () => {
    CalendarioPlaneamiento.find().fetch();
    $( '#planeamiento' ).fullCalendar( 'refetchEvents' );
  });
})

Template.agregarPlaneamientoIda.helpers({
  planesida() {
    return PlanesHorarios.find({ida: true});
  },
  hi() {
    console.log(this.valueOf());
    return PlanesHorarios.findOne({_id: this.valueOf()}).hi;
  },
  hf() {
    return PlanesHorarios.findOne({_id: this.valueOf()}).hf;
  },
  f() {
    return PlanesHorarios.findOne({_id: this.valueOf()}).frecuencia;
  },
  planesvuelta() {
    return PlanesHorarios.find({ida: false});
  },
  rutas() {
    return Rutas.find()
  },
  planesSeleccionadosLunes() {
    return alunes.get();
  },
  planesSeleccionadosMartes() {
    return amartes.get();
  },
  planesSeleccionadosMiercoles() {
    return amiercoles.get();
  },
  planesSeleccionadosJueves() {
    return ajueves.get();
  },
  planesSeleccionadosViernes() {
    return aviernes.get();
  },
  planesSeleccionadosSabado() {
    return asabado.get();
  },
  planesSeleccionadosDomingo() {
    console.log(adomingo.get());
    return adomingo.get();
  }
})

Template.agregarPlaneamientoIda.events({
  'click [name="guardar-plan"]'(e, t) {
    let datos = {
      rutaId: $('#ruta').val(),
      plan: {
        lunes: alunes.get(),
        martes: amartes.get(),
        miercoles: amiercoles.get(),
        jueves: ajueves.get(),
        viernes: aviernes.get(),
        sabado: asabado.get(),
        domingo: adomingo.get()
      },
      ida: true
    }

    if (typeof datos.plan.lunes !== 'undefined' && datos.plan.lunes.length > 0 && typeof datos.plan.martes !== 'undefined' && datos.plan.martes.length > 0 && typeof datos.plan.miercoles !== 'undefined' && datos.plan.miercoles.length > 0 ) {

      if ( typeof datos.plan.jueves !== 'undefined' && datos.plan.jueves.length > 0 && typeof datos.plan.viernes !== 'undefined' && datos.plan.viernes.length > 0 && typeof datos.plan.sabado !== 'undefined' && datos.plan.sabado.length > 0 ) {

        if ( typeof datos.plan.domingo !== 'undefined' && datos.plan.domingo.length > 0 ) {
          Meteor.call('crearPlan', datos, (err) => {
            if (err) {
              Bert.alert('Hubo un Error, vuela a intentarlo', 'danger')
            } else {
              Bert.alert('Planeamiento Guardado', 'success')
              FlowRouter.go('/admin/listas/planes')
            }
          })
        }
      }

    } else {
      Bert.alert('complete los datos', 'danger');
    }

  },
  'click .a1'() {
    Modal.show('seleccionarPlanHorarioIda')
  },
  'click .a2'() {
    Modal.show('seleccionarPlanHorarioIda2')
  },
  'click .a3'() {
    Modal.show('seleccionarPlanHorarioIda3')
  },
  'click .a4'() {
    Modal.show('seleccionarPlanHorarioIda4')
  },
  'click .a5'() {
    Modal.show('seleccionarPlanHorarioIda5')
  },
  'click .a6'() {
    Modal.show('seleccionarPlanHorarioIda6')
  },
  'click .a7'() {
    Modal.show('seleccionarPlanHorarioIda7')
  },
  'click #remove'() {
    alunes.remove(this.valueOf())
  },
  'click #remove2'() {
    amartes.remove(this.valueOf())
  },
  'click #remove3'() {
    amiercoles.remove(this.valueOf())
  },
  'click #remove4'() {
    ajueves.remove(this.valueOf())
  },
  'click #remove5'() {
    aviernes.remove(this.valueOf())
  },
  'click #remove6'() {
    asabado.remove(this.valueOf())
  },
  'click #remove7'() {
    adomingo.remove(this.valueOf())
  }
})



Template.agregarPlaneamientoVuelta.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
    template.subscribe('rutas')
  })

})

Template.agregarPlaneamientoVuelta.helpers({
  planesida() {
    return PlanesHorarios.find({ida: true});
  },
  hi() {
    console.log(this.valueOf());
    return PlanesHorarios.findOne({_id: this.valueOf()}).hi;
  },
  hf() {
    return PlanesHorarios.findOne({_id: this.valueOf()}).hf;
  },
  f() {
    return PlanesHorarios.findOne({_id: this.valueOf()}).frecuencia;
  },
  rutas() {
    return Rutas.find()
  },
  planesvuelta() {
    return PlanesHorarios.find({ida: false});
  },
  planesSeleccionadosLunes() {
    return plunes.get();
  },
  planesSeleccionadosMartes() {
    return pmartes.get();
  },
  planesSeleccionadosMiercoles() {
    return pmiercoles.get();
  },
  planesSeleccionadosJueves() {
    return pjueves.get();
  },
  planesSeleccionadosViernes() {
    return pviernes.get();
  },
  planesSeleccionadosSabado() {
    return psabado.get();
  },
  planesSeleccionadosDomingo() {
    return pdomingo.get();
  }
})

Template.agregarPlaneamientoVuelta.events({
  'click [name="guardar-plan"]'(e, t) {
    let datos = {
      rutaId: $('#ruta').val(),
      plan: {
        lunes: plunes.get(),
        martes: pmartes.get(),
        miercoles: pmiercoles.get(),
        jueves: pjueves.get(),
        viernes: pviernes.get(),
        sabado: psabado.get(),
        domingo: pdomingo.get()
      },
      ida: false
    }

    if (typeof datos.plan.lunes !== 'undefined' && datos.plan.lunes.length > 0 && typeof datos.plan.martes !== 'undefined' && datos.plan.martes.length > 0 && typeof datos.plan.miercoles !== 'undefined' && datos.plan.miercoles.length > 0 ) {

      if ( typeof datos.plan.jueves !== 'undefined' && datos.plan.jueves.length > 0 && typeof datos.plan.viernes !== 'undefined' && datos.plan.viernes.length > 0 && typeof datos.plan.sabado !== 'undefined' && datos.plan.sabado.length > 0 ) {

        if ( typeof datos.plan.domingo !== 'undefined' && datos.plan.domingo.length > 0 ) {
          Meteor.call('crearPlan', datos, (err) => {
            if (err) {
              Bert.alert('Hubo un Error, vuela a intentarlo', 'danger')
            } else {
              Bert.alert('Planeamiento Guardado', 'success')
              FlowRouter.go('/admin/listas/planes')
            }
          })
        }
      }

    } else {
      Bert.alert('complete los datos', 'danger');
    }

  },
  'click .a1'() {
    Modal.show('seleccionarPlanHorarioVuelta')
  },
  'click .a2'() {
    Modal.show('seleccionarPlanHorarioVuelta2')
  },
  'click .a3'() {
    Modal.show('seleccionarPlanHorarioVuelta3')
  },
  'click .a4'() {
    Modal.show('seleccionarPlanHorarioVuelta4')
  },
  'click .a5'() {
    Modal.show('seleccionarPlanHorarioVuelta5')
  },
  'click .a6'() {
    Modal.show('seleccionarPlanHorarioVuelta6')
  },
  'click .a7'() {
    Modal.show('seleccionarPlanHorarioVuelta7')
  },
  'click #remove'() {
    plunes.remove(this.valueOf())
  }
})

Template.seleccionarPlanHorarioIda.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioIda.helpers({
  planes() {
    return PlanesHorarios.find({ida: true});
  }
})

Template.seleccionarPlanHorarioIda.events({
  'click .as'() {
    alunes.push(this._id)
  }
})

Template.seleccionarPlanHorarioIda2.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioIda2.helpers({
  planes() {
    return PlanesHorarios.find({ida: true});
  }
})

Template.seleccionarPlanHorarioIda2.events({
  'click .as'() {
    amartes.push(this._id)
  }
})

Template.seleccionarPlanHorarioIda3.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioIda3.helpers({
  planes() {
    return PlanesHorarios.find({ida: true});
  }
})

Template.seleccionarPlanHorarioIda3.events({
  'click .as'() {
    amiercoles.push(this._id)
  }
})

Template.seleccionarPlanHorarioIda4.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioIda4.helpers({
  planes() {
    return PlanesHorarios.find({ida: true});
  }
})

Template.seleccionarPlanHorarioIda4.events({
  'click .as'() {
    ajueves.push(this._id)
  }
})

Template.seleccionarPlanHorarioIda5.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioIda5.helpers({
  planes() {
    return PlanesHorarios.find({ida: true});
  }
})

Template.seleccionarPlanHorarioIda5.events({
  'click .as'() {
    aviernes.push(this._id)
  }
})

Template.seleccionarPlanHorarioIda6.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioIda6.helpers({
  planes() {
    return PlanesHorarios.find({ida: true});
  }
})

Template.seleccionarPlanHorarioIda6.events({
  'click .as'() {
    asabado.push(this._id)
  }
})

Template.seleccionarPlanHorarioIda7.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioIda7.helpers({
  planes() {
    return PlanesHorarios.find({ida: true});
  }
})

Template.seleccionarPlanHorarioIda7.events({
  'click .as'() {

    adomingo.push(this._id)
        console.log(adomingo.get());
  }
})


Template.seleccionarPlanHorarioVuelta.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})


Template.seleccionarPlanHorarioVuelta.helpers({
  planes() {
    return PlanesHorarios.find({ida: false});
  }
})

Template.seleccionarPlanHorarioVuelta.events({
  'click .plunes'() {
    plunes.push(this._id)
  }
})

Template.seleccionarPlanHorarioVuelta2.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioVuelta2.helpers({
  planes() {
    return PlanesHorarios.find({ida: false});
  }
})

Template.seleccionarPlanHorarioVuelta3.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioVuelta3.helpers({
  planes() {
    return PlanesHorarios.find({ida: false});
  }
})

Template.seleccionarPlanHorarioVuelta4.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioVuelta4.helpers({
  planes() {
    return PlanesHorarios.find({ida: false});
  }
})

Template.seleccionarPlanHorarioVuelta5.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioVuelta5.helpers({
  planes() {
    return PlanesHorarios.find({ida: false});
  }
})

Template.seleccionarPlanHorarioVuelta6.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioVuelta6.helpers({
  planes() {
    return PlanesHorarios.find({ida: false});
  }
})

Template.seleccionarPlanHorarioVuelta7.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioVuelta7.helpers({
  planes() {
    return PlanesHorarios.find({ida: false});
  }
})

Template.seleccionarPlanHorarioVuelta2.events({
  'click .pmartes'() {
    pmartes.push(this._id)
  }
})

Template.seleccionarPlanHorarioVuelta3.events({
  'click .pmiercoles'() {
    pmiercoles.push(this._id)
  }
})

Template.seleccionarPlanHorarioVuelta4.events({
  'click .pjueves'() {
    pjueves.push(this._id)
  }
})

Template.seleccionarPlanHorarioVuelta5.events({
  'click .pviernes'() {
    pviernes.push(this._id)
  }
})

Template.seleccionarPlanHorarioVuelta6.events({
  'click .psabado'() {
    psabado.push(this._id)
  }
})

Template.seleccionarPlanHorarioVuelta7.events({
  'click .pdomingo'() {
    pdomingo.push(this._id)
  }
})

Template.ConfigurarPlaneamiento.onCreated( () => {
  let template = Template.instance()

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.ConfigurarPlaneamiento.helpers({
  horarios() {
    return PlanesHorarios.find();
  }
})

Template.ConfigurarPlaneamiento.events({
  'click [name="guardar_planeamiento"]'(e, t) {

    let programacion = {
      hi: t.find('[name="hi"]').value,
      hf: t.find('[name="hf"]').value
    }

    let validacion = {
      rutaId: $('#ruta').val(),
      ida: true,
      activo: false,
      dia: Session.get('date').slice(0, 10)
    }

    if (programacion.hi !== "" && programacion.hf !== "") {
      Meteor.call('add_plan_horario', programacion, validacion, (err) => {
        if (err) {
          Bert.alert('Hubo un Error', 'danger');
          Modal.hide('ConfigurarPlaneamiento')
        } else {
          Modal.hide('ConfigurarPlaneamiento')
          Bert.alert('Planeamiento Agregado');
        }
      })
    } else {
      Bert.alert('Complete los datos')
    }

  }
})
