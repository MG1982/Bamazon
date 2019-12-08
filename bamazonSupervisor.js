// Requires
const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");
const chalk = require("chalk");

//Chalk Colours set to variables
const green = chalk.green;
const yellow = chalk.yellow;
const red = chalk.red;

// Messages
const welcomeMessage = "\n\n------------------------------------------------------------------------------------------------\n|                            YOU ARE CURRENTLY IN SUPERVISOR MODE                              |\n------------------------------------------------------------------------------------------------";
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
    console.log(green("connected as id: " + connection.threadId) + yellow(welcomeMessage));
    start();
});

// Initial inquirer prompt asking what the manager what they would like to do
let start = function () {
    inquirer.prompt({
        name: "super",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Product Sales by Department", "Create New Department", "Exit"]
    }).then(function (answer) {
        switch (answer.super) {
            case "View Product Sales by Department":
                viewSales();
                break;
            case "Create New Department":
                newDepartment();
                break;
            case "Exit":
                console.log(yellow(exitMessage))
                connection.end();
                break;
        }
    })
}
let viewSales = function () {
    let query = "Select departments.department_id, departments.department_name, departments.over_head_costs, IFNULL(sum(products.product_sales), 0) as product_sales, IFNULL((SUM(products.product_sales) - departments.over_head_costs), 0) as total_profit FROM products RIGHT OUTER JOIN departments on products.department_name = departments.department_name GROUP BY departments.department_id;";
    connection.query(query, function (err, res) {
        if (err) throw err;
        // Cli-Table display config for products table
        let salesTable = new Table({
            head: [yellow("Department ID"), yellow("Department Name"), yellow("Overhead Costs"), yellow("Product Sales"), yellow("Total Profit")],
            colWidths: [25, 25, 25, 25, 25]
        });
        // For loop that prints all items from database to table
        for (let i = 0; i < res.length; i++) {
            salesTable.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit]);
        }
        // Logs the table to the terminal
        console.log(salesTable.toString());
        start();
    })
}

let newDepartment = function () {
    connection.query("Select * FROM departments", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "department",
                type: "input",
                message: "What is the name of the department you want to add?",
                validate: function (input) {
                    if (input === "" || input === " ") {
                        console.log(red("Please enter a valid name"))
                        return false;
                    }
                    for (let i = 0; i < res.length; i++) {
                        let newDep = res[i].department_name;
                        if (newDep.indexOf(input) > -1) {
                            console.log(red("That deparment name already exists!"))
                        }
                    }
                    return true;
                }
            },
            {
                name: "overhead",
                type: "input",
                message: "What are the overhead costs?",
                validate: function (value) {
                    if (isNaN(value) === false && value > -1) {
                        return true;
                    }
                    console.log(red("Enter a valid amount"));
                    return false;
                }
            }
        ]).then(function (answer) {
            let query = connection.query("INSERT INTO departments SET ?",
                {
                    department_name: answer.department,
                    over_head_costs: answer.overhead
                },
                function (err) {
                    if (err) throw err;
                    console.log(green("\nDepartment Added Successfully\n"))
                    start();
                })
        })
    })
}
