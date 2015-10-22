/*
globals $, mortgageCalculator, c3
*/
"use strict";
(function () {
  ///////////////////////////////
  // Get references to the DOM //
  /////////////////////////////// 

  var initialDeposit = document.querySelector("#initialDeposit_input"),
    monthlyIncome = document.querySelector("#monthlyIncome_input"),
    interest = document.querySelector("#interest_input"),
    term = document.querySelector("#term_input"),
    monthlyExpenses = document.querySelector("#monthlyExpenses_input"),
    mortgageResult = document.getElementById("mortgage"),
    totalPriceHouse = document.getElementById("totalPriceHouse"),
    totalInterestResult = document.getElementById("totalInterest"),
    maxMonthlyPayment = document.getElementById("maxMonthlyPayment"),
    inputUpdateEl = document.getElementsByClassName("input-update");

  ////////////////////////
  // Slider assignation //
  ////////////////////////

  function createSliders() {
    $(".slider").each(function () {
      var begin = this.dataset.begin,
        end = this.dataset.end,
        value = this.dataset.value,
        slideramount = ("#" + this.getAttribute("id") + "_input");

      $(this).slider({
        range: "min",
        value: value || 37,
        min: +begin,
        max: +end,
        slide: function (event, ui) {
          //update text box quantity
          $(slideramount).val(ui.value);
        },
        stop: function () {
          updatePage();
        }
      });

      //initialise text box quantity
      $(slideramount).val($(this).slider("value"));
    });

    //When text box is changed, update slider
    for (var i = 0; i < inputUpdateEl.length; i += 1) {
      inputUpdateEl[i].addEventListener("change", updateInput, false);
    }
  }

  function updateInput() {
    /*jshint validthis:true */
    var value = this.value,
      selector = $(this).parent("div").parent("div").next();

    selector.slider("value", value);
  }

  /////////////////////////
  // updating DOM values //
  /////////////////////////

  function addListener(inputUpdateEl) {
    for (var i = 0; i < inputUpdateEl.length; i += 1) {
      inputUpdateEl[i].addEventListener("change", updatePage, false);
    }
    var introButton = document.getElementById("introButton");

    introButton.addEventListener("click", changeButtonText, false);
  }

  var amortizationResult;

  function updatePage() {
    var mortgage = mortgageCalculator.calculateMortgage({
      "initialDeposit": +initialDeposit.value,
      "monthlyIncome": +monthlyIncome.value,
      "interest": +interest.value,
      "term": +term.value,
      "monthlyExpenses": +monthlyExpenses.value
    });

    // DOM Update.

    mortgageResult.innerHTML =
      mortgageCalculator.formatMoney(mortgage.mortgageTotal);
    totalPriceHouse.innerHTML =
      mortgageCalculator.formatMoney(mortgage.totalPriceHouse);
    maxMonthlyPayment.innerHTML =
      mortgageCalculator.formatMoney(mortgage.maxMonthlyPayment);

    // updating the chart

    amortizationResult = mortgageCalculator.amortization(
      mortgage.mortgageTotal,
      mortgage.maxMonthlyPayment, (+term.value) * 12, +interest.value / 100);

    var totalInterest = 0;


    function getTotalInterest(element) {
      totalInterest += element.amortizationInterest;
    }
    amortizationResult.forEach(getTotalInterest);
    totalInterestResult.innerHTML =
      mortgageCalculator.formatMoney(totalInterest);
    var columns = [
      ["x"],
      ["Interest"],
      ["Capital"]
    ];

    for (var i = 0; i < amortizationResult.length; i += 1) {
      columns[0].push(formatDate(amortizationResult[i].period));
      columns[1].push((+amortizationResult[i].amortizationInterest).toFixed(2));
      columns[2].push((+amortizationResult[i].amortizationCapital).toFixed(2));
    }
    updateChart(mortgage, +initialDeposit.value, totalInterest, columns);
    createTable(formatTable(amortizationResult), headers);
  }

  ///////////////
  // C3 charts //
  ///////////////

  // Pie Chart

  var pieChart = c3.generate({
    bindto: "#chart",
    data: {
      type: "pie",
      columns: [
        ["Total Interest"],
        ["Total Mortgage"],
        ["Initial Deposit"]
      ],
      transition: {
        duration: 3000
      }
    },
    tooltip: {
      format: {
        value: function (value) {
          return mortgageCalculator.formatMoney(value);
        }
      }
    }
  });

  // Bar Chart

  var barChart = c3.generate({
    bindto: "#barChart",
    data: {
      x: "x",
      columns: [
        ["x"],
        ["Interest"],
        ["Capital"]
      ],
      groups: [
        ["Interest", "Capital"]
      ],
      type: "bar",
      onmouseover: function (d) {
        scrollTable(d);

      },
      onmouseout: function (d) {
        var destination = document.getElementById(d.index + 1);

        destination.setAttribute("class", "");
      },
      onclick: function (d) {
        scrollTable(d);
      }
    },
    tooltip: {
      format: {
        value: function (value) {
          return mortgageCalculator.formatMoney(value);
        }
      }
    },
    axis: {
      x: {
        type: "timeseries",
        extent: ["2015-04-01", "2015-07-01"],
        tick: {
          format: "%m/%Y"
        }
      }
    },
    subchart: {
      show: true
    },
    zoom: {
      enabled: true
    }
  });

  var updateChart = function (mortgage, deposit, interest, columns) {
    pieChart.load({
      columns: [
        ["Total Interest", interest],
        ["Total Mortgage", mortgage.mortgageTotal],
        ["Initial Deposit", deposit]
      ]
    });
    barChart.load({
      columns: columns
    });
  };

  ///////////
  // Table //
  ///////////

  var headers = ["Year", "Month", "Interest", "Capital", "Capital left"];

  function createTable(tableData, headers) {
    var table = document.createElement("table"),
      tableHeader = document.createElement("thead"),
      tableBody = document.createElement("tbody"),
      tableAmortization = document.getElementById("tableAmortization"),
      header = document.createElement("tr");

    tableAmortization.innerHTML = "";
    headers.forEach(function (rowData) {

      var cell = document.createElement("th");

      cell.appendChild(document.createTextNode(rowData));
      header.appendChild(cell);

      tableHeader.appendChild(header);
    });

    tableData.forEach(function (rowData) {
      var row = document.createElement("tr");

      row.setAttribute("id", rowData.splice(0, 1));

      rowData.forEach(function (cellData) {
        var cell = document.createElement("td");

        cell.appendChild(document.createTextNode(cellData));
        row.appendChild(cell);
      });

      tableBody.appendChild(row);
    });
    table.setAttribute("class", "table table-bordered");
    table.appendChild(tableHeader);
    table.appendChild(tableBody);
    tableAmortization.appendChild(table);
  }

  function formatTable(amortizationResult) {
    var amortizationTable = [];

    for (var i = 0; i < amortizationResult.length; i += 1) {
      var tempArray = [];
      var periodDate = new Date(formatDate(amortizationResult[i].period));
      var periodYear = periodDate.getFullYear();
      var periodMonth = periodDate.getMonth() + 1;

      tempArray.push(amortizationResult[i].period);
      tempArray.push(periodYear);
      tempArray.push(periodMonth);
      tempArray.push(
        mortgageCalculator.formatMoney(
          amortizationResult[i].amortizationInterest));
      tempArray.push(
        mortgageCalculator.formatMoney(
          amortizationResult[i].amortizationCapital));
      tempArray.push(
        mortgageCalculator.formatMoney(
          amortizationResult[i].remainingCapital));
      amortizationTable.push(tempArray);
    }
    return amortizationTable;
  }

//////////////////////
// helper functions //
//////////////////////

  function formatDate(period) {
    var today = new Date();

    today.setMonth(today.getMonth() + period);
    var year = today.getFullYear();
    var month = +today.getMonth() + 1;

    // this is for an extrange behaviour on firefox and IE that doesn't 
    // get the month passed as single digit.

    if (month < 10) {
      month = "0"+ month;
    }
    return year + "-" + month + "-01";
  }

  function updateYear() {
    var year = new Date(),
      domYear = document.getElementsByClassName("year");

    year = year.getFullYear();

    for (var i = 0; i < domYear.length; i += 1) {
      domYear[i].innerHTML = year;
    }
  }

  function changeButtonText() {
    var introButton = document.getElementById("introButton");

    if (introButton.innerHTML.trim() === "Show Intro") {
      introButton.innerHTML = "Hide Intro";
    } else if (introButton.innerHTML.trim() === "Hide Intro") {
      introButton.innerHTML = "Show Intro";
    }
  }

  function hideIntro() {
    setTimeout(function () {
      document.getElementById("introButton").click();
    }, 6000);
  }

  function scrollTable(d) {
    var container = document.getElementById("tableAmortization"),
      destination = document.getElementById(d.index + 1);

    container.scrollTop = destination.offsetTop;
    destination.setAttribute("class", "success");
    setTimeout(function () {
      destination.setAttribute("class", "");
    }, 500);
  }

  ////////////////////////////////////////////////
  // functions to trigger when dom is loaded // //
  ////////////////////////////////////////////////

  $(function () {
    updateYear();
    createSliders();
    addListener(inputUpdateEl);
    updatePage();
    hideIntro();
  });
})();
