CREATE DATABASE  IF NOT EXISTS `vetcontrol` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `vetcontrol`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: vetcontrol
-- ------------------------------------------------------
-- Server version	8.4.6

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (2,'Accesorios'),(3,'Medicamentos'),(4,'Servicios'),(1,'Vacunas');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `citas`
--

DROP TABLE IF EXISTS `citas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `citas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `paciente_id` int unsigned NOT NULL,
  `veterinario_id` int unsigned DEFAULT NULL,
  `especialidad_id` smallint unsigned DEFAULT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `estado` enum('Programada','Confirmada','Atendida','Cancelada','No asistió') NOT NULL DEFAULT 'Programada',
  `notas` varchar(255) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `paciente_id` (`paciente_id`),
  KEY `veterinario_id` (`veterinario_id`),
  KEY `especialidad_id` (`especialidad_id`),
  CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`),
  CONSTRAINT `citas_ibfk_2` FOREIGN KEY (`veterinario_id`) REFERENCES `empleados` (`id`),
  CONSTRAINT `citas_ibfk_3` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `citas`
--

LOCK TABLES `citas` WRITE;
/*!40000 ALTER TABLE `citas` DISABLE KEYS */;
INSERT INTO `citas` VALUES (1,1,4,8,'2025-09-19 10:00:00','2025-09-19 10:30:00','Programada','tiene mocos','2025-09-18 05:22:43'),(2,2,4,2,'2025-09-15 10:00:00','2025-09-15 10:30:00','Programada','manchas en la lengua','2025-09-18 05:27:11'),(3,2,4,5,'2025-09-19 12:00:00','2025-09-19 13:00:00','Programada','seguimiento','2025-09-18 05:28:00');
/*!40000 ALTER TABLE `citas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleados`
--

DROP TABLE IF EXISTS `empleados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleados` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  `nombre2` varchar(60) DEFAULT NULL,
  `apellido` varchar(60) NOT NULL,
  `apellido2` varchar(60) DEFAULT NULL,
  `apellido_casada` varchar(60) DEFAULT NULL,
  `num_colegiado` varchar(30) DEFAULT NULL,
  `dpi` varchar(20) NOT NULL,
  `telefono` varchar(25) DEFAULT NULL,
  `tipo_empleado_id` int unsigned NOT NULL,
  `especialidad_id` smallint unsigned DEFAULT NULL,
  `activo` tinyint NOT NULL DEFAULT '1',
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_empleados_dpi` (`dpi`),
  KEY `tipo_empleado_id` (`tipo_empleado_id`),
  KEY `especialidad_id` (`especialidad_id`),
  CONSTRAINT `empleados_ibfk_1` FOREIGN KEY (`tipo_empleado_id`) REFERENCES `tipos_empleado` (`id`),
  CONSTRAINT `empleados_ibfk_2` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleados`
--

LOCK TABLES `empleados` WRITE;
/*!40000 ALTER TABLE `empleados` DISABLE KEYS */;
INSERT INTO `empleados` VALUES (1,'Raul','Eduardo','Sologaistoa','Castillo',NULL,NULL,'2408630700108','41285375',5,NULL,1,'2025-09-18 02:14:04'),(2,'Administrador',NULL,'Administrador',NULL,NULL,NULL,'9999999999999','22554422',5,NULL,1,'2025-09-18 02:28:16'),(3,'Alejandro','William','Ochoa','Diaz',NULL,NULL,'2408630700111','41285375',4,NULL,1,'2025-09-18 04:11:32'),(4,'Dylan','Altair','Quevedo',NULL,NULL,NULL,'2408630700112','44556611',1,8,1,'2025-09-18 05:21:13');
/*!40000 ALTER TABLE `empleados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `especialidades`
--

DROP TABLE IF EXISTS `especialidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `especialidades` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `especialidades`
--

LOCK TABLES `especialidades` WRITE;
/*!40000 ALTER TABLE `especialidades` DISABLE KEYS */;
INSERT INTO `especialidades` VALUES (6,'Anestesiología'),(7,'Cardiología'),(1,'Cirugía'),(2,'Dermatología'),(8,'Medicina Interna'),(5,'Neurología'),(3,'Odontología'),(4,'Oftalmología');
/*!40000 ALTER TABLE `especialidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `factura_detalle`
--

DROP TABLE IF EXISTS `factura_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `factura_detalle` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `factura_id` bigint unsigned NOT NULL,
  `producto_id` int unsigned DEFAULT NULL,
  `codigo` varchar(30) DEFAULT NULL,
  `descripcion` varchar(200) NOT NULL,
  `cantidad` decimal(12,3) NOT NULL DEFAULT '1.000',
  `precio_unit` decimal(12,2) NOT NULL,
  `total_linea` decimal(12,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `factura_id` (`factura_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `factura_detalle_ibfk_1` FOREIGN KEY (`factura_id`) REFERENCES `facturas_encabezado` (`id`) ON DELETE CASCADE,
  CONSTRAINT `factura_detalle_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `factura_detalle`
--

LOCK TABLES `factura_detalle` WRITE;
/*!40000 ALTER TABLE `factura_detalle` DISABLE KEYS */;
/*!40000 ALTER TABLE `factura_detalle` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_factura_salida` AFTER INSERT ON `factura_detalle` FOR EACH ROW BEGIN
  IF NEW.producto_id IS NOT NULL THEN
    UPDATE productos SET existencia = existencia - NEW.cantidad WHERE id = NEW.producto_id;
    INSERT INTO movimientos_inventario(producto_id, tipo, cantidad, precio_unit, referencia, ref_id, notas)
    VALUES (NEW.producto_id, 'SALIDA', NEW.cantidad, NEW.precio_unit, 'FACTURA', NEW.factura_id, 'Salida por factura');
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `facturas_encabezado`
--

DROP TABLE IF EXISTS `facturas_encabezado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facturas_encabezado` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `serie` varchar(30) DEFAULT NULL,
  `numero` varchar(30) NOT NULL,
  `fecha_emision` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `paciente_id` int unsigned DEFAULT NULL,
  `nit` varchar(25) DEFAULT NULL,
  `direccion` varchar(180) DEFAULT NULL,
  `subtotal` decimal(12,2) NOT NULL DEFAULT '0.00',
  `impuestos` decimal(12,2) NOT NULL DEFAULT '0.00',
  `descuentos` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total` decimal(12,2) NOT NULL DEFAULT '0.00',
  `usuario_id` int unsigned DEFAULT NULL,
  `estado` enum('Emitida','Anulada','Pagada') NOT NULL DEFAULT 'Emitida',
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero` (`numero`),
  KEY `paciente_id` (`paciente_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `facturas_encabezado_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`),
  CONSTRAINT `facturas_encabezado_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facturas_encabezado`
--

LOCK TABLES `facturas_encabezado` WRITE;
/*!40000 ALTER TABLE `facturas_encabezado` DISABLE KEYS */;
/*!40000 ALTER TABLE `facturas_encabezado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimientos_inventario`
--

DROP TABLE IF EXISTS `movimientos_inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientos_inventario` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `producto_id` int unsigned NOT NULL,
  `tipo` enum('ENTRADA','SALIDA','AJUSTE') NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unit` decimal(12,2) DEFAULT NULL,
  `referencia` varchar(30) DEFAULT NULL,
  `ref_id` bigint unsigned DEFAULT NULL,
  `notas` varchar(255) DEFAULT NULL,
  `usuario_id` int unsigned DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `producto_id` (`producto_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `movimientos_inventario_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`),
  CONSTRAINT `movimientos_inventario_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientos_inventario`
--

LOCK TABLES `movimientos_inventario` WRITE;
/*!40000 ALTER TABLE `movimientos_inventario` DISABLE KEYS */;
/*!40000 ALTER TABLE `movimientos_inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pacientes`
--

DROP TABLE IF EXISTS `pacientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pacientes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `especie` varchar(60) NOT NULL,
  `raza` varchar(80) DEFAULT NULL,
  `sexo` enum('Macho','Hembra','Otro') NOT NULL DEFAULT 'Macho',
  `fecha_nacimiento` date DEFAULT NULL,
  `vacunas` varchar(255) DEFAULT NULL,
  `alergias` varchar(255) DEFAULT NULL,
  `tratamientos` varchar(255) DEFAULT NULL,
  `responsable` varchar(120) NOT NULL,
  `telefono_resp` varchar(25) DEFAULT NULL,
  `correo_resp` varchar(120) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pacientes`
--

LOCK TABLES `pacientes` WRITE;
/*!40000 ALTER TABLE `pacientes` DISABLE KEYS */;
INSERT INTO `pacientes` VALUES (1,'Tayzon','Perro','Cruzado','Macho','2024-04-01','ninguna','ninguna','ninguno','Dylan Sologaistoa','41285375','dylans@gmail.com','2025-09-18 05:01:12'),(2,'Michi','Gato','tuxeado','Macho','2020-03-15','ninguna','ninguna','riñones','Christian Diaz','22554466','christiand@gmail.com','2025-09-18 05:02:54');
/*!40000 ALTER TABLE `pacientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pantallas`
--

DROP TABLE IF EXISTS `pantallas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pantallas` (
  `id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(40) NOT NULL,
  `nombre` varchar(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pantallas`
--

LOCK TABLES `pantallas` WRITE;
/*!40000 ALTER TABLE `pantallas` DISABLE KEYS */;
INSERT INTO `pantallas` VALUES (1,'dashboard','Dashboard'),(2,'pacientes','Pacientes'),(3,'citas','Citas'),(4,'inventario','Inventario'),(5,'facturacion','Facturación'),(6,'reportes','Reportes'),(7,'empleados','Empleados'),(8,'usuarios','Usuarios'),(9,'roles','Roles'),(10,'pantallas','Pantallas');
/*!40000 ALTER TABLE `pantallas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(30) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `categoria_id` smallint unsigned DEFAULT NULL,
  `proveedor_id` int unsigned DEFAULT NULL,
  `existencia` int NOT NULL DEFAULT '0',
  `stock_minimo` int NOT NULL DEFAULT '0',
  `precio` decimal(12,2) NOT NULL DEFAULT '0.00',
  `activo` tinyint NOT NULL DEFAULT '1',
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'P000001','Rabia Canina',1,NULL,150,5,350.00,1,'2025-09-18 04:27:33'),(2,'P000002','Consulta General',4,NULL,0,0,150.00,1,'2025-09-18 04:28:44');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrador'),(3,'Bodega'),(2,'Recepción'),(5,'Recursos Humanos'),(4,'Veterinario');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles_pantallas`
--

DROP TABLE IF EXISTS `roles_pantallas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles_pantallas` (
  `rol_id` int unsigned NOT NULL,
  `pantalla_id` tinyint unsigned NOT NULL,
  PRIMARY KEY (`rol_id`,`pantalla_id`),
  KEY `pantalla_id` (`pantalla_id`),
  CONSTRAINT `roles_pantallas_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `roles_pantallas_ibfk_2` FOREIGN KEY (`pantalla_id`) REFERENCES `pantallas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles_pantallas`
--

LOCK TABLES `roles_pantallas` WRITE;
/*!40000 ALTER TABLE `roles_pantallas` DISABLE KEYS */;
INSERT INTO `roles_pantallas` VALUES (1,1),(2,1),(3,1),(5,1),(1,2),(2,2),(1,3),(2,3),(1,4),(3,4),(1,5),(2,5),(1,6),(2,6),(3,6),(1,7),(5,7),(1,8),(5,8),(1,9),(1,10);
/*!40000 ALTER TABLE `roles_pantallas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_empleado`
--

DROP TABLE IF EXISTS `tipos_empleado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_empleado` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(40) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_empleado`
--

LOCK TABLES `tipos_empleado` WRITE;
/*!40000 ALTER TABLE `tipos_empleado` DISABLE KEYS */;
INSERT INTO `tipos_empleado` VALUES (5,'Administrador'),(3,'Bodega'),(4,'Facturación'),(2,'Recepción'),(1,'Veterinario');
/*!40000 ALTER TABLE `tipos_empleado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `empleado_id` int unsigned NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `clave_hash` varchar(255) NOT NULL,
  `rol_id` int unsigned NOT NULL,
  `activo` tinyint NOT NULL DEFAULT '1',
  `ultimo_login` datetime DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`),
  KEY `empleado_id` (`empleado_id`),
  KEY `rol_id` (`rol_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`id`),
  CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,2,'admin','$2b$10$AxVlPNHl/3ClKfTO/qBd9.loOgR7aszP.fvnItI7tqdZ8XVd1Oh0a',1,1,NULL,'2025-09-18 02:28:38'),(2,1,'rauls','$2b$10$S/wxDATeykhlHpvQ/u52FeDs6Yo/q2ZZmLhTVbSMVDQMXBR.Bekle',1,1,'2025-09-17 23:18:10','2025-09-18 02:36:43');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_stock_bajo`
--

DROP TABLE IF EXISTS `v_stock_bajo`;
/*!50001 DROP VIEW IF EXISTS `v_stock_bajo`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_stock_bajo` AS SELECT 
 1 AS `id`,
 1 AS `codigo`,
 1 AS `nombre`,
 1 AS `existencia`,
 1 AS `stock_minimo`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping routines for database 'vetcontrol'
--

--
-- Final view structure for view `v_stock_bajo`
--

/*!50001 DROP VIEW IF EXISTS `v_stock_bajo`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_stock_bajo` AS select `productos`.`id` AS `id`,`productos`.`codigo` AS `codigo`,`productos`.`nombre` AS `nombre`,`productos`.`existencia` AS `existencia`,`productos`.`stock_minimo` AS `stock_minimo` from `productos` where ((`productos`.`activo` = 1) and (`productos`.`existencia` <= `productos`.`stock_minimo`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-17 23:30:43
