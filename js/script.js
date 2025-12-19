const url = "http://localhost:3000/recipieData";

async function loadSections() {
    try {
        const response = await axios.get(url);
        const sections = response.data;  

        let SectionHtml = "";

        sections.forEach((item, index) => {

            // Build Ingredients HTML
            let ingredientsHtml = "";
            if (item.ingredients) {
                ingredientsHtml = `
                    <h4 class="mt-3">Ingredients:</h4>
                    <ul>
                        ${item.ingredients.map(i => i).join(", ")}
                    </ul>
                `;
            }

            // Build Process HTML
            let processHtml = "";
            if (item.process) {
                processHtml = `
                    <h4 class="mt-3">Process:</h4>
                    <ol>
                        ${item.process.map(step => `<li>${step}</li>`).join("")}
                    </ol>
                `;
            }

            // Odd-even layout
            if (index % 2 !== 0) {
                // IMAGE RIGHT
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
                // IMAGE LEFT
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

        document.getElementById("dynamic-section").innerHTML = SectionHtml;

    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}

loadSections();


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

 
 

