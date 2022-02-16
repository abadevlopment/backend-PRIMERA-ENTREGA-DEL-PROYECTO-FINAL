const { promises: fs } = require('fs')

class Productos {
    constructor(route) {
        this.route = route;
    }

    async getAll() {
        try {
            const all = await fs.readFile(this.route, 'utf-8')
            return JSON.parse(all)
        } catch (error) {
            return []
        }
    }

    async getById(id) {
        try {
            const all = await this.getAll()
            const search = all.find(res => res.idp == id)
            return search || { error: `producto no encontrado` }
        } catch (error) {
            throw new Error(`Error al buscar: ${error}`)
        }
    }


    async save(object) {
        const all = await this.getAll()
        const nId = all.length == 0 ? 1 : all[all.length-1].idp + 1
        const time = Date.now()
        const save = { ...object,timestamp: time, idp: nId}
        all.push(save)

        try {
            await fs.writeFile(this.route, JSON.stringify(all, null, 2))
            return save
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`)
        }
    }

    async updateById(object, id) {
        const all = await this.getAll()
        const index = all.findIndex(res => res.idp == id)
        if (index == -1) {
            throw new Error(`Error al actualizar: no se encontró el id ${id}`)
        } else {
            all[index] = object
            try {
                await fs.writeFile(this.route, JSON.stringify(all, null, 2))
            } catch (error) {
                throw new Error(`Error al actualizar: ${error}`)
            }
        }
    }

    async deleteByID(id) {
        const all = await this.getAll()
        const index = all.findIndex(res => res.idp == id)
        if (index == -1) {
            return { error: `producto no encontrado` }
            // throw new Error(`Error al borrar: no se encontró el id ${id}`)
        }
        
        all.splice(index, 1)
        try {
            await fs.writeFile(this.route, JSON.stringify(all, null, 2))
            return { mensaje: `producto borrado` }
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }

    async deleteAll() {
        try {
            await fs.writeFile(this.route, JSON.stringify([], null, 2))
        } catch (error) {
            throw new Error(`Error al borrar todo: ${error}`)
        }
    }
}

module.exports = Productos