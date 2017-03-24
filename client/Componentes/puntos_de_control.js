Template.ConfigPuntosDeControl.onCreated(() => {
  let template = Template.instance();
  template.rutaId = new ReactiveVar(0)
  template.autorun( () => {
    template.subscribe('rutas')
  })
})

Template.ConfigPuntosDeControl.helpers({
  rutas() {
    return Rutas.find({})
  },
  puntos() {
    return Rutas.findOne({_id: Template.instance().rutaId.get()}).puntosdecontrol;
  }
})

Template.ConfigPuntosDeControl.events({
  'change [name="rutas"]'(e, t) {
    console.log(e.target.value);
    if (e.target.value == "0") {
      t.rutaId.set(0)
    } else {
      console.log(t.rutaId.get());
      t.rutaId.set(e.target.value)
    }

  },
  'click .save'(e, t) {
    console.log(t.rutaId.get());
    if (t.rutaId.get() !== 0  ) {

      datos = {
        rutaId: t.rutaId.get(),
        puntos: []
      }

      $( "li.pc" ).each(function( index ) {
          console.log( index + ": " + $( this ).find('#lat').html() );
          datos.puntos.push({
            lat: $( this ).find('#lat').html(),
            lng: $( this ).find('#lng').html(),
            tida: $( this ).find('#tida').val(),
            tvuelta: $( this ).find('#tvuelta').val()
          })
      });

      console.log(datos.puntos);

      Meteor.call('guardarPuntosControl', datos, (err) => {
        if (err) {
          Bert.alert('Hubo un error, vuelta a intentarlo', 'danger')
        } else {
          Bert.alert('Puntos de Control Guardados', 'success')
        }
      })
    } else {
      Bert.alert('Seleccione una Ruta', 'warning')
    }
  }
})
