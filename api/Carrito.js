const { promises: fs } = require('fs')

class Carritos {
    constructor(route) {
        this.route = route;
    }

    async getAllCarts() {
        try {
            const carts = await fs.readFile(this.route, 'utf-8')
            return JSON.parse(carts)
        } catch (error) {
            return []
        }
    }

    async create() {
        const carts = await this.getAllCarts()
        const nId = carts.length == 0 ? 1 : carts[carts.length - 1].id + 1
        const time = Date(Date.now()).toString()
        const save = { productos: [], timestamp: time, id: nId }
        carts.push(save)
        try {
            await fs.writeFile(this.route, JSON.stringify(carts, null, 2))
            return (save)
        } catch (error) {
            return (`Error al guardar: ${error}`)
        }
    }

    async deleteCartByID(id) {
        const carts = await this.getAllCarts()
        const index = carts.findIndex(res => res.id == id)
        if (index == -1) {
            return { error: `carrito no encontrado` }
        }
        carts.splice(index, 1)
        try {
            await fs.writeFile(this.route, JSON.stringify(carts, null, 2))
            return { Mensaje: `carrito borrado` }
        } catch (error) {
            return (`Error al borrar: ${error}`)
        }
    }

    async getByIdProds(id) {
        const carts = await this.getAllCarts()
        const search = carts.find(resp => resp.id == id)
        const prods = search.productos

        try {
            return prods || { error: `productos no encontrados` }
        } catch (error) {
            return (`Error al buscar: ${error}`)
        }
    }

    async saveById(object, id) {
        const carts = await this.getAllCarts()
        const index = carts.findIndex(res => res.id == id)
        const saveIn = carts[index]
        const array = saveIn.productos

        if (index == -1) {
            return {Error: `no se encontró el id ${id}`}
        } else {
            array.push(object)
            try {
                await fs.writeFile(this.route, JSON.stringify(carts, null, 2))
                return saveIn
            } catch (error) {
                return (`Error al actualizar: ${error}`)
            }
        }
    }

    async updateById(id, idp) {
        const carts = await this.getAllCarts()
        const cartIndex = carts.findIndex(res => res.id == id)
        const prods = carts[cartIndex].productos
        const index = prods.findIndex(res => res.idp == idp)

        if (index == -1) {
            return { error: `producto no encontrado` }
        }

        prods.splice(index, 1)
        try {
            await fs.writeFile(this.route, JSON.stringify(carts, null, 2))
            return { mensaje: `producto borrado` }
        } catch (error) {
            return (`Error al borrar: ${error}`)
        }
    }
}

module.exports = Carritos