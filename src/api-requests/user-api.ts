import { url_ngrok } from ".";

export const getUsers = async () => {
  const response = await fetch(`${url_ngrok}api/users?populate=*`, {
    method: "GET",
  });
  const data = await response.json();
  const users = data;
  return users;
};
export const getUsersById = async (id: string) => {
  const response = await fetch(`${url_ngrok}api/users/${id}?populate=*`, {
    method: "GET",
  });
  const data = await response.json();
  const user = data;
  return user;
};
export const setFavoritesCollectionForUser = async (id: string, collection: any,token: any) => {
  const collectionId = String(collection.id);
    console.log(token,'token')
    const response = await fetch(`${url_ngrok}api/users/${id}`, {
      headers:{
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      },
      method: "PUT",
      body: JSON.stringify({
        data: {
          favorite: {
            connect: [collectionId],
          },
        },
      }),
    });
    const data = await response.json();
    if(data.error){
      return data.error
    }
    return data
};

export const registerUser = async (name: any,surname: any,email: any,password: any,collectionId:any) => {
  const username = `${name} ${surname}`
  const response = await fetch(`${url_ngrok}api/auth/local/register`, {
    headers:{
           "Content-Type": "application/json",
             },
    method: "POST",
    body: JSON.stringify({
                name:surname,
                username:username,
                email:email,
                password:password,
                favorite: collectionId,
            }),
  });
  const data = await response.json();
  const user = data;
  return user;
};
export const loginUser = async (email: any,password: any) => {
  const response = await fetch(`${url_ngrok}api/auth/local`, {
    headers:{
           "Content-Type": "application/json",
             },
    method: "POST",
    body: JSON.stringify({
      identifier: email,
        password: password
            }),
           
  });
  const data = await response.json();
  return data;
};
export const userBearer = async (jwt: any,user: { id: any; })=>{
 const response = await fetch(`${url_ngrok}api/users/${user.id}?populate=*`, {
    headers:{
           "Content-Type": "application/json",
           "Authorization": `Bearer ${jwt}`,
             },
    method: "POST",

  });
  const data = await response.json();

  return data;
}

export const userApi = { getUsers, getUsersById,setFavoritesCollectionForUser ,registerUser,loginUser,userBearer};
