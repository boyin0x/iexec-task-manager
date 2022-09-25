import { createApi } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'

export const api = createApi({
    baseQuery: graphqlRequestBaseQuery({
      url: 'https://thegraph.bellecour.iex.ec/subgraphs/name/bellecour/poco-v5',
    }),
    endpoints: (builder) => ({})
})
  