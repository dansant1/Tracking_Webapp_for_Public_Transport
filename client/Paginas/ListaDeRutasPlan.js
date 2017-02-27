Template.ListaDeRutasPlan.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    let empresaId = FlowRouter.getParam('empresaId')
    template.subscribe('DetalleDeEmpresa', empresaId);
    template.subscribe('rutas')
  })
})

Template.ListaDeRutasPlan.helpers({
    empresa() {
      let empresaId = FlowRouter.getParam('empresaId')
      return Empresas.findOne({_id: empresaId}).nombre;
    },
     rutas() {
      let empresaId = FlowRouter.getParam('empresaId')
      return Rutas.find({empresasId: empresaId})
    }
})
