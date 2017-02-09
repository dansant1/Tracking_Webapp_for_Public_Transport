Template.LeftMenuAdministrador.onCreated( () => {
	let template = Template.instance();
    template.autorun( () => {
        
        template.subscribe( 'Empresas');
        
    });
});

Template.LeftMenuAdministrador.helpers({
	numeroEmpresas() {
		return Empresas.find().fetch().length;
	}
});