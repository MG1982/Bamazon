// Requires
const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");
const chalk = require("chalk");

//Chalk Colours set to variables
const cyan = chalk.cyan;
const green = chalk.green;
const red = chalk.red;

// Messages
const welcomeMessage = "\n\n------------------------------------------------------------------------------------------------\n|                                      WELCOME TO BAMAZON                                      |\n------------------------------------------------------------------------------------------------";
const exitMessage = "\n------------------------------------------------------------------------------------------------\n|                     THANK YOU FOR VISITING WE HOPE TO SEE YOU AGAIN SOON!                    |\n------------------------------------------------------------------------------------------------";

// SQL connection info
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "bootcamp",
    database: "bamazon_DB"
});

// SQL Connection 
connection.connect(function (err) {
    if (err) throw err;
    console.log(green("connected as id: " + connection.threadId) + cyan(welcomeMessage));
    start();
});

// Initial inquirer prompt asking to see product list or exit
let start = function () {
    inquirer.prompt({
        name: "startOrExit",
        type: "list",
        message: "Would you like to see the product list or exit?",
        choices: ["Product List", "Exit"]
    }).then(function (answer) {
        if (answer.startOrExit === "Product List") {
            showProducts();
        } else {
            if (answer.startOrExit === "Exit") {
                console.log(cyan(exitMessage));
                connection.end();
            }
        }
    })
}

// function that shows all products in a table
let showProducts = function () {
    let query = "Select * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        // Cli-Table display config for products table
        let stockTable = new Table({
            head: [cyan("Item ID"), cyan("Product Name"), cyan("Price"), cyan("Quantity")],
            colWidths: [10, 40, 15, 10]
        });
        // For loop that prints all items from database to table
        for (let i = 0; i < res.length; i++) {
            stockTable.push([res[i].item_id, res[i].product_name, "$" + res[i].price.toFixed(2), res[i].stock_quantity]);
        }
        // Logs the table to the terminal
        console.log(stockTable.toString());

        // Inquirer prompt for purchasing items
        inquirer.prompt([{
            name: "ID",
            type: "input",
            message: "Select a product to purchase by it's Item ID",
            validate: function (value) {
                if (isNaN(value) == false && parseInt(value) <= res.length && parseInt(value) > 0) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            name: "QTY",
            type: "input",
            message: "How many would you like to purchase?",
            validate: function (value) {
                if (isNaN(value) == false && parseInt(value) > 0) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        ]).then(function (answer) {
            let selectedID = answer.ID;
            let orderQuantity = answer.QTY;
            confirmStock(selectedID, orderQuantity);
        })
    })
}
// Confirms sufficient stock number and displays total of order for user to review
let confirmStock = function (ID, amount) {
    connection.query("Select * FROM products WHERE item_id = " + ID, function (err, res) {
        if (err) throw err;
        // Calculates total cost after quantity validation
        if (amount <= res[0].stock_quantity) {
            let totalCost = res[0].price * amount;

            // Cli-Table display config for purchase receipt
            let receiptTable = new Table({
                head: [green("QTY"), green("PRODUCT"), green("PRICE"), green("TOTAL")],
                colWidths: [10, 40, 15, 26]
            });
            receiptTable.push([amount, res[0].product_name, "$" + res[0].price.toFixed(2), "$" + totalCost.toFixed(2)]);
            console.log(green("\nYour items are in stock.\n") + receiptTable.toString());
            confirmPurchase(ID, amount, totalCost);
        } else {
            console.log(red("\nSorry we dont have enough " + res[0].product_name + "'s in stock to complete your order.\n"));
            start();
        };
    })
}
// Final confirmation before proceeding with purchase and changing stock numbers in database
let confirmPurchase = function (ID, amount, totalCost) {
    inquirer.prompt({
        name: "confirmPurchase",
        type: "list",
        message: "Would you like to proceed with this purchase?",
        choices: ["Yes", "No"]
    }).then(function (answer) {
        if (answer.confirmPurchase === "Yes") {

            // Update stock QTY in database
            connection.query("UPDATE products SET stock_quantity = stock_quantity - " + amount + " WHERE item_id =" + ID);
            // Add to product sales
            connection.query("UPDATE products SET product_sales = product_sales + " + totalCost + " WHERE item_id =" + ID);
            console.log(green("\nPurchase Successful - Thank you for shopping with BAMAZON.\n\n"));
            start();
        } else {
            if (answer.confirmPurchase === "No") {
                start();
            }
        }
    })
}
