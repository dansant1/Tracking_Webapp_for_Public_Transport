import {Meteor} from 'meteor/meteor';
import {Excel} from 'meteor/netanelgilad:excel'
import ROLES from '../../Both/Roles'

function getHorarioNuevo (rango, dia, ida, rutaId, opcion) {
  let r1 = rango.hi.slice(0, 2)
  let r2 = rango.hf.slice(0, 2)
  r1 = parseInt(r1)
  r2 = parseInt(r2)

  let horas = _.range(r1, r2 + 1);

  let u = [];

  let inicio;

  if (opcion === true) {
    if (r1 + 1 > 9) {
      inicio = r1 + ':00'
    }  else {
      inicio = '0' + r1 + ':00'
    }
  } else {
    if (r1 + 1 > 9) {
      inicio = r1 + ':01'
    }  else {
      inicio = '0' + r1 + ':01'
    }
  }





  horas.map( d => {

    if (d > 9) {
      u.push(d + ':00')
    } else {
      u.push( '0' + d + ':00')
    }

  })

  u.shift()

  u.unshift(inicio)
  console.log(dia);
  console.log(ida);
  console.log(rutaId);
  let horario = HorasPorDia.findOne({dia: dia, ida: ida, rutaId: rutaId}).horas

  horario.shift();

  let nuevo_horario = []

  nuevo_horario = _.union(u, horario)

  return nuevo_horario
}

function process(date) {
    if (date === null || date === undefined) {
        return '';
    } else {
        let parts;
        if (date.search("/") !== -1) {
            parts = date.split("/");
            //format dd/mm/yyyy
            return new Date(
                parseInt(parts[2]),
                parseInt(parts[1]) - 1,
                parseInt(parts[0])
            );
        } else {
            //format yyyy-mm-dd
            parts = date.split("-");
            return new Date(
                parseInt(parts[0]),
                parseInt(parts[1]) - 1,
                parseInt(parts[2])
            );
        }
    }

}

function formarJSON(date) {
    if (date === null || date === undefined) {

        return ''
    } else {
        var parts = date.split("/");
        if (parts[2] !== undefined) {
            if (parts[2].length === 2) {

                parts[2] = '20' + parts[2];
            }
        }

        return parts[1] + '/' + parts[0] + '/' + parts[2]
    }

}

Meteor.methods({
  toggleCero(programacionId, cero) {
    ProgramacionVehiculo.update({_id: programacionId}, {
      $set: {
        cero: cero
      }
    })
  },
  crearGrupoHorario(nombre, fecha, ida) {
    let grupoHorarioId = GruposHorarios.insert({
      nombre: nombre,
      fecha: fecha,
      ida: ida,
      createdAt: new Date()
    })
  },
  importarGrupoHorario(grupoHorarioId, rutaId, fecha) {
    let grupoHorario = GruposHorarios.findOne({_id: grupoHorarioId})

    let dia = grupoHorario.fecha;
    let ida = grupoHorario.ida;

    let hayHoras = HorasPorDia.find({dia: fecha, ida: ida, rutaId: rutaId}).fetch();

      console.log(ida);
      console.log(rutaId);
      console.log(dia);

      let plan = Plan.findOne({ activo: false, dia: dia, rutaId: rutaId, ida: ida})

    if (plan === undefined) {
      throw new Meteor.Error('Error', 'No existen planeamientos asociados al dia');
      return;
    }

      Plan.insert({
        activo: false,
        dia: fecha,
        rutaId: rutaId,
        ida: ida,
        programacion: plan.programacion
      })

      let rango;

      plan.programacion.forEach( p => {
        let hi = p.hi.slice(0, 2);
        let hf = p.hf.slice(0, 2)
        if (hi === '00') {
          hi = p.hi.slice(0, 2) + ":00:00"
        } else {
          if (parseInt(p.hi.slice(0, 2)) > 9) {
            hi = p.hi.slice(0, 2) + ":00:00"
          } else {
            //console.log(programacion.hi);
            hi = p.hi.slice(0, 2) + ":00:00"
          }

        }

        if (hf === '00') {
          hf = p.hf.slice(0, 2) + ":00:00"
        } else {
          if (parseInt(p.hf.slice(0, 2)) > 9) {
            hf = p.hf.slice(0, 2) + ":00:00"
          } else {
            //console.log(programacion.hf);
            hf = p.hf.slice(0, 2) + ":00:00"
          }

        }
        CalendarioPlaneamiento.insert({
          ida: ida,
          dia: fecha,
          hora: p.hi + ':' + p.hf,
          planId: Plan.findOne({ activo: false, dia: fecha, rutaId: rutaId})._id,
          rutaId: rutaId,
          title: 'H: ' + p.hi + ' - ' + p.hf + ' F: ' + p.frecuencia,
          start: fecha + 'T' + hi,
          end: fecha + 'T' + hf,
          hi: p.hi,
          hf: p.hf,
          editable: false,
          permitir: false
        })

        rango = {
          hi: p.hi,
          hf: p.hf
        }

      })

      let numeroCalendario = CalendarioPlaneamiento.find({ida: ida, dia: fecha, rutaId: rutaId}).fetch().length
      if (numeroCalendario) {
            let CalendarioId = CalendarioPlaneamiento.find({ida: ida, dia: fecha, rutaId: rutaId}).fetch()[numeroCalendario - 1]._id

            CalendarioPlaneamiento.update({_id: CalendarioId}, {
              $set: {
                permitir: true
              }
            })
      }


      if (hayHoras.length > 0) {
        HorasPorDia.update({dia: fecha, ida: ida, rutaId: rutaId}, {
          $set: {
            primera: true,
            horas: getHorarioNuevo (rango, fecha, ida, rutaId, false)
          }
        })
      } else {
        HorasPorDia.insert({dia: fecha, ida: ida, rutaId: rutaId, horas: getHorarioNuevo (rango, dia, ida, rutaId, false), primera: true, createdAt: new Date()})
      }




  },
  seleccionarVehiculo(vehiculoId) {
    if (Vehiculos.findOne({_id: vehiculoId}).seleccionado === true ) {
      return {
        mensaje: 'Vehiculo no Disponible',
        disponible: false
      }
    } else {
      Vehiculos.update({_id: vehiculoId}, {
        $set: {
          seleccionado: true,
          guardado: false
        }
      })

      return {
        mensaje: '',
        disponible: true
      }
    }


  },
  vehiculosNoGuardado(empresaId) {
    console.log(empresaId);
    Vehiculos.find({empresaId: empresaId, guardado: false}).forEach(v => {
      Vehiculos.update({_id: v._id}, {
        $set: {
          seleccionado: false
        }
      })
    })

  },
  agregarLista(nombre) {
    if (this.userId) {
      Listas.insert({
        nombre: nombre
      })
    } else {
      return;
    }
  },
  guardarPuntosControl(datos) {
    if (this.userId) {
      Rutas.update({_id: datos.rutaId}, {
        $set: {
          'puntosdecontrol': datos.puntos
        }
      })
    } else {
      return;
    }
  },
  obtenerEmpresaId(rutaId) {
    let empresa = Rutas.findOne({_id: rutaId}).empresasId;
    if (empresa) {
      return empresa
    } else {
      return undefined;
    }

  },
  crearProgramacionVehiculo(d) {
        if (this.userId) {
            if (typeof d !== 'undefined') {
                ProgramacionVehiculo.insert(d);
            }
        }
  },
  reasignarVehiculos(programacionVehiculoId, vehiculoId, reqSi, reqNo) {

        if (reqSi && reqNo) {
            ProgramacionVehiculoHistorial.insert({
                progInicialId: programacionVehiculoId,
                vehiculoId,
                reqSi,
                reqNo
            });
        }

        let hoy = new Date();
        let dd = hoy.getDate();
        var mm = hoy.getMonth() + 1;

        let yyyy = hoy.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        let programacionNueva = [];
        let despachoAuxiliar;
        let despachoAnterior;
        let swap = false;

        let programacionActual = ProgramacionVehiculo.findOne({_id: programacionVehiculoId}).programacion;
        console.log(programacionVehiculoId, vehiculoId);
        console.log(programacionActual.length);
        console.log(programacionActual);

        for (let i = 0; i < programacionActual.length; i++) {
            let despacho = programacionActual[i];


            if (swap) {
                despachoAuxiliar = despachoAnterior;
                despachoAnterior = _.clone(despacho);
                despacho["hora"] = despachoAuxiliar["hora"];
                despacho["despachado"] = despachoAuxiliar["despachado"];
                //console.log("swap", i);
            }

            if (despacho["vehiculoId"] === vehiculoId) {
                swap = true;
                despachoAnterior = despacho;
                console.log("found");
                continue;
            }

            programacionNueva.push(despacho);

        }

        ProgramacionVehiculo.update({_id: programacionVehiculoId}, {$set: {programacion: programacionNueva}});
        Vehiculos.update({_id: vehiculoId}, {$set: {espera: true}});

        // // ponemos en espera al vehiculo
        // let despachoDeVehiculoReasignarId = registroId;
        // // = ProgramacionVehiculo.update({_id: registroId}, { $set: { requisitos: false } });
        //
        // //obtenemos la lista de despachos ordenada
        // let despachosOrdered = ProgramacionVehiculo.find({ despachado: false, hora: { $nin: ["","24:00"] } }, { $sort : {datetime: 1 } }).fetch();
        // let reordenar = false;
        // let registroDespachoAuxiliar = { hora: "", datetime: "" };
        //
        // for( let i=0; i<= despachosOrdered.length; i++){
        //
        //   if ( typeof despachosOrdered[i] === 'undefined' ){
        //     break;
        //   }
        //
        //   if ( reordenar ){
        //     ProgramacionVehiculo.update({_id: despachosOrdered[i]._id}, { $set: {
        //         hora: despachosOrdered[i-1].hora,
        //         datetime: despachosOrdered[i-1].datetime
        //     }});
        //   }
        //
        //   if ( despachosOrdered[i]._id === registroId ){
        //     reordenar = true;
        //     ProgramacionVehiculo.update({_id: registroId}, { $set: { requisitos: false } });
        //   }
        //
        // }
        return true;

    },
    AgregarPlaneamientoDelDiaAutomatico(rutaId) {
        if (this.userId) {
            let v = [];
            let empresaId = Meteor.users.findOne({_id: this.userId}).profile.empresaId;
            let vehiculos = Vehiculos.find({empresaId: empresaId});

            vehiculos.forEach((vid) => {
                v.push(vid._id)
            })

            let fecha = new Date();
            let diaNumero = fecha.getDay();

            let hoy = new Date();
            let dd = hoy.getDate();
            var mm = hoy.getMonth() + 1;

            let yyyy = hoy.getFullYear();

            if (dd < 10) {
                dd = '0' + dd;
            }

            if (mm < 10) {
                mm = '0' + mm;
            }
            var today = dd + '/' + mm + '/' + yyyy;

            let planeamiento = Planeamiento.findOne({empresaId: empresaId});

            let diasArray = ["", 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
            let nombreDia = diasArray[diaNumero];

            let horasEnPlaneamientoPorDia = planeamiento.plan.horas[nombreDia];

            horasEnPlaneamientoPorDia.forEach((hora) => {

                ProgramacionVehiculo.insert({
                    vehiculoId: _.sample(v),
                    rutaId: rutaId,
                    empresaId: empresaId,
                    despachado: false,
                    hora: hora,
                    ida: true,
                    dia: today,
                    createdAt: new Date()
                });

            });


        } else {
            return;
        }
    },
    verificarConductorEsAptoParaSalirARuta(conductorId) {
        if (this.userId) {

            let hoy = new Date();
            let dd = hoy.getDate();
            var mm = hoy.getMonth() + 1;

            let yyyy = hoy.getFullYear();

            if (dd < 10) {
                dd = '0' + dd;
            }

            if (mm < 10) {
                mm = '0' + mm;
            }
            var today = dd + '/' + mm + '/' + yyyy;


            let conductor = Conductores.findOne({_id: conductorId});
            let venceLicencia = conductor.licencia.revalidacion;
            let venceCEV = conductor.CEV.caducidad;
            let credencial = conductor.credencial.caducidad;

            let licencia;
            let cev;
            let cred;
            let res = {};

            if (venceLicencia && venceLicencia !== undefined && venceLicencia !== null) {
                if (process(today) < process(venceLicencia)) {
                    licencia = true;
                } else {
                    licencia = false;
                    return {
                        valido: false,
                        razon: `La licencia esta vencida desde ${venceLicencia}`
                    }
                }
            } else {
                return {
                    valido: false,
                    razon: 'El conductor no tiene licencia'
                }
            }

            if (venceCEV && venceCEV !== undefined && venceCEV !== null) {
                if (process(today) < process(venceCEV)) {
                    cev = true;
                } else {
                    cev = false;
                    return {
                        valido: false,
                        razon: `El CEV esa vencido desde el ${venceCEV}`
                    }
                }
            } else {
                return {
                    valido: false,
                    razon: 'El conductor no tiene CEV'
                }
            }

            if (credencial && credencial !== undefined && credencial !== null) {
                if (process(today) < process(credencial)) {
                    cred = true;
                } else {
                    cred = false;
                    return {
                        valido: false,
                        razon: `La credencial esta vencida desde el ${credencial}`
                    }
                }

            } else {
                return {
                    valido: false,
                    razon: 'El conductor no tiene credencial'
                }
            }

            return {
                valido: true,
                razon: 'El conductor cumple con los requisitos'
            }

        } else {
            return;
        }
    },
    verificarCobradorEsAptoParaSalirARuta(cobradorId) {
        if (this.userId) {

            let hoy = new Date();
            let dd = hoy.getDate();
            var mm = hoy.getMonth() + 1;

            let yyyy = hoy.getFullYear();

            if (dd < 10) {
                dd = '0' + dd;
            }

            if (mm < 10) {
                mm = '0' + mm;
            }
            var today = dd + '/' + mm + '/' + yyyy;

            let venceCEV = Cobradores.findOne({_id: cobradorId}).CEV.caducidad;
            let credencial = Cobradores.findOne({_id: cobradorId}).credencial.caducidad;

            let cev;
            let cred;

            if (venceCEV !== undefined && venceCEV !== null) {
                if (process(today) < process(venceCEV)) {
                    cev = true;
                } else {
                    cev = false;
                }
            }

            if (credencial !== undefined && credencial !== null) {
                if (process(today) < process(credencial)) {
                    cred = true;
                } else {
                    cred = false;
                }
            }

            let res = {}
            if (cev && cred) {
                res.valido = true;
                res.razon = 'El cobrador cumple con los requisitos'
            } else {
                res.valido = false;
                if (cred !== true) {
                    res.razon = 'La licencia esta vencido.'
                } else if (cred !== true && cev !== true) {
                    res.razon = 'La licencia y el CEV estan vencidos.'
                } else {
                    res.razon = 'Los documentos del cobrador estan vencidos'
                }
            }

            return res;

        } else {
            return;
        }
    },

    RegistrarVehiculoParaDespachar(registroId, vehiculoId, conductorId, cobradorId, number) {

        if (this.userId) {

            let p = ProgramacionVehiculo.find({ _id: registroId, programacion: { $elemMatch: {vehiculoId: vehiculoId} } }).fetch()
            console.log(p);
            ProgramacionVehiculo.update({ _id: registroId, programacion: { $elemMatch: {vehiculoId: vehiculoId} } }, {
              $set: {
                "programacion.$.despachado": true
              }
            })

            Vehiculos.update({_id: vehiculoId}, {
                $set: {
                    despachado: true,
                    despachadoHora: new Date(),
                    conductorId: conductorId,
                    cobradorId: cobradorId
                }
            })

            Conductores.update({_id: conductorId}, {
                $set: {
                    despachado: true
                }
            })

            Cobradores.update({_id: cobradorId}, {
                $set: {
                    despachado: true
                }
            })

        } else {
            return;
        }

    },
    volver_salir(vehiculoId) {
      if (this.userId) {
        Vehiculos.update({_id: vehiculoId}, {
          $set: {
            espera: false
          }
        })
      }
    },
    agregarRequisito({nombre, activo = true, listaId}){
        Requisitos.insert({
            nombre: nombre,
            createdAt: new Date(),
            activo: activo,
            listaId: listaId
        });
    },
    eliminarRequisito(id){
        Requisitos.remove({_id: id});
    },
    setActivoRequisito(id, activo){
        Requisitos.update({_id: id}, {
            $set: {
                activo: activo
            }
        })
    },

    agregarEmpresa(datos) {

        Empresas.insert({
            nombre: datos.nombre,
            createdAt: new Date(),
            ruc: datos.ruc,
            domicilio: datos.domicilio,
            representante: datos.representante,
            telefono: datos.telefono,
            email: datos.email,
            plan: datos.plan
        });

    },
    eliminarEmpresa(id) {
        Empresas.remove({_id: id});
    },
    agregarEntidad(datos) {
        Entidades.insert({
            nombre: datos.nombre
        });
    },
    eliminarEntidad(id) {
        Entidades.remove({_id: id});
    },
    agregarUsuario(datos, rol) {

        switch (rol) {
            case 2:
                datos.profile.ida = true;
                break;
            case 22:
                datos.profile.ida = false;
                break;

        }

        id = Accounts.createUser(datos);

        if (id) {

            if (rol === 1) {
                Directores.insert({
                    nombre: datos.profile.nombre,
                    empresaId: datos.profile.empresaId,
                    email: datos.email,
                    userId: id
                });
                Roles.addUsersToRoles(id, [ROLES.empresa.director], ROLES.grupos.empresa);
            } else if (rol === 2) {
                Operadores.insert({
                    nombre: datos.profile.nombre,
                    empresaId: datos.profile.empresaId,
                    email: datos.email,
                    userId: id,
                    tipo: 'Operador de Despacho'
                });
                Roles.addUsersToRoles(id, [ROLES.empresa.operador], ROLES.grupos.empresa);
            } else if (rol === 3) {
                Operadores.insert({
                    nombre: datos.profile.nombre,
                    empresaId: datos.profile.empresaId,
                    email: datos.email,
                    userId: id,
                    tipo: 'Operador de Monitoreo'
                });
                Roles.addUsersToRoles(id, [ROLES.empresa.monitoreo], ROLES.grupos.empresa);
            } else if (rol === 22) {
                Operadores.insert({
                    nombre: datos.profile.nombre,
                    empresaId: datos.profile.empresaId,
                    email: datos.email,
                    userId: id,
                    tipo: 'Operador de Despacho'
                });
                Roles.addUsersToRoles(id, [ROLES.empresa.operador], ROLES.grupos.empresa);
            } else {
                Operadores.insert({
                    nombre: datos.profile.nombre,
                    empresaId: datos.profile.empresaId,
                    email: datos.email,
                    userId: id,
                    tipo: 'Operador Asistente'
                });

                Roles.addUsersToRoles(id, ['Operador Asistente'], ROLES.grupos.empresa);
            }

        } else {
            return;
        }
    },
    AgregarAdministrador(datos) {
        id = Accounts.createUser({
            email: datos.email,
            password: datos.password,
        });

        if (id) {
            datos.createdAt = new Date()
            Roles.addUsersToRoles(id, [ROLES.administracion.gerente], ROLES.grupos.administracion);
            Administradores.insert(datos);
        }

    },
    eliminarUsuario(id) {
        Administradores.remove({_id: id})
    },
    generarReporte1() {
        var wopts = {bookType: 'xlsx', bookSST: false, type: 'binary'};
        let excel = new Excel('xlsx');
        var wbout = excel.write(workbook, wopts);

        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }


        saveAs(new Blob([s2ab(wbout)], {type: "application/octet-stream"}), "test.xlsx");
    },
    leerExcel(data, id, rutaId) {

        if (this.userId) {

            let excel = new Excel('xlsx');

            let workbook = excel.read(data, {type: 'binary'});

            let sheet_name_list = workbook.SheetNames;
            let sheet = workbook.Sheets[sheet_name_list[0]];
            let hojaDeConductores = workbook.Sheets[sheet_name_list[1]];
            let hojaDeCobradores = workbook.Sheets[sheet_name_list[2]];

            let datos = excel.utils.sheet_to_json(sheet, {header: 1});
            datos.shift();

            let conductores = excel.utils.sheet_to_json(hojaDeConductores, {header: 1});
            conductores.shift();

            let cobradores = excel.utils.sheet_to_json(hojaDeCobradores, {header: 1});
            cobradores.shift();


            if (Rutas.findOne({_id: rutaId}).nombre !== undefined) {
                if (typeof datos !== 'undefined' && datos.length > 0 && typeof conductores !== 'undefined' && conductores.length > 0 && typeof cobradores !== 'undefined' && cobradores.length > 0) {

                    // Parsear los Vehiculos e insertar en la BD
                    datos.forEach(d => {

                        let obj = d.reduce((acc, cur, i) => {
                            acc[i] = cur;
                            return acc;
                        }, {});

                        let arregloRutas = Rutas.findOne({_id: rutaId}).ida;
                        let p = _.sample(arregloRutas);
                        let posicion = p

                        let tc = []


                        if (obj['1'] !== undefined) {
                            tc.push({
                                numero: obj['32'],
                                entidad: obj['33'],
                                emision: formarJSON(obj['34']),
                                caducidad: formarJSON(obj['35'])
                            })

                            tc.push({
                                numero: obj['16'],
                                entidad: obj['17'],
                                emision: formarJSON(obj['18']),
                                caducidad: formarJSON(obj['19'])
                            })

                            Vehiculos.insert({
                                empresaId: id,
                                activo: true,
                                posicion: posicion,
                                rutaId: rutaId,
                                borrador: false,
                                despachado: false,
                                padron: obj['0'],
                                placa: obj['1'],
                                propietario: {
                                    nombre: obj['2'],
                                    dni: obj['3'],
                                    domicilio: obj['4'],
                                    distrito: obj['5'],
                                    telefono: obj['6'],
                                },
                                tecnico: {
                                    marca: obj['7'],
                                    modelo: obj['8'],
                                    serie: obj['9'],
                                    combustible: obj['10'],
                                    anioDeFabricacion: parseInt(obj['11']),
                                    longitud: obj['12'],
                                    asientos: parseInt(obj['13'])
                                },
                                codigoDeRuta: Rutas.findOne({_id: rutaId}).nombre,
                                fechaDePermanenciaEnLaEmpresa: formarJSON(obj['15']),
                                TC: tc,
                                SOAT: {
                                    numero: obj['20'],
                                    compnia: obj['21'],
                                    inicio: formarJSON(obj['22']),
                                    fin: formarJSON(obj['23'])
                                },
                                CITV: {
                                    numero: obj['24'],
                                    compania: obj['25'],
                                    inicio: formarJSON(obj['26']),
                                    fin: formarJSON(obj['27'])
                                },
                                RC: {
                                    numero: obj['28'],
                                    compania: obj['29'],
                                    inicio: formarJSON(obj['30']),
                                    fin: formarJSON(obj['31'])
                                }
                            });
                        }

                    });

                    let vehiculoId;
                    let placa;
                    // Parsear los conductores e insertar en la BD
                    conductores.forEach(c => {

                        let conductor = c.reduce((acc, cur, i) => {
                            acc[i] = cur;
                            return acc;
                        }, {});

                        placa = conductor['1'];
                        if (placa !== undefined) {

                            if (Vehiculos.find({placa: placa}).fetch()[0]._id === undefined) {
                                vehiculoId = "";
                            } else {
                                vehiculoId = Vehiculos.find({placa: placa}).fetch()[0]._id;
                            }

                        }

                        if (conductor['2'] !== undefined) {

                            Conductores.insert({
                                empresaId: id,
                                vehiculoId: vehiculoId,
                                borrador: false,
                                despachado: false,
                                datos: {
                                    nombre: conductor['3'],
                                    apellido: conductor['2'],
                                    dni: conductor['4'],
                                    caducidad: formarJSON(conductor['5']),
                                    domicilio: conductor['6'],
                                    distrito: conductor['7'],
                                    telefono: conductor['8']
                                },
                                licencia: {
                                    codigo: conductor['9'],
                                    categoria: conductor['10'],
                                    expedicion: formarJSON(conductor['11']),
                                    revalidacion: formarJSON(conductor['12'])
                                },
                                CEV: {
                                    codigo: conductor['13'],
                                    entidad: conductor['14'],
                                    emision: formarJSON(conductor['15']),
                                    caducidad: formarJSON(conductor['16'])
                                },
                                credencial: {
                                    numero: conductor['17'],
                                    emision: formarJSON(conductor['18']),
                                    caducidad: formarJSON(conductor['19'])
                                },
                                chc: conductor['20'],
                                fotocheck: conductor['21']
                            });
                        }


                    });

                    // Parsear los cobradores e insertar en la BD
                    cobradores.forEach(co => {

                        let cobrador = co.reduce((acc, cur, i) => {
                            acc[i] = cur;
                            return acc;
                        }, {});


                        placa = cobrador['1'];

                        if (placa !== undefined) {

                            vehiculoId = Vehiculos.find({placa: placa}).fetch()[0]._id;
                        }


                        if (cobrador['2'] !== undefined) {
                            //console.log(id);
                            Cobradores.insert({
                                empresaId: id,
                                vehiculoId: vehiculoId,
                                borrador: false,
                                despachado: false,
                                datos: {
                                    nombre: cobrador['3'],
                                    apellido: cobrador['2'],
                                    dni: cobrador['4'],
                                    domicilio: cobrador['5'],
                                    distrito: cobrador['6'],
                                    telefono: cobrador['7']
                                },
                                CEV: {
                                    codigo: cobrador['8'],
                                    emision: formarJSON(cobrador['9']),
                                    caducidad: formarJSON(cobrador['10'])
                                },
                                credencial: {
                                    numero: cobrador['11'],
                                    emision: formarJSON(cobrador['12']),
                                    caducidad: formarJSON(cobrador['13'])
                                },
                                chc: cobrador['14'],
                                fotocheck: cobrador['15']
                            });
                        }


                    });

                    return 'Datos Cargados'
                } else {
                    return 'Formato Incorrecto'
                }
            }

        } else {
            return;
        }

    },

    leerPlaneamientoExcel(empresa, ruta, data) {
        let excel = new Excel('xlsx');

        let workbook = excel.read(data, {type: 'binary'});

        let sheet_name_list = workbook.SheetNames;
        let sheet = workbook.Sheets[sheet_name_list[0]];

        let datos = excel.utils.sheet_to_json(sheet, {header: 1});

        datos.shift();
        let plan = {
            horas: {
                lunes: [],
                martes: [],
                miercoles: [],
                jueves: [],
                viernes: [],
                sabado: [],
                domingo: []
            }
        }


        // Parsear los conductores e insertar en la BD
        datos.forEach(c => {

            let hora = c.reduce((acc, cur, i) => {
                acc[i] = cur;
                return acc;
            }, {});

            let value;
            if (hora['0'] !== undefined) {

                Object.keys(plan.horas).forEach((dia) => {

                    if (dia !== 'domingo' && dia !== 'sabado') {
                        value = hora['0']
                    }
                    if (dia === 'sabado') {
                        value = hora['1']
                    }
                    if (dia === 'domingo') {
                        value = hora['2']
                    }

                    plan.horas[dia].push(value);

                });

            }

        });

        if (Planeamiento.find({empresaId: empresa, rutaId: ruta}).fetch().length === 0) {
            Planeamiento.insert({
                empresaId: empresa,
                rutaId: ruta,
                plan: plan
            });

        } else {
            return 'Ya existe un plan de rodamiento para esta empresa y ruta';
        }


    },
    agregarVehiculo(datos) {
        if (this.userId) {
            datos.activo = true;
            let arregloRutas = Rutas.findOne({_id: datos.rutaId}).ida;
            let p = _.sample(arregloRutas);
            let posicion = p
            datos.posicion = posicion;
            datos.borrador = false;
            Vehiculos.insert(datos);
            //agregar posicion de prueba
            // let ruta = Rutas.findOne( datos.rutaId );
            // vehiculo.posicion
            //
        } else {
            return;
        }
    },
    agregarVehiculoBorrador(datos) {
        if (this.userId) {
            let arregloRutas = Rutas.findOne({_id: rutaId}).ida;
            let p = _.sample(arregloRutas);
            let posicion = p
            datos.posicion = posicion;
            datos.activo = true;
            datos.borrador = true;
            Vehiculos.insert(datos);
        } else {
            return;
        }
    },
    aprobarVehiculo(vehiculoId) {
        if (this.userId) {
            Vehiculos.update({_id: vehiculoId}, {
                $set: {
                    borrador: false
                }
            })
        } else {
            return;
        }
    },
    estadoVehiculo(id, estado) {
        if (this.userId) {

            Vehiculos.update({_id: id}, {
                $set: {
                    activo: estado
                }
            });

        } else {
            return;
        }
    },
    agregarConductor(datos) {
        if (this.userId) {
            datos.borrador = false;
            Conductores.insert(datos);
        } else {
            return;
        }
    },
    aprobarConductor(vehiculoId) {
        if (this.userId) {
            Conductores.update({_id: vehiculoId}, {
                $set: {
                    borrador: false
                }
            })
        } else {
            return;
        }
    },
    agregarConductorBorrador(datos) {
        if (this.userId) {
            datos.borrador = true;
            Conductores.insert(datos);
        } else {
            return;
        }
    },
    agregarCobrador(datos) {
        if (this.userId) {
            datos.borrador = false;
            Cobradores.insert(datos);
        } else {
            return;
        }
    },
    aprobarCobrador(vehiculoId) {
        if (this.userId) {
            Cobradores.update({_id: vehiculoId}, {
                $set: {
                    borrador: false
                }
            })
        } else {
            return;
        }
    },
    agregarCobradorBorrador(datos) {
        if (this.userId) {
            datos.borrador = true;
            Cobradores.insert(datos);
        } else {
            return;
        }
    },
    editarVehiculo(vehiculoId, datos) {

        Vehiculos.update({_id: vehiculoId}, {
            $set: {
                placa: datos.placa,
                propietario: datos.propietario,
                tecnico: datos.tecnico,
                compania: datos.compania,
                codigoDeRuta: datos.codigoDeRuta,
                fechaDePermanenciaEnLaEmpresa: datos.fechaDePermanenciaEnLaEmpresa,
                TC: datos.TC,
                SOAT: datos.SOAT,
                CITV: datos.CITV,
                aseguradora: datos.aseguradora,
                RC: datos.RC,
                TCH: datos.TCH
            }
        });
    },
    editarConductor(vehiculoId, datos) {

        Conductores.update({_id: vehiculoId}, {
            $set: {
                datos: datos.datos,
                licencia: datos.licencia,
                CEV: datos.CEV,
                credencial: datos.credencial
            }
        });
    },
    editarCobrador(vehiculoId, datos) {

        Cobradores.update({_id: vehiculoId}, {
            $set: {
                datos: datos.datos,
                CEV: datos.CEV,
                credencial: datos.credencial
            }
        });
    },
    EliminarVehiculo(vehiculoId) {
        Vehiculos.remove({_id: vehiculoId});
    },
    EliminarCobrador(cobradorId) {
        Cobradores.remove({_id: cobradorId});
    },
    EliminarConductor(conductorId) {
        Conductores.remove({_id: conductorId});
    },
    eliminarDirector(directorId) {

        if (this.userId) {
            let userId = Directores.findOne({_id: directorId}).userId;
            Directores.remove({_id: directorId});
            Meteor.users.remove({_id: userId});
        } else {
            return;
        }

    },
    eliminarOperador(operadorId) {

        if (this.userId) {
            let userId = Operadores.findOne({_id: directorId}).userId;
            Operadores.remove({_id: directorId});
            Meteor.users.remove({_id: userId});
        } else {
            return;
        }

    },
    editarEmpresa(datos, empresaId) {
        if (this.userId) {
            Empresas.update({_id: empresaId}, {
                $set: datos
            });
        } else {
            return;
        }
    },
    agregarPlaneamientoEmpresa(datos, empresaId) {

        if (this.userId) {

            let planeamiento = Planeamiento.find({empresaId: empresaId}).fetch().length
            if (planeamiento > 0) {
                Planeamiento.update({empresaId: empresaId}, {
                    $set: {
                        rutaId: datos.rutaId,
                        plan: datos,
                        modificado: new Date()
                    }
                });
            } else {
                Planeamiento.insert({
                    empresaId: empresaId,
                    modificado: new Date(),
                    rutaId: datos.rutaId,
                    plan: datos
                });
            }

        } else {
            return;
        }

    },
    AgregarRuta(datos) {

        if (this.userId) {

            let rutaId = Rutas.insert(datos);

            if (rutaId) {

                Empresas.update({_id: datos.empresasId}, {
                    $push: {
                        rutas: rutaId
                    }
                });

            }


        } else {
            return
        }
    },
    eliminarRuta(rutaId) {
        if (this.userId) {
            Rutas.remove({_id: rutaId});
        } else {
            return;
        }
    },
    despachar({programacionId, hora}){
        let programacion = ProgramacionVehiculo.findOne({_id: programacionId});

        ProgramacionVehiculo.update({_id: programacionId}, {});
        let totalRequisitosVehiculo = Requisitos.find({_id: {$in: vehiculo.idRequisitos}}).count();
        let totalRequisitos = Requisitos.find().count();
        if (!vehiculo.despachado && totalRequisitosVehiculo === totalRequisitos) {
            Despachos.insert({
                deliveredAt: new Date(),
                vehiculoId,
                hora,
                returnedAt: null
            });
            Vehiculos.update({_id: vehiculoId}, {
                $set: {
                    despachado: true
                }
            });
        }
    }
});
