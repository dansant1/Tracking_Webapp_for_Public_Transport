Template.RecaudacionTPI.onCreated(() => {
    let template = Template.instance();

    template.searchQuery = new ReactiveVar();
    template.searching = new ReactiveVar(false);

    template.autorun(() => {

        template.subscribe('BuscaadorDeEmpresas', template.searchQuery.get(), () => {
            setTimeout(() => {
                template.searching.set(false);
            }, 300);
        });
    });
});

Template.RecaudacionTPI.helpers({
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

Template.RecaudacionTPI.events({
    'keyup [name="search"]' (event, template) {

        let value = event.target.value.trim();

        //if ( value !== '' && event.keyCode === 13 ) {
        template.searchQuery.set(value);
        template.searching.set(true);
        //}
        console.log(value);
        if (value === '') {
            template.searchQuery.set(value);
        }
    }
});

Template.RecaudacionTPIvehiculos.onCreated( () => {
  let template = Template.instance();

  template.searchQuery = new ReactiveVar();
  template.searching = new ReactiveVar(false);


  template.autorun( () => {
    let empresaId = FlowRouter.getParam('empresaId');
    template.subscribe('VehiculosPorEmpresa2', empresaId, template.searchQuery.get(), () => {
        setTimeout(() => {
            template.searching.set(false);
        }, 300);
    })
    template.subscribe('RecaudacionTPI')
  })
})

Template.RecaudacionTPIvehiculos.events({
    'keyup [name="search"]' (event, template) {

        let value = event.target.value.trim();

        //if ( value !== '' && event.keyCode === 13 ) {
        template.searchQuery.set(value);
        template.searching.set(true);
        //}

        if (value === '') {
            template.searchQuery.set(value);
        }
    },
    'change .vehiculo-activo'(e, t) {
      if (e.target.checked) {
        Meteor.call('vehiculoCobrado', e.target.checked, this._id, (err) => {
          if (err) {
            Bert.alert('Hubo un error, vuelva a intentarlo', 'danger')
          } else {
            Bert.alert('Vehiculo Cobrado', 'success')
          }
        })
      } else {
        Meteor.call('vehiculoNoCobrado', this._id, (err) => {
          if (err) {
            Bert.alert('Hubo un error, vuelva a intentarlo', 'danger')
          } else {
            Bert.alert('Vehiculo No Cobrado', 'success')
          }
        })
      }


    }
});

Template.RecaudacionTPIvehiculos.helpers({
  vehiculos() {
    let empresaId = FlowRouter.getParam('empresaId');
    return Vehiculos.find({empresaId: empresaId})
  },
  checked(vehiculoId) {
    let pagado = RecaudacionTPI.find({vehiculoId: vehiculoId}).fetch()[0].pagado;
    console.log(pagado);
    if (pagado) {
      return 'checked'
    } else {
      return ''
    }

  },
  hoy() {
    let hoy = new Date();
    let dd = hoy.getDate();
    var mm = hoy.getMonth() + 1;

    let yyyy = hoy.getFullYear();

    if ( dd < 10 ) {
        dd='0'+dd;
    }

    if ( mm < 10 ) {
        mm='0'+mm;
    }
    var today = dd+'/'+mm+'/'+yyyy;

    return today;
  },
  recaudo() {
    let total = 0;
    let empresaId = FlowRouter.getParam('empresaId')
    let pagos = RecaudacionTPI.find({empresaId: empresaId, pagado: true});

    pagos.forEach( (p) => {
      if (p.plan === 1) {
        total = total + 5
      } else {
        total = total + 8;
      }

    })

    return 'S/ ' + total
  }
})
