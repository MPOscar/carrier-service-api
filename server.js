## código mainapp
const http = require ('http');

const hostname = '54.167.87.144';
puerto const = 3000;

servidor const = http.createServer ((req, res) => {
	res.statusCode = 200;
  	res.setHeader ('Content-Type', 'text / plain');
  	res.end ('¡Esta es la aplicación principal! \ n');
});

server.listen (puerto, nombre de host, () => {
  	console.log (`Servidor ejecutándose en http: // $ {hostname}: $ {port} /`);
});
## código adminside
const http = require ('http');

const hostname = '54.167.87.144';
puerto const = 3001;

servidor const = http.createServer ((req, res) => {
	res.statusCode = 200;
  	res.setHeader ('Content-Type', 'text / plain');
  	res.end ('¡Este es el lado del administrador! \ n');
});

server.listen (puerto, nombre de host, () => {
  	console.log (`Servidor ejecutándose en http: // $ {hostname}: $ {port} /`);
});