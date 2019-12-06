DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(50) NULL,
  price DECIMAL(7,2) NOT NULL,
  stock_quantity INT NOT NULL DEFAULT '1',
  PRIMARY KEY (item_id)
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES(1, "Samsung 82 inch 4k UHD OLED TV", "TV", 3995, 20),(2, "ASUS ROG GZ700GX Laptop", "Computer", 8999, 5),(3, "iPhone X", "Phone", 1199, 435),(4, "ONKYO 7.2 Channel AV Receiver", "Audio", 999, 333),(5, "ACER Predator Helios 300", "Computer", 2196, 288),(6, "Samsung Galaxy S10", "Phone", 1299, 782),(7, "SONY 65 inch 4K UHD LED TV", "TV", 1895, 56),(8, "MSi GT76 Titan", "Computer", 5899, 457),(9, "Hisense 32 inch HD LED TV", "TV", 221, 290),(10, "BOSE Soundbar 500", "Audio", 799, 827);

Select * From products;