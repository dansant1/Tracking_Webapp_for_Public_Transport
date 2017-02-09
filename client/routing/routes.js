FlowRouter.route('/', {
	name: 'Inicio',
	action() {
		BlazeLayout.render('LayoutCliente', { cliente: 'InicioCliente', administrador: 'Empresas'});
	}
});

// Rutas del Cliente/Empresa

FlowRouter.route('/rastreo', {
	name: 'Rastreo',
	action() {
		BlazeLayout.render('LayoutCliente', { cliente: 'mapaCliente'});
	}
});

// Rutas del Administrador

FlowRouter.route('/empresas', {
	name: 'Empresas',
	action() {
		BlazeLayout.render('LayoutCliente', { administrador: 'Empresas'});
	}
});

FlowRouter.route('/admin/reportes', {
	name: 'AdministradorReportes',
	action() {
		BlazeLayout.render('LayoutCliente', { administrador: 'AdministradorReportes'});
	}
});


FlowRouter.route('/empresas/:empresaId', {
	name: 'Empresa',
	action() {
		
		BlazeLayout.render('LayoutCliente', { administrador: 'DetalleDeEmpresa'});
	}
});

FlowRouter.route('/vehiculo/:vehiculoId', {
	name: 'DetalleDeVehiculo',
	action() {
		BlazeLayout.render('LayoutCliente', { administrador: 'DetalleVehiculos'});
	}
});

FlowRouter.route('/admin/planeamiento', {
	name: 'AdministradorPlaneamiento',
	action() {
		BlazeLayout.render('LayoutCliente', { administrador: 'AdministradorPlaneamiento'});	
	}
});

FlowRouter.route('/admin/agregaruta', {
	name: 'AdministradorAgregarRuta',
	action() {
		BlazeLayout.render('LayoutCliente', { administrador: 'AdministradorAgregarRuta'});	
	}
});

FlowRouter.route('/admin/planeamientos/:empresaId', {
	name: 'AdministradorPlaneamientoPorEmpresa',
	action() {
		BlazeLayout.render('LayoutCliente', { administrador: 'AdministradorPlaneamientoPorEmpresa'});	
	}
});

FlowRouter.route('/admin/rutas', {
	name: 'AdministradorRuta',
	action() {
		BlazeLayout.render('LayoutCliente', { administrador: 'AdministradorRutas'});	
	}
});

FlowRouter.route('/admin/rastreo', {
	name: 'AdministradorRastreo',
	action() {
		BlazeLayout.render('LayoutCliente', { administrador: 'AdministradorRastreo'});	
	}
});

FlowRouter.route('/admin/equipo', {
	name: 'AdministradorEquipo',
	action() {
		BlazeLayout.render('LayoutCliente', { administrador: 'AdministradorEquipo'});	
	}
});

FlowRouter.route('/admin/rutas/:empresaId', {
	name: 'AdministradorRutaPorEmpresa',
	action() {
		BlazeLayout.render('LayoutCliente', { administrador: 'AdministradorRutasPorEmpresa'});	
	}
});


FlowRouter.route('/admin/agregarplan', {
	name: 'AdministradorAgregarPlaneamiento',
	action() {
		BlazeLayout.render('LayoutCliente', { administrador: 'AdministradorAgregarPlaneamiento'});	
	}
});