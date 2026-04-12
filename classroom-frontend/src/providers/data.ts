import { BACKEND_BASE_URL } from "@/constants";
import { ListResponse } from "@/types"
import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest"

const getResponseLocation = (response: Response) => {
    try {
        const url = new URL(response.url);
        return `${url.pathname}${url.search}`;
    } catch {
        return response.url || "the API endpoint";
    }
};

const getPreviewText = (body: string) =>
    body.replace(/\s+/g, " ").trim().slice(0, 120);

const parseJsonResponse = async <T>(
    response: Response,
    requestLabel: string,
): Promise<T> => {
    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    const body = await response.text();

    if (!contentType.includes("application/json")) {
        const preview = getPreviewText(body);

        throw new Error(
            `${requestLabel} returned ${response.status} ${response.statusText} with ${contentType || "an unknown content type"} instead of JSON.${preview ? ` Response started with: ${preview}` : ""}`,
        );
    }

    try {
        return JSON.parse(body) as T;
    } catch {
        throw new Error(`${requestLabel} returned invalid JSON.`);
    }
};

const buildApiError = async (response: Response, requestLabel: string) => {
    try {
        const payload = await parseJsonResponse<Record<string, unknown>>(
            response.clone(),
            requestLabel,
        );

        const message =
            typeof payload.message === "string"
                ? payload.message
                : typeof payload.error === "string"
                  ? payload.error
                  : `${requestLabel} failed with ${response.status} ${response.statusText}.`;

        return {
            message,
            statusCode: response.status,
        };
    } catch (error) {
        return {
            message:
                error instanceof Error
                    ? error.message
                    : `${requestLabel} failed with ${response.status} ${response.statusText}.`,
            statusCode: response.status,
        };
    }
};

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
         const requestLabel = `Request to ${getResponseLocation(response)}`;

         if (!response.ok) {
            const error = await buildApiError(response, requestLabel);
            throw new Error(error.message);
         }

         const payload = await parseJsonResponse<ListResponse>(
            response.clone(),
            requestLabel,
         );

         return payload.data ?? [];
      },

      getTotalCount: async (response) =>{
         const requestLabel = `Request to ${getResponseLocation(response)}`;
         const playload = await parseJsonResponse<ListResponse>(
            response.clone(),
            requestLabel,
         );

         return playload.pagination?.total ?? playload.data?.length ?? 0;
      }
    },
    create: {
      mapResponse: async (response) => {
         const requestLabel = `Request to ${getResponseLocation(response)}`;

         return await parseJsonResponse<Record<string, unknown>>(
            response,
            requestLabel,
         );
      },
      transformError: async (response) => {
         const requestLabel = `Request to ${getResponseLocation(response)}`;

         return await buildApiError(response, requestLabel);
      }
    }
}

const  { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);
export { dataProvider  };
