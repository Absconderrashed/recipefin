import {elements} from './base';
import {limitRecipeTitle} from './SearchView';

export const toogleLikeBtn = isLiked =>{
    /*<button class="recipe__love">
        <svg class="header__likes">
            <use href="img/icons.svg#icon-heart-outlined"></use>
        </svg>
    </button>*/
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';  //icon-heart = complete heart and icon-heart-outlined= only heart outline
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

//toggle the heart icon if there is any like
export const toggleLikeMenu = numLikes =>{
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};


//render likes menu
export const renderLikesMenu = like =>{
    const markup = `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="${like.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4> 
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>
    `;

    elements.likesList.insertAdjacentHTML('beforeend', markup);
}

export const deleteLike = id =>{
    //element = <ul class="likes__list"> </ul>
    const element = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;
    if(element){
        element.parentElement.removeChild(element);  //remove from the like list
    }
    
}