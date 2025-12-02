let url = "http://localhost:3000/recipieData";

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

async function saveRecipe() {
    // Read form values
    const title = document.getElementById("title").value;
    const description2 = document.getElementById("description2").value;
    const ingredientsText = document.getElementById("ingredients").value;
    const processText = document.getElementById("process").value;
    const buttonText = document.getElementById("buttonText").value;
    const image = document.getElementById("image").value;

    // Convert textarea lines into array
    const ingredientsArray = ingredientsText.split("\n").map(i => i.trim()).filter(i => i !== "");
    const processArray = processText.split("\n").map(s => s.trim()).filter(s => s !== "");

    // Create JSON object to save
    const recipe = {
        title: title,
        description2: description2,
        ingredients: ingredientsArray,
        process: processArray,
        buttonText: buttonText,
        image: image
    };

    try {
        // Send to JSON server
        const response = await axios.post(url, recipe);

        // Show success message
        document.getElementById("messageBox").innerHTML =
            `<div class="alert alert-success mt-3">Recipe saved successfully!</div>`;

        // Show generated JSON
        document.getElementById("output").innerHTML =
            `<pre>${JSON.stringify(recipe, null, 2)}</pre>`;

        // Clear form
        document.getElementById("recipeForm").reset();


    } catch (error) {
        console.error("Error saving data:", error);

        document.getElementById("messageBox").innerHTML =
            `<div class="alert alert-danger mt-3">Failed to save recipe!</div>`;
    }
    finally{loadSections()}
 }
 saveRecipe();

