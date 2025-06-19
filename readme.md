# Gemini Multimodal API Wrapper

This project provides a simple Express.js API wrapper around the Google Gemini API (specifically using the `gemini-2.0-flash` model). It allows you to interact with the Gemini model for various tasks, including text generation, image analysis, document summarization, and audio transcription, through convenient RESTful endpoints.

## Features

* **Text Generation:** Generate text based on a given prompt.
* **Image Analysis:** Describe images or answer questions about them.
* **Document Summarization:** Summarize content from documents (e.g., PDFs).
* **Audio Transcription:** Transcribe spoken language from audio files.
* **CORS Enabled:** Allows requests from different origins for easy integration with frontend applications.
* **Environment Variable Configuration:** Securely manage your API key and port.

## Prerequisites

Before running this project, ensure you have the following installed:

* Node.js (LTS version recommended)
* npm (Node Package Manager) or Yarn

You will also need a Google Cloud Project with the Gemini API enabled and an API key.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Create a `.env` file:**
    In the root directory of your project, create a file named `.env` and add your Google API key and the desired port:

    ```
    GOOGLE_API_KEY=YOUR_GOOG_GEMINI_API_KEY
    PORT=3000
    ```
    Replace `YOUR_GOOG_GEMINI_API_KEY` with your actual Google Gemini API key.

## Usage

1.  **Start the server:**
    ```bash
    npm start
    # or
    node server.js
    ```
    The server will start on the port specified in your `.env` file (e.g., `http://localhost:3000`).

2.  **API Endpoints:**

    You can access the available endpoints by making HTTP requests to your server. Below are examples using `curl`. For file uploads, you can use tools like Postman, Insomnia, or a JavaScript `FormData` object in a web application.

    ### 1. Get Available Endpoints

    ```bash
    curl -X GET http://localhost:3000/
    ```

    **Example Response:**
    ```json
    {
      "endpoints": [
        { "method": "GET", "path": "/", "description": "List available endpoints" },
        { "method": "POST", "path": "/generate-text", "description": "Generate text from a prompt" },
        { "method": "POST", "path": "/generate-from-image", "description": "Generate text from an image and a prompt" },
        { "method": "POST", "path": "/generate-from-document", "description": "Summarize a document" },
        { "method": "POST", "path": "/generate-from-audio", "description": "Transcribe audio" }
      ]
    }
    ```

    ### 2. Generate Text

    **Endpoint:** `POST /generate-text`
    **Content-Type:** `application/json`

    ```bash
    curl -X POST -H "Content-Type: application/json" \
         -d '{"prompt": "Write a short poem about the ocean."}' \
         http://localhost:3000/generate-text
    ```

    **Example Response:**
    ```json
    {
      "output": "Vast, deep, and blue, a boundless expanse,\nWhispering secrets in its rhythmic dance.\nWaves crash and foam, a ceaseless, roaring sound,\nLife teems within, where mysteries are found."
    }
    ```

    ### 3. Generate from Image

    **Endpoint:** `POST /generate-from-image`
    **Content-Type:** `multipart/form-data`
    **Fields:**
    * `image`: The image file (required).
    * `prompt`: (Optional) A prompt for the AI, e.g., "Describe this image in detail."

    ```bash
    # Assuming you have an image file named 'cat.jpg' in the current directory
    curl -X POST -F "image=@cat.jpg" \
         -F "prompt=What is in this picture?" \
         http://localhost:3000/generate-from-image
    ```

    **Example Response:**
    ```json
    {
      "output": "The image shows a fluffy ginger cat with green eyes. It is lying down on a soft surface, possibly a blanket or carpet, and appears relaxed."
    }
    ```

    ### 4. Generate from Document

    **Endpoint:** `POST /generate-from-document`
    **Content-Type:** `multipart/form-data`
    **Fields:**
    * `document`: The document file (e.g., PDF, required).
    * `prompt`: (Optional) A prompt for the AI, e.g., "Summarize the key points of this report."

    ```bash
    # Assuming you have a document file named 'report.pdf' in the current directory
    curl -X POST -F "document=@report.pdf" \
         -F "prompt=Summarize the main conclusions." \
         http://localhost:3000/generate-from-document
    ```

    **Example Response (depends on document content):**
    ```json
    {
      "output": "The report concludes that renewable energy sources are critical for future sustainability, with solar and wind power showing significant growth potential. Further investment in grid infrastructure is recommended."
    }
    ```

    ### 5. Generate from Audio

    **Endpoint:** `POST /generate-from-audio`
    **Content-Type:** `multipart/form-data`
    **Fields:**
    * `audio`: The audio file (e.g., MP3, WAV, required).
    * `prompt`: (Optional) A prompt for the AI, e.g., "Transcribe this audio."

    ```bash
    # Assuming you have an audio file named 'speech.mp3' in the current directory
    curl -X POST -F "audio=@speech.mp3" \
         -F "prompt=Transcribe the spoken words." \
         http://localhost/generate-from-audio
    ```

    **Example Response (depends on audio content):**
    ```json
    {
      "output": "Hello, welcome to our demonstration. We are excited to show you what our new product can do."
    }
    ```

## Error Handling

The API includes basic error handling. If a request is malformed or an issue occurs with the Gemini API, a JSON response with an `error` field and an appropriate HTTP status code will be returned (e.g., 400 for bad requests, 500 for server errors).

## Contributing

Feel free to fork this repository, open issues, or submit pull requests if you have suggestions for improvements or encounter any bugs.

## License

This project is open-sourced under the MIT License.