var allProvinces;

allProvinces = require("provinces");

module.exports = function(country) {
  var languageCode;
  if (country == null) {
    languageCode = navigator.userLanguage || navigator.language;
    country = languageCode.length === 2 ? languageCode.split("-")[1] : "US";
  }
  return allProvinces.reduce(function(provinces, province) {
    if (province.country === country) {
      provinces.push({
        name: province.name,
        short: province.short
      });
    }
    return provinces;
  }, []);
};
