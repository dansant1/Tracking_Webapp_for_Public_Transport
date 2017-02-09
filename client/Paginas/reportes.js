Template.AdministradorReportes.events({
	'click #generar1'() {

		let externalDataRetrievedFromServer = []

		let vehiculos = Vehiculos.find().map(function (i) {
			externalDataRetrievedFromServer.push({"Fecha": i.fecha, "Responsable": i.responsable.nombre,"Descripción": i.descripcion, "Horas": i.horas, "Costo (S/)": i.precio,"Total (S/)": i.total});
		});


		function buildTableBody(data, columns) {
	    	var body = [];

	    	body.push(columns);

	    	data.forEach(function(row) {
	        	var dataRow = [];

	        	columns.forEach(function(column) {
	            	dataRow.push(row[column].toString());
	        	})

	        	body.push(dataRow);
	    	});

	    	return body;
		}

		function table(data, columns) {
    		return {
        		table: {
            		headerRows: 1,
            		widths: [90, 100, 100, '*', 75, 75],
            		body: buildTableBody(data, columns)
        		}
    		};
		}

		var dd = {
			pageSize: 'A4',
			pageMargins: [ 30, 25, 30, 25 ],
    		content: [
    				{
						stack: [
							'Susana Valladares Caballero',
							{ text: 'Lima, Perú', style: 'subheader' },
						],
						style: 'header'
					},
    			{
						table: {
								body: [
										['Factura #', '00374'],
										['Fecha de facturación', '08 Mayo, 2016'],
										['Balance total', 'S/ 100'],
										['Asunto', 'Daños y Perjuicios c/ empresa SA']
								]
						}
				},
        		{ text: 'Horas', style: 'header' },
        		table(externalDataRetrievedFromServer, ['Fecha', 'Responsable','Descripción', 'Horas', 'Costo (S/)','Total (S/)']),
        		{ text: '', style: 'header' },
        		{
						table: {
								style: 'header',
								body: [
										['Costo total de horas', '100'],
										['Sub total', '100'],
										['Total', 'S/ 100']
								]
						}
				}
    		],
			styles: {
				header: {
					fontSize: 18,
					bold: true,
					alignment: 'right',
					margin: [50,45,0,18]
				},
				subheader: {
					fontSize: 14
				},
				superMargin: {
					margin: [20, 0, 40, 0],
					fontSize: 15,
				}
			}
		}

		// Inicio del proceso de genereacion de pdf
		pdfMake.createPdf(dd).open();
	}
});