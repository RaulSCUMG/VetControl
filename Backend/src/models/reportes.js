const { pool } = require("../../db");

async function obtenerReporteVentas() {
    const [rows] = await pool.query(`
    select
        fe.fecha_emision,
        p.responsable, 
        fd.descripcion, 
        fe.total   
    from vetcontrol.facturas_encabezado fe   
    inner join vetcontrol.pacientes p on fe.paciente_id = p.id
    inner join vetcontrol.factura_detalle fd on fd.factura_id = fe.id
    order by fe.id`);
return rows;
}

async function ingresosTotales() {
    const [rows] = await pool.query(`
    select SUM(fe.total)    
from vetcontrol.facturas_encabezado fe   
inner join vetcontrol.pacientes p on fe.paciente_id = p.id
inner join vetcontrol.factura_detalle fd on fd.factura_id = fe.id
order by fe.id;`);
    return rows;
}

module.exports = { obtenerReporteVentas }