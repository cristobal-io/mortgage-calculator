var defaultOptions = {
    places: 2,
    symbol: "€",
    thousand: ".",
    decimal: ","
  },
  _ = require("lodash"),
  // custom made clone function like lodash
  clone = _.compose(JSON.parse, JSON.stringify);

function negativeValue(number) {
  return (number < 0 ? "-" : "");
}

function formatMoney(number, options) {
  // assign value number or 0 if its not provided.
  number = +number || 0;

  // assign default options if they doesn't exist.
  options = _.defaults(clone(options || {}), defaultOptions);

  var negative = negativeValue(number),
    i =
    parseInt(number = Math.abs(number).toFixed(options.places), 10) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;

  return options.symbol + negative + (j ? i.substr(0, j) +
    options.thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" +
    options.thousand) + (options.places ? options.decimal +
    Math.abs(number - i).toFixed(options.places).slice(2) : "");
}
module.exports = formatMoney;
