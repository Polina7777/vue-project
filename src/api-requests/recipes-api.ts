import { url_ngrok } from ".";

export const getAllRecipes = async()=>{
    const response = await fetch(`${url_ngrok}api/foods`,{method:'GET'});
    const data = await response.json();
    const recipes = data.data
    return recipes;
}
export const getAllRecipesWithIngredientCollection = async()=>{
    const response = await fetch(`${url_ngrok}api/foods?populate=*`,{method:'GET'});
    const data = await response.json();
    const recipes = data.data
    return recipes;
}
export const getRecipeById = async(id:string)=>{
    const response = await fetch(`${url_ngrok}api/foods/${id}`,{method:'GET'});
    const data = await response.json();
    const recipe = data.data
    return recipe;
}
export const getRecipeByIdWithIngredientCollection = async(id:string)=>{
    const response = await fetch(`${url_ngrok}api/foods/${id}?populate=*`,{method:'GET'});
    const data = await response.json();
    const recipe = data.data
    return recipe;
}
export const sortRecipeASC = async()=>{
    console.log('asc')
    const response = await fetch(`${url_ngrok}api/foods?sort=title%3Aasc&populate=*`,{method:'GET'});
    const data = await response.json();
    const recipe = data.data
    console.log(recipe,'asc')
    return recipe;
}
export const sortRecipeDESC = async()=>{
    console.log('desc')
    const response = await fetch(`${url_ngrok}api/foods?sort=title%3Adesc&populate=*`,{method:'GET'});
    const data = await response.json();
    const recipe = data.data
    console.log(recipe,'desc')
    return recipe;
}


export const recipesApi = {getAllRecipes,getRecipeById,getRecipeByIdWithIngredientCollection,getAllRecipesWithIngredientCollection,sortRecipeASC, sortRecipeDESC}