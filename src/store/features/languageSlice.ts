import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LanguageState {
    language: string;
}

// Function to load the language from localStorage
const loadLanguage = (): LanguageState => {
    try {
        const storedLanguage = localStorage.getItem("language");
        return { language: storedLanguage || "en" };
    } catch (error) {
        console.error("Error loading language:", error);
        return { language: "en" };
    }
};

const initialState: LanguageState = loadLanguage();

const languageSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
            localStorage.setItem("language", action.payload); // Persist language change
        },
    },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
