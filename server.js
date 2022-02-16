const express = require('express')
const { Router } = express

const app = express()
const productsRouter = Router()
const cartRouter = Router()
const PORT = 8080 || process.env.PORT

const ApiProductos = require('./api/Productos.js')
const ApiCarritos = require('./api/Carrito.js')
const productos = new ApiProductos('./api/productos.txt') 
const carrito = new ApiCarritos('./api/carrito.txt')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('./public'))
app.use('/api/productos',productsRouter)
app.use('/api/carrito',cartRouter)

// PRODUCTS

productsRouter.get('', (req, res) => {
    productos.getAll().then(resp => res.send(resp))
    // console.log(res);
})

productsRouter.get('/:id', (req, res) => {
    const id = req.params.id
    productos.getById(id).then(resp => res.send(resp))
})

productsRouter.post('/', (req, res) => {
    const toSave = req.body
    // console.log(req.body);
    productos.save(toSave).then(resp => res.send(resp))
})

productsRouter.delete('/:id', (req, res) => {
    const id = req.params.id
    productos.deleteByID(id).then(resp => res.send(resp))
})

// CART

cartRouter.get('', (req, res) => {
    carrito.getAllCarts().then(resp => res.send(resp))
})

cartRouter.post('/', (req, res) => {
    carrito.create().then(resp => res.send(resp))
})

cartRouter.delete('/:id', (req, res) => {
    const id = req.params.id
    carrito.deleteCartByID(id).then(resp => res.send(resp))
})

cartRouter.get('/:id/productos', (req, res) => {
    const id = req.params.id
    carrito.getByIdProds(id).then(resp => res.send(resp))
})

cartRouter.post('/:id/productos/:id_prod', (req, res) =>{
    const id = req.params.id
    const id_prod = req.params.id_prod
    productos.getById(id_prod)
        .then(resp => {
            carrito.saveById(resp, id).then(respo => res.send(respo))
        })
})

cartRouter.delete('/:id/productos/:id_prod', (req, res) =>{
    const id = req.params.id
    const id_prod = req.params.id_prod
    carrito.updateById(id, id_prod).then(resp => res.send(resp))
})







const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
  })
  server.on("error", error => console.log(`Error en servidor ${error}`))
