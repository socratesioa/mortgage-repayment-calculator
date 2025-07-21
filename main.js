const form = document.getElementById("form");
const mortgageAmount = document.getElementById("mortgageAmount");
const mortgageTerm = document.getElementById("mortgageTerm");
const interestRate = document.getElementById("interestRate");
const displayMonthly = document.getElementById("monthly");
const displayTerm = document.getElementById("term");

document.addEventListener("DOMContentLoaded", () => {
  const cleaveMortgage = new Cleave("#mortgageAmount", {
    numeral: true,
    numeralThousandsGroupStyle: "thousand",
    numeralDecimalScale: 2,
    numeralDecimalMark: ".",
    delimiter: ",",
    stripLeadingZeroes: true,
  });
});

const handleSubmit = (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(e.target));
  const errors = {};

  //   CLEAR ERRORS
  document.querySelectorAll(".error-message").forEach((span) => {
    span.textContent = "";
  });

  // FORM VALIDATION
  const rawAmount = data.mortgageAmount.replace(/,/g, "");
  const amount = parseFloat(rawAmount);

  if (data.mortgageAmount.trim() === "") {
    errors.mortgageAmount = "This field is required";
  } else if (isNaN(amount) || amount <= 0) {
    errors.mortgageAmount = "Please enter a valid Amount";
  }

  const term = parseFloat(data.mortgageTerm);

  if (data.mortgageTerm.trim() === "") {
    errors.mortgageTerm = "This field is required";
  } else if (isNaN(term) || term <= 0) {
    errors.mortgageTerm = "Please enter a valid Term";
  }

  const interest = parseFloat(data.interestRate);

  if (data.interestRate.trim() === "") {
    errors.interestRate = "This field is required";
  } else if (isNaN(interest) || interest <= 0) {
    errors.interestRate = "Please enter a valid Interest";
  }

  const mortgageType = data.mortgageType;

  if (!data.mortgageType) {
    errors.mortgageType = "This field is required";
  }

  console.log("Amount:", amount);
  console.log("Term:", term);
  console.log("Interest Rate:", interest);
  console.log("Type:", mortgageType);

  //   ERROR HANDLING
  for (const key in errors) {
    const errorSpan = document.getElementById(`error-${key}`);
    if (errorSpan) {
      errorSpan.textContent = errors[key];
    }

    const input = document.getElementById(key);
    if (input) {
      const suffixWrapper = input.closest(".input-wrapper-suffix");
      if (suffixWrapper) {
        suffixWrapper.classList.add("input-error");
        const suffix = suffixWrapper.querySelector(".suffix");
        if (suffix) suffix.classList.add("suffix-error");
      }

      const prefixWrapper = input.closest(".input-wrapper-prefix");
      if (prefixWrapper) {
        prefixWrapper.classList.add("input-error");
        const prefix = prefixWrapper.querySelector(".prefix");
        if (prefix) prefix.classList.add("prefix-error");
      }
    }
  }

  if (Object.keys(errors).length > 0) return;

  //   CALCULATIONS
  const monthlyRate = interest / 100 / 12;
  const totalPayments = term * 12;

  let monthlyPayment;
  let termPayment;

  if (mortgageType === "repayment") {
    const numerator =
      amount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments);
    const denominator = Math.pow(1 + monthlyRate, totalPayments) - 1;
    monthlyPayment = numerator / denominator;
  } else if (mortgageType === "interestOnly") {
    monthlyPayment = amount * monthlyRate;
  }

  if (monthlyPayment) {
    termPayment = monthlyPayment * 12 * term;
    monthlyPayment = monthlyPayment.toFixed(2);
    termPayment = termPayment.toFixed(2);

    const currencyFormatter = new Intl.NumberFormat("en-UK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    console.log("Monthly Payment: £" + monthlyPayment);
    displayMonthly.textContent = `£${currencyFormatter.format(monthlyPayment)}`;
    console.log("Total over the term: £" + termPayment);
    displayTerm.textContent = `£${currencyFormatter.format(termPayment)}`;

    document.getElementById("empty-results").style.display = "none";
    document.getElementById("mortgage-results").style.display = "flex";
  } else {
    console.log("Something went wrong with the calculation.");
  }
};

form.addEventListener("submit", handleSubmit);

// CLEAR ERRORS ON USER INPUT

const inputs = form.querySelectorAll("input");

inputs.forEach((input) => {
  input.addEventListener("input", () => {
    const key = input.id || input.name;

    const errorSpan = document.getElementById(`error-${key}`);
    if (errorSpan) errorSpan.textContent = "";

    const suffixWrapper = input.closest(".input-wrapper-suffix");
    const prefixWrapper = input.closest(".input-wrapper-prefix");

    if (suffixWrapper) {
      suffixWrapper.classList.remove("input-error");
      const suffix = suffixWrapper.querySelector(".suffix");
      if (suffix) suffix.classList.remove("suffix-error");
    }

    if (prefixWrapper) {
      prefixWrapper.classList.remove("input-error");
      const prefix = prefixWrapper.querySelector(".prefix");
      if (prefix) prefix.classList.remove("prefix-error");
    }
  });
});

// CLEAR ALL
form.addEventListener("reset", () => {
  displayMonthly.textContent = "";
  displayTerm.textContent = "";
  document.getElementById("empty-results").style.display = "flex";
  document.getElementById("mortgage-results").style.display = "none";

  document.querySelectorAll(".input-wrapper-prefix").forEach((el) => {
    el.classList.remove("input-error");
    const prefix = el.querySelector(".prefix");
    if (prefix) prefix.classList.remove("prefix-error");
  });

  document.querySelectorAll(".input-wrapper-suffix").forEach((el) => {
    el.classList.remove("input-error");
    const suffix = el.querySelector(".suffix");
    if (suffix) suffix.classList.remove("suffix-error");
  });

  document.querySelectorAll(".error-message").forEach((span) => {
    span.textContent = "";
  });
});
