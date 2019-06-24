//Lista de variables del tablero y cronometro 
var filas = 4; 
var columnas =4;
var movimientos = 0;
var tiempoInicial = 0;   
var tiempoFinal= 0; 
var diferenciaTiempo = 0; 
var tiempoID = 0;
var tablero;
var listaTablero;  
var textoMovimientos;
var tiempoJugado; 

// Este evento hace que apenas cargue la pagina inicie el juego con cronometro
window.addEventListener( "load", iniciar, false ); 

//Funcion para  definir minutos, segundos etc
function chronometro(){  
	
	tiempoFinal = new Date();
	diferenciaTiempo = tiempoFinal - tiempoInicial;
	diferenciaTiempo = new Date(diferenciaTiempo);
	
	var milisegundos = diferenciaTiempo.getMilliseconds();   
	var segundos = diferenciaTiempo.getSeconds();
	var minutos = diferenciaTiempo.getMinutes();
		
	if (minutos < 10){
		minutos = "0" + minutos;
	}
	if (segundos < 10){
		segundos = "0" + segundos;
	}
	if(milisegundos < 10){				
		milisegundos = "00" +milisegundos;
	}
	else if(milisegundos < 100){
		milisegundos = "0" +milisegundos;
	}
	
	document.getElementById("tiempo").innerHTML =  minutos + ":" + segundos + ":" + milisegundos;
	tiempoJugado =  minutos + ":" + segundos + ":" + milisegundos;
	tiempoID = setTimeout("chronometro()", 10);
}

//Funcion para iniciar Cronometro
function InicioCronometro(){
	document.getElementById("detener").onclick = detenerCronometro;
	document.getElementById("reset").onclick = resetearCronometro;  
	tiempoInicial = new Date();
	chronometro();
}

//Funcion para resetear Cronometro
function resetearCronometro(){
	document.getElementById("tiempo").innerHTML = "0:00:00:000";
	tiempoInicial = new Date();
}

//Funcion para detener-resetear Cronometro
function detenerResetearChronometro(){
	document.getElementById("tiempo").innerHTML = "0:00:00:000";
	document.getElementById("detener").onclick = InicioCronometro;
}

//Funcion para detener Cronometro
function detenerCronometro(){
	document.getElementById("jugar").disabled = false;
	document.getElementById("detener").disabled = true;
	document.getElementById("tablero").style.visibility="hidden";  
	document.getElementById("anuncio").style.visibility="visible";  
	document.getElementById("detener").onclick = detenerResetearChronometro;
	clearTimeout(tiempoID);
}

//Función para contar movimientos y actualizar cantidad en html
function contadorMovimientos()
{
  movimientos++;
  if (textoMovimientos)
  {
    textoMovimientos.innerHTML = movimientos;
  }
}

//Funcion para cargar un juego nuevo
function iniciar() 
{
  document.getElementById("ganador").style.visibility="hidden";  
  var button = document.getElementById("jugar");
  button.addEventListener( "click", juegoNuevo, false );
  textoMovimientos = document.getElementById("cantidadMovimientos");
  tablero = document.getElementById("tablero");
  InicioCronometro();
  juegoNuevo();
}

//Funcion para iniciar un juego
function juegoNuevo()  
{
  var numeros = new Array();
  var datosTablero; 
  var numeroRandom = 0;
  var contador = 0; 
  movimientos = 0;
  
  document.getElementById("ganador").style.visibility="hidden";  
  document.getElementById("jugar").disabled = true;
  document.getElementById("detener").disabled = false;
  document.getElementById("tablero").style.visibility="visible"; 
  document.getElementById("anuncio").style.visibility="hidden";  
  
  textoMovimientos.innerHTML = movimientos;
 
  listaTablero = new Array(filas);
  for (var i = 0; i < filas; i++)
  {
    listaTablero[i] = new Array(columnas);
  }
  datosTablero = new Array( filas * columnas );
  for (var i = 0; i < filas * columnas; i++)
  {
    datosTablero[i] = 0;
  }
 for (var i = 0; i < filas * columnas; i++)
  {
    numeroRandom = Math.floor(Math.random()*filas * columnas);
    if (datosTablero[numeroRandom] == 0) 
    {
      datosTablero[numeroRandom] = 1;
      numeros.push(numeroRandom);
    }
    else 
    {
      i--;
    }
  }
  
  contador = 0;
  for (var i = 0; i < filas; i++)
  {
    for (var j = 0; j < columnas; j++)
    {
      listaTablero[i][j] = numeros[contador];
      
      contador++;
    }
  }
  MostrarTablero();
}

//Cambios de casillas
function revisionMoviemientTablero(rowCoordinate, columnCoordinate, direction)  
{
  filaEscogida = 0; 
  columnaEscogida = 0;
  
  if (direction == "up")
  {
    filaEscogida = -1;
  }
  else if (direction == "down")
  {
    filaEscogida = 1;
  }
  else if (direction == "left")
  {
    columnaEscogida = -1;
  }
  else if (direction == "right")
  {
    columnaEscogida = 1;
  }  
  
  // Revisa la casilla escogida y la traslada a la vacia
  if (rowCoordinate + filaEscogida >= 0 && columnCoordinate + columnaEscogida >= 0 &&
    rowCoordinate + filaEscogida < filas && columnCoordinate + columnaEscogida < columnas
  )
  {
    if ( listaTablero[rowCoordinate + filaEscogida][columnCoordinate + columnaEscogida] == 0)
    {
      listaTablero[rowCoordinate + filaEscogida][columnCoordinate + columnaEscogida] = listaTablero[rowCoordinate][columnCoordinate];
      listaTablero[rowCoordinate][columnCoordinate] = 0;
      MostrarTablero();
      return true;
    }
  }
  return false; 
}

//Funcion para revisar movimiento y revisar tablero
function movimientoCasilla( tableRow, tableColumn)  
{
  if (revisionMoviemientTablero(tableRow, tableColumn, "up") ||
      revisionMoviemientTablero(tableRow, tableColumn, "down") ||
      revisionMoviemientTablero(tableRow, tableColumn, "left") ||
      revisionMoviemientTablero(tableRow, tableColumn, "right") )
  {
    contadorMovimientos();
  }
   
  if (verificadorTablero())
  {
	document.getElementById("ganador").style.visibility="visible";  
	detenerCronometro();
	document.getElementById("tiempo").innerHTML = tiempoJugado;  
	alert("Felicidaddes! Resolvio el puzzle UH con " + movimientos + " movimientos, con un tiempo de: "+ tiempoJugado);
	}
}

function verificadorTablero() 
{
  var contador = 1; 
  for (var i = 0; i < filas; i++)
  {
    for (var j = 0; j < columnas; j++)
    {
      if (listaTablero[i][j] != contador)
      {
	if ( !(contador === filas * columnas && listaTablero[i][j] === 0 ))
	{
	  return false;
	}
      }
      contador++;
    }
  }
  return true;
}

//Funcion para mostrar tablero
function MostrarTablero() 
{
  var casilla = "";  
  for (var i = 0; i < filas; i++)
  {
    casilla += "<tr>";
    for (var j = 0; j < columnas; j++)
    {
      if (listaTablero[i][j] == 0)
      {
		casilla += "<td class=\"blank\"> </td>";
      }
      else
      {
		casilla += "<td class=\"tile\" onclick=\"movimientoCasilla(" + i + ", " + j + ")\">" + listaTablero[i][j] + "</td>";
      }
    } 
    casilla += "</tr>";
  } 
  tablero.innerHTML = casilla;
}

