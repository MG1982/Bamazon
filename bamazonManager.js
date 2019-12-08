// Requires
const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");
const chalk = require("chalk");

//Chalk Colours set to variables
const green = chalk.green;
const red = chalk.red;

// Messages
const welcomeMessage = "\n\n------------------------------------------------------------------------------------------------\n|                               YOU ARE CURRENTLY IN MANAGER MODE                              |\n------------------------------------------------------------------------------------------------";
const exitMessage = "\n------------------------------------------------------------------------------------------------\n|                                         UPDATES SAVED                                        |\n------------------------------------------------------------------------------------------------";

// SQL connection info
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_DB"
});

// SQL Connection 
connection.connect(function (err) {
    if (err) throw err;
    console.log(green("connected as id: " + connection.threadId) + red(welcomeMessage));
    start();
});

// Initial inquirer prompt asking what the manager what they would like to do
let start = function () {
    inquirer.prompt({
        name: "manage",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }).then(function (answer) {
        switch (answer.manage) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "Exit":
                console.log(red(exitMessage))
                connection.end();
                break;
        }
    })
}

let viewProducts = function () {
    let query = "Select * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        // Cli-Table display config for products table
        let stockTable = new Table({
            head: ["Item ID", "Product Name", "Department", "Price", "Quantity"],
            colWidths: [10, 40, 15, 15, 10]
        });
        // For loop that prints all items from database to table
        for (let i = 0; i < res.length; i++) {
            stockTable.push([res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price.toFixed(2), res[i].stock_quantity]);
        }
        // Logs the table to the terminal
        console.log(stockTable.toString());
        start();
    })
}

let lowInventory = function () {
    connection.query("Select * FROM products", function (err, res) {
        if (err) throw err;
        // Cli-Table display config for products table
        let lowStockTable = new Table({
            head: ["Item ID", "Product Name", "Department", "Price", "Quantity"],
            colWidths: [10, 40, 15, 15, 10]
        });
        // For loop that prints all items from database to table
        for (let i = 0; i < res.length; i++) {
            if (res[i].stock_quantity <= 5) {
                lowStockTable.push([res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price.toFixed(2), res[i].stock_quantity]);
            }
        }
        // Logs the table to the terminal
        console.log(lowStockTable.toString());
        start();
    })
}

let addInventory = function () {
    connection.query("Select * FROM products", function (err, res) {
        if (err) throw err;
        let productArray = [];
        for (let i = 0; i < res.length; i++) {
            productArray.push(res[i].product_name);
        }
        inquirer.prompt([
            {
                name: "product",
                type: "list",
                message: "Which product do you want to change?",
                choices: productArray
            },
            {
                name: "QTY",
                type: "input",
                message: "How much would you like to enter?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }]).then(function (answer) {
                let currentQTY;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].product_name === answer.product) {
                        currentQTY = res[i].stock_quantity;
                    }
                }
                connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: currentQTY + parseInt(answer.QTY) }, { product_name: answer.product }], function (err, res) {
                    if (err) throw err;
                    console.log(green("\nStock Quantity Updated Successfully\n"));
                    start();
                })
            })
    });
}

let addProduct = function () {
    connection.query("Select * FROM products", function (err, result) {
        if (err) throw err;
        let departmentArray = [];
        for (let i = 0; i < result.length; i++) {
            departmentArray.push(result[i].department_name);
        }
        let choices = Array.from(new Set(departmentArray));
        inquirer.prompt([
            {
                name: "item",
                type: "input",
                message: "What is the name of the new product?"
            },
            {
                name: "department",
                type: "list",
                message: "What department?",
                choices: choices
            },
            {
                name: "price",
                type: "input",
                message: "What would you like the price to be?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }

            },
            {
                name: "QTY",
                type: "input",
                message: "How many will you be adding?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (answer) {
            connection.query("INSERT INTO products SET ?",
                {
                    product_name: answer.item,
                    department_name: answer.department,
                    price: answer.price || 0,
                    stock_quantity: answer.QTY
                },

                function (err) {
                    if (err) throw err;
                    console.log(green("\nNew Product Successfully Created\n"));
                    start();
                })
        })
    })
}
