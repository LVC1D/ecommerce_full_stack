import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isVisible: false,
}

const userTooltipSlice = createSlice({
    name: 'userTooltip',
    initialState,
    reducers: {
        showTooltip(state) {
            state.isVisible = true;
        },
        hideTooltip(state) {
            state.isVisible = false;
        },
        toggleTooltip(state) {
            state.isVisible = !state.isVisible;
        }
    }
})

export default userTooltipSlice.reducer;
export const { showTooltip, hideTooltip, toggleTooltip } = userTooltipSlice.actions;
export const selectUserTooltipVisibility = (state) => state.userTooltip.isVisible;