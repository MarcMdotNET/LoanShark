//Get loan amount and term in months
function getValues() {

    let _loanAmount = document.getElementById("inputLoanAmount").value;
    let _loanTerm = document.getElementById("inputLoanTerm").value;
    let _interestRate = document.getElementById("inputInterestRate").value;
    
    if (_loanAmount == "" || _loanTerm == "" || _interestRate == "") {
        alert("Please enter all values.");
    } else if (isNaN(_loanAmount) || isNaN(_loanTerm) || isNaN(_interestRate)) {
        alert("All values must be numbers.");
    } else {
        let _calculatedLoanObj = calculateLoan(_loanAmount, _loanTerm, _interestRate);
        displayLoan(_calculatedLoanObj);
    }

}

//Calculate loan values
function calculateLoan(loanAmount, loanTerm, interestRate) {
    
    let _monthlyInterestRate = interestRate / 100 / 12;
    let _monthlyPayment = loanAmount * ((_monthlyInterestRate * Math.pow((1 + _monthlyInterestRate), loanTerm)) / (Math.pow((1 + _monthlyInterestRate), loanTerm) - 1));
    let _totalCost = _monthlyPayment * loanTerm;
    let _totalInterest = _totalCost - loanAmount;
    let _calculatedLoanObj = {
        totalPrincipal: loanAmount,
        calculatedMonthlyPayment: _monthlyPayment,
        calculatedTotalCost: _totalCost,
        calculatedTotalInterest: _totalInterest,
        currentMonth: [],
        currentMonthlyInterest: [],
        currentMonthlyPrincipal: [],
        totalPaidInterest: [],
        currentBalance: [],
    };

    for (let i = 0; i < loanTerm; i++) {

        _calculatedLoanObj.currentMonth[i] = i + 1;

        _calculatedLoanObj.currentMonthlyInterest[i] = loanAmount * _monthlyInterestRate;
        _calculatedLoanObj.currentMonthlyPrincipal[i] = _calculatedLoanObj.calculatedMonthlyPayment - _calculatedLoanObj.currentMonthlyInterest[i];

        _calculatedLoanObj.totalPaidInterest[i] = _calculatedLoanObj.currentMonthlyInterest[i] + (_calculatedLoanObj.totalPaidInterest[i - 1] || 0);

        loanAmount = loanAmount - _calculatedLoanObj.currentMonthlyPrincipal[i];
        
        _calculatedLoanObj.currentBalance[i] = loanAmount;
    }

    return _calculatedLoanObj;
}

//Display loan values
function displayLoan(calculatedLoanObj) {

    let _dollarUS = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        useGrouping: true,
    });

    let _resultsTable = "";

    document.getElementById("outputTotalPrincipal").innerHTML = _dollarUS.format(calculatedLoanObj.totalPrincipal);
    document.getElementById("outputTotalInterest").innerHTML = _dollarUS.format(calculatedLoanObj.calculatedTotalInterest);
    document.getElementById("outputTotalCost").innerHTML = _dollarUS.format(calculatedLoanObj.calculatedTotalCost);
    document.getElementById("outputMonthlyPayment").innerHTML = _dollarUS.format(calculatedLoanObj.calculatedMonthlyPayment);

    for (let i = 0; i < calculatedLoanObj.currentMonth.length; i++) {
        _resultsTable += `<tr>`;
        _resultsTable += `<td>${calculatedLoanObj.currentMonth[i]}</td>`;
        _resultsTable += `<td>${_dollarUS.format(calculatedLoanObj.calculatedMonthlyPayment)}</td>`;
        _resultsTable += `<td>${_dollarUS.format(calculatedLoanObj.currentMonthlyPrincipal[i])}</td>`;
        _resultsTable += `<td>${_dollarUS.format(calculatedLoanObj.currentMonthlyInterest[i])}</td>`;
        _resultsTable += `<td>${_dollarUS.format(calculatedLoanObj.totalPaidInterest[i])}</td>`;
        _resultsTable += `<td>${_dollarUS.format(calculatedLoanObj.currentBalance[i])}</td>`;
        _resultsTable += `</tr>`;
    }

    document.getElementById("loanAmortizationTable").innerHTML = _resultsTable;
}