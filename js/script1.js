/***********************
 * COMMON HELPERS
 ***********************/

// shortcut for getElementById
const $ = (id) => document.getElementById(id);

// all API URLs in one place
const API = {
  RECIPES: "http://localhost:3000/recipieData",
  REVIEWS: "http://localhost:3000/CustomerReview"
};

// dish images
const dishImageMap = {
  puranpoli: "images/Puranpoli.jpeg",
  upma: "images/upma.jpeg",
  vadapav: "images/vadapav.jpeg"
};

// dish display names
const dishNameMap = {
  puranpoli: "Puran Poli",
  upma: "Upma",
  vadapav: "Vada Pav"
};

// store recipes globally for search
let allSections = [];

/***********************
 * RECIPE SECTION
 ***********************/

// fetch recipes from server
const loadSections = async () => {
  try {
    const response = await axios.get(API.RECIPES);
    allSections = response.data || [];
    renderSections(allSections);
  } catch (error) {
    console.error("Failed to load recipes", error);
  }
};

// create list HTML (ingredients / process)
const createList = (title, items, type) => {
  if (!items || items.length === 0) return "";

  if (type === "comma") {
    return `<h4>${title}</h4><p>${items.join(", ")}</p>`;
  }

  return `
    <h4>${title}</h4>
    <${type}>
      ${items.map(item => `<li>${item}</li>`).join("")}
    </${type}>
  `;
};

// create single recipe section
const createSectionTemplate = (item, reverse) => {
  const textPart = `
    <div class="col-lg-6">
      <h1>${item.title}</h1>
      <p>${item.description1 || ""}</p>
      <p>${item.description2 || ""}</p>

      ${createList("Ingredients", item.ingredients, "comma")}
      ${createList("Process", item.process, "ol")}
    </div>
  `;

  const imagePart = `
    <div class="col-lg-6">
      <img src="${item.image}" class="img-fluid">
    </div>
  `;

  return `
    <section class="container py-5">
      <div class="row align-items-center">
        ${reverse ? imagePart + textPart : textPart + imagePart}
      </div>
    </section>
  `;
};

// show recipes on page
const renderSections = (sections) => {
  if (!sections.length) {
    $("dynamic-section").innerHTML = "<p>No recipes found</p>";
    return;
  }

  $("dynamic-section").innerHTML = sections
    .map((item, index) => createSectionTemplate(item, index % 2))
    .join("");
};

// load recipes initially
loadSections();

/***********************
 * SEARCH FILTER
 ***********************/

document.querySelector(".filteredData")?.addEventListener("input", (e) => {
  const searchText = e.target.value.toLowerCase();

  const filteredData = searchText
    ? allSections.filter(item =>
        item.title.toLowerCase().includes(searchText)
      )
    : allSections;

  renderSections(filteredData);

  document
    .querySelector(".hero-section")
    ?.classList.toggle("hero-disabled", searchText.length > 0);
});

/***********************
 * SAVE RECIPE FORM
 ***********************/

const saveRecipe = async (e) => {
  e.preventDefault();

  const recipe = {
    title: $("title").value.trim(),
    description2: $("description2").value.trim(),
    ingredients: $("ingredients").value.split("\n").filter(Boolean),
    process: $("process").value.split("\n").filter(Boolean),
    image: $("image").value.trim()
  };

  if (!recipe.title || !recipe.ingredients.length || !recipe.process.length) {
    $("messageBox").innerHTML =
      "<div class='alert alert-danger'>Fill all required fields</div>";
    return;
  }

  const btn = $("SavaRecipeBtn");
  btn.disabled = true;
  btn.innerText = "Saving...";

  try {
    await axios.post(API.RECIPES, recipe);
    $("messageBox").innerHTML =
      "<div class='alert alert-success'>Recipe Saved</div>";
    $("recipeForm").reset();
    loadSections();
  } catch {
    $("messageBox").innerHTML =
      "<div class='alert alert-danger'>Save Failed</div>";
  } finally {
    btn.disabled = false;
    btn.innerText = "Save Recipe";
  }
};

$("SavaRecipeBtn")?.addEventListener("click", saveRecipe);

/***********************
 * IMAGE CHANGE (DROPDOWN)
 ***********************/

const changeImage = (value) => {
  $("foodImage").src = dishImageMap[value] || "images/food.jpg";
};

/***********************
 * REVIEWS SECTION
 ***********************/

const loadReviews = async () => {
  try {
    const response = await axios.get(API.REVIEWS);

    $("reviewContainer").innerHTML = response.data
      .map(review => `
        <div class="col-md-4">
          <div class="review-card">
            <h6>${review.dishName}</h6>
            <p>${review.description}</p>
            <strong>${review.customerName}</strong>
          </div>
        </div>
      `)
      .join("");
  } catch (error) {
    console.error("Failed to load reviews", error);
  }
};

loadReviews();

/***********************
 * FEEDBACK FORM
 ***********************/

const submitFeedback = async (e) => {
  e.preventDefault();

  const dishKey = $("feedbackDish").value;
  if (!dishKey) return alert("Select a dish");

  const review = {
    customerName: $("feedbackCustomerName").value.trim(),
    phone: $("feedbackPhone").value.trim(),
    date: $("feedbackDate").value,
    description: $("feedbackMessage").value.trim(),
    dishName: dishNameMap[dishKey],
    image: dishImageMap[dishKey]
  };

  const btn = $("submitFeedbackBtn");
  btn.disabled = true;
  btn.innerText = "Submitting...";

  try {
    await axios.post(API.REVIEWS, review);
    alert("Feedback submitted");
    $("feedbackForm").reset();
    loadReviews();
  } catch {
    alert("Submission failed");
  } finally {
    btn.disabled = false;
    btn.innerText = "Submit";
  }
};

$("submitFeedbackBtn")?.addEventListener("click", submitFeedback);

/***********************
 * DEFAULT IMAGE
 ***********************/

document.addEventListener("DOMContentLoaded", () => {
  if ($("foodImage")) {
    $("foodImage").src = dishImageMap.vadapav;
  }
});
