const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const formula1API = require(path.join(__dirname, "formula1API"));
const basketAPI = require(path.join(__dirname,"basketAPI"));

var baseURL = "/api/v1";//Esto hay que borrarlo una vez hecho todo

const port = process.env.PORT || 3000; //Anyadido para Heroku L05.
const app = express(); //Por convenio se crea así la variable.

app.use(bodyParser.json());
app.use("/", express.static(__dirname+"/public/"));

formula1API(app);
basketAPI(app);

app.listen(port, () => {
	console.log("Server ready fake");
});

console.log("Starting server...");

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




