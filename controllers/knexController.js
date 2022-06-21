import crearKnex from 'knex'

export default class KnexConfig {
    constructor(config, tabla, createTable) {
        this.conexion = crearKnex(config);
        this.tabla = tabla;
        createTable(this.conexion, tabla);
    }
    async save(producto) {
        await this.conexion.insert(producto).into(this.tabla)
            .then(() => { console.log(`Agregado a la DB`, producto); })
            .catch(error => { console.log(error); })
        return producto;
    }
    async updateById(id, producto) {
        await this.conexion.from(this.tabla).where('id', id).update(producto)
            .then(() => { console.log(`Id:${id} actualizado`); })
            .catch(error => { console.log(error); })
    }
    async getAll() {
        let contenido;
        await this.conexion.from(this.tabla).select('*')
            .then(rows => { contenido = rows; })
            .catch(error => { console.log(error); })
        return contenido;
    }
}