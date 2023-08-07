const express = require("express")
const cors = require('cors')
require('dotenv').config()
const app = express()
app.use(cors())
app.use(express.static('./public'))
app.use(express.json())
const PORT = process.env.PORT || 8080;
const IP =  process.env.IP || '192.168.1.171';

let jugadores = []
let variable = process.env.MENSAJE;
console.log(variable)

class Jugador {
  constructor(id) {
    this.id = id
  }
  asignarMokepon(mokepon){
    this.mokepon = mokepon
  }
  actualizarPosicion(x,y){
    
    this.x =x,
    this.y =y;
  }
  actualizarAtaques(ataques){
    this.ataques = ataques
  }
}

class Mokepon{
  constructor(nombre){
    this.nombre = nombre
  }
}
app.get("/",(req,res)=>{
  res.sendFile('./public/mokepon.html')
})

app.get("/unirse", (req, res) => {
  const id = `${Math.random()}`

  const jugador = new Jugador(id)

  jugadores.push(jugador)

  res.setHeader("Access-Control-Allow-Origin", "*")
  console.log("un jugador se conecto")
  res.send(id)
})

app.post("/mokepon/:jugadorId",(req,res)=>{
  const jugadorId = req.params.jugadorId || ""
  const nombre = req.body.mokepone || ""
  const mokepon = new Mokepon(nombre)
  const jugadorIndex = jugadores.findIndex((jugador)=>jugadorId ===jugador.id)
  
  if (jugadorIndex >= 0){
    jugadores[jugadorIndex].asignarMokepon(mokepon)
  }

  // console.log('judadores lista',jugadores);
  // console.log('jugadorId',jugadorId);
  res.end()
  
})

app.post("/mokepon/:jugadorId/posicion",(req,res)=>{
  const jugadorId = req.params?.jugadorId || ""
  const{ x , y } = req.body || 0

  const jugadorIndex = jugadores.findIndex((jugador)=>jugadorId ===jugador.id)

  
  if (jugadorIndex >= 0){
   
    jugadores[jugadorIndex].actualizarPosicion(x,y)
  }
 
  
  const enemigos = jugadores.filter(jugador => jugadorId !== jugador.id)

  res.send({enemigos})
})

app.post("/mokepon/:jugadorId/ataques",(req,res)=>{
  const jugadorId = req.params.jugadorId || ""
  const{ ataques } = req.body || []

  const jugadorIndex = jugadores.findIndex((jugador)=>jugadorId ===jugador.id)

  
  if (jugadorIndex >= 0){
   
    jugadores[jugadorIndex].actualizarAtaques(ataques)
  }
 
  
  const enemigos = jugadores.filter(jugador => jugadorId !== jugador.id)

  res.send({enemigos})
})
app.get("/mokepon/:jugadorId/ataques",(req,res)=>{
  const jugadorId = req.params.jugadorId || ""
  const jugador = jugadores.find(jugador=> jugadorId == jugador.id)
  res.json({
    ataques:jugador.ataques || []
  })
})

app.get('/reiniciar',(req,res)=>{

  jugadores = []
  console.log("se va a acavar")
  res.send({
    resiltado:"reiniciar el juego"
  })
})



app.listen(PORT,IP, () => {
  console.log(`Servidor funcionando en el y la direccion IP:${IP} PORT:${PORT}`)
})
