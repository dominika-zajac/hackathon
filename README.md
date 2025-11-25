# Langate

This is a NextJS starter in Firebase Studio.

## Getting Started

To get started, take a look at `src/app/page.tsx`.

## Setup Gemini API Key

To enable the generative AI features in this application, you need to configure your Gemini API key.

1.  **Obtain a Gemini API Key**: If you don't have one, you can create one from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  **Configure the API Key**: Open the `.env` file in the root of this project and add your API key:

    ```
    GEMINI_API_KEY=your_api_key_here
    ```

    Replace `your_api_key_here` with the actual key you obtained. The application is already set up to load this key for the AI-powered features.
