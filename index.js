const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const formula1API = require(path.join(__dirname, "formula1API"));

var baseURL = "/api/v1";

const port = process.env.PORT || 3000; //Anyadido para Heroku L05.
const app = express(); //Por convenio se crea así la variable.

app.use(bodyParser.json());
app.use("/", express.static(__dirname+"/public/"));

formula1API(app);

app.listen(port, () => {
	console.log("Server ready fake");
});

console.log("Starting server...");

// Backlog L03. - 23/03/2020

var pilotosInitialData = [
	{ country: 'germany', year:2019, totalpointnumber:568, pilotnumber: 5, victorynumber: 5 },
	{ country: 'france', year:2019, totalpointnumber:32, pilotnumber: 3, victorynumber: 0  },
	{ country: 'united kingdom', year:2014, totalpointnumber:475, pilotnumber: 4, victorynumber: 11 },
	{ country: 'spain', year:2015, totalpointnumber:30, pilotnumber: 3, victorynumber: 0 },
	{ country: 'mexico', year:2016, totalpointnumber:101, pilotnumber: 2, victorynumber: 0 }
];

//Cargar datos iniciales - Natación - loadInitialData.
app.get(baseURL+"/swim-stats/loadInitialData", (req,res) => {
	nadadores = nadadoresInitialData.slice();
	res.send(200, 'Los datos iniciales se han cargado.');
	console.log("Data sent: "+JSON.stringify(nadadores,null,2));
});

//RECURSOS GENERALES - API REST - Natacion

app.get(baseURL + '/swim-stats', (request, response) => {
	console.log(Date() + ' - GET /swim-stats');
	response.send(nadadores);
});

app.post(baseURL + '/swim-stats', (request, response) => {
	console.log(Date() + ' - POST /swim-stats');
	var aux = request.body;
	nadadores.push(aux);
	response.sendStatus(201);
});

app.put(baseURL + '/swim-stats', (request, response) => {
	console.log(Date() + ' - PUT /swim-stats');
	response.send(405);
});

app.delete(baseURL + '/swim-stats', (request, response) => {
	console.log(Date() + ' - DELETE /swim-stats');
	//swimmers = swimmers;
	nadadores = [];
	response.sendStatus(200);
});

// RECURSOS ESPECÍFICOS - NATACIÓN

app.get(baseURL + '/swim-stats/:position', (request, response) => {
	var aux = request.params.position;
	console.log(Date() + ' - GET /position - Recurso Específico' + aux);
	var filtro = nadadores.filter(n => n.position == aux);
	response.send(filtro[0]);

});

app.post(baseURL + '/swim-stats/:position', (request, response) => {
	var aux = request.params.position;
	console.log(Date() + ' - POST /position - Recurso Específico ' + aux);
	response.send(405, "Method not allowed");
});

app.delete(baseURL + '/swim-stats/:position', (request, response) => {
	var aux = request.params.position;
	console.log(Date() + ' - DELETE /swimmers - Recurso Específico' + aux);
	var filtro = nadadores.filter(n => n.position != aux);
	nadadores = filtro;
	response.sendStatus(200);

});

app.put(baseURL + '/swim-stats/:position', (request, response) => {
	var aux = request.params.position;
	var name = request.body.position;
	if(aux != name){
		response.sendStatus(409);
		console.warn(Date()+ " Hacking Attempt !!!! ");
	}	
	else{
		console.log(Date() + ' - PUT /position - Recurso Específico ' + aux);
		var filtro = nadadores.filter(n => n.position != aux);
		nadadores = filtro;
		nadadores.push(request.body);
		response.sendStatus(200);
	}
});

//Cargar datos iniciales - Baloncesto - loadInitialData.
app.get(baseURL+"/og-basket-stats/loadInitialData", (req,res) => {
	baloncesto = baloncestoInitialData.slice();
	res.send(200);
	console.log("Data sent: "+JSON.stringify(baloncesto,null,2));
})



//RECURSOS GENERALES - API REST - BALONCESTO

app.get(baseURL + '/og-basket-stats', (request, response) => {
	console.log(Date() + ' - GET /og-basket-stats');
	response.send(baloncesto);
});

app.post(baseURL + '/og-basket-stats', (request, response) => {
	console.log(Date() + ' - POST /og-basket-stats');
	var aux = request.body;
	if((aux.year == null)|| (aux.year == "") || (aux == "") ){
		response.send(400, "Bad Request");
	}else{
		baloncesto.push(aux);
		response.send(201, "Created");
	}
});

app.put(baseURL + '/og-basket-stats', (request, response) => {
	console.log(Date() + ' - PUT /og-basket-stats');
	response.send(405, "Method Not Allowed(Put Base Rute)");
});

app.delete(baseURL + '/og-basket-stats', (request, response) => {
	console.log(Date() + ' - DELETE /og-basket-stats');
	baloncesto = []; 
	response.sendStatus(200, "OK");
});

// RECURSOS ESPECÍFICOS - BALONCESTO

app.get(baseURL + '/og-basket-stats/:year', (request, response) => {
	var aux = request.params.year;
	console.log(Date() + ' - GET /year - Recurso Específico' + aux);
	var filtro = baloncesto.filter(n => n.year == aux);
	if(filtro == ""){
		response.sendStatus(400,"Bad Requestt");
	}else{
		response.send(filtro[0]);
	}	
});

app.post(baseURL + '/og-basket-stats/:year', (request, response) => {
	var aux = request.params.year;
	console.log(Date() + ' - POST /year - Recurso Específico ' + aux);
	response.send(405, "Method Not Allowed (Post resource)");
	//response.send(405);
});

app.delete(baseURL + '/og-basket-stats/:year', (request, response) => {
	var aux = request.params.year;
	console.log(Date() + ' - DELETE /basket - Recurso Específico' + aux);
	var filtro = baloncesto.filter(n => n.year != aux);
	baloncesto = filtro;
	response.sendStatus(200,"OK");

});

app.put(baseURL + '/og-basket-stats/:year', (request, response) => {
	var aux = request.params.year;
	var aux2 = request.body;
	if(aux != aux2.year){
		response.send(409,"Conflict (WARNING)");
	}	
	else{
		console.log(Date() + ' - PUT /year - Recurso Específico ' + aux);
		var filtro = baloncesto.filter(n => n.year != aux); 
		banloncesto = filtro; 
		baloncesto.push(request.body);
		response.send(200,"OK");
	}
	
});



