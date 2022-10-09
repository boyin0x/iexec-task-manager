import { gql } from "graphql-request";

import { App, Category, Dataset, Workerpool } from "../../generated/graphql";
import { IExec } from "iexec";
import { removeEmptyProps } from "../../helpers/utils";
import { RequestOrderFields } from "./NewTaskForm";
import { api, getIexecAndRefresh } from "../../app/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { PublishedApporder } from "iexec/dist/lib/IExecOrderbookModule";

const initialState = {
  selectedApp: "",
  selectedDataset: "",
  selectedWorkerpool: "",
};

export const newTaskSlice = createSlice({
  name: "newTask",
  initialState: initialState,
  reducers: {
    setSelectedApp: (state, action: PayloadAction<string>) => {
      state.selectedApp = action.payload;
    },
    setSelectedDataset: (state, action: PayloadAction<string>) => {
      state.selectedDataset = action.payload;
    },
    setSelectedWorkerpool: (state, action: PayloadAction<string>) => {
      state.selectedWorkerpool = action.payload;
    },
  },
});
export default newTaskSlice.reducer;

export const { setSelectedApp, setSelectedDataset, setSelectedWorkerpool } = newTaskSlice.actions;

export const selectSelectedApp = (state: RootState) => state.newTask.selectedApp;
export const selectSelectedDataset = (state: RootState) => state.newTask.selectedDataset;
export const selectSelectedWorkerpool = (state: RootState) => state.newTask.selectedWorkerpool;

const newTaskApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<{ categories: Category[] }, void>({
      query: () => ({
        document: gql`
          query getCategories {
            categories(orderBy: id) {
              id
              name
            }
          }
        `,
      }),
    }),

    searchApps: builder.query<{ apps: App[] }, string>({
      query: (searchText) => ({
        document: gql`
          query getApps($searchText: String) {
            apps(first: 100, where: { name_contains_nocase: $searchText }) {
              id
              name
            }
          }
        `,
        variables: {
          searchText,
        },
      }),
    }),

    searchDatasets: builder.query<{ datasets: Dataset[] }, string>({
      query: (searchText) => ({
        document: gql`
          query getDatasets($searchText: String) {
            datasets: datasets(first: 100, where: { name_contains_nocase: $searchText }) {
              id
              name
            }
          }
        `,
        variables: {
          searchText,
        },
      }),
    }),

    searchWorkerpools: builder.query<{ workerpools: Workerpool[] }, string>({
      query: (searchText) => ({
        document: gql`
          query getWorkerpools($searchText: String) {
            workerpools: workerpools(
              first: 100
              where: { description_contains_nocase: $searchText }
            ) {
              id
              description
            }
          }
        `,
        variables: {
          searchText,
        },
      }),
    }),

    fetchAppOrderbook: builder.query<PublishedApporder[], string>({
      queryFn: async (app, { getState }) => {
        const iexec = await getIexecAndRefresh(getState());
        let s = await iexec.orderbook.fetchAppOrderbook(app);
        return { data: s.orders };
      },
    }),

    createRequestOrder: builder.mutation<string, RequestOrderFields>({
      queryFn: async (formFields, { getState }) => {
        try {
          const iexec = await getIexecAndRefresh(getState());
          const account = await iexec.wallet.getAddress();

          const { app, dataset, workerpool, category } = formFields;

          const iexec_input_files =
            formFields.inputFiles.trim().length === 0 ? "" : formFields.inputFiles.split(",");
          let requestOrderFields = {
            app,
            workerpool,
            dataset,
            requester: account,
            params:
              {
                iexec_args: formFields.args,
                iexec_input_files,
              } || "",
            category: category,
          };

          if (formFields.limitPrice) {
            const { appmaxprice, datasetmaxprice, workerpoolmaxprice } = formFields;

            requestOrderFields = {
              ...requestOrderFields,
              ...{
                appmaxprice,
                datasetmaxprice,
                workerpoolmaxprice,
              },
            };

            let clean_requestOrderFields = removeEmptyProps(requestOrderFields);
            console.log({ clean_requestOrderFields });

            const requestOrderToSign = await iexec.order.createRequestorder(
              clean_requestOrderFields
            );
            const requestOrder = await iexec.order.signRequestorder(requestOrderToSign);

            let published = await iexec.order.publishRequestorder(requestOrder);

            return { data: published };
          } else {
            const { appOrder, datasetOrder, workerpoolOrder } = await getBestOrders(
              iexec,
              app,
              dataset,
              workerpool,
              category
            );

            let clean_requestOrderFields = removeEmptyProps(requestOrderFields);

            const requestOrderToSign = await iexec.order.createRequestorder(
              clean_requestOrderFields
            );

            const requestOrder = await iexec.order.signRequestorder(requestOrderToSign);

            const res = await iexec.order.matchOrders({
              apporder: appOrder,
              datasetorder: datasetOrder,
              requestorder: requestOrder,
              workerpoolorder: workerpoolOrder,
            });

            return { data: res.dealid };
          }
        } catch (e) {
          return { error: (e as Error).message || e };
        }
      },
      invalidatesTags: ["REQUEST_ORDERS"],
    }),
  }),
});
export const {
  useLazyFetchAppOrderbookQuery,
  useGetCategoriesQuery,
  useCreateRequestOrderMutation,
  useLazySearchAppsQuery,
  useLazySearchDatasetsQuery,
  useLazySearchWorkerpoolsQuery,
} = newTaskApi;

async function getBestOrders(
  iexec: IExec,
  app: string,
  dataset: string,
  workerpool: string,
  category: string
) {
  const { orders } = await iexec.orderbook.fetchAppOrderbook(app);
  const appOrder = orders && orders[0] && orders[0].order;
  if (!appOrder) {
    throw new Error(`No orders for app`);
  }

  let datasetOrder;
  if (dataset) {
    const { orders: dtsOrders } = await iexec.orderbook.fetchDatasetOrderbook(dataset, { app });
    datasetOrder = dtsOrders && dtsOrders[0] && dtsOrders[0].order;
    if (!datasetOrder) {
      throw new Error(`No orders for dataset`);
    }
  }

  const { orders: wkpOrders } = await iexec.orderbook.fetchWorkerpoolOrderbook({
    category,
  });
  const workerpoolOrder = wkpOrders && wkpOrders[0] && wkpOrders[0].order;
  if (!workerpoolOrder) {
    throw new Error(`No orders for workerpool`);
  }
  return { appOrder, datasetOrder, workerpoolOrder };
}
