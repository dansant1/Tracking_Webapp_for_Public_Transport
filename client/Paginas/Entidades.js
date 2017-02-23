Template.Entidades.onCreated(() => {
    let template = Template.instance();

    template.searchQuery = new ReactiveVar();
    template.searching = new ReactiveVar(false);

    template.autorun(() => {

        template.subscribe('BuscadorEntidades', template.searchQuery.get(), () => {
            setTimeout(() => {
                template.searching.set(false);
            }, 300);
        });

    });

});

Template.Entidades.helpers({
    query() {
        return Template.instance().searchQuery.get();
    },
    entidades() {
        let query = {},
            projection = {limit: 40, sort: {nombre: 1}};

        let search = Template.instance().searchQuery.get();
        if (search) {
            let regex = new RegExp(search, 'i');
            query = {
                $or: [
                    {nombre: regex}
                ]
            };

            projection.limit = 200;
        }

        return Entidades.find(query, projection);
    }
});

Template.Entidades.events({

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
    'click .add__entity'() {
        Modal.show('agregarEntidad');
    },
    'click .delete__entity'() {
        swal({
                title: "¿Estas seguro?",
                text: "Se eliminaran todos los datos de la entidad",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Si, Eliminar Entidad",
                closeOnConfirm: false
            },
            () => {
                Meteor.call('eliminarEntidad', this._id, (err) => {
                    if (err) {
                        alert(err);
                    } else {
                        swal("Eliminado!", "", "success");
                    }
                });
            });

    },

});

Template.agregarEntidad.onRendered(function () {


});

Template.agregarEntidad.events({

    'click .send__entity__data'() {
        var datos = {
            nombre: $('.form__add__entity').find('input[name="nombre"]').val()
        };

        if (datos.nombre != "") {
            Meteor.call('agregarEntidad', datos, (err) => {
                if (err) {
                    alert(err);
                } else {
                    Modal.hide('agregarEntidad');
                }
            })
        } else {
            alert('Ingrese datos validos');
        }
    }

});