Template.ListaDeEmpresasProgramacion.onCreated(() => {
    let template = Template.instance();

    template.searchQuery = new ReactiveVar();
    template.searching = new ReactiveVar(false);
    template.rutaId = new ReactiveVar(false);

    template.autorun(() => {

        template.subscribe('BuscaadorDeEmpresas', template.searchQuery.get(), () => {
            setTimeout(() => {
                template.searching.set(false);
            }, 300);
        });


    });
});

Template.ListaDeEmpresasProgramacion.helpers({
    searching() {
        return Template.instance().searching.get();
    },
    query() {
        return Template.instance().searchQuery.get();
    },
    empresas() {
        let query = {},
            projection = {limit: 40, sort: {nombre: 1}};

        let search = Template.instance().searchQuery.get();
        if (search) {
            let regex = new RegExp(search, 'i');
            query = {
                $or: [
                    {nombre: regex},
                    {ruc: regex}
                ]
            };

            projection.limit = 200;
        }

        return Empresas.find(query, projection);
    }
});

Template.ListaDeEmpresasProgramacion.events({
    'keyup [name="search"]' (event, template) {

        let value = event.target.value.trim();

        //if ( value !== '' && event.keyCode === 13 ) {
        template.searchQuery.set(value);
        template.searching.set(true);
        //}

        if (value === '') {
            template.searchQuery.set(value);
        }
    }
});

Template.ListaDeRutasProgramacion.onCreated( () => {
  let template = Template.instance();
  template.autorun(() => {

      template.subscribe('rutas')


  });
})

Template.ListaDeRutasProgramacion.helpers({
  rutas() {
    return Rutas.find({empresasId: FlowRouter.getParam('rutaId')})
  }
})
