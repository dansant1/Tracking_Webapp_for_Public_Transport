let lunes = new ReactiveArray([])
let martes = new ReactiveArray([])
let miercoles = new ReactiveArray([])
let jueves = new ReactiveArray([])
let viernes = new ReactiveArray([])
let sabado = new ReactiveArray([])
let domingo = new ReactiveArray([])

Template.EditarPlan.onCreated( () => {
  let template = Template.instance()

  template.autorun( () => {
    template.subscribe('planes2');
    template.subscribe('PlanesHorarios')
  })
})

Template.EditarPlan.onRendered( () => {
  let t = Template.instance()

  t.autorun( () => {


    let planId = FlowRouter.getParam('planId');
    let plan = Plan.findOne({_id: planId}).plan;
    lunes.set(plan.lunes)
    martes.set(plan.martes)
    miercoles.set(plan.miercoles)
    jueves.set(plan.jueves)
    viernes.set(plan.viernes)
    sabado.set(plan.sabado)
    domingo.set(plan.domingo)
  })

})

Template.EditarPlan.helpers({
  lunes() {
    return lunes.get()
  },
  hi() {
    console.log(this.valueOf());
    return PlanesHorarios.findOne({_id: this.valueOf()}).hi;
  },
  hf() {
    return PlanesHorarios.findOne({_id: this.valueOf()}).hf;
  },
  f() {
    return PlanesHorarios.findOne({_id: this.valueOf()}).frecuencia;
  },
  martes() {
    return martes.get()
  },
  miercoles() {
    return miercoles.get()
  },
  jueves() {
    return jueves.get()
  },
  viernes() {
    return viernes.get()
  },
  sabado() {
    return sabado.get()
  },
  domingo() {
    return domingo.get()
  }
})

Template.EditarPlan.events({
  'click .a1'() {
    let planId = FlowRouter.getParam('planId');
    let plan = Plan.findOne({_id: planId}).ida;
    console.log(plan);
    if (plan) {
      Modal.show('seleccionarPlanHorarioIda01')
    } else {
      Modal.show('seleccionarPlanHorarioVuelta01')
    }

  },
  'click .a2'() {
    let planId = FlowRouter.getParam('planId');
    let plan = Plan.findOne({_id: planId}).ida;
    if (plan) {
      Modal.show('seleccionarPlanHorarioIda02')
    } else {
      Modal.show('seleccionarPlanHorarioVuelta02')
    }
  },
  'click .a3'() {
    let planId = FlowRouter.getParam('planId');
    let plan = Plan.findOne({_id: planId}).ida;
    if (plan) {
      Modal.show('seleccionarPlanHorarioIda03')
    } else {
      Modal.show('seleccionarPlanHorarioVuelta03')
    }
  },
  'click .a4'() {
    let planId = FlowRouter.getParam('planId');
    let plan = Plan.findOne({_id: planId}).ida;
    if (plan) {
      Modal.show('seleccionarPlanHorarioIda04')
    } else {
      Modal.show('seleccionarPlanHorarioVuelta04')
    }
  },
  'click .a5'() {
    let planId = FlowRouter.getParam('planId');
    let plan = Plan.findOne({_id: planId}).ida;
    if (plan) {
      Modal.show('seleccionarPlanHorarioIda05')
    } else {
      Modal.show('seleccionarPlanHorarioVuelta05')
    }
  },
  'click .a6'() {
    let planId = FlowRouter.getParam('planId');
    let plan = Plan.findOne({_id: planId}).ida;
    if (plan) {
      Modal.show('seleccionarPlanHorarioIda06')
    } else {
      Modal.show('seleccionarPlanHorarioVuelta06')
    }
  },
  'click .a7'() {
    let planId = FlowRouter.getParam('planId');
    let plan = Plan.findOne({_id: planId}).ida;
    if (plan) {
      Modal.show('seleccionarPlanHorarioIda07')
    } else {
      Modal.show('seleccionarPlanHorarioVuelta07')
    }
  },
  'click #remove'() {
      lunes.remove(this.valueOf())
  },
  'click #remove2'() {
      martes.remove(this.valueOf())
  },
  'click #remove3'() {
      miercoles.remove(this.valueOf())
  },
  'click #remove4'() {
      jueves.remove(this.valueOf())
  },
  'click #remove5'() {
      viernes.remove(this.valueOf())
  },
  'click #remove6'() {
      sabado.remove(this.valueOf())
  },
  'click #remove7'() {
      domingo.remove(this.valueOf())
  },
  'click [name="guardar-plan"]'(e, t) {
    let plan = {
        lunes: lunes.get(),
        martes: martes.get(),
        miercoles: miercoles.get(),
        jueves: jueves.get(),
        viernes: viernes.get(),
        sabado: sabado.get(),
        domingo: domingo.get()
    }

    let planId = FlowRouter.getParam('planId');

    if (typeof plan.lunes !== 'undefined' && plan.lunes.length > 0 && typeof plan.martes !== 'undefined' && plan.martes.length > 0 && typeof plan.miercoles !== 'undefined' && plan.miercoles.length > 0 ) {

      if ( typeof plan.jueves !== 'undefined' && plan.jueves.length > 0 && typeof plan.viernes !== 'undefined' && plan.viernes.length > 0 && typeof plan.sabado !== 'undefined' && plan.sabado.length > 0 ) {

        if ( typeof plan.domingo !== 'undefined' && plan.domingo.length > 0 ) {
          Meteor.call('editarPlan', plan, planId, (err) => {
            if (err) {
              Bert.alert('Hubo un Error, vuela a intentarlo', 'danger')
            } else {
              Bert.alert('Planeamiento Editado', 'success')
              FlowRouter.go('/admin/listas/planes')
            }
          })
        }
      }

    } else {
      Bert.alert('complete los datos', 'danger');
    }

  }
})

Template.seleccionarPlanHorarioIda01.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioIda01.helpers({
  planes() {
    return PlanesHorarios.find({ida: true});
  }
})

Template.seleccionarPlanHorarioIda01.events({
  'click .as'() {
    lunes.push(this._id)
  }
})


Template.seleccionarPlanHorarioIda02.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioIda02.helpers({
  planes() {
    return PlanesHorarios.find({ida: true});
  }
})

Template.seleccionarPlanHorarioIda02.events({
  'click .as'() {
    martes.push(this._id)
  }
})

Template.seleccionarPlanHorarioIda03.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioIda03.helpers({
  planes() {
    return PlanesHorarios.find({ida: true});
  }
})

Template.seleccionarPlanHorarioIda03.events({
  'click .as'() {
    miercoles.push(this._id)
  }
})

Template.seleccionarPlanHorarioIda04.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioIda04.helpers({
  planes() {
    return PlanesHorarios.find({ida: true});
  }
})

Template.seleccionarPlanHorarioIda04.events({
  'click .as'() {
    jueves.push(this._id)
  }
})

Template.seleccionarPlanHorarioIda05.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioIda05.helpers({
  planes() {
    return PlanesHorarios.find({ida: true});
  }
})

Template.seleccionarPlanHorarioIda05.events({
  'click .as'() {
    viernes.push(this._id)
  }
})

Template.seleccionarPlanHorarioIda06.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioIda06.helpers({
  planes() {
    return PlanesHorarios.find({ida: true});
  }
})

Template.seleccionarPlanHorarioIda06.events({
  'click .as'() {
    sabado.push(this._id)
  }
})

Template.seleccionarPlanHorarioIda07.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioIda07.helpers({
  planes() {
    return PlanesHorarios.find({ida: true});
  }
})

Template.seleccionarPlanHorarioIda07.events({
  'click .as'() {
    domingo.push(this._id)
  }
})

// Vuelta
Template.seleccionarPlanHorarioVuelta01.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioVuelta01.helpers({
  planes() {
    return PlanesHorarios.find({ida: false});
  }
})

Template.seleccionarPlanHorarioVuelta01.events({
  'click .as'() {
    lunes.push(this._id)
  }
})


Template.seleccionarPlanHorarioVuelta02.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioVuelta02.helpers({
  planes() {
    return PlanesHorarios.find({ida: false});
  }
})

Template.seleccionarPlanHorarioVuelta02.events({
  'click .as'() {
    martes.push(this._id)
  }
})

Template.seleccionarPlanHorarioVuelta03.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioVuelta03.helpers({
  planes() {
    return PlanesHorarios.find({ida: false});
  }
})

Template.seleccionarPlanHorarioVuelta03.events({
  'click .as'() {
    miercoles.push(this._id)
  }
})

Template.seleccionarPlanHorarioVuelta04.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioVuelta04.helpers({
  planes() {
    return PlanesHorarios.find({ida: false});
  }
})

Template.seleccionarPlanHorarioVuelta04.events({
  'click .as'() {
    jueves.push(this._id)
  }
})

Template.seleccionarPlanHorarioVuelta05.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioVuelta05.helpers({
  planes() {
    return PlanesHorarios.find({ida: false});
  }
})

Template.seleccionarPlanHorarioVuelta05.events({
  'click .as'() {
    viernes.push(this._id)
  }
})

Template.seleccionarPlanHorarioVuelta06.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioVuelta06.helpers({
  planes() {
    return PlanesHorarios.find({ida: false});
  }
})

Template.seleccionarPlanHorarioVuelta06.events({
  'click .as'() {
    sabado.push(this._id)
  }
})

Template.seleccionarPlanHorarioVuelta07.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('PlanesHorarios')
  })

})

Template.seleccionarPlanHorarioVuelta07.helpers({
  planes() {
    return PlanesHorarios.find({ida: false});
  }
})

Template.seleccionarPlanHorarioVuelta07.events({
  'click .as'() {
    domingo.push(this._id)
  }
})
