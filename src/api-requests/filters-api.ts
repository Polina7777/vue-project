import { url_ngrok } from ".";

 const filtersByTags = async (id: string,sortType:string,page:any) => {
  const response = await fetch(
    `${url_ngrok}api/foods?pagination[page]=${page}&pagination[pageSize]=3&sort=title%3A${sortType}&populate=*&filters[categories][id][$eqi]=${id}`,
    { method: "GET" }
  );
  const data = await response.json();
  const filteredData = data.data;
  const pagination = data.meta.pagination
  return {filteredData,pagination};
};

 const filtersByFiltersForm = async (filters: {
  kcal: string;
  serve: string;
  grams: string;
},sortType:string,page:number) => {
  const response = await fetch(
    `${url_ngrok}api/foods?pagination[page]=${page}&pagination[pageSize]=3&sort=title%3A${sortType}&populate=*&filters[extra_info][kcal][$containsi]=${filters.kcal}&filters[extra_info][serve][$containsi]=${filters.serve}&filters[extra_info][grams][$containsi]=${filters.grams}`,
    { method: "GET" }
  );
  const data = await response.json();
  console.log(data,'filters')
  const filteredData = data.data;
  const pagination = data.meta.pagination
  return {filteredData,pagination};
  // return filteredData;
};

export const filtersApi = { filtersByTags, filtersByFiltersForm };
