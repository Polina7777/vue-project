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

// export const RegUser = async (name,surname,email,password) => {
//   const response = await fetch(`${url_ngrok}api/users`, {
//     headers:{
//            "Content-Type": "application/json",
//              },
//     method: "POST",
//     body: JSON.stringify({
//               data: {
//                 username:name,
//                 email:email,
//                 password:password
//               },
//             }),
//   });
//   const data = await response.json();
//   const user = data;
//   return user;
// };
// http://localhost:1337/api/auth/local/register
export const registerUser = async (name,surname,email,password) => {
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
                password:password
            }),
  });
  const data = await response.json();
  const user = data;
  return user;
};
export const loginUser = async (email,password) => {
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
    // const { jwt, user } = response.data
    // window.localStorage.setItem('jwt', jwt)
    //  window.localStorage.setItem('userData', JSON.stringify(user))

};
export const userBearer = async (jwt,user)=>{
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

export const userApi = { getUsers, getUsersById,registerUser,loginUser,userBearer};
