// const urlService = 'http://localhost:3000'
const urlService = 'http://34.160.110.0'
// const urlService = 'https://7cac-2401-4900-1f34-2442-f81d-5f17-8b0d-bdc6.ngrok-free.app'


const waitingMessages = ["Whipping up some culinary magic! This might take a moment.",
"Simmering the recipe ideas. Just a bit more patience, please!",
"Our kitchen is buzzing with creativity. Hang tight for your delicious recipe!",
"Stirring the pot of possibilities. We'll have your recipe ready shortly.",
"The recipe is in the oven—slow-cooking perfection. Almost there!",
"Marinating your personalized recipe. Thanks for your patience!",
"Blending flavors, unlocking secrets. Your recipe is on its way!",
"Our chef is crafting something special for you. A little more time, please!",
"Infusing the recipe with savory details. Almost done!",
"Savor the anticipation! Your customized recipe is on the horizon."]


async function safeJsonParse(response) {
    try {
        return await response.json();
    } catch (error) {
        throw new Error( response)
    }

}



async function makeRecipe() {
    showLoader();

    var userInput = document.getElementById('recipeInput').value;



    var apiUrl = urlService + '/make/recipe';
    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authentication : getToken()
        },
        body: JSON.stringify({ text: userInput }),
    };


    try {
        var response = await fetch(apiUrl, requestOptions);
        if (response.status === 429) {
            alert('Too Many Requests. Please try again later.');
            hideLoader();
          } 
        var apiResponse = await safeJsonParse(response)
        // await response.json();
        debugger
        if (apiResponse.error) {
            alert(apiResponse.error);
            hideLoader();
            document.getElementById('recipeInput').value = '';
            
        }
        else {
            localStorage.setItem('recipe_id', apiResponse.recipe_id);
            hideLoader();
            displayResponse(apiResponse);
        }

        // localStorage.setItem('recipe_id', apiResponse.recipe_id);
        // hideLoader();
        // displayResponse(apiResponse);
    } catch (error) {
        console.error('API Error:', error);
        hideLoader();
        displayResponse({ error: 'An error occurred while making the API request.' });
    }
}

function displayResponse(response) {


    const structuredResponse = `
        <h2>${response.recipe_name}</h2>
        <p>Servings: ${response.number_of_servings}</p>
        <p>Cooking Time: ${response.cooking_time} minutes</p>
        <p>Nutritional Value: ${response.nutritional_value}</p>
        <p>Taste: ${response.taste}</p>
        <h3>Ingredients:</h3>
        <ul>
            ${response.ingredients.map(ingredient =>
                `<li>${ingredient.quantity} ${ingredient.unit} of ${ingredient.name}</li>`
            ).join('')}
        </ul>
        <h3>Method:</h3>
        <ol>
            ${response.method.map(step =>
                `<li><strong>${step.step}</strong>: ${step.instruction}</li>`
            ).join('')}
        </ol>
    `;

    document.getElementById('response-values').innerHTML = structuredResponse;

    document.getElementById('response-image').innerHTML = `<img src=${response.imgurl} alt="recipe image" width="500" height="600">`;
}

function showLoader() {
    
    var loader = document.getElementById('loader');
    loader.style.display = 'block';

    
    var loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.innerHTML = 'Loading...';

    
    var startTime = new Date().getTime();
    var timer = setInterval(function() {
        var elapsedTime = Math.floor((new Date().getTime() - startTime) / 1000);
        // loadingMessage.innerHTML = 'Loading... ' + elapsedTime + ' seconds';
        const randomMessage = waitingMessages[Math.floor(Math.random() * waitingMessages.length)];

         loadingMessage.innerHTML = randomMessage;
    }, 3000);
    
    loader.dataset.timerId = timer;
}

function hideLoader() {
    var loader = document.getElementById('loader');
    loader.style.display = 'none';
    var timerId = loader.dataset.timerId;
    if (timerId) {
        clearInterval(timerId);
        loader.dataset.timerId = '';
    }
}


function openLoginRegisterModal() {
    document.getElementById('loginRegisterModal').style.display = 'block';

}

function redirectToHomePage() {
    window.location.href = 'index.html';
}


function closeLoginRegisterModal() {
    document.getElementById('loginRegisterModal').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}


async function registerUser() {
    var username = document.getElementById('register_username').value;
    var password = document.getElementById('register_password').value;

    var apiUrl = urlService + '/auth/signup';

    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authentication' : getToken()
        },
        body: JSON.stringify({ email: username, password: password}),
    };

    try {
        var response = await fetch(apiUrl, requestOptions);
        
        var apiResponse = await response.json();

        console.log(apiResponse)


        if (apiResponse.error) alert(apiResponse.error);
        else {
            const token = apiResponse.token;
            saveToken(token);
            alert('User registered successfully');
            redirectToHomePage()
        }
        
        
    } catch (error) {
        console.error('API Error:', error);
        alert('An error occurred while making the API request.');
    }
}


async function loginUser() {
    var username = document.getElementById('login_username').value;
    var password = document.getElementById('login_password').value;

    var apiUrl = urlService + '/auth/login';

    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authentication' : getToken()
        },
        body: JSON.stringify({ email: username, password: password}),
    };

    try {
        var response = await fetch(apiUrl, requestOptions);
        
        var apiResponse = await response.json();

        console.log(apiResponse)



        if (apiResponse.error) alert(apiResponse.error);
        else {
            const token = apiResponse.token;
            saveToken(token);
            alert('User logged in  successfully');
            redirectToHomePage()
        }

        
        
        
    } catch (error) {
        console.error('API Error:', error);
        alert('An error occurred while making the API request.');
    }
}


const saveToken = (token) => {
    localStorage.setItem('Recipe_USER_token', token);
}

const getToken = () => {
    return localStorage.getItem('Recipe_USER_token');
}




async function get_recent_search() {
    console.log('get_recent_search')
    if (window.location.pathname.endsWith('recent-searches.html')) {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };

        const response = await fetch(urlService + "/recipe/recent-recipes", requestOptions);
        const apiResponse = await response.json();

        apiResponse.forEach(item => {
            const box = document.createElement('div');
            box.className = 'box';
            box.style.backgroundImage = `url(${item.short_imgurl})`;
            box.style.backgroundSize = 'cover';

            const link = document.createElement('a');
            link.href = `recipe.html?recipe_id=${item._id}`; // Add the recipe_id to the link URL

            const title = document.createElement('div');
            title.innerHTML = item.recipe_name;
            link.appendChild(title); // Append the title to the link element
            box.appendChild(link); // Append the link to the box element

            box.addEventListener('click', function() {
                window.location.href = `recipe.html?recipe_id=${item._id}`;
            })

            document.querySelector('.container').appendChild(box);
        });
    }
}

async function get_recent_search_user() {

    if (window.location.pathname.endsWith('recent-searches.html')) {
        const token =  getToken();

        if (!token) {
            alert('Please login to add recipe to favorites');
            window.location.href = 'login.html';
            return;
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'authentication' : getToken()},
        };

        const response = await fetch(urlService + "/recipe/recent-recipes", requestOptions);
        const apiResponse = await response.json();

        apiResponse.forEach(item => {
            const box = document.createElement('div');
            box.className = 'box';
            box.style.backgroundImage = `url(${item.short_imgurl})`;
            box.style.backgroundSize = 'cover';

            const link = document.createElement('a');
            link.href = `recipe.html?recipe_id=${item._id}`; // Add the recipe_id to the link URL

            const title = document.createElement('div');
            title.innerHTML = item.recipe_name;
            link.appendChild(title); // Append the title to the link element
            box.appendChild(link); // Append the link to the box element

            box.addEventListener('click', function() {
                window.location.href = `recipe.html?recipe_id=${item._id}`;
            })

            document.querySelector('.container').appendChild(box);
        });
    }
}

window.onload = async function() {
    if (window.location.pathname.endsWith('favorites.html')) {
        const token =  getToken();
        if (!token) {
            alert('Please login to add recipe to favorites');
            window.location.href = 'login.html';
            return;
        }
    
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'authentication' : getToken() },
        };

        const response = await fetch(urlService+ "/recipe/fav-recipes", requestOptions);
        const apiResponse = await response.json();

        apiResponse.forEach(item => {
            const box = document.createElement('div');
            box.className = 'box';
            box.style.backgroundImage = `url(${item.short_imgurl})`;
            box.style.backgroundSize = 'cover';

            const link = document.createElement('a');
            link.href = `recipe.html?recipe_id=${item._id}`; // Add the recipe_id to the link URL

            const title = document.createElement('div');
            title.innerHTML = item.recipe_name;
            link.appendChild(title); // Append the title to the link element
            box.appendChild(link); // Append the link to the box element

            box.addEventListener('click', function() {
                window.location.href = `recipe.html?recipe_id=${item._id}`;
            })

            document.querySelector('.container').appendChild(box);
        });
    }
}
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

async function fetchRecipeDetails(recipeId) {
    try {
        const response = await fetch(urlService + `/recipe/recipe?recipe_id=${recipeId}`);
        const data = await response.json();
        displayResponse(data);
    } catch (error) {
        console.error('Error fetching recipe details:', error);
    }
}

function initializePage() {
    const recipeId = getQueryParam('recipe_id');
    if (recipeId) {
        fetchRecipeDetails(recipeId)
    }
    else  console.error('Recipe ID not found in query parameters');
}


function initializeHomePage() {

    // Check if a token exists in the local storage
    const token = getToken();
    if (token) {
        // If a token exists, hide the login and register buttons
        const loginButton = document.getElementById('loginButton');
        const registerButton = document.getElementById('registerButton');
        if (loginButton) loginButton.style.display = 'none';
        if (registerButton) registerButton.style.display = 'none';
    }
    else signoutButton.style.display = 'none';
}

function logout() {
    localStorage.removeItem('Recipe_USER_token');
    redirectToHomePage();
}

async function addToFavorites(){
    const recipeId = localStorage.getItem('recipe_id');

    const token =  getToken();
    if (!token) {
        alert('Please login to add recipe to favorites');
        window.location.href = 'login.html';
        return;
    }

    if (!recipeId) {
        alert('No recipe found to add to favorites');
        return;
    }


    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authentication' : getToken()
        },
        body: JSON.stringify({ recipe_id: recipeId }),
    };

    const response = await fetch(urlService+"/recipe/favourite/add", requestOptions)
    
    const apiResponse = await response.json();
    alert('SuccessFully Added To Favorites !!');
}