import { url_ngrok } from ".";

export const getProcessByIdWithSteps = async(id:string)=>{
    const response = await fetch(`${url_ngrok}api/processes/${id}?populate=*`,{method:'GET'});
    const data = await response.json();
    const collection = data.data
    return collection;
}
export const createProcessCollection = async (name:string,steps:any) => {
    const responseCreate = await fetch(`${url_ngrok}api/processes`, {
      headers:{
        "Content-Type": "application/json",
        },
      method: "POST",
      body: JSON.stringify({
        data: {
         title:name,
        },
      }),
    });
    const dataCreate = await responseCreate.json();
    const collection = dataCreate.data
    const responseAddSteps = await fetch(`${url_ngrok}api/processes/${collection.id}`, {
        headers:{
          "Content-Type": "application/json",
          },
        method: "PUT",
        body: JSON.stringify({
          data: {
            process_steps:{
                connect:steps
            }
          },
        }),
      });
      const dataAddSteps = await responseAddSteps.json();
      const addStepsData = dataAddSteps.data
      console.log(addStepsData)
   return collection
  };

  export const createProcessStep = async (name:string,description:any) => {
    const responseCreate = await fetch(`${url_ngrok}api/process-steps`, {
      headers:{
        "Content-Type": "application/json",
        },
      method: "POST",
      body: JSON.stringify({
        data: {
         name:name,
         description:description.description
        },
      }),
    });
    const dataCreate = await responseCreate.json();
    const step = dataCreate.data
    console.log(step)
   return step
  };

export const processApi = {getProcessByIdWithSteps,createProcessCollection,createProcessStep}