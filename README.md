# SpendWise

SpendWise is a budgeting application designed to help users work with their budget and expenses. The JavaScript foundation allows users to enter their budget and expenses, calculate their remaining balance, and view the results in the browser console.

## JavaScript Concepts Implemented

The project demonstrates several JavaScript concepts, including:

* Variables
* Data types
* User input
* Number conversion
* Arithmetic calculations
* Functions
* Function parameters and return values
* Console output

## How Variables Are Used

Variables are used to store budgeting information and calculation results.

For example:

```javascript
let budget = 50000;
let expenses = 15000;
```

Additional variables store the values entered by the user and the calculated remaining balance.

## How User Input Is Collected

The application uses the JavaScript `prompt()` function to collect the user's budget and expense information.

```javascript
let userBudget = Number(prompt("Enter your budget:"));
let userExpenses = Number(prompt("Enter your total expenses:"));
```

The `Number()` function converts the input into numbers so that JavaScript can perform calculations.

## How Calculations Are Performed

SpendWise calculates the remaining balance by subtracting expenses from the budget.

```javascript
budget - expenses
```

The result represents the amount remaining after expenses have been deducted from the budget.

## How Functions Organize the Code

A reusable function called `calculateBalance()` is used to perform the budget calculation.

```javascript
function calculateBalance(budget, expenses) {
    return budget - expenses;
}
```

The function accepts the budget and expenses as parameters and returns the remaining balance. Using a function keeps the calculation organized and makes it reusable.

## Files

* `index.html` - Contains the structure of the SpendWise webpage.
* `style.css` - Contains the styling for the webpage.
* `script.js` - Contains the JavaScript logic for user input, calculations, functions, and console output.
* `README.md` - Contains information about the project and the JavaScript concepts implemented.

## How to Run

1. Open the project in Visual Studio Code.
2. Open `index.html` using a browser or Live Server.
3. Enter the requested budget when prompted.
4. Enter the total expenses when prompted.
5. Open the browser developer tools and select the Console tab.
6. View the budget, expenses, and remaining balance.
