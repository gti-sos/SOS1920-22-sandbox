module.exports = function(app){
	
	const dataStore = require('nedb');
	const path = require('path');
	const baseURL = "/api/v1";
	const dbFileName = path.join(__dirname, "formula1.db");
	
	const db = new dataStore({
		fileName: dbFileName,
		autoload: true
	});
	
	var pilotosInitialData = [
		{ country: 'germany', year:2019, totalpointnumber:568, pilotnumber: 5, victorynumber: 5 },
		{ country: 'france', year:2019, totalpointnumber:32, pilotnumber: 3, victorynumber: 0  },
		{ country: 'united kingdom', year:2014, totalpointnumber:475, pilotnumber: 4, victorynumber: 11 },
		{ country: 'spain', year:2015, totalpointnumber:30, pilotnumber: 3, victorynumber: 0 },
		{ country: 'mexico', year:2016, totalpointnumber:101, pilotnumber: 2, victorynumber: 0 },
		{ country: 'india', year:2017, totalpointnumber:5, pilotnumber: 4, victorynumber: 1 }
	];
	
	app.get(baseURL + "/formula-stats/loadInitialData", (request, response) => {

		console.log("New GET .../loadInitialData");
		/*var formula1 = db.getAllData();
	
		if (formula1.length >= 1) {
			response.sendStatus(409, "CONFLICT(this action would remove the existing data)");
			console.log("There is already loaded data");
		}
		else{
			db.insert(pilotosInitialData);
			response.send(JSON.stringify(pilotosInitialData, null, 2));
			console.log("Initial data loaded"+JSON.stringify(pilotosInitialData, null, 2));
		}*/
		
		db.remove({});
        db.insert(pilotosInitialData);
        response.send(JSON.stringify(pilotosInitialData,null,2));
        console.log("Initial data loaded:"+JSON.stringify(pilotosInitialData,null,2));
	});
	
	app.get(baseURL+"/formula-stats", (request, response) => {
		console.log(Date() + "GET general de Fórmula 1 API");
		
		var query = request.query;
		
		var offset = query.offset;
		var limit = query.limit;
		
		//Variable auxiliar para el query.
		var aux = "";
		
		delete query.offset;
		delete query.limit;
		
		if(query.hasOwnProperty("year")){
			query.year = parseInt(query.year);	
			console.log(query.year);
		}
		//ESTA PROPIEDAD NO HACE DEBIDO A QUE NO HACE FALTA PARSEAR STRINGS!!!!!!!
		/*if(query.hasOwnProperty("country")){
			query.country = parseInt(query.country);
			console.log(query.country);
		}*/
		if(query.hasOwnProperty("totalpointnumber")){
			query.totalpointnumber = parseInt(query.totalpointnumber);
			console.log(query.totalpointnumber);
		}
		if(query.hasOwnProperty("victorynumber")){
			query.victorynumber = parseInt(query.victorynumber);
			console.log(query.victorynumber);
		}
		if(query.hasOwnProperty("pilotnumber")){
			query.pilotnumber = parseInt(query.pilotnumber);
			console.log(query.pilotnumber);
		}
		
		console.log(query);
		
		db.find(query).skip(offset).limit(limit).exec((error, formula1) => {
			formula1.forEach((n) => {
				delete n._id;
		});
		
		if (formula1.length < 1) {
			response.sendStatus(400, "Bad request");
			console.log("Requested data is INVALID");
		}
		else{
			response.send(JSON.stringify(formula1, null, 2));
			console.log("Data sent:"+JSON.stringify(formula1, null, 2));
	
		}});
		
	});
	
	app.post(baseURL + '/formula-stats', (request, response) => {
		console.log(Date() + ' - POST /formula-stats');
		
		var aux = request.body; // Objeto entero - Si quiero acceder a algo concreto con el .name.
		
		if((aux == null) || (aux.country == null) || (aux.year == null) || (aux.totalpointnumber==null) || 	(aux.pilotnumber == null) || (aux.victorynumber == null)){
			response.sendStatus(400, "Falta uno o más campos");
			console.log("POST not created");
		}
		else{
			db.insert(aux);
			response.sendStatus(201, "Post created");
			console.log(JSON.stringify(aux, null, 2));
		}
		
	});
	
	app.put(baseURL + '/formula-stats', (request, response) => {
		console.log(Date() + ' - PUT /formula-stats');
		response.send(405);
	});
	
	app.delete(baseURL + '/formula-stats', (request, response) => {
		console.log(Date() + ' - DELETE /formula-stats');
		
		db.remove({}, {multi:true}, (error, numDelete) => {
			console.log(numDelete + "nationalities deleted");
		});
		response.sendStatus(200, "OK");
	});
	
	app.get(baseURL + '/formula-stats/:country/:year', (request, response) => {
		console.log(Date() + ' - GET /formula-stats/:country/:year');
		
		var aux = request.params.country; //Pillar el contenido después de los dos puntos.
		var year = parseInt(request.params.year);
		
		db.find({"country": aux, "year": year}).exec((err, pilotos) => {
			if(pilotos.length == 1){
				delete pilotos[0]._id;
				
				response.send(JSON.stringify(pilotos[0],null,2));
				console.log("/GET - Recurso Específico /country/year: " + JSON.stringify(pilotos[0]), null, 2);
			}
			else{
				response.sendStatus(404, "Not found");
			}
		});
		
	});
	
	app.post(baseURL + '/formula-stats/:country/:year', (request, response) => {
		//Can we get this variable: var aux = request.params.country.year; ?????
		var aux = request.params.country;
		var year = request.params.year;
		
		console.log(Date() + ' - POST /country/year - Recurso Específico ');
		response.send(405, 'Method not allowed');
		//response.send(405);
	});
	
	app.put(baseURL + '/formula-stats/:country/:year', (request, response) => {
		console.log(Date() + ' - PUT /formula-stats/:country/:year');
		
		var aux = request.params.country; //Pillar el contenido después de los dos puntos.
		var name = request.body.country;
		
		var year = parseInt(request.params.year);
		var yearBody = parseInt(request.body.year);
		
		var body = request.body;
		
		if (aux != name || year != yearBody) {
			response.sendStatus(409);
			console.warn(Date() + ' Hacking Attempt !!!! ');
		}
		else {
			db.update({"country": country, "year": year }, body, (err, pilotosUpdated) => {
				if(pilotosUpdated == 0){
					response.sendStatus(404, "Not found");
				}
				else{
					response.sendStatus(200);
					console.log(Date() + ' - PUT /country - Recurso Específico ');
				}
			});
		}
	});
	
	app.delete(baseURL + '/formula-stats/:country/:year', (request, response) => {
		console.log(Date() + ' - DELETE /formula-stats/:country/:year');
		
		//Lo que hay detrás de los dos puntos no es siempre así.
		var aux = request.params.country; //Pillar el contenido después de los dos puntos.
		var year = parseInt(request.params.year);
		
		db.remove({"country": aux, "year": year}, {multi:true}, (err, pilotsDeleted) => {
			if(pilotosDeleted == 0){
				response.sendStatus(404, "Not found");
			}
			else{
				response.sendStatus(200);
			}
		});
		
	});
	
}