// Global app controller


//app control
import Search from './models/Search';
import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/SearchView';
import * as recipeView from './views/recipeView';
import Recipe from './models/Recipe';
import List from './models/List';
import * as listView from './views/listView';
import Likes from './models/Likes';
import * as likesView from './views/likesView';

/*Global state of the app
* - Search object
* - Current recipe object
* - Shopping List object
* - Liked recipes
*/
const state = {};


/*SEARCH CONTROLLER*/ 
const controlSearch = async ()=>{
    // 1) Get the query from the view
    const query = searchView.getInput();
    //if there is a query
    if(query){
        // 2) create new search object and add to state variable
        state.search = new Search(query);

        // 3) Prepare UI for results   //clear the input filed and clear the search result if a search is placed
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes); //animate the loading circle
        try{
            // 4) Search for recipes
            await state.search.getResults();
            // 5) Render results on UI
            clearLoader();  //remove the spinning loader when the result has come from the server
            searchView.renderResults(state.search.result); //state.search.result is the array of the recipe
        }catch(error){
            alert('Something went wrong...');
            clearLoader();  //remove the spinning loader when the result has come from the server
        }
    }
};


elements.searchForm.addEventListener('submit', e =>{
    e.preventDefault();
    controlSearch();
})

//event listener of the pagination button
//target the paren element of the button
elements.searchResPages.addEventListener('click', e =>{
    //retrieving the button element
    //starts with target element where it happend
    //and head towards the class '.btn-inline' and 
    //<button class="btn-inline results__btn--prev"> 
    const button = e.target.closest('.btn-inline');  
    if(button){
        const goToPage =parseInt(button.dataset.goto);      //goToPage = 1 or 2 or 3 from <button class="btn-inline results__btn--${type}" data-goto=1>
        //clear the previous search list before display the result
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
})

/*RECIPE CONTROLLER*/
const controlRecipe = async ()=>{
    //id = #47746;
    const id = window.location.hash.replace('#', '');   //id = 47746
    if(id){
        //prepare UI for changes
        recipeView.clearRecipe();         //clear previous recipe data from UI
        renderLoader(elements.recipe);    //load spinner 

        //highlight selected pizza if there is a search
        if(state.search){
            //if the id changes by user click or load event of the page
            searchView.highlightSelected(id);
        }
        
        //create new recipe object
        state.recipe = new Recipe(id);
        
        try{
            //1) get recipe data
            await state.recipe.getRecipe();
            //2) calculate cooking time and serving time
            state.recipe.calcTime();
            state.recipe.calcServings(); 
            
            //3) process the ingredients of the recipe according to UI interface
            state.recipe.parseIngredients();
            //console.log(state.recipe);

            //4) render recipe on UI
            clearLoader();                         //clear the spinner
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id)); //
            
        }catch(error){
            alert('Error processing recipe');
        }
    }
};


/*List CONTROLLER*/
const controlList = () =>{
    //1) add the item to the list
    if(!state.list){
        state.list = new List();
    };

    //2) Add each ingredients to the list
    state.recipe.ingredients.forEach(el =>{
        /*item = {
                id: 'f4562dfg',
                count: 2,
                unit: 'tbsp',
                ingredient: 'salt'
            }*/
        const item = state.list.addItem(el.count, el.unit, el.ingredient); //item is added to the state.list
        //adding the item to the list UI
        listView.renderItem(item);
    });

};




/*Likes CONTROLLER*/
const controlLikes = () => {
    //initialize the array for the first time
    if(!state.likes){
        state.likes = new Likes();
    }
    const currId = state.recipe.id;
    //the recipe has not  been liked yet
    if(!state.likes.isLiked(currId)){
        //add like to the state
        const newLike = state.likes.addLike(
            currId, 
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
            );

        //toggle the like button
        likesView.toogleLikeBtn(true);

        //add like to the UI list
        likesView.renderLikesMenu(newLike);
        
    }
    //the recipe has been liked alreday
    else{

        //remove like from the state
        state.likes.deleteLike(currId);

        //toggle the like button
        likesView.toogleLikeBtn(false);

        //remove like from the UI list
        likesView.deleteLike(currId);
    }
    //toggle the like menu if the number of likes are more than 0
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    //like list
    
    
};

//if user already likes any recipe, at the time of page loading it should show up in the likes menu
//page load event
window.addEventListener('load', ()=>{

    //initialize the like object
    state.likes = new Likes();

    //retrieve the liked data from localStorage
    state.likes.readStorage();

    //if there is existing likes show up the toggle menu
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //render the existing likes UI
    state.likes.likes.forEach(like => likesView.renderLikesMenu(like));
});

//eventlistner if the hash changes in the url
//window.addEventListener('hashchange', controlRecipe);  //http://localhost:8080/#47746
//window.addEventListener('load', controlRecipe);       //if page refreshes with a recipe id
//hashchange and load event together
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)); 

//click events any of the button in <div class="recipe">  
elements.recipe.addEventListener('click', event=>{

    //if the decrease button in the recipe or any of the child is clicked
    if(event.target.matches('.btn-dec, .btn-dec *')){
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            //update Recipe UI
            recipeView.updateServingsIngredients(state.recipe);
        }
    }
    //if the increase button in the recipe or any of the child is clicked
    else if(event.target.matches('.btn-inc, .btn-inc *')){
        state.recipe.updateServings('inc');
        //update Recipe UI
        recipeView.updateServingsIngredients(state.recipe);
    }

    //click event of "ADD TO SHOPPING LIST" button
    else if(event.target.matches('.recipe__btn-add, .recipe__btn-add *')){
        //add recipe ingredients to shopping list
        controlList();
    }
    
    //click event of the Likes button
    else if (event.target.matches('.recipe__love, .recipe__love *')){
        //add or remove likes of the recipe
        controlLikes();
    }
    //console.log(state.recipe);
});

//Handle delete and update list item events
elements.shopping.addEventListener('click', event =>{
    //id of any of the input or text or delete buton which is clicked
    const id = event.target.closest('.shopping__item').dataset.itemid;
    //Handle the delete button
    if(event.target.matches('.shopping__delete, .shopping__delete *')){
        //delete from the state.list
        state.list.deleteItem(id);
        //delete from the UI
        listView.deleteItem(id);
    }
    //update the count if the input value changes
    else if (event.target.matches('.shopping__count-value')){
        let val = parseFloat(event.target.value);
        if(val < 0){
            event.target.value = 0;
            val = 0;
        }
        state.list.updateCount(id, val);
    }
});

