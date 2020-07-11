const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsItem = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const singleMealItem = document.getElementById('single-meal');

const spinner = document.querySelector('.lds-roller');
const error = document.querySelector('.error');

// Spinner Hidden
spinner.style.display = 'none';

// Search meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  // Show spinner and error dialog
  spinner.style.display = '';
  error.innerHTML = '';

  // Clear single meal
  singleMealItem.innerHTML = '';

  // Get search term
  const term = search.value;

  // Check if empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results for '${term}'. Try again!</p>`;

          // Clear searched meals
          mealsItem.innerHTML = '';
          // Clear spinner
          spinner.style.display = 'none';
        } else {
          mealsItem.innerHTML = data.meals
            .map(
              (meal) => `
              <div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <div class="meal-info" data-mealID="${meal.idMeal}">
                  <h3>${meal.strMeal}</h3>
                </div>
              </div>
            `
            )
            .join('');

          // Clear spinner
          spinner.style.display = 'none';
        }
      });

    // Clear search text
    search.value = '';
  } else {
    error.innerHTML = 'Please enter a search term!';
    spinner.style.display = 'none';
    // Clear meals and heading
    mealsItem.innerHTML = '';
    resultHeading.innerHTML = '';
  }

  // Clear input
  e.currentTarget.reset();
}

// Fetch meal by ID
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

// Fetch random meal from API
function getRandomMeal() {
  // Clear meals and heading
  mealsItem.innerHTML = '';
  resultHeading.innerHTML = '';

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  singleMealItem.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

// Event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsItem.addEventListener('click', (e) => {
  const mealInfo = e.composedPath().find((item) => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealID');
    getMealById(mealID);
  }
});
