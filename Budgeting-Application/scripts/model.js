/**
 * The Budget Controller Module will handle all the data.
 * This function returns an object containing all the public functions.
 */
function createModel(){
 
    //Private classes, variables, and functions.
    var data;

    /**
     * Class representing a debit.
     */
    class Expense{
        /**
         * Create an expense
         * @param {number} id 
         * @param {string} description 
         * @param {number} value 
         */
        constructor(id, description, value){
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        }

        calcPercentage(totalIncome){

            if(totalIncome > 0){
                this.percentage = Math.round((this.value / totalIncome) * 100);
            }else{
                this.percentage = -1;
            }

        }

        getPercentage(){
            return this.percentage;
        }  
    }

    /**
     * Class representing a credit.
     */
    class Income{
        /**
         * Create an income
         * @param {number} id 
         * @param {string} description 
         * @param {number} value 
         */
        constructor(id, description, value){
            this.id = id;
            this.description = description;
            this.value = value;
        }
    };

    /**
     * An object that contains all the expense and
     * income items as well as totals.
     */ 
    data = {

        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1

    };

    /**
     *  Calculates totals for a given category of our data
     *  structure and stores it in the appropriate place.
     *  Helper function for the public 'calculateBudget function'.
     * @param {string} type expects 'inc' or 'exp'. 
     */
    function calculateTotal(type){
        var sum = 0;
        data.allItems[type].forEach(function(current){
            sum += current.value;
        });

        data.totals[type] = sum;
    }


    // Return an object containing the public API for the budgetController module.     
    return {

        /**
         * Adds items to the 'data' object.
         * @param {string} type expects 'exp' or 'inc'
         * @param {string} des  description of the item
         * @param {number} val  value of the item
         */
        addItem: function(type, des, val){
            var newItem, ID;

            //Store the current array being accessed in a variable.
            var currentItemArray = data.allItems[type];

            // Create ID based on the id of the last item in the current array.
            if(currentItemArray.length > 0){ // Test for an empty array.
                ID = currentItemArray[currentItemArray.length-1].id +1;
            }else{
                ID = 0;
            }

            // Create the item to be added.
            if( type === 'exp'){
                newItem = new Expense(ID, des, val);
            }else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }

            // Add the item to the array in our data structure...
            currentItemArray.push(newItem);
            

            // and return it.
            return newItem;
        },

        /**
         * Delete the item based on the type and id of the item.
         * @param {string} type expects 'inc' or 'exp'
         * @param {number} id the id (not the index) of the item to be deleted. 
         */
        deleteItem: function(type, id){
            var ids, index;

            ids = data.allItems[type].map(function(curr){
                return curr.id;
            });

            index = ids.indexOf(id);

            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },

        /**
         * Calculates all the budget info and stores it in the 'data' object.
         */
        calculateBudget: function(){

            // Calculate total income and expenses and store it in data.
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the current budget total and store it in data.
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of income spent and store it in data.
            if (data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage = -1;
            }
        },

        /**
         * Calculates the percentages for display.
         */
        calculatePercentages: function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },

        /**
         * Gets percentages from all the expense items and returns them in an Array.
         * @returns an Array containing the percentages to be displayed.
         */
        getPercentages(){
            var allPercentages;

            allPercentages = data.allItems.exp.map(function(curr){
                return curr.getPercentage();
            });

            return allPercentages;
        },

        /**
         * Returns an Object representing our internal data structure.
         * Used for debugging. Use getBudget to get relevent info.
         */
        getData: function(){
            return data;
        },

        /**
         * Returns a simple Object used to map the relevent info
         * to useful labels.
         */
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        }
    };
}