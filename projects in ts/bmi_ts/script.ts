const resultDiv = document.querySelector(".result") as HTMLElement;
if (!resultDiv) {
  throw new Error("Result div not found");
}

function getValue<T extends HTMLInputElement>(selector: string): number | null {
  const element = document.querySelector(selector) as T;
  if (!element) {
    throw new Error(`Element with selector "${selector}" not found`);
  }

  const value = element.value?.trim();
  if (!value) return null;

  const numValue = Number(value);
  if (isNaN(numValue) || numValue <= 0) {
    throw new Error(`Invalid value for ${selector}: ${value}`);
  }

  return numValue;
}

function calculateBMI() {
  try {
    const height = getValue<HTMLInputElement>(".height");
    const weight = getValue<HTMLInputElement>(".weight");

    const bmi: number | null =
      height && weight ? (weight / ( (height*height) /10000)) : null;

    if (bmi !== null && !isNaN(bmi)) {
      resultDiv.classList.add("toggle");
      const bmiValue = resultDiv.querySelector(".bmi") as HTMLElement;
      const bmiStatus = resultDiv.querySelector(".comment") as HTMLElement;

      if (!bmiValue || !bmiStatus) {
        throw new Error("BMI display elements not found");
      }

      bmiValue.textContent = bmi.toFixed(2);

      if (bmi <= 18.5) {
        bmiStatus.textContent = "Under weight";
      } else if (bmi <= 24.9) {
        bmiStatus.textContent = "Normal weight";
      } else if (bmi <= 29.9) {
        bmiStatus.textContent = "Over weight";
      } else {
        bmiStatus.textContent = "Obesity";
      }
    } else {
      throw new Error("Invalid BMI calculation");
    }
  } catch (error) {
    console.error("Error calculating BMI:", error);
    resultDiv.innerHTML = `<p class="error">Error: ${
      error instanceof Error ? error.message : "Unknown error"
    }</p>`;
  }
}

const submitBtn = document.querySelector(".submitBtn") as HTMLButtonElement;
if (submitBtn) {
  submitBtn.addEventListener("click", calculateBMI);
} else {
  throw new Error("Submit button not found");
}
