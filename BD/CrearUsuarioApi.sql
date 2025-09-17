USE vetcontrol;
CREATE USER 'vetcontrol'@'localhost' IDENTIFIED BY 'V3tC0ntro1!';
GRANT ALL PRIVILEGES ON vetcontrol.* TO 'vetcontrol'@'localhost';
FLUSH PRIVILEGES;