
import sideNav from '../Utilities/side-nav'

Template.Cliente.onRendered( () => sideNav() )

Template.Administrador.onRendered( () => sideNav() )

Template.Cliente.helpers({
  monitor() {
    if (Roles.userIsInRole(Meteor.userId(), ['monitoreo'], 'Empresa')) {
      return 'modo'
    } else {
      return ''
    }
  }
})
