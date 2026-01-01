const url = "http://localhost:3000/recipieData";

async function loadSections() {
    try {
        const response = await axios.get(url);
        const sections = response.data || [];

        // cache for filtering
        window.allSections = sections;

        renderSections(sections);

    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}

function renderSections(sections) {
    let SectionHtml = "";

    sections.forEach((item, index) => {
        let ingredientsHtml = "";
        if (item.ingredients) {
            ingredientsHtml = `
                    <h4 class="mt-3">Ingredients:</h4>
                    <ul>
                        ${item.ingredients.map(i => i).join(", ")}
                    </ul>
                `;
        }

        let processHtml = "";
        if (item.process) {
            processHtml = `
                    <h4 class="mt-3">Process:</h4>
                    <ol>
                        ${item.process.map(step => `<li>${step}</li>`).join("")}
                    </ol>
                `;
        }

        if (index % 2 !== 0) {
            SectionHtml += `
                <section class="container py-5">
                    <div class="row align-items-center">

                        <div class="col-lg-6 mb-4 mb-lg-0">
                            <h1 class="fw-bold">${item.title}</h1>

                            ${item.description1 ? `<p class="mt-3">${item.description1}</p>` : ""}
                            <p>${item.description2 || ""}</p>

                            ${ingredientsHtml}
                            ${processHtml}
                        </div>

                        <div class="col-lg-6">
                            <div class="image-box">
                                <img src="${item.image}" class="img-fluid filled-image" alt="Food">
                            </div>
                        </div>

                    </div>
                </section>
                `;
        } else {
            SectionHtml += `
                <section class="container py-5">
                    <div class="row align-items-center">

                        <div class="col-lg-6">
                            <div class="image-box">
                                <img src="${item.image}" class="img-fluid filled-image" alt="Food">
                            </div>
                        </div>

                        <div class="col-lg-6 mb-4 mb-lg-0">
                            <h1 class="fw-bold">${item.title}</h1>

                            ${item.description1 ? `<p class="mt-3">${item.description1}</p>` : ""}
                            <p>${item.description2 || ""}</p>

                            ${ingredientsHtml}
                            ${processHtml}
                        </div>

                    </div>
                </section>
                `;
        }
    });

    const container = document.getElementById("dynamic-section");
    if (!SectionHtml) {
        container.innerHTML = `<p class="text-center py-5">No recipes found.</p>`;
    } else {
        container.innerHTML = SectionHtml;
    }
}

loadSections();

// wire up search input (filter by title)
const searchInput = document.querySelector('.filteredData');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const q = (e.target.value || '').trim().toLowerCase();
        const all = window.allSections || [];
        const filtered = q ? all.filter(item => (item.title || '').toLowerCase().includes(q)) : all;
        renderSections(filtered);
        // hide/show hero section while user types and update accessibility
        const hero = document.querySelector('.hero-section');
        if (hero) {
            if (q.length > 0) {
                hero.classList.add('hero-disabled');
                hero.setAttribute('aria-hidden', 'true');
            } else {
                hero.classList.remove('hero-disabled');
                hero.removeAttribute('aria-hidden');
            }
        }
    });
}


// to load the data in json through a form

async function saveRecipe(e) {
    if (e && e.preventDefault) e.preventDefault();

    const msgBox = document.getElementById("messageBox");
    const getVal = id => document.getElementById(id) ? document.getElementById(id).value.trim() : "";
    const title = getVal("title");
    const description2 = getVal("description2");
    const ingredientsText = getVal("ingredients");
    const processText = getVal("process");
    const buttonText = getVal("buttonText");
    const image = getVal("image");

    // Validation
    const missing = [];
    if (!title) missing.push('Title');
    if (!ingredientsText) missing.push('Ingredients');
    if (!processText) missing.push('Process');
    if (!image) missing.push('Image');

    if (missing.length) {
        if (msgBox) msgBox.innerHTML = `<div class="alert alert-danger">Please provide: ${missing.join(', ')}</div>`;
        return;
    }

    const recipe = {
        title,
        description2,
        ingredients: ingredientsText.split("\n").map(i => i.trim()).filter(Boolean),
        process: processText.split("\n").map(p => p.trim()).filter(Boolean),
        buttonText: buttonText || 'Explore Menu',
        image
    };

    const saveBtn = document.getElementById("SavaRecipeBtn");
    const prevBtnText = saveBtn ? saveBtn.innerHTML : null;
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = 'Saving...';
    }

    try {
        const response = await axios.post(url, recipe);
        if (msgBox) msgBox.innerHTML = `<div class="alert alert-success">Recipe saved (id: ${response.data && response.data.id ? response.data.id : 'n/a'})</div>`;

        const out = document.getElementById("output");
        if (out) out.innerHTML = `<pre>${JSON.stringify(response.data || recipe, null, 2)}</pre>`;

        const form = document.getElementById("recipeForm");
        if (form) form.reset();

        await loadSections();
    } catch (error) {
        console.error(error);
        if (msgBox) msgBox.innerHTML = `<div class="alert alert-danger">Save failed: ${error && error.message ? error.message : 'unknown error'}</div>`;
    } finally {
        if (saveBtn) {
            saveBtn.disabled = false;
            if (prevBtnText !== null) saveBtn.innerHTML = prevBtnText;
        }
    }
}

 
 const saveBtn = document.getElementById("SavaRecipeBtn");
 if (saveBtn) saveBtn.addEventListener("click", saveRecipe);

  function changeImage(value) {
    const img = document.getElementById("foodImage");

    if (value === "puranpoli") {
      img.src = "images/Puranpoli.jpeg";
    } 
    else if (value === "upma") {
      img.src = "images/upma.jpeg";
    } 
    else if (value === "vadapav") {
      img.src = "images/vadapav.jpeg";
    } 
    else {
      img.src = "images/food.jpg";
    }
  }




const reviewUrl = "http://localhost:3000/CustomerReview";

async function loadReviews() {
  try {
    const response = await axios.get(reviewUrl);
    const reviews = response.data;

    let cardsHtml = "";

    reviews.forEach(review => {
      cardsHtml += `
        <div class="col-md-4">
          <div class="review-card h-100">
            <p class="dish-name">${review.dishName}</p>
            <p class="description">${review.description}</p>

            <div class="d-flex align-items-center mt-3">
              <img src="${review.image}" class="avatar">
              <div class="ms-2">
                <h6 class="mb-0">${review.customerName}</h6>
                <small class="text-muted">Customer</small>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    document.getElementById("reviewContainer").innerHTML = cardsHtml;

  } catch (error) {
    console.error("Error loading reviews", error);
  }
}

loadReviews();

// Initialize default feedback image
document.addEventListener('DOMContentLoaded', function() {
    const foodImage = document.getElementById("foodImage");
    if (foodImage) {
        foodImage.src = "images/vadapav.jpeg";
    }
});

// Feedback form submission
async function submitFeedback(e) {
    if (e && e.preventDefault) e.preventDefault();

    const customerName = document.getElementById("feedbackCustomerName").value.trim();
    const phone = document.getElementById("feedbackPhone").value.trim();
    const date = document.getElementById("feedbackDate").value;
    const message = document.getElementById("feedbackMessage").value.trim();
    const dishSelect = document.getElementById("feedbackDish").value.trim();

    // Validation
    if (!customerName || !message || !dishSelect) {
        alert("Please fill in: Customer Name, Message, and select a Dish");
        return;
    }

    // Map dish select to dish name
    const dishNameMap = {
        "puranpoli": "Puran Poli",
        "upma": "Upma",
        "vadapav": "Vada Pav"
    };
    
    const dishName = dishNameMap[dishSelect] || dishSelect;
    
    // Map dish to image
    const dishImageMap = {
        "puranpoli": "images/Puranpoli.jpeg",
        "upma": "images/upma.jpeg",
        "vadapav": "images/vadapav.jpeg"
    };
    
    const image = dishImageMap[dishSelect] || "images/food.jpg";

    const review = {
        customerName,
        dishName,
        description: message,
        phone,
        date,
        image
    };

    const submitBtn = document.getElementById("submitFeedbackBtn");
    const prevBtnText = submitBtn.innerHTML;

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Submitting...";

        const response = await axios.post(reviewUrl, review);
        
        alert("Feedback submitted successfully!");
        document.getElementById("feedbackForm").reset();
        document.getElementById("feedbackDish").value = "";
        document.getElementById("foodImage").src = "images/vadapav.jpeg";
        
        // Reload reviews to show the new feedback
        await loadReviews();

    } catch (error) {
        console.error("Error submitting feedback:", error);
        alert("Error submitting feedback. Please try again.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = prevBtnText;
    }
}

// Wire up feedback form submit button
const submitFeedbackBtn = document.getElementById("submitFeedbackBtn");
if (submitFeedbackBtn) {
    submitFeedbackBtn.addEventListener("click", submitFeedback);
}

 
 

