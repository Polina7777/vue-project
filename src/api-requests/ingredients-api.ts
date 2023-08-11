import { url_ngrok } from ".";

export const getAllIngredients = async()=>{
    const response = await fetch(`${url_ngrok}api/ingredients?populate=*`,{method:'GET'});
    const data = await response.json();
    const ingredients = data.data
    return ingredients;
}

export const getAllIngredientCollections = async()=>{
    const response = await fetch(`${url_ngrok}api/ingredient-collections`,{method:'GET'});
    const data = await response.json();
    const collections = data.data
    return collections;
}

export const getAllIngredientCollectionsWithIngredients = async()=>{
    const response = await fetch(`${url_ngrok}api/ingredient-collections?populate=*`,{method:'GET'});
    const data = await response.json();
    const collections = data.data
    return collections;
}
export const getIngredientCollectionByIdWithIngredients = async(id:string)=>{
    const response = await fetch(`${url_ngrok}api/ingredient-collections/${id}?populate=*`,{method:'GET'});
    const data = await response.json();
    const collection = data.data
    return collection;
}
export const getIngredientCollectionById = async(id:string)=>{
    const response = await fetch(`${url_ngrok}api/ingredient-collections/${id}`,{method:'GET'});
    const data = await response.json();
    const collection = data.data
    return collection;
}
export const createIngredientsCollection = async (name:string,ingredients:any) => {
    const responseCreate = await fetch(`${url_ngrok}api/ingredient-collections`, {
      headers:{
        "Content-Type": "application/json",
        },
      method: "POST",
      body: JSON.stringify({
        data: {
         name:name,
        },
      }),
    });
    const dataCreate = await responseCreate.json();
    const collection = dataCreate.data
    const responseAddSteps = await fetch(`${url_ngrok}api/ingredient-collections/${collection.id}`, {
        headers:{
          "Content-Type": "application/json",
          },
        method: "PUT",
        body: JSON.stringify({
          data: {
            ingredients:{
                connect:ingredients
            }
          },
        }),
      });
      const dataAddSteps = await responseAddSteps.json();
      const addStepsData = dataAddSteps.data
   return collection
  };

  export const createIngredient = async (name:string,image:string) => {
    const responseCreate = await fetch(`${url_ngrok}api/ingredients`, {
      headers:{
        "Content-Type": "application/json",
        },
      method: "POST",
      body: JSON.stringify({
        data: {
         ingredient:name,
        //  image_url:image
        },
      }),
    });
    const dataCreate = await responseCreate.json();
    const ingredient = dataCreate.data
   return ingredient;
  };


export const ingredientsApi = {getAllIngredients,getAllIngredientCollections,getAllIngredientCollectionsWithIngredients,getIngredientCollectionByIdWithIngredients,getIngredientCollectionById,createIngredientsCollection,createIngredient}