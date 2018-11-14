/**
 * The controller is responsible for controlling the 
 * communication of the other modules as well as the 
 * flow of the application. All of the other modules 
 * are passed into this one as arguments. Returns an
 * object containing functions to run the application.
 */
function createController(){
    var budgetCtrl, UICtrl;

    budgetCtrl = createModel();
    UICtrl = createView();

    /**
     * A helper function for setUpEventListeners.
     */
    function updateBudget(){
        var budget;

        // Calculate the budget.
        budgetCtrl.calculateBudget();

        // Return the budget.
        budget = budgetCtrl.getBudget();

        // Display the budget on the UI.
        UICtrl.displayBudget(budget);
    }
    
    /**
     * A helper function for setUpEventListeners. 
     */
    function updatePercentages(){
        var percentages;

        // Calculate percentages
        budgetCtrl.calculatePercentages();

        // Read percentages from the buget controler
        percentages = budgetCtrl.getPercentages();

        // Update the UI
        UICtrl.displayPercentages(percentages);
    }   
    
    /**
     * A helper function for setUpEventListeners. 
     */
    function ctrlAddItem(){
        var input, newItem;
        
        // Get the field input data.
        input = UICtrl.getInput();

        // Validate input.
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){

            // Add the item to the budget controller.
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // Add the item to the UI.
            UICtrl.addListItem(newItem, input.type);

            // Clear input fields.
            UICtrl.clearFields();

            // Calculate and update budget.
            updateBudget();

            // Calculate the expense percentages.
            updatePercentages();
            // Debugging
            //console.log(budgetCtrl.getData());
        }
    }

    /**
     * A helper function for setUpEventListeners. 
     * @param {event} event the event to be acted on.
     */
    function ctrlDeleteItem(event){
        var itemId, splitId, type, id;

        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        // Check if the item clicked has an id and split it up into useful parts.
        // itemId looks like this 'exp-0'.
        if(itemId){
            splitId = itemId.split('-');
            type = splitId[0];
            id = parseInt(splitId[1]);

            // Delete the item from the data structure.
            budgetCtrl.deleteItem(type, id);

            // Remove the item from the interface.
            UICtrl.deleteListItem(itemId);

            // Update the budget
            updateBudget();
        }
    }

    /**
     * Set up all the event listeners.
     */
    function setupEventListeners(){
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13){
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType)
    }

    //Return an object containing any functins needed to run the application. 
    return{
        
        /**
         * Set up and run the application.
         */
        init: function(){
            setupEventListeners();
            UICtrl.displayMonth();
        }
    }

}