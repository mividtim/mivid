
allProvinces  = require "provinces"

module.exports = (country) ->
  if !country?
    languageCode = navigator.userLanguage || navigator.language
    country = if languageCode.length is 2 then languageCode.split("-")[1] else "US"
  allProvinces.reduce(
    (provinces, province) ->
      if province.country is country
        provinces.push name: province.name, short: province.short
      provinces
    [])
