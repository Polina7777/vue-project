import { url_ngrok } from ".";
import { ingredientsApi } from "./ingredients-api";
import { processApi } from "./process-api";
import { smallInfoApi } from "./small-info-api";

export const getAllRecipes = async()=>{
    const response = await fetch(`${url_ngrok}api/foods`,{method:'GET'});
    const data = await response.json();
    const recipes = data.data
    return recipes;
}
export const getAllRecipesWithIngredientCollection = async(sortType:string,page:any)=>{
    const response = await fetch(`${url_ngrok}api/foods?pagination[page]=${page}&pagination[pageSize]=3&sort=title%3A${sortType}&populate=*`,{method:'GET'});
    const data = await response.json();
    const recipes = data
    return recipes;
}
export const getAllRecipesWithIngredientCollectionWithoutPagination = async()=>{
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

export const createNewRecipe =  async (title: any,description: any,categoryId: any,image: any,kcal:any,grams:any,mins:any,serve:any,steps:any,ingredients:any) => {
    const stepsIdArr = [];
    const ingredientsIdArr =[];
   steps.map(async (item,index)=>{ 
    const name = `Step ${index + 1}`
    const createStep = await processApi.createProcessStep(name,item)
    stepsIdArr.push(createStep.id)
})
ingredients.map(async(item,index)=>{
    const createIngredient = await ingredientsApi.createIngredient(item.name,item.image)
    ingredientsIdArr.push(createIngredient.id)
})
    const smallInfoCollectionId = await smallInfoApi.createSmallInfoCollection(title,kcal,grams)
    const extraInfoCollectionId = await smallInfoApi.createExtraInfoCollection(title,kcal,grams,mins,serve)
    const processCollectionId = await processApi.createProcessCollection(title,stepsIdArr)
    const ingredientCollectionId = await ingredientsApi.createIngredientsCollection(title,ingredientsIdArr)
console.log(smallInfoCollectionId, extraInfoCollectionId,processCollectionId,ingredientCollectionId)

    const responseCreareRecipe = await fetch(`${url_ngrok}api/foods`, {
      headers:{
             "Content-Type": "application/json",
               },
      method: "POST",
      body: JSON.stringify({
        data:{
            title:title,
            description:description,
            image_url:image,
        }
                
              }),
    });
    const data = await responseCreareRecipe.json();
    const recipe = data;
    console.log(data)
    console.log(categoryId)
    const responseConnectAllCollections = await fetch(`${url_ngrok}api/foods/${recipe.data.id}`, {
        headers:{
               "Content-Type": "application/json",
                 },
        method: "PUT",
        body: JSON.stringify({
                 data:{
                    categories:{
                        connect:[4,categoryId]
                    },
                    small_extra_info:{
                        connect: [smallInfoCollectionId.id],
                    },
                    extra_info:{
                        connect: [extraInfoCollectionId.id],
                    },
                    processing:{
                        connect:[processCollectionId.id]
                    },
                    ingredient_collection:{
                        connect:[ingredientCollectionId.id]
                    }
                 }
                }),
      });
  
    const connectData = await responseConnectAllCollections.json();
   
    console.log(recipe,connectData)
    return recipe;
  };


export const recipesApi = {getAllRecipes,getRecipeById,getRecipeByIdWithIngredientCollection,getAllRecipesWithIngredientCollection,getAllRecipesWithIngredientCollectionWithoutPagination ,sortRecipeASC, sortRecipeDESC, createNewRecipe}