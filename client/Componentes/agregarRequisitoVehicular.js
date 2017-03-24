Template.agregarRequisitoVehicular.events({
  'click .agregar'(e, t) {

    e.preventDefault();
    let requisito = t.find("[name='requisito']").value;
    console.log(requisito)
    if (requisito != "") {
      Meteor.call('agregarRequisito', {nombre: requisito, activo: true, listaId: Session.get('listaId')}, function (err) {
        if (err) {
          Bert.alert('Hubo un error, vuelva a intentarlo', 'danger')
        } else {
          Bert.alert('Agregaste un requisito Vehicular', 'success');
          Modal.hide('agregarRequisitoVehicular')
        }
      })
    } else {
      Bert.alert('Ingrese los datos', 'warning')
    }
  }
})
