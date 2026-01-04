/***********************
 * COMMON HELPERS
 ***********************/
const $ = id => document.getElementById(id);

const API = {
  recipes: "http://localhost:3000/recipieData",
  reviews: "http://localhost:3000/CustomerReview"
};

const dishImageMap = {
  puranpoli: "images/Puranpoli.jpeg",
  upma: "images/upma.jpeg",
  vadapav: "images/vadapav.jpeg"
};

const dishNameMap = {
  puranpoli: "Puran Poli",
  upma: "Upma",
  vadapav: "Vada Pav"
};

/***********************
 * RECIPE SECTION
 ***********************/
async function loadSections() {
  try {
    const { data = [] } = await axios.get(API.recipes);
    // console.log(data);
    window.allSections = data;
    renderSections(data);
  } catch (e) {
    console.error("Recipe load error", e);
  }
}

const listHTML = (title, items, type = "ul") =>
  items?.length
    ? `<h4 class="mt-3">${title}</h4>
       ${type === "comma" ? `<p>${items.join(", ")}</p>` : `<${type}>${items.map(i => `<li>${i}</li>`).join("")}</${type}>`}`
    : "";

function sectionTemplate(item, reverse) {
  const text = `
    <div class="col-lg-6 mb-4 mb-lg-0">
      <h1 class="fw-bold">${item.title}</h1>
      ${item.description1 ? `<p class="mt-3">${item.description1}</p>` : ""}
      <p>${item.description2 || ""}</p>
      ${listHTML("Ingredients", item.ingredients, "comma")}
      ${listHTML("Process", item.process, "ol")}
    </div>
  `;

  const image = `
    <div class="col-lg-6">
      <div class="image-box">
        <img src="${item.image}" class="img-fluid filled-image" alt="Food">
      </div>
    </div>
  `;

  return `
    <section class="container py-5">
      <div class="row align-items-center">
        ${reverse ? image + text : text + image}
      </div>
    </section>
  `;
}

function renderSections(sections) {
  $("dynamic-section").innerHTML = sections.length
    ? sections.map((s, i) => sectionTemplate(s, i % 2)).join("")
    : `<p class="text-center py-5">No recipes found.</p>`;
}

loadSections();

/***********************
 * SEARCH FILTER
 ***********************/
document.querySelector(".filteredData")?.addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  const filtered = q
    ? window.allSections.filter(i =>
        i.title.toLowerCase().includes(q)
      )
    : window.allSections;

  renderSections(filtered);

  const hero = document.querySelector(".hero-section");
  hero?.classList.toggle("hero-disabled", q.length > 0);
});

/***********************
 * SAVE RECIPE FORM
 ***********************/
async function saveRecipe(e) {
  e.preventDefault();

  const recipe = {
    title: $("title").value.trim(),
    description2: $("description2").value.trim(),
    ingredients: $("ingredients").value.split("\n").filter(Boolean),
    process: $("process").value.split("\n").filter(Boolean),
    buttonText: $("buttonText").value || "Explore Menu",
    image: $("image").value.trim()
  };

  if (!recipe.title || !recipe.ingredients.length || !recipe.process.length || !recipe.image) {
    $("messageBox").innerHTML =
      `<div class="alert alert-danger">Please fill all required fields</div>`;
    return;
  }

  const btn = $("SavaRecipeBtn");
  btn.disabled = true;
  btn.innerText = "Saving...";

  try {
    await axios.post(API.recipes, recipe);
    $("messageBox").innerHTML =
      `<div class="alert alert-success">Recipe saved successfully</div>`;
    $("recipeForm").reset();
    loadSections();
  } catch {
    $("messageBox").innerHTML =
      `<div class="alert alert-danger">Save failed</div>`;
  } finally {
    btn.disabled = false;
    btn.innerText = "Save Recipe";
  }
}

$("SavaRecipeBtn")?.addEventListener("click", saveRecipe);

/***********************
 * IMAGE CHANGE (DROPDOWN)
 ***********************/
function changeImage(value) {
  $("foodImage").src = dishImageMap[value] || "images/food.jpg";
}

/***********************
 * REVIEWS SECTION
 ***********************/
async function loadReviews() {
  try {
    const { data } = await axios.get(API.reviews);
    $("reviewContainer").innerHTML = data.map(r => `
      <div class="col-md-4">
        <div class="review-card h-100">
          <p class="dish-name">${r.dishName}</p>
          <p>${r.description}</p>
          <div class="d-flex align-items-center mt-3">
            <img src="${r.image}" class="avatar">
            <div class="ms-2">
              <h6>${r.customerName}</h6>
              <small class="text-muted">Customer</small>
            </div>
          </div>
        </div>
      </div>
    `).join("");
  } catch (e) {
    console.error("Review load error", e);
  }
}

loadReviews();

/***********************
 * FEEDBACK FORM
 ***********************/
async function submitFeedback(e) {
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
    await axios.post(API.reviews, review);
    alert("Feedback submitted!");
    $("feedbackForm").reset();
    $("foodImage").src = dishImageMap.vadapav;
    loadReviews();
  } catch {
    alert("Submission failed");
  } finally {
    btn.disabled = false;
    btn.innerText = "Submit";
  }
}

$("submitFeedbackBtn")?.addEventListener("click", submitFeedback);

/***********************
 * DEFAULT IMAGE
 ***********************/
document.addEventListener("DOMContentLoaded", () => {
  if ($("foodImage")) $("foodImage").src = dishImageMap.vadapav;
});
