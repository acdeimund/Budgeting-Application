/**
 * The UIController Module handles the user interface.
 * This function returns an object containing all the public functions.
 */
function createView(){

    // Private classes, variables, and functions.

    /**
     * An object to contain all the strings that refer of DOM objects
     */
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };


    /**
     * Formats the dollar amounts for the UI.
     * @param {number} num the dollar amount to be formated
     * @param {string} type expects 'inc' or 'exp' 
     * @returns: String representing the formatted number.
     */
    function formatNumber(num, type){
        var formatedNum, splitNum, dollarsTemp, sign, dollars, cents;

        dollars = '';
        sign = '';

        // Force into 00.00 format.
        formatedNum = num.toFixed(2);

        // Split the dollars and cents.
        splitNum = formatedNum.split('.');
        dollarsTemp = splitNum[0].split('');
        cents = splitNum[1];

        // Add commas to the dollar amount from back to front.
        for(var i = 0; i < dollarsTemp.length; i++){
            dollars = dollarsTemp[dollarsTemp.length - (i+1)] + dollars;

            //Add the commas every third didget.
            if( dollarsTemp[i+1] && !((i + 1) % 3) ){
                dollars = ',' + dollars;
            }
        }

        // Add dollar sign and + or -.
        dollars = '$' + dollars;
        if(type === 'exp'){
            sign = '- ';
        }else if(type === 'inc'){
            sign = '+ ';
        }
        
        return sign + dollars + '.' + cents;
    }

    //Return an object containing the public API for the UIController module.
    return {

        /**
         * Get the input from the user via the UI.
         * @returns: Object containing input values.
         */
        getInput:   function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, //Will be either 'inc' or 'exp'.
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        /**
         * Get the names of the classes and IDs used in the DOM.
         * @returns: Object containing string representation of DOM classes and IDs.
         */
        getDOMstrings: function(){
            return DOMstrings;
        },

        /**
         * Updates the UI components with budget data.
         * @param {object} budgetData A simple object to map data values to names. 
         */
        displayBudget: function(budgetData){
            var budgetAmount;
            budgetAmount = 0;
            // Test if the budget amount is positive, else leave it at 0;
            if(budgetData.budget > 0){
                budgetAmount = budgetData.budget;
            }
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(budgetAmount);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(budgetData.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(budgetData.totalExp, 'exp');
            
            if( budgetData.percentage > 0 ){
                document.querySelector(DOMstrings.percentageLabel).textContent = budgetData.percentage + '%';
            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        /**
         * Displays the percentage next to an Expense.
         * @param {Array} percentages an Array containing all of the percentages.
         */
        displayPercentages: function(percentages){
            var fields, nodeListForEach;

            fields = document.querySelectorAll(DOMstrings.expPercentageLabel);
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(cur, i){
                if(percentages[i] > 0){
                    cur.textContent = percentages[i] + '%';
                }else{
                    cur.textContent = '---'
                }
            });
        },

        /**
         * displays the month and year on the UI.
         */
        displayMonth: function(){
            var now, year, month, months;

            months = ['January, ', 'February, ', 'March, ', 'April, ', 'May, ', 'June, ',
             'July, ', 'August, ', 'September, ', 'October, ', 'November, ', 'December, ']
            now = new Date();
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + year;
        },

        /**
         * Create and display an html div representing a budget item.
         * @param {budgetItem} obj 
         * @param {string} type expects 'exp' or 'inc'. 
         */
        addListItem: function(obj, type){
            var newHtml, percentageString, element;

            // Assign the type-dependant variables.
            if(type === 'exp'){
                percentageString = '<div class="item__percentage">21%</div>\n';
                element = DOMstrings.expensesContainer;
            }else if(type === 'inc'){
                percentageString = '';
                element = DOMstrings.incomeContainer;
            }
            // Create HTML string.
            newHtml ='<div class="item clearfix" id="' + type + '-' + obj.id + '">\n'+
                     '  <div class="item__description">' + obj.description + '</div>\n'+
                     '  <div class="right clearfix">\n'+
                     '    <div class="item__value">' + formatNumber(obj.value, type) + '</div>\n'+
                     '    ' + percentageString +
                     '    <div class="item__delete">\n'+
                     '      <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n'+
                     '    </div>\n'+
                     '  </div>\n'+
                     '</div>\n';
            

            //Insert HTML into the DOM.
            document.querySelector(element).insertAdjacentHTML('afterbegin', newHtml);
        },

        /**
         * Removes an item from the UI.
         * @param {string} id expects the html element of the node to be removed.
         */
        deleteListItem: function(id){
            var element;
            
            element = document.getElementById(id);
            element.parentNode.removeChild(element)
        },

        /**
         * Changes the color of the fields based on the type of the item being input.
         */
        changedType: function(){
            var fields;

            fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );

            Array.prototype.slice.call(fields).forEach(function(cur){
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },

        /**
         * Clears input fields and returns focus to the first field.
         */
        clearFields: function(){
            var fields, fieldsArray;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(current){
                current.value = "";
            });

            fieldsArray[0].focus();
        }
    };
}