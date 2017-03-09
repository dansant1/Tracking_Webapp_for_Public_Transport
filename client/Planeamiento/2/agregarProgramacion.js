let horarios = new ReactiveArray([]);

Template.agregarProgramacionIda.onCreated( () => {
  let template = Template.instance()
  template.cantidad = new ReactiveVar(0)

  let dia = new Date();
  let n = dia.getDay();

  let d = '';
  switch (n) {
    case 1:
      d = 'lunes'
    break;
    case 2:
      d = 'martes'
    break;
    case 3:
      d = 'miercoles'
    break;
    case 4:
        d = 'jueves'
    break;
    case 5:
        d = 'viernes'
    break;
    case 6:
        d = 'sabado'
    break;
    case 0:
        d = 'domingo'
    break;
  }

  let horas;
  template.autorun( () => {
    let ida = true//Meteor.user().profile.ida;
    console.log(ida);
    let rutaId = FlowRouter.getParam('rutaId');

    template.subscribe('VehiculosHorario', () => {

    })
    template.subscribe('Horarios', ida, rutaId, () => {
      if (Plan.find().fetch().length > 0) {

        horas = Plan.find({}).fetch()[0].plan[d];
          
      }
    })
  })
})

Template.agregarProgramacionIda.events({
  'keyup [name="cantidad"]'(e, t) {
    t.cantidad.set(e.target.value);
  }
})

Template.agregarProgramacionIda.helpers({
  horarios() {
      return horarios.get();
  },
  vehiculos() {
    return Vehiculos.find();
  }
})
