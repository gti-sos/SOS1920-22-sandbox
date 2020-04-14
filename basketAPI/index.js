module.exports = function(app){
	console.log(Date() + " Registering Formula 1 API");
	
	const dataStore = require("nedb");
	const path = require("path");
	const baseURL = "/api/v1";
	const dbFileName = path.join(__dirname, "basket.db");
	
	const db = new dataStore({
		filename: dbFileName,
		autoload: true
	});
	
	var baloncestoInitialData = [
		{country:'serbia', year:2016, points:66, threepoints:4, rebounds:33},
		{country:'spain', year:2012, points:100, threepoints:7, rebounds:35},
		{country:'spain', year:2008, points:107, threepoints:8, rebounds:37},
		{country:'italy', year:2004, points:69, threepoints:11, rebounds:26},
		{country:'france', year:2000, points:75, threepoints:6, rebounds:20},
	];
	
//==============================LoadInitialData==============================\\
	
	app.get(baseURL+"/og-basket-stats/loadInitialData", (request,response) =>{
		db.remove({},{multi: true}); //Elimina la db
		db.insert(baloncestoInitialData);
		response.sendStatus(200);
	});
	
//==============================POST-General==============================\\

	app.get(baseURL + '/og-basket-stats', (request, response) => {
		var query = request.query; //Es un String
		console.log(query);
		var offset = query.offset;
		var limit = query.limit;
		
		delete query.offset;
		delete query.limit;

		if(query.hasOwnProperty("country")){//Leemos la url y buscamos el dato que coincida
			query.country = query.country;	
			console.log("Pais: " + query.country);
		}
		
		if(query.hasOwnProperty("year")){
			query.year = parseInt(query.year);	//Si es integer usamos parseInt
			console.log("Año: " + query.year);
		}
		
		if(query.hasOwnProperty("points")){
			query.points = parseInt(query.points);
			console.log("Puntos: " + query.points);
		}

		if(query.hasOwnProperty("threepoints")){
			query.threepoints = parseInt(query.threepoints);
			console.log("Puntos de Tres: " + query.threepoints);
		}
		
		if(query.hasOwnProperty("rebounds")){
			query.rebounds = parseInt(query.rebounds);
			console.log("Rebotes: " + query.rebounds);
		}
		
		console.log(query);
	
		db.find(query).skip(offset).limit(limit).exec((err, basketstats)=>{
			basketstats.forEach((b)=>{  
				delete b._id;   //Borramos el parametro _id
			});
		
		if (basketstats.length < 0) {
			response.sendStatus(400, "Bad request");
			console.log("Requested data is INVALID");
		}
		else{
			response.send(JSON.stringify(basketstats, null, 2));
			console.log("Data sent:"+JSON.stringify(basketstats, null, 2));
		}});
	});
	
//==============================POST-General==============================\\

	app.post(baseURL + '/og-basket-stats', (request, response) => {
		var aux = request.body;
		
		if ((aux==null) || (aux.country==null) || (aux.year==null) || (aux.points==null) || (aux.threepoints==null) || (aux.rebounds==null)){
			response.send(400, "Faltan Campos");
		}else{
			db.insert(aux);
			response.sendStatus(201,"Creado");
		}
	});
	
//==============================PUT-General==============================\\

	app.put(baseURL + '/og-basket-stats', (request, response) =>{
		response.status(405).send("Method Not Allowed(Put Base Rute)");
	});
	
//==============================DELETE-General==============================\\
	
	app.delete(baseURL + '/og-basket-stats', (request, response) => {
		db.remove({},{multi: true});
		response.sendStatus(200, "OK");
	});

//==============================GET-RecursoEspecifico==============================\\

	app.get(baseURL + '/og-basket-stats/:year/:country',(request, response) => {
		var anyo = parseInt(request.params.year);
		var pais = request.params.country;
	
		db.find({"year":anyo,"country":pais}).exec((err, basketstats)=>{
			
			if(basketstats.length==1){
				delete basketstats[0]._id;
				response.send(JSON.stringify(basketstats[0],null,2));
			}else{
				response.status(404).send("No se encuentra")
			}
		});
	});
	
//==============================POST-RecursoEspecifico==============================\\	

	app.post(baseURL + '/og-basket-stats/:year/:country', (request, response) => {
		var aux = request.params.year;
		response.send(405, "Method Not Allowed (Post resource)");
	});

//==============================PUT-RecursoEspecifico==============================\\

	app.put(baseURL + '/og-basket-stats/:year/:country', (request, response) => {
		var anyo = parseInt(request.params.year);
		var auxyear = parseInt(request.body.year);
		
		var pais = request.params.country;
		var aux = request.body;
		
		
		if((anyo != auxyear) || (pais!=aux.country)){
			response.send(409,"Conflict (WARNING)");
		}	
		else{
			db.update({"country":pais,"year":anyo}, aux,(err, newbasketstats)=>{
				if(newbasketstats==0){
					response.status(404).send("Not Found");
				}else{
					response.status(200);
				}
			});
		}
		console.log("fin");
		
	});

//==============================DELETE-RecursoEspecifico==============================\\	
};