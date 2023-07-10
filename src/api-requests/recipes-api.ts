import { url_ngrok } from ".";

export const getAllRecipes = async()=>{
    const response = await fetch(`${url_ngrok}api/foods`,{method:'GET'});
    const data = await response.json();
    const recipes = data.data
    return recipes;
}
export const getAllRecipesWithIngredientCollection = async(sortType:string)=>{
    const response = await fetch(`${url_ngrok}api/foods?sort=title%3A${sortType}&populate=*`,{method:'GET'});
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
    const response = await fetch(`${url_ngrok}api/foods?sort=title%3Aasc&populate=*`,{method:'GET'});
    const data = await response.json();
    const recipe = data.data
    return recipe;
}
export const sortRecipeDESC = async()=>{
    const response = await fetch(`${url_ngrok}api/foods?sort=title%3Adesc&populate=*`,{method:'GET'});
    const data = await response.json();
    const recipe = data.data
    return recipe;
}


export const recipesApi = {getAllRecipes,getRecipeById,getRecipeByIdWithIngredientCollection,getAllRecipesWithIngredientCollection,sortRecipeASC, sortRecipeDESC}