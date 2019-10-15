import { countryIndex } from "./countryIndex";
import API_URL from "../../Misc/API_URL";

const fillupData = countryOptions => {
  for (let i = 0; i < countryOptions.length; i++) {
    let recent = countryOptions[i];
    fetch(API_URL + "/getpassportfilterinfo/?u=" + recent.value)
      .then(res => {
        res.json().then(data => {
          console.log("data here!!");
          console.log(data.message);
          const i = countryIndex[data.message.u][1];
          countryOptions[i].data = data.message;
        });
      })
      .then(json => console.log(json));
  }
  return countryOptions;
};

export const colourOptions = [
  { value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
  { value: "blue", label: "Blue", color: "#0052CC", disabled: true },
  { value: "purple", label: "Purple", color: "#5243AA" },
  { value: "red", label: "Red", color: "#FF5630", isFixed: true },
  { value: "orange", label: "Orange", color: "#FF8B00" },
  { value: "yellow", label: "Yellow", color: "#FFC400" },
  { value: "green", label: "Green", color: "#36B37E" },
  { value: "forest", label: "Forest", color: "#00875A" },
  { value: "slate", label: "Slate", color: "#253858" },
  { value: "silver", label: "Silver", color: "#666666" },
];

export const flavourOptions = [
  { value: "vanilla", label: "Vanilla", rating: "safe" },
  { value: "chocolate", label: "Chocolate", rating: "good" },
  { value: "strawberry", label: "Strawberry", rating: "wild" },
  { value: "salted-caramel", label: "Salted Caramel", rating: "crazy" },
];

export const countryOptions = [
  { value: "US", clicked: 0, data: null, label: "United States" },
  { value: "CN", clicked: 0, data: null, label: "China" },
  { value: "JP", clicked: 0, data: null, label: "Japan" },
  { value: "IN", clicked: 0, data: null, label: "India" },
  { value: "PH", clicked: 0, data: null, label: "Philippines" },
  { value: "ID", clicked: 0, data: null, label: "Indonesia" },
  { value: "FR", clicked: 0, data: null, label: "France" },
  { value: "GB", clicked: 0, data: null, label: "United Kingdom" },
  { value: "TW", clicked: 0, data: null, label: "Taiwan" },
  { value: "MM", clicked: 0, data: null, label: "Myanmar" },
  { value: "CM", clicked: 0, data: null, label: "Cameroon" },
  { value: "AF", clicked: 0, data: null, label: "Afghanistan" },
  { value: "IQ", clicked: 0, data: null, label: "Iraq" },
  { value: "PK", clicked: 0, data: null, label: "Pakistan" },
  { value: "SY", clicked: 0, data: null, label: "Syria" },
  { value: "SO", clicked: 0, data: null, label: "Somalia" },
  { value: "SD", clicked: 0, data: null, label: "Sudan" },
  { value: "YE", clicked: 0, data: null, label: "Yemen" },
  { value: "ET", clicked: 0, data: null, label: "Ethiopia" },
  { value: "ER", clicked: 0, data: null, label: "Eritrea" },
  { value: "IR", clicked: 0, data: null, label: "Iran" },
  { value: "KP", clicked: 0, data: null, label: "North Korea" },
  { value: "LY", clicked: 0, data: null, label: "Libya" },
  { value: "PS", clicked: 0, data: null, label: "Palestine" },
  { value: "NP", clicked: 0, data: null, label: "Nepal" },
  { value: "CD", clicked: 0, data: null, label: "DR Congo" },
  { value: "SS", clicked: 0, data: null, label: "South Sudan" },
  { value: "XK", clicked: 0, data: null, label: "Kosovo" },
  { value: "LB", clicked: 0, data: null, label: "Lebanon" },
  { value: "LK", clicked: 0, data: null, label: "Sri Lanka" },
  { value: "DJ", clicked: 0, data: null, label: "Djibouti" },
  { value: "BD", clicked: 0, data: null, label: "Bangladesh" },
  { value: "CG", clicked: 0, data: null, label: "Congo" },
  { value: "CF", clicked: 0, data: null, label: "Central African Republic" },
  { value: "BI", clicked: 0, data: null, label: "Burundi" },
  { value: "EG", clicked: 0, data: null, label: "Egypt" },
  { value: "GQ", clicked: 0, data: null, label: "Equatorial Guinea" },
  { value: "TM", clicked: 0, data: null, label: "Turkmenistan" },
  { value: "KM", clicked: 0, data: null, label: "Comoros" },
  { value: "DZ", clicked: 0, data: null, label: "Algeria" },
  { value: "BT", clicked: 0, data: null, label: "Bhutan" },
  { value: "NG", clicked: 0, data: null, label: "Nigeria" },
  { value: "TD", clicked: 0, data: null, label: "Chad" },
  { value: "KH", clicked: 0, data: null, label: "Cambodia" },
  { value: "JO", clicked: 0, data: null, label: "Jordan" },
  { value: "LA", clicked: 0, data: null, label: "Laos" },
  { value: "VN", clicked: 0, data: null, label: "Viet Nam" },
  { value: "AO", clicked: 0, data: null, label: "Angola" },
  { value: "HT", clicked: 0, data: null, label: "Haiti" },
  { value: "RW", clicked: 0, data: null, label: "Rwanda" },
  { value: "LR", clicked: 0, data: null, label: "Liberia" },
  { value: "GA", clicked: 0, data: null, label: "Gabon" },
  { value: "MG", clicked: 0, data: null, label: "Madagascar" },
  { value: "GW", clicked: 0, data: null, label: "Guinea-Bissau" },
  { value: "TG", clicked: 0, data: null, label: "Togo" },
  { value: "MR", clicked: 0, data: null, label: "Mauritania" },
  { value: "ST", clicked: 0, data: null, label: "Sao Tome and Principe" },
  { value: "MZ", clicked: 0, data: null, label: "Mozambique" },
  { value: "TJ", clicked: 0, data: null, label: "Tajikistan" },
  { value: "GN", clicked: 0, data: null, label: "Guinea" },
  { value: "UZ", clicked: 0, data: null, label: "Uzbekistan" },
  { value: "NE", clicked: 0, data: null, label: "Niger" },
  { value: "BF", clicked: 0, data: null, label: "Burkina Faso" },
  { value: "CI", clicked: 0, data: null, label: "Ivory Coast" },
  { value: "ML", clicked: 0, data: null, label: "Mali" },
  { value: "DO", clicked: 0, data: null, label: "Dominican Republic" },
  { value: "SN", clicked: 0, data: null, label: "Senegal" },
  { value: "BJ", clicked: 0, data: null, label: "Benin" },
  { value: "KG", clicked: 0, data: null, label: "Kyrgyzstan" },
  { value: "MN", clicked: 0, data: null, label: "Mongolia" },
  { value: "AM", clicked: 0, data: null, label: "Armenia" },
  { value: "MA", clicked: 0, data: null, label: "Morocco" },
  { value: "CU", clicked: 0, data: null, label: "Cuba" },
  { value: "CV", clicked: 0, data: null, label: "Cape Verde" },
  { value: "AZ", clicked: 0, data: null, label: "Azerbaijan" },
  { value: "UG", clicked: 0, data: null, label: "Uganda" },
  { value: "TN", clicked: 0, data: null, label: "Tunisia" },
  { value: "ZW", clicked: 0, data: null, label: "Zimbabwe" },
  { value: "GH", clicked: 0, data: null, label: "Ghana" },
  { value: "SL", clicked: 0, data: null, label: "Sierra Leone" },
  { value: "ZM", clicked: 0, data: null, label: "Zambia" },
  { value: "BO", clicked: 0, data: null, label: "Bolivia" },
  { value: "KE", clicked: 0, data: null, label: "Kenya" },
  { value: "NA", clicked: 0, data: null, label: "Namibia" },
  { value: "PG", clicked: 0, data: null, label: "Papua New Guinea" },
  { value: "KZ", clicked: 0, data: null, label: "Kazakhstan" },
  { value: "SR", clicked: 0, data: null, label: "Suriname" },
  { value: "TZ", clicked: 0, data: null, label: "Tanzania" },
  { value: "TH", clicked: 0, data: null, label: "Thailand" },
  { value: "SA", clicked: 0, data: null, label: "Saudi Arabia" },
  { value: "OM", clicked: 0, data: null, label: "Oman" },
  { value: "MW", clicked: 0, data: null, label: "Malawi" },
  { value: "GM", clicked: 0, data: null, label: "Gambia" },
  { value: "BY", clicked: 0, data: null, label: "Belarus" },
  { value: "SZ", clicked: 0, data: null, label: "Swaziland" },
  { value: "NR", clicked: 0, data: null, label: "Nauru" },
  { value: "LS", clicked: 0, data: null, label: "Lesotho" },
  { value: "BH", clicked: 0, data: null, label: "Bahrain" },
  { value: "MV", clicked: 0, data: null, label: "Maldives" },
  { value: "BW", clicked: 0, data: null, label: "Botswana" },
  { value: "GY", clicked: 0, data: null, label: "Guyana" },
  { value: "EC", clicked: 0, data: null, label: "Ecuador" },
  { value: "FJ", clicked: 0, data: null, label: "Fiji" },
  { value: "QA", clicked: 0, data: null, label: "Qatar" },
  { value: "JM", clicked: 0, data: null, label: "Jamaica" },
  { value: "KW", clicked: 0, data: null, label: "Kuwait" },
  { value: "TL", clicked: 0, data: null, label: "Timor-Leste" },
  { value: "BZ", clicked: 0, data: null, label: "Belize" },
  { value: "ZA", clicked: 0, data: null, label: "South Africa" },
  { value: "FM", clicked: 0, data: null, label: "Micronesia" },
  { value: "PW", clicked: 0, data: null, label: "Palau" },
  { value: "AL", clicked: 0, data: null, label: "Albania" },
  { value: "TR", clicked: 0, data: null, label: "Turkey" },
  { value: "BA", clicked: 0, data: null, label: "Bosnia and Herzegovina" },
  { value: "MD", clicked: 0, data: null, label: "Moldova" },
  { value: "GE", clicked: 0, data: null, label: "Georgia" },
  { value: "MH", clicked: 0, data: null, label: "Marshall Islands" },
  { value: "NI", clicked: 0, data: null, label: "Nicaragua" },
  { value: "ME", clicked: 0, data: null, label: "Montenegro" },
  { value: "MK", clicked: 0, data: null, label: "Macedonia" },
  { value: "RU", clicked: 0, data: null, label: "Russian Federation" },
  { value: "KI", clicked: 0, data: null, label: "Kiribati" },
  { value: "TO", clicked: 0, data: null, label: "Tonga" },
  { value: "CO", clicked: 0, data: null, label: "Colombia" },
  { value: "GT", clicked: 0, data: null, label: "Guatemala" },
  { value: "SV", clicked: 0, data: null, label: "El Salvador" },
  { value: "TV", clicked: 0, data: null, label: "Tuvalu" },
  { value: "HN", clicked: 0, data: null, label: "Honduras" },
  { value: "WS", clicked: 0, data: null, label: "Samoa" },
  { value: "RS", clicked: 0, data: null, label: "Serbia" },
  { value: "SB", clicked: 0, data: null, label: "Solomon Islands" },
  { value: "VU", clicked: 0, data: null, label: "Vanuatu" },
  { value: "VE", clicked: 0, data: null, label: "Venezuela" },
  { value: "PA", clicked: 0, data: null, label: "Panama" },
  { value: "DM", clicked: 0, data: null, label: "Dominica" },
  { value: "PY", clicked: 0, data: null, label: "Paraguay" },
  { value: "UA", clicked: 0, data: null, label: "Ukraine" },
  { value: "MO", clicked: 0, data: null, label: "Macao" },
  { value: "PE", clicked: 0, data: null, label: "Peru" },
  { value: "LC", clicked: 0, data: null, label: "Saint Lucia" },
  { value: "CR", clicked: 0, data: null, label: "Costa Rica" },
  { value: "GD", clicked: 0, data: null, label: "Grenada" },
  { value: "MU", clicked: 0, data: null, label: "Mauritius" },
  { value: "AG", clicked: 0, data: null, label: "Antigua and Barbuda" },
  { value: "KN", clicked: 0, data: null, label: "Saint Kitts and Nevis" },
  { value: "TT", clicked: 0, data: null, label: "Trinidad and Tobago" },
  { value: "VA", clicked: 0, data: null, label: "Vatican" },
  { value: "VC", clicked: 0, data: null, label: "Saint Vincent and the Grenadines" },
  { value: "MX", clicked: 0, data: null, label: "Mexico" },
  { value: "UY", clicked: 0, data: null, label: "Uruguay" },
  { value: "SC", clicked: 0, data: null, label: "Seychelles" },
  { value: "AD", clicked: 0, data: null, label: "Andorra" },
  { value: "BS", clicked: 0, data: null, label: "Bahamas" },
  { value: "BN", clicked: 0, data: null, label: "Brunei Darussalam" },
  { value: "IL", clicked: 0, data: null, label: "Israel" },
  { value: "SM", clicked: 0, data: null, label: "San Marino" },
  { value: "BB", clicked: 0, data: null, label: "Barbados" },
  { value: "AR", clicked: 0, data: null, label: "Argentina" },
  { value: "CL", clicked: 0, data: null, label: "Chile" },
  { value: "MC", clicked: 0, data: null, label: "Monaco" },
  { value: "AU", clicked: 0, data: null, label: "Australia" },
  { value: "BR", clicked: 0, data: null, label: "Brazil" },
  { value: "HK", clicked: 0, data: null, label: "Hong Kong" },
  { value: "NZ", clicked: 0, data: null, label: "New Zealand" },
  { value: "BG", clicked: 0, data: null, label: "Bulgaria" },
  { value: "HR", clicked: 0, data: null, label: "Croatia" },
  { value: "LI", clicked: 0, data: null, label: "Liechtenstein" },
  { value: "RO", clicked: 0, data: null, label: "Romania" },
  { value: "CA", clicked: 0, data: null, label: "Canada" },
  { value: "AE", clicked: 0, data: null, label: "United Arab Emirates" },
  { value: "CY", clicked: 0, data: null, label: "Cyprus" },
  { value: "EE", clicked: 0, data: null, label: "Estonia" },
  { value: "IS", clicked: 0, data: null, label: "Iceland" },
  { value: "LV", clicked: 0, data: null, label: "Latvia" },
  { value: "LT", clicked: 0, data: null, label: "Lithuania" },
  { value: "SK", clicked: 0, data: null, label: "Slovakia" },
  { value: "IE", clicked: 0, data: null, label: "Ireland" },
  { value: "PL", clicked: 0, data: null, label: "Poland" },
  { value: "SI", clicked: 0, data: null, label: "Slovenia" },
  { value: "MY", clicked: 0, data: null, label: "Malaysia" },
  { value: "HU", clicked: 0, data: null, label: "Hungary" },
  { value: "MT", clicked: 0, data: null, label: "Malta" },
  { value: "CH", clicked: 0, data: null, label: "Switzerland" },
  { value: "CZ", clicked: 0, data: null, label: "Czech Republic" },
  { value: "GR", clicked: 0, data: null, label: "Greece" },
  { value: "PT", clicked: 0, data: null, label: "Portugal" },
  { value: "NO", clicked: 0, data: null, label: "Norway" },
  { value: "KR", clicked: 0, data: null, label: "South Korea" },
  { value: "AT", clicked: 0, data: null, label: "Austria" },
  { value: "BE", clicked: 0, data: null, label: "Belgium" },
  { value: "NL", clicked: 0, data: null, label: "Netherlands" },
  { value: "ES", clicked: 0, data: null, label: "Spain" },
  { value: "IT", clicked: 0, data: null, label: "Italy" },
  { value: "LU", clicked: 0, data: null, label: "Luxembourg" },
  { value: "DK", clicked: 0, data: null, label: "Denmark" },
  { value: "FI", clicked: 0, data: null, label: "Finland" },
  { value: "SE", clicked: 0, data: null, label: "Sweden" },
  { value: "DE", clicked: 0, data: null, label: "Germany" },
  { value: "SG", clicked: 0, data: null, label: "Singapore" },
];

export const optionLength = [
  { value: 1, label: "general" },
  {
    value: 2,
    label: "Evil is the moment when I lack the strength to be true to the Good that compels me.",
  },
  {
    value: 3,
    label:
      "It is now an easy matter to spell out the ethic of a truth: 'Do all that you can to persevere in that which exceeds your perseverance. Persevere in the interruption. Seize in your being that which has seized and broken you.",
  },
];

// let bigOptions = [];
// for (let i = 0; i < 10000; i++) {
// 	bigOptions = bigOptions.concat(colourOptions);
// }

export const groupedOptions = [
  {
    label: "Colours",
    options: colourOptions,
  },
  {
    label: "Flavours",
    options: flavourOptions,
  },
];