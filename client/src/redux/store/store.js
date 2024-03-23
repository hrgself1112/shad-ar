import { configureStore } from "@reduxjs/toolkit";
import articleData from "../slices/article-data";
import dataReducer from '../slices/fetch-refetch-api/fetch-data-api';
import validate from "../slices/article-validator/validate";
export const store = configureStore({
    reducer: {
        ArticlesData:articleData,
        data: dataReducer,
        validateArticle:validate
    },
})