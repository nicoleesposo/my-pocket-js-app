const balanceEl = document.querySelector(".balance h4");
const incomeTotalEl = document.querySelector(".income h4");
const outcomeTotalEl = document.querySelector(".expense h4");
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const allEl = document.querySelector("#all");
const incomeList = document.querySelector("#income .card-table-container .list");
const expenseList = document.querySelector("#expense .card-table-container .list");
const allList = document.querySelector("#all .list");
const currDate = document.querySelector(".balance .date");

// Menu Tabs
const expenseBtn = document.querySelector(".main .sidebar .toggle .tab1");
const incomeBtn = document.querySelector(".main .sidebar .toggle .tab2");
const allBtn = document.querySelector(".main .sidebar .toggle .tab3");

// Expense
const addExpense = document.querySelector(".add-expense");
const expenseTitle = document.getElementById("expense-title-input");
const expenseAmount = document.getElementById("expense-amount-input");

// Income
const addIncome = document.querySelector(".add-income");
const incomeTitle = document.getElementById("income-title-input");
const incomeAmount = document.getElementById("income-amount-input");

// variables
let ENTRY_LIST;
let balance = 0, income = 0, outcome = 0;
const DELETE = "delete", EDIT = "edit";

ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();


window.addEventListener('load', function() {
    dateToday = new Date()
    let newDate = dateToday.toDateString();
    // "15-Dec-2014"
    currDate.innerHTML = `${newDate}`;
    console.log('page is fully loaded');
});

expenseBtn.addEventListener("click", function(){
    show(expenseEl);
    hide( [incomeEl, allEl] );
    active( expenseBtn );
    inactive( [incomeBtn, allBtn] );
    console.log("working");
})
incomeBtn.addEventListener("click", function(){
    show(incomeEl);
    hide( [expenseEl, allEl] );
    active( incomeBtn );
    inactive( [expenseBtn, allBtn] );
})
allBtn.addEventListener("click", function(){
    show(allEl);
    hide( [incomeEl, expenseEl] );
    active( allBtn );
    inactive( [incomeBtn, expenseBtn] );
})

addExpense.addEventListener("click", function(){
    if(!expenseTitle.value || !expenseAmount.value ) {
        alert("Incomplete");
    } else {
        let expense = {
            type : "expense",
            title : expenseTitle.value,
            amount : parseInt(expenseAmount.value)
        }
        ENTRY_LIST.push(expense);
        
        alert("Added!")
        $('.alert').alert();
        updateUI();
        clearInput( [expenseTitle, expenseAmount] )    
    };
})

addIncome.addEventListener("click", function(){
    if(!incomeTitle.value || !incomeAmount.value ) {
        alert("Incomplete");
    } else {
        let income = {
            type : "income",
            title : incomeTitle.value,
            amount : parseInt(incomeAmount.value)
        }
        ENTRY_LIST.push(income);
    
        updateUI();
        clearInput( [incomeTitle, incomeAmount] )
    };

})

incomeList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);

console.log(incomeList);


function deleteOrEdit(event){
    const targetBtn = event.target;
    console.log(event);

    const entry = targetBtn.parentNode;

    if( targetBtn.id == "delete" ){
        deleteEntry(entry);
    }else if(targetBtn.id == 'edit' ){
        console.log("finally working");
        editEntry(entry);
    }
}

function deleteEntry(entry){

    ENTRY_LIST.splice( entry.id, 1);
    updateUI();
}

function editEntry(entry){
    let ENTRY = ENTRY_LIST[entry.id];
    console.log(`+++++++++++${entry.id}`)

    if(ENTRY.type == "income"){
        incomeAmount.value = ENTRY.amount;
        incomeTitle.value = ENTRY.title;
    }else if(ENTRY.type == "expense"){
        expenseAmount.value = ENTRY.amount;
        expenseTitle.value = ENTRY.title;
    }
    deleteEntry(entry);

}

function updateUI(){
    income = calculateTotal("income", ENTRY_LIST);
    outcome = calculateTotal("expense", ENTRY_LIST);
    balance = Math.abs(calculateBalance(income, outcome));

    let sign = (income >= outcome) ? "₱" : "-₱";

    balanceEl.innerHTML = `<small>${sign}</small>${balance}`;
    outcomeTotalEl.innerHTML = `<small>₱</small>${outcome}`;
    incomeTotalEl.innerHTML = `<small>₱</small>${income}`;

    clearElement( [expenseList, incomeList, allList] );

    ENTRY_LIST.forEach( (entry, index) => {
        if( entry.type == "expense" ){
            showEntry(expenseList, entry.type, entry.title, entry.amount, index);
        }else if( entry.type == "income" ){
            showEntry(incomeList, entry.type, entry.title, entry.amount, index);
        }
        showEntry(allList, entry.type, entry.title, entry.amount, index)
    });
    updateChart(income, outcome);
    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

function showEntry(list, type, title, amount, id){

    const entry = `
        <div class="card-row" id="${id}" class="${type}">
            <div class="row">
                <div class="col-7 card-align memo">${title}</div>
                <div class="col-3 card-align">₱${amount}</div>
                <div class="col-2 card-align" id="${id}">
                    <a id="edit" class="edit-btn">Edit</a>
                    <a id="delete" class="delete-btn">Delete</a>
                </div>
            </div>
        </div>
    `;

    // const hello = "hello";

    console.log(`${id} - ${type} - ${title} - ${amount}`);
    const position = "afterbegin";
    // list.innerHTML += hello;
    list.insertAdjacentHTML(position, entry);
}

function clearElement(elements){
    elements.forEach( element => {
        element.innerHTML = "";
    })
}

function calculateTotal(type, list){
    let sum = 0;

    list.forEach( entry => {
        if( entry.type == type ){
            sum += entry.amount;
        }
    })

    return sum;
}

function calculateBalance(income, outcome){
    return income - outcome;
}

function clearInput(inputs){
    inputs.forEach( input => {
        input.value = "";
    })
}
function show(element){
    element.classList.remove("hide");
}

function hide( elements ){
    elements.forEach( element => {
        element.classList.add("hide");
    })
}

function active(element){
    element.classList.add("active");
}

function inactive( elements ){
    elements.forEach( element => {
        element.classList.remove("active");
    })
}

