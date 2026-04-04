// import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
// import { API_URL } from "./constants";
// export const { dataProvider, kyInstance } = createSimpleRestDataProvider({
//   apiURL: API_URL,
// });

import { BaseRecord, DataProvider,GetListParams, GetListResponse } from "@refinedev/core";


export const dataProvider: DataProvider ={
  getList: async <Tdata extends BaseRecord = BaseRecord>({ resource }:
   GetListParams): Promise<GetListResponse<Tdata>> =>{
    if(resource !== 'subjects') return { data: [] as Tdata[], total:0 };

    return{
       data: [],
       total:0,
    }
   },
   

   getOne: async () => { throw new Error('This function is not present in mock')}, 
   create: async () => { throw new Error('This function is not present in mock')},
   update: async () => { throw new Error('This function is not present in mock')},
   deleteOne: async () => { throw new Error('This function is not present in mock')},

   getApiUrl: ()=> '',
}