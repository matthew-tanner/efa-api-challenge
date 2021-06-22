// Global Values
const baseURL = "https://api.covid19api.com/";
const worldTotalURL = "world/total";
const countriesURL = "countries";
const liveCountryURL = "live/country/";

const elemConfirmed = document.getElementById("total-confirmed");
const elemDeaths = document.getElementById("total-deaths");
const elemRecovered = document.getElementById("total-recovered");
const elemCountryList = document.getElementById("country-list-options");
const elemCountryInput = document.getElementById("country-list");
const elemListGroup = document.getElementById("country-list-group");

let countryData = [];
let dataDate = new Date();

dataDate.setDate(dataDate.getDate() - 1);

const loadCountries = async () => {
  await fetch(baseURL + countriesURL)
    .then((res) => res.json())
    .then(
      (json) =>
        (countryData = json.map((item) => {
          return item.Slug;
        }))
    )
    .then(() => console.log(countryData))
    .then(() => popCountryDropdown());
};

const getWorldTotal = async () => {
  await fetch(baseURL + worldTotalURL)
    .then((res) => res.json())
    .then((json) => {
      elemConfirmed.innerText = json.TotalConfirmed.toLocaleString("en-US");
      elemDeaths.innerText = json.TotalDeaths.toLocaleString("en-US");
      elemRecovered.innerText = json.TotalRecovered.toLocaleString("en-US");
    });
};

const getCountryData = async (data) => {
  if (data) {
    await fetch(
      baseURL + liveCountryURL + data + "/status/confirmed/date/" + dataDate.toISOString()
    )
      .then((res) => res.json())
      .then((json) => {
        elemListGroup.querySelectorAll("*").forEach(node => node.remove())
        json.map((item) => {
          dataTemplate = `
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
              <div class="fw-bold">${item.Province}</div>
            </div>
            <span class="badge bg-warning rounded-pill">Cases: ${item.Confirmed}</span>
            <span class="badge bg-dark rounded-pill">Deaths: ${item.Deaths}</span>
          </li>`;
          elemListGroup.insertAdjacentHTML("beforeend", dataTemplate);
        });
      });
  }
};

const popCountryDropdown = () => {
  countryData.forEach((item) => {
    let cOption = document.createElement("option");
    cOption.setAttribute("value", item);
    elemCountryList.appendChild(cOption);
  });
};

elemCountryInput.addEventListener("change", (e) => getCountryData(e.target.value));

loadCountries();
getWorldTotal();
