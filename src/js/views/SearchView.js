import {elements} from './base'
export const getInput = () => elements.searchInput.value;

//
export const highlightSelected = id =>{

    //first remove the active class from all classes 'results__link'
    //resultArray = [<a class="results__link results__link--active" href="#23456">, <a class="results__link results__link--active" href="#23459">] 
    const resultArray = Array.from(document.querySelectorAll('.results__link'));
    
    resultArray.forEach(el => {
        el.classList.remove('results__link--active');
    })
    //adding the active class with the id 
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

//generating the HTML markup for displaying the search result
const renderRecipe = recipe => {
    //HTML markup for li inside <ul class="results__list"></ul>
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`;
    //targeting the <ul class="results__list"></ul> element and insert the li as the last child
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
}

//shortening the title, if the title has more than 17 characters
export const limitRecipeTitle = (title, limit = 17) =>{
    const newTitle = [];  //new title to hold the shortened title
    if(title.length > limit){                         //step by step execution example
        title.split(' ').reduce((accu, cur) =>{       //'Potato with tomato and spinach'
            if(accu + cur.length <= limit){           // accu = 0 / accu + cur = 5 / newTitle = ['Potato']
                newTitle.push(cur);                   // accu = 5 / accu + cur = 9 / newTitle = ['Potato', 'with']
            }                                         //accu = 9 / accu + cur = 15 / newTitle = ['Potato', 'with', 'tomato']
            return accu + cur.length;                 //accu = 15 / accu + cur = 18 / newTitle = ['Potato', 'with', 'tomato']
        }, 0)                                         //accu = 18 / accu + cur = 25 / newTitle = ['Potato', 'with', 'tomato']
        return `${newTitle.join(' ')}...`;
    }
    return title;
}

//HTML markup for creating the pagination button.
//it takes the page number and depending on the page number
// it retuns the previous or next button element
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page-1 : page+1}>
        <span>Page ${type === 'prev' ? page-1 : page+1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numberOfResults, resPerPage) =>{
    //total number of pages
    const pages = Math.ceil(numberOfResults / resPerPage);
    let button;
    if(page ===1 && pages >1){
        //only one button to the next page
        button = createButton(page, 'next');
    }else if(page < pages){
        //both buttons into a string
        button = `${createButton(page, 'prev')}
                  ${createButton(page, 'next')}`;
        
    }else if(page === pages){
        //only one button to the previous page
        button = createButton(page, 'prev');
    }

    //selecting the element to insert the button
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};


//recives all the recipes and iterate through each recipe
export const renderResults = (recipes, page=1, resPerPage=10) =>{
    //in page 1, start = 0; in page 2, start = 10; in page 3, start = 20
    const start = (page - 1) * resPerPage;
    //in page 1, end = 10; in page 2, end = 20; in page 3, end = 30
    const end = page * resPerPage;
    //call the renderRecipe method for each Recipe per page
    //slice method does not 
    recipes.slice(start, end).forEach(renderRecipe);   // in page 1, forEach iterates between 0 and 9 
    
    //render pagination buttons depending on the current page and total number of results and number of resuls per page
    renderButtons(page, recipes.length, resPerPage);
}

//clear the input field after hitting enter key
export const clearInput = () => elements.searchInput.value = '';

//clear the previous result if the new search is placed
export const clearResults = () =>{
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};