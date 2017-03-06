Template.Planeamiento_mostrar.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        let empresaId = Meteor.user().profile.empresaId;
        template.subscribe('Empresas');
        template.subscribe('Rutas');
        template.subscribe('DetalleDeEmpresaPlaneamiento', empresaId);
    });
});

Template.Planeamiento_mostrar.onRendered(() => {

});

Template.Planeamiento_mostrar.helpers({
    empresas() {
        let empresa = Empresas.findOne({_id: Meteor.user().profile.empresaId});
        return empresa ? empresa.nombre : '';
    },
    ruta(id) {
        return Rutas.findOne({_id: id}).nombre;
    },
    planeamiento() {
        let rutaId = FlowRouter.getParam('rutaId');
        return Planeamiento.findOne({"plan.rutaId": rutaId});
    }
});