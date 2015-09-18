function getAmortization(capital, pay, periods, interest) {
  var amortizationTable = [];
  var updateAmortizationTable = function (capital, periods) {
    var amortizationInterest = capital * (interest / 12),
      amortizationCapital = pay - amortizationInterest;

    if (capital < pay) {
      pay = capital + amortizationInterest;
      amortizationCapital = pay - amortizationInterest;
      updateTable(pay, amortizationCapital);
      return;
    } else {
      updateTable(pay, amortizationCapital);
      updateAmortizationTable(capital - amortizationCapital, periods - 1);
    }

    function updateTable(pay, amortizationCapital) {
      amortizationTable.push({
        period: (amortizationTable.length + 1),
        amortizationInterest: amortizationInterest,
        amortizationCapital: amortizationCapital,
        remainingCapital: capital - amortizationCapital
      });
    }
  };
  updateAmortizationTable(capital, periods);
  return amortizationTable;
}

if (typeof module !== "undefined") {
  module.exports = getAmortization;
}
