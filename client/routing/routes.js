FlowRouter.route('/', {
    name: 'Inicio',
    action() {
        BlazeLayout.render('LayoutCliente', {cliente: 'InicioCliente', administrador: 'Empresas'});
    }
});

// Rutas del Cliente/Empresa

FlowRouter.route('/rastreo', {
    name: 'Rastreo',
    action() {
        BlazeLayout.render('LayoutCliente', {cliente: 'mapaCliente'});
    }
});

FlowRouter.route('/mantenimiento', {
    name: 'Mantenimiento',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'mantenimiento'});
    }
});

FlowRouter.route('/gestiontpi', {
    name: 'RecaudacionTPI',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'RecaudacionTPI'});
    }
});

FlowRouter.route('/planes/:empresaId', {
    name: 'PlaneamientoPorEmpresa',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'ListaDeRutasPlan'});
    }
});

FlowRouter.route('/plan/:empresaId/r/:rutaId', {
    name: 'PlaneamientoPorEmpresa',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'AdministradorPlaneamientoPorEmpresa'});
    }
});

FlowRouter.route('/recaudaciontpi/:empresaId', {
    name: 'RecaudacionTPIpersonalizado',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'RecaudacionTPIvehiculos'});
    }
});

FlowRouter.route('/borradores', {
    name: 'Borradores',
    action() {
        BlazeLayout.render('LayoutCliente', {cliente: 'Borradores'});
    }
});

FlowRouter.route('/vehiculos', {
    name: 'Vehiculos',
    action() {
        BlazeLayout.render('LayoutCliente', {cliente: 'ListaDeVehiculos2'});
    }
});

FlowRouter.route('/colaboradores', {
    name: 'Colaboradores',
    action() {
        BlazeLayout.render('LayoutCliente', {cliente: 'ListaDeColaboradores'});
    }
});

FlowRouter.route('/planeamiento', {
    name: 'Planeamiento',
    action() {
        BlazeLayout.render('LayoutCliente', {cliente: 'RutasDeLaEmpresa'});
    }
});

FlowRouter.route('/plan/ruta/:rutaId', {
    name: 'Planeamiento',
    action() {
        BlazeLayout.render('LayoutCliente', {cliente: 'Planeamiento_mostrar'});
    }
});

FlowRouter.route('/despacho/d/:rutaId', {
    name: 'Planeamiento',
    action() {
        BlazeLayout.render('LayoutCliente', {cliente: 'FuncionDespachar', administrador: 'FuncionDespachar'});
    }
});

FlowRouter.route('/planeamiento/:rutaId/nuevo', {
    name: 'Planeamiento.Nuevo',
    action() {
        BlazeLayout.render('LayoutCliente', {cliente: 'NuevoPlaneamientoDelDia', administrador: 'NuevoPlaneamientoDelDia'});
    }
});

FlowRouter.route('/planeamiento/:rutaId/nuevo/vuelta', {
    name: 'Planeamiento.Nuevo',
    action() {

        BlazeLayout.render('LayoutCliente', {cliente: 'NuevoPlaneamientoDelDiaVuelta', administrador: 'NuevoPlaneamientoDelDiaVuelta'});
    }

});

FlowRouter.route('/planeamiento/:rutaId/nuevo/ida', {
    name: 'Planeamiento.Nuevo.Ida',
    action() {
        BlazeLayout.render('LayoutCliente', {cliente: 'agregarProgramacionIda'/*'NuevoPlaneamientoDelDia'*/});
    }
});



FlowRouter.route('/rutas', {
    name: 'Rutas',
    action() {
        BlazeLayout.render('LayoutCliente', {cliente: 'Rutas'});
    }
});

FlowRouter.route('/agregarplaneamiento', {
    name: 'Planeamiento',
    action() {
        BlazeLayout.render('LayoutCliente', {cliente: 'AgregarPlaneamiento'});
    }
});

// Rutas del Administrador

FlowRouter.route('/empresas', {
    name: 'Empresas',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'Empresas'});
    }
});

FlowRouter.route('/admin/reportes', {
    name: 'AdministradorReportes',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'AdministradorReportes'});
    }
});


FlowRouter.route('/admin/flotas', {
    name: 'AdministradorReportes',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'flotas'});
    }
});

FlowRouter.route('/admin/operadores', {
    name: 'AdministradorReportes',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'operadores'});
    }
});

FlowRouter.route('/pc', {
    name: 'AdministradorReportes',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'ConfigPuntosDeControl'});
    }
});


FlowRouter.route('/empresas/:empresaId', {
    name: 'Empresa',
    action() {

        BlazeLayout.render('LayoutCliente', {administrador: 'DetalleDeEmpresa'});
    }
});


FlowRouter.route('/empresas/:empresaId/ruta/:rutaId', {
    name: 'EmpresaRuta',
    action() {

        BlazeLayout.render('LayoutCliente', {administrador: 'DetalleDeEmpresa'});
    }
});

FlowRouter.route('/empresas/:empresaId/rutas/', {
  name: 'EmpresaRuta',
  action() {
      BlazeLayout.render('LayoutCliente', {administrador: 'ListaDeRutasDespacho'});
  }
})

FlowRouter.route('/admin/entidades', {
    name: 'Entidades',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'Entidades'});
    }
});

FlowRouter.route('/vehiculo/:vehiculoId', {
    name: 'DetalleDeVehiculo',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'DetalleVehiculos'});
    }
});

FlowRouter.route('/admin/planeamiento', {
    name: 'AdministradorPlaneamiento',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'AdministradorPlaneamiento'});
    }
});

FlowRouter.route('/admin/agregaruta', {
    name: 'AdministradorAgregarRuta',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'AdministradorAgregarRuta'});
    }
});

FlowRouter.route('/admin/planeamientos/:empresaId', {
    name: 'AdministradorPlaneamientoPorEmpresa',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'AdministradorPlaneamientoPorEmpresa'});
    }
});

FlowRouter.route('/admin/rutas', {
    name: 'AdministradorRuta',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'AdministradorRutas'});
    }
});

FlowRouter.route('/admin/rastreo', {
    name: 'AdministradorRastreo',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'adminMapaCliente'});
    }
});

FlowRouter.route('/admin/equipo', {
    name: 'AdministradorEquipo',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'AdministradorEquipo2'});
    }
});

FlowRouter.route('/admin/rutas/:empresaId', {
    name: 'AdministradorRutaPorEmpresa',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'AdministradorRutasPorEmpresa'});
    }
});


FlowRouter.route('/admin/agregarplan/ida', {
    name: 'AdministradorAgregarPlaneamiento',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'agregarPlaneamientoIda' /*'AdministradorAgregarPlaneamiento'*/});
    }
});

FlowRouter.route('/admin/agregarplan/vuelta', {
    name: 'AdministradorAgregarPlaneamiento',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'agregarPlaneamientoVuelta' /*'AdministradorAgregarPlaneamiento'*/});
    }
});

FlowRouter.route('/admin/agregarplanhorario/ida', {
    name: 'AdministradorAgregarPlanHorarioIda',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'AgregarPlanHorarioIda'});
    }
});

FlowRouter.route('/admin/agregarplanhorario/vuelta', {
    name: 'AdministradorAgregarPlanHorarioVuelta',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'AgregarPlanHorarioVuelta'});
    }
});

FlowRouter.route('/admin/listas/planeshorarios', {
    name: 'AdministradorListaPlanesHorarios',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'ListaDePlanesHorarios'});
    }
});

FlowRouter.route('/admin/listas/planes', {
    name: 'AdministradorListaPlanes',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'ListaDePlanes'});
    }
});

FlowRouter.route('/admin/listas/planes/2', {
    name: 'AdministradorListaPlanes',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'ListaDePlanes2'});
    }
});

FlowRouter.route('/admin/planeshorarios/editar/:planHorarioId', {
    name: 'EditarPlanHorario',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'EditarPlanHorario'});
    }
});

FlowRouter.route('/admin/planes/editar/:planId', {
    name: 'EditarPlaneamiento',
    action() {
        BlazeLayout.render('LayoutCliente', {administrador: 'EditarPlan'});
    }
});

FlowRouter.route('/admin/listas/despacho', {
  name: 'Despacho.Empresa',
  action() {
    BlazeLayout.render('LayoutCliente', {administrador: 'ListaDeEmpresasDespacho'});
  }
})


FlowRouter.route('/admin/listas/programacion', {
  name: 'Despacho.Empresa',
  action() {
    BlazeLayout.render('LayoutCliente', {administrador: 'ListaDeEmpresasProgramacion'});
  }
})

FlowRouter.route('/admin/:rutaId/rutas', {
  name: 'Rutas.Empresa',
  action() {
    BlazeLayout.render('LayoutCliente', {administrador: 'ListaDeRutasProgramacion'});
  }
})
