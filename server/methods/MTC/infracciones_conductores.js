const MTC_URL = 'http://slcp.mtc.gob.pe/';

function buscar (licencia) {
  let data, header, response;

  data = JSON.stringify(obener_data_de_busqueda_licencia(licencia));
  //console.log(data);
  headers = obtener_headers()

  response = request({
    url: MTC_URL,
    method: 'POST',
    headers: headers,
    form: data,
    json: true,
    }, (err, res, body) => {
    if (!err) {

      data = parsear_resultado_busqueda(res, licencia, body)
    } else {
      console.log(err);
    }

  })

  return data;
}

function obener_data_de_busqueda_licencia (licencia) {
  return  {
            ScriptManager: 'tUpdatePanel|ibtnBusqNroLic',
            rbtnlBuqueda: '1',
            txtNroLicencia: licencia,
            //hdCodAdministrado:'1550531',
            hdNumTipoDoc: '2',
            hdNumDocumento: licencia.slice(1),
            txtNroResolucion: '',
            txtFechaResolucion: '',
            txtIniSancion: '',
            txtFinSancion: '',
            __EVENTTARGET: 'ibtnBusqNroLic',
            __EVENTARGUMENT: '',
            __LASTFOCUS: null,
            __VIEWSTATE: '',//'IXEzd6D0EwMDCbNtry3t/6684hy89ChQ2hhI9eEAroMHm36QZsZMjgIawZMUjZMtpACD4IkZ92exY+ZKzLNUCnLh+77SMpZUahGcr3DJUqg42IzHQyLSCuxGsBTNKEFXFKT+4ZxKpUq0EvN5yi1QOPnXerw9WRyQu6LEGkTTAL4XuK66rIKMDD7NcsTrI/kvkYFgllJ8LxiMU4Qa+hztR4sblr37C6orGXpn2vN0CjvLTd/tF5Ty9aJyVpPxtwjJ1J43N1GJ3Pdy3BltV8IcGJWZ5dCnKCIS85yLEmQxy81XewpxVvlwX22Jzh8WziX0Vs3j4pUeZ1I4egKtmo/SE/BU7ZzVZDb1sBmm09S6nbYjTcCa0Jkd4QyKhfFrcsthnwBnXTJNyfhmJISvcy1jeS8D/MG7QxjmMKQdpmH7iqKVBRwL2wrJjjIZlyZlUdOp3BUNBw8VRrJtx90sIZ8DgFbhweKehhSQLDylWwT78/nAQXhkxdxnkjo2llHNUtadWmQK6XeIydF2eEHWTEbDU2ImiaOcD8c77VDBLurz750wr0zgUTUyErYl0eTVJ+TxMB+A0mH05IwM+QGSHDrihlShg7PZKWN8Q+zRcf9X05AHervQTBAUK8Ox+iekBxiZJjf7jqb8PQy/KSo1qBti3jYPT0D2OVvyNQajpUOMX6YZz2J5Ld4cUoNEwQ5fcSN2D/yjgFu2FoQOa79Lq9o4fV6gdQftM1hgUZ4hbWQMSNJ5pRjc0bp12lDSrdMnDr/T3HAmxATlMf4RkdrxGvFwFpXFEuDZEVLgmvgnZAzTF+yuG6OcP6YKtPZoEgAsxzVIU/EM5bHkKInycK8tD1+kl5kKj48OnhjV82tdkh91rlyyN3MU5Lijp0XMBMyXa2aZnMAAOzWerGbInXtwdtRHInKZukKLhXnlrBvX4WgNu3uGd5juE79zuFyn7lJ+iNmxStO4rEEgCRN7gSuqDYq4E+DiQTSvf9FlZhfztdKD7j+/+6Zd0a6QzX2XhtQPoz6BqcTCLRbJfefQKhCQ/jnx8d+m54zFBU6EzldzaIwWXURtZ3JQJ360Wb/x84WsOfRdNBpFjhTk6cJPPw1gY1gkdTY4gfyBy9TH/KWDpxcdF1EPUWLD66Z5tvBSwArOlpLyW15U9W37Vm5yZjYNxN2RPK3ZzYRfW6BD2T6U8z6SsFIDeLg7DNiL6WUT3YBsNBjItYMFeObSVSxfY0Teog3QWhVmtnefApTj2beAmDiK2lIWPYKd2+mXqDZpaVkRRbJSL+VvlXktfk2RY61c3aapk9Ej4tpdJva9pOf+FTDczmtzqREJUTm7d1yeirtJSsSFDhvN5b4ucDcZ/RuUOw5tqgIEUDRo4RzDof2OuaNg849GepBoXZNfvHiVfqI4oB+nxb0uvlGVcqx+sTtwsfN++t3OVnwW84Qb3erIvnJm5T+YQvFsr7oo1MfesmkdggnD8EJdN0NKP9SkumQ2IZe7Qs6WgbVgD/TPxCOsQ+Aue4O0CIXac1dF1OxcrVZMrkwil/EKvJ27dTyZ2ShNuCjygcgGcX1QXLsM86APNdVrxFE=',
            __EVENTVALIDATION: '', //'sDMc/RFWouHmZ/oRKzGwrGWMM08GToA++ZS8h/26yJfqj7rjukZXUVD23eRfsOUtKHkYN4QMX1AO/4Y0YEdkAtBeLjntdPBnk8FRCYPb6zwBK2Lzy3VDotaL3h1mxZXSgIZ+JTtD2uDJD1bPHXBlVikn+7DNAIUdrJdSXEoEoByDtc6QC8/VFr4PbF/HRmklxSPWcbTC76nn2Ac6d2HavixZLBaLWpgTZEMLF7DFKUm7r4JH4IYqJEYwfxJYAROHmYYRzFhnq4d1Bd1WDB1JEwwazklQ6Gexdxfh6/L9dQ/db+LMIpvCTaltyQnXc+t+cKvm4tEOoNgmv2l3mZ3YNldXYJilcMIkDYY1XpIN9wnz7JaeAT48I6FUVja7ixtyTyItSNQ++QYHi4X4AkZTEGXltZmV/A7d77ig+Dmh/cqlGmqwlXWZ3zXqtVOVRykry5FEzJnYGBFnDxpwoAp2AfeZRm2ahM0p2qC3NXpvyfNCwDUTfH4IuIIqI2/cGAqd',
            __VIEWSTATEENCRYPTED: '',
            __ASYNCPOST: true
          }
}

function obtener_headers () {
  return  {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'es-419,es;q=0.8',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            //'Cookie':'_ga=GA1.3.81006674.1452990760',
            //'Content-Length':'3934',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Host': 'slcp.mtc.gob.pe',
            'Origin': 'http://slcp.mtc.gob.pe',
            'Referer': 'http://slcp.mtc.gob.pe',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36',
            'X-MicrosoftAjax': 'Delta=true',
            'X-Requested-With': 'XMLHttpRequest'
          }
}

function parsear_resultado_busqueda (response, licencia, body) {
    let data = {'status': 'FOUND', 'licencia': licencia, 'error': false, 'msg_error': ''}
    let $;

    if (response.statusCode == 200) {
      $ = cheerio.load(body);

      if ($) {
         let div_exists = $('div#PnlMensajeNoExisteas')
         console.log(div_exists);
         if ( div_exists === undefined) {
           data['status'] = 'NOT_FOUND'
         }

         console.log(data);
      }
      //console.log('Texto: ');
      //console.log($('#pnlAdministrado').text());
    } else {


      console.log('no funciona');
    }
}

Meteor.methods({
  infracciones_conductores_mtc(conductorId) {
    if (this.userId) {
      buscar('Q25563091');
    } else {
      throw new Meteor.Error('Error', 'No authorized');
    }
  }
})
