const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    content: ""
}

const validate = createSlice({
    name: "ArticleValidator",
    initialState,
    reducers: {
        insertDataForCheck: (state, action) => {
            return { ...state, ...action.payload };
        },
        resetUser: () => {
            return initialState
        }
    }
})

export const { insertDataForCheck, resetUser } = validate.actions;
export default validate.reducer;