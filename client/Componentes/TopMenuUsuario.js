Template.TopMenuUsuario.events({
	'click .logout'() {

		Meteor.logout();
		FlowRouter.go('/')
	}
});
