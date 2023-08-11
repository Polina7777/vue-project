import { url_ngrok } from ".";

export const getSmallInfoById = async(id:string)=>{
    const response = await fetch(`${url_ngrok}api/small-extra-info/${id}?populate=*`,{method:'GET'});
    const data = await response.json();
    const collection = data.data
    return collection;
}


export const createSmallInfoCollection = async (name:string,kcal:any,grams:any) => {
    const response = await fetch(`${url_ngrok}api/small-extra-infos`, {
      headers:{
        "Content-Type": "application/json",
        },
      method: "POST",
      body: JSON.stringify({
        data:{
           name:name,
           kcal: `${kcal} kcal`,
           grams: `${grams} grams`,

         },
      }),
    });
    const data = await response.json();
    const collection = data.data
    console.log(collection)
   return collection
  };

  export const createExtraInfoCollection = async (name:string,kcal:any,grams:any,mins:any,serve:any) => {
    const response = await fetch(`${url_ngrok}api/extra-infos`, {
      headers:{
        "Content-Type": "application/json",
        },
      method: "POST",
      body: JSON.stringify({
        data: {
         name:name,
         kcal: `${kcal} kcal`,
         grams: `${grams} grams`,
         min: `${mins} mins`,
         serve: `${serve} serves`,
        },
      }),
    });
    const data = await response.json();
    const collection = data.data
    console.log(collection)
   return collection
  };
export const smallInfoApi = {getSmallInfoById, createSmallInfoCollection,createExtraInfoCollection}