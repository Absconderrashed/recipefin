import axios from 'axios';

export default class Recipe{
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        }catch(error){
            console.log(error);
        }
    }

    //processing of the ingredients
    parseIngredients(){
        const unitsLong = ['tablespoons', 'tablesspoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds', '-'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound', ' '];
        const units = [...unitsShort, 'g', 'kg'];
        const newIngredients = this.ingredients.map(el =>{
            //1) uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((current, curIndex) =>{
                ingredient = ingredient.replace(current, unitsShort[curIndex]);
            });
            //2) remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
           
            //3) Parse ingredients into count, unit, and ingredients
            let arrIng = ingredient.split(' ');   //converts all the ingredients into array
            //return true or false if the current element matches with the words in the unitsShort array
            let unitIndex = arrIng.findIndex(curEl => units.includes(curEl)); 
            let objIng; //to hold the data count, unit and ingredients after processing  
            if(unitIndex >-1){
                //there is an unit
                //Ex.  1-1/3 cups....  arrCount = 1-1/3
                //Ex.  4 1/2 cups....  arrCount = [4, 1/2]
                //Ex.  4 cups....      arrCount = [4] 
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if(arrCount.length === 1){
                    count = (parseInt(arrIng[0]));
                    
                }else{
                   count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                objIng = {
                    count: count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                }
            }else if(parseInt(arrIng[0])){
                //there is an unit and the first element is a number
                objIng = {
                    count: parseInt(arrIng[0]),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }else if (unitIndex === -1){
                //there is no unit
                objIng = {
                    count: 1,
                    unit : '',
                    ingredient: ingredient
                }
            }
            
            return objIng;
        })
        this.ingredients = newIngredients;
        //console.log(this.ingredients);
    }
    calcTime(){
        //aasume that each three ingredients take 15 minutes to cook
        const numIng = this.ingredients.length;
        const periods = numIng / 3;
        this.time = Math.ceil(periods * 15);
    }
    calcServings(){
        this.servings = 4;
    }
 
    //increase or decrease the number of servings
    updateServings(type){
        //temporary variable to hold servings number
        const newServings = type ==='inc' ? this.servings+1 : this.servings-1;
        //update count
        //0: {count: 4.5, unit: "cup", ingredient: "unbleached high gluten, bread, or all-purpose flour, chilled"}
        //1: {count: 1.75, unit: "tsp", ingredient: "salt"}
        //2: {count: 1, unit: "tsp", ingredient: "instant yeast"}
        //3: {count: 1, unit: "cup", ingredient: "olive oil "}
        this.ingredients.forEach(ing =>{
            //new count equation
            ing.count = ing.count * (newServings/this.servings);
        })
        
        this.servings = newServings;
    }
}