import { handleFile, SubirFotoVehiculo, SubirFotoConductor, SubirFotoCobrador } from '../Utilities/archivos'

Template.LeftMenuEmpresa.events({
	'click .av'() {
		Modal.show('AgregarVehiculo');
	},
	'click .ac'() {
		Modal.show('AgregarConductor1');
	},
	'click .aco'() {
		Modal.show('AgregarCobrador1');
	}
});

Template.LeftMenuAdministrador.events({
	'click .ae'() {
		Modal.show('agregarEmpresa');
	}
});