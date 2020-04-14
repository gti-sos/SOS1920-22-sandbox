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
		{ country: 'serbia', year:2016, points:66, threepoints: 4, rebounds: 33 },
		{ country: 'spain', year:2012, points:100, threepoints: 7, rebounds: 35 },
		{ country: 'spain', year:2008, points:107, threepoints: 8, rebounds: 37 },
		{ country: 'italy', year:2004, points:69, threepoints: 11, rebounds: 26 },
		{ country: 'france', year:2000, points:75, threepoints: 6, rebounds: 20 },
	];

//==============================LoadInitialData==============================\\
	
	app.get(baseURL+"/og-basket-stats/loadInitialData", (request,response) =>{
		db.insert(baloncestoInitialData);
		response.sendStatus(200);
	});
	
//==============================GetGeneral==============================\\

	app.get(baseURL + '/og-basket-stats', (request, response) => {
		var query = request.query; //Es un String
		console.log(query);
		var offset = query.offset;
		var limit = query.limit;
		
		delete query.offset;
		delete query.limit;

		if(query.hasOwnProperty("country")){
			query.country = parseInt(query.country);	
			console.log("Pais: " + query.country);
		}
		
		if(query.hasOwnProperty("year")){
			query.year = parseInt(query.year);	
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
	
		db.find(query).skip(offset).limit(limit).exec((err, basketstats)=>{
			basketstats.forEach((b)=>{  
				delete b._id;   //Borramos el parametro _id
			});
		response.send(JSON.stringify(basketstats,null,2));
		
		});
			

	});
	
};