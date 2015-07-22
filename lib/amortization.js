/*exported getAmortization*/
(function () {
  function getAmortization(capital, pay, periods, interest) {
    var amortizationTable = [];
    var getTable = function (capital, pay, periods, interest) {
      var amortizationInterest = capital * (interest / 12),
        amortizationCapital = pay - amortizationInterest;

      if (capital < pay) {
        pay = capital + amortizationInterest;
        amortizationCapital = pay - amortizationInterest;
        updateTable(pay, amortizationCapital);
        return amortizationTable;
      } else {
        updateTable(pay, amortizationCapital);
        getTable(capital - pay, pay, periods - 1, interest);
      }

      function updateTable(pay, amortizationCapital) {
        amortizationTable.push({
          period: (amortizationTable.length + 1),
          amortizationInterest: amortizationInterest,
          amortizationCapital: amortizationCapital,
          remainingCapital: capital - pay
        });
      }
      return amortizationTable;
    };
    getTable(capital, pay, periods, interest);
    return amortizationTable;
  }

  if (typeof module !== "undefined") {
    module.exports = getAmortization;
  }
}());
