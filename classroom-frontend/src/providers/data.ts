import { BACKEND_BASE_URL } from "@/constants";
import { ListResponse } from "@/types"
import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest"


const options: CreateDataProviderOptions ={
    getList: {
      getEndpoint: ({ resource }) => resource,

      buildQueryParams: async ({ resource,pagination, filters}) => {
         const page = pagination?.currentPage ?? 1;
         const pageSize = pagination?.pageSize ?? 10;

         const params: Record<string, string|number> = { page,limit: pageSize};

         filters?.forEach((filter) => {
            const field = 'field' in filter ? filter.field: '';
            if (!('value' in filter) || filter.value == null || field === '') {
                return;
            }

            const value = String(filter.value);

            if(resource === 'subjects'){
                 if(field === 'department') params.department = value;
                 if(field === 'name' || field ==='code') params.search = value;
            }
         });
         return params;
      },

      mapResponse: async (response) => {
         const payload: ListResponse = await response.clone().json();

         return payload.data ?? [];
      },

      getTotalCount: async (response) =>{
         const playload: ListResponse = await response.clone().json();

         return playload.pagination?.total ?? playload.data?.length ?? 0;
      }
    }
}

const  { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);
export { dataProvider  };
