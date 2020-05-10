export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
}

const elementString = {
    loader: 'loader'
};

//implement the animated loading icon before the search result appears on the page
export const renderLoader = parent =>{
    const loader = `
        <div class="${elementString.loader}">
            <svg>
                <use href='img/icons.svg#icon-cw'></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
}

export const clearLoader = ()=>{
    //since the loader class is added later as a child 
    //so it cannnot be selected from elements object like other query selector elements
    //so it is explicitly selected here
    const loader = document.querySelector(`.${elementString.loader}`);
    //to remove an element, select the parent element of the selected element
    //then use removeChild method
    loader.parentElement.removeChild(loader);
}