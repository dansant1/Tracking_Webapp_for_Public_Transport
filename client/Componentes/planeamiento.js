import {Random} from 'meteor/random';

Template.AgregarPlaneamiento.onCreated(() => {
    let self = Template.instance();

    self.planeamiento = new ReactiveVar([
        {
            _id: Random.id(),
            dia: "lunes",
            hinicio: "",
            hfinal: "",
            frecuencia: 20,
            horas: []
        }
    ]);

    self.empresaId = new ReactiveVar(Meteor.user().profile.empresaId);

    self.subscribe('Empresas');
    self.subscribe('Rutas');

    self.autorun(() => {
        // let planeamiento = self.planeamiento.get();

    });

});

Template.AgregarPlaneamiento.helpers({
    planeamiento(){
        return Template.instance().planeamiento.get();
    },
    empresas() {
        return Empresas.findOne({_id: Template.instance().empresaId.get()});
    },
    rutas() {
        return Rutas.find({});
    },
    ruta(id) {
        let ruta = Rutas.findOne({_id: id}) || {nombre: ""};
        return ruta.nombre;
    },
    frecuencias(){
        return Template.instance().frecuencias.get();
    }

});

Template.AgregarPlaneamiento.onRendered(() => {

});

function addMinutes(time/*"hh:mm"*/, minsToAdd/*"N"*/) {
    function z(n) {
        return (n < 10 ? '0' : '') + n;
    }

    let bits = time.split(':');
    let mins = bits[0] * 60 + (+bits[1]) + (+minsToAdd);

    return z(mins % (24 * 60) / 60 | 0) + ':' + z(mins % 60);
}

function converToMinutes(time/*"hh:mm"*/) {
    return parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]);
}

Template.AgregarPlaneamiento.events({
    'keyup input.frecuencia'(e, t) {
        let target = $(e.currentTarget);
        let planId = target.closest(".planeamiento").attr("id");

    },
    'click button.update'(e, t){
        let target = $(e.currentTarget);
        let planeamiento = Template.instance().planeamiento.get();

        let updatedPlaneamiento = {
            _id: target.closest(".planeamiento").attr("id"),
            dia: target.closest(".planeamiento").find(".dia").val(),
            hinicio: target.closest(".planeamiento").find(".hinicio").val(),
            hfinal: target.closest(".planeamiento").find(".hfinal").val(),
            frecuencia: parseInt(target.closest(".planeamiento").find(".frecuencia").val()),
        };

        //Generar Horas
        let horas = [];
        let minutosAlInicio = converToMinutes(updatedPlaneamiento.hinicio);
        let minutosAlFinal = converToMinutes(updatedPlaneamiento.hfinal);
        let minutos = minutosAlInicio;


        // exceptions
        if (!updatedPlaneamiento.hinicio) {
            Bert.alert('Debe ingresar la hora inicial', 'danger', 'growl-top-right');
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        if (!updatedPlaneamiento.hfinal) {
            Bert.alert('Debe ingresar la hora final', 'danger', 'growl-top-right');
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        if (minutosAlInicio > minutosAlFinal) {
            Bert.alert('La hora inicial debe ser mayor a la hora final', 'danger', 'growl-top-right');
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        if (!updatedPlaneamiento.frecuencia) {
            Bert.alert('La frecuencia debe ser mayor a cero', 'danger', 'growl-top-right');
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        let hora = updatedPlaneamiento.hinicio;
        horas.push(updatedPlaneamiento.hinicio);

        //Generar Horas
        while (minutos + updatedPlaneamiento.frecuencia <= minutosAlFinal) {
            hora = addMinutes(hora, updatedPlaneamiento.frecuencia);
            horas.push(hora);
            minutos += updatedPlaneamiento.frecuencia;
        }

        updatedPlaneamiento["horas"] = horas;

        //Actualizar Planeamiento
        for (let i = 0; i < planeamiento.length; i++) {
            if (planeamiento[i]._id === updatedPlaneamiento._id) {
                planeamiento[i] = updatedPlaneamiento;
                break;
            }
        }

        Template.instance().planeamiento.set(planeamiento);

    },
    'click button.agregar'(e, t){
        let planeamiento = Template.instance().planeamiento.get();
        planeamiento.push({
            _id: Random.id(),
            dia: "",
            hinicio: "",
            hfinal: "",
            frecuencia: 20,
            horas: []
        });
        Template.instance().planeamiento.set(planeamiento);
    },
    'click .guardar'(e, t) {

        let datos = {
            rutaId: $('#ruta').val(),
            horas: {
                lunes: [],
                martes: [],
                miercoles: [],
                jueves: [],
                viernes: [],
                sabado: [],
                domingo: []
            }
        };

        // transformando datos a estructura actual de planeamiento

        let planeamiento = Template.instance().planeamiento.get();

        planeamiento.forEach((plan) => {
            datos.horas[plan.dia] = _.union(datos.horas[plan.dia], plan["horas"]);
        });

        let empresaId = Template.instance().empresaId.get();

        if (datos.rutaId !== '1') {

            let archivo = document.getElementById('excelplan');

            if ('files' in archivo) {

                if (archivo.files.length === 0) {
                    Meteor.call('agregarPlaneamientoEmpresa', datos, empresaId, (err) => {
                        if (err) {
                            Bert.alert('Hubo un error, vuelva a intentarlo.', 'danger', 'growl-top-right');
                        } else {
                            FlowRouter.go('/planeamiento');
                            Bert.alert('Planeamiento agregado.', 'success', 'growl-top-right');
                        }
                    });
                } else {

                    let files = archivo.files;

                    let i, f;

                    for (i = 0, f = files[i]; i != files.length; ++i) {

                        let reader = new FileReader();
                        let name = f.name;

                        reader.onload = (e) => {

                            let data = e.target.result;

                            Modal.show('CargandoExcel');
                            Meteor.call('leerPlaneamientoExcel', empresaId, datos.rutaId, data, (err, result) => {
                                if (err) {
                                    Modal.hide('CargandoExcel');
                                    Bert.alert('Hubo un error, vuelva a intentarlo.', 'danger', 'growl-top-right');
                                } else {
                                    Modal.hide('CargandoExcel');
                                    if (result) {
                                        Bert.alert(result, 'success');
                                    } else {
                                        FlowRouter.go('/planeamiento');
                                        Bert.alert('Planeamiento agregado', 'success');
                                    }

                                }
                            });
                        };

                        reader.readAsBinaryString(f);

                    }
                }

            } else {
                Bert.alert('Complete los datos.', 'warning', 'growl-top-right');
            }
        } else {
            Bert.alert('Seleccione una ruta', 'warning', 'growl-top-right');
        }
    }
});

Template.RutasDeLaEmpresa.onCreated(() => {
    let template = Template.instance();

    template.autorun(() => {
        let empresaId = Meteor.user().profile.empresaId
        template.subscribe('DetalleDeEmpresa', empresaId);
        template.subscribe('rutas')
    })
})

Template.RutasDeLaEmpresa.helpers({
    empresa() {
        let empresa = Empresas.findOne({_id: Meteor.user().profile.empresaId});
        return empresa ? empresa.nombre : '';
    },
    rutas() {
        let empresaId = Meteor.user().profile.empresaId
        return Rutas.find({empresasId: empresaId})
    }
})
