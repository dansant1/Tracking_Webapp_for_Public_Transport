import { handleFile, SubirFotoVehiculo, SubirFotoConductor, SubirFotoCobrador } from '../Utilities/archivos'

Template.LeftMenuEmpresa.helpers({
	monitor() {
    if (Roles.userIsInRole(Meteor.userId(), ['monitoreo'], 'Empresa')) {
      return 'modo-monitor'
    } else {
      return ''
    }
  }
})

Template.LeftMenuEmpresa.events({
	'click .avd'() {
		Modal.show('AgregarVehiculo1');
	},
	'click .avo'() {
		Modal.show('AgregarVehiculoBorrador')
	},
	'click .ac'() {
		Modal.show('AgregarConductor1');
	},
	'click .aco'() {
		Modal.show('AgregarCobrador1');
	},
	'click .ac1'() {
		Modal.show('AgregarConductorBorrador');
	},
	'click .aco1'() {
		Modal.show('AgregarCobradorBorrador');
	}
});

Template.LeftMenuAdministrador.events({
	'click .ae'() {
		Modal.show('agregarEmpresa');
	},
	'click .add__entity'() {
		Modal.show('agregarEntidad');
	},
	'click .add__mantenimiento'() {
		Modal.show('agregarRequisitoVehicular');
	}
});
