const { pool } = require("../../db");

async function obtenerReporteVentas() {
    const [rows] = await pool.query(`
        select
        DATE_FORMAT(fe.fecha_emision, '%Y-%m-%d') AS fecha,
        IFNULL(p.responsable,'-') as responsable,
        fd.descripcion as descripcion, 
        fe.total  as total 
        from vetcontrol.facturas_encabezado fe   
        left join vetcontrol.pacientes p on fe.paciente_id = p.id
        inner join vetcontrol.factura_detalle fd on fd.factura_id = fe.id
        order by fe.id;`
    );
    return rows;
}

// async function ingresosTotales() {
//     const [rows] = await pool.query(`
//     select SUM(fe.total)
// from vetcontrol.facturas_encabezado fe
// inner join vetcontrol.pacientes p on fe.paciente_id = p.id
// inner join vetcontrol.factura_detalle fd on fd.factura_id = fe.id
// order by fe.id;`);
//     return rows;
// }

async function obtenerPacientesAcciones() {
    const [rows] = await pool.query(
        `SELECT nombre, 
        especie,  
        facDet.descripcion as descripcion,  
        DATE_FORMAT(facEnc.fecha_emision, '%Y-%m-%d')As fecha 
        FROM PACIENTES paciente
        inner join facturas_encabezado facEnc on paciente.id = facEnc.paciente_id
        inner join factura_detalle facDet on facEnc.id=facDet.id;`
    );
    return rows;
}

async function obtenerInventarios() {
    const [rows] = await pool.query(
        `SELECT producto.codigo as SKU,
        producto.nombre as producto,
        producto.existencia as Existencia,
        producto.stock_minimo as "Minimo disponible"
        FROM PRODUCTOS producto;`
    );
    return rows;
}

async function obtenerDatosCrecimiento() {
    const [rows] = await pool.query(
        `SELECT DATE_FORMAT(facEnc.fecha_emision, '%Y-%m') AS fecha, 
        IFNULL(paciente.nombre,'-') as nombre, 
        IFNULL(paciente.responsable,'-') as responsable, 
        facEnc.total as "ingreso total" 
        FROM facturas_encabezado facEnc 
        left join pacientes paciente on paciente.id = facEnc.paciente_id
        inner join factura_detalle facDet on facEnc.id=facDet.id;`
    );
    return rows;
}

module.exports = {
    obtenerReporteVentas,
    obtenerPacientesAcciones,
    obtenerInventarios,
    obtenerDatosCrecimiento
};
