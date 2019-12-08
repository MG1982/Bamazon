DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(40) NOT NULL,
  department_name VARCHAR(20) NULL,
  price DECIMAL(7,2) NOT NULL,
  stock_quantity INT NOT NULL DEFAULT '0',
  product_sales DECIMAL(10,2) NOT NULL DEFAULT '0',
  PRIMARY KEY (item_id)
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES
(1, "Samsung 82 inch 4k UHD OLED TV", "TV", 3995.80, 20),
(2, "ASUS ROG GZ700GX Laptop", "Computer", 8999.05, 5),
(3, "iPhone X", "Phone", 1199.99, 435),
(4, "ONKYO 7.2 Channel AV Receiver", "Audio", 999.99, 333),
(5, "ACER Predator Helios 300", "Computer", 2196.15, 288),
(6, "Samsung Galaxy S10", "Phone", 1299.45, 782),
(7, "SONY 65 inch 4K UHD LED TV", "TV", 1895.50, 56),
(8, "MSi GT76 Titan", "Computer", 5899.89, 457),
(9, "Hisense 32 inch HD LED TV", "TV", 221.45, 290),
(10, "BOSE Soundbar 500", "Audio", 799.99, 827);

Select * From products;

CREATE TABLE departments (
	department_id INT NOT NULL auto_increment,
    department_name VARCHAR(20) NOT NULL,
    over_head_costs DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (department_id)
    );
    
INSERT INTO departments (department_id, department_name, over_head_costs)
VALUES
(01, "Audio", 2000),
(02, "Computer", 1000),
(03, "Phone", 300),
(04, "TV", 800);

Select * From departments;  