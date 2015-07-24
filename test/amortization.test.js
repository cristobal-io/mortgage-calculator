/*exported load*/
if (typeof require !== "undefined") {
  var expect = require("expect.js"),
    amortizationFixtures = require("./fixtures/amortization.json"),
    getAmortization = require("../lib/amortization.js");
} else {
  var amortizationFixtures;
  loadJSON(function (response) {
    // Parse JSON string into object
    amortizationFixtures = JSON.parse(response);
  });
  console.log(amortizationFixtures);
}

function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open("GET", "./fixtures/amortization.json", false);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

describe("when using the getAmortization function, it:", function () {

  it("should expose a function", function () {
    expect(getAmortization).to.be.a("function");
  });

  for (var i = 0; i < amortizationFixtures.length; i += 1) {
    it("should pass test nº " +
      amortizationFixtures[i].explanation,
      checkFixtures(amortizationFixtures[i]));
  }
});

function checkFixtures(fixture) {
  return function () {
    expect(getAmortization.apply(null, fixture.input)).to.eql(fixture.output);
  };
}
