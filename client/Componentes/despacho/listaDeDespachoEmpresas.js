Template.ListaDeEmpresasDespacho.onCreated(() => {
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

Template.ListaDeEmpresasDespacho.helpers({
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

Template.ListaDeEmpresasDespacho.events({
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

Template.ListaDeRutasDespacho.onCreated( () => {
  let template = Template.instance();
  template.autorun(() => {
      template.subscribe('rutas')

  });
})

Template.ListaDeRutasDespacho.events({
  'click .dida'() {
    Session.set('Ida', true)
  },
  'click .dvuelta'() {
    Session.set('Ida', false)
  }
})

Template.ListaDeRutasDespacho.helpers({
  rutas() {
    return Rutas.find({empresasId: FlowRouter.getParam('empresaId')})
  }
})
