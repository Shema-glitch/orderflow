
# OrderFlow Lite: Local Setup and Deployment Guide

This guide will help you set up and run this Next.js application locally, and prepare it for deployment to Firebase App Hosting.

## Prerequisites

Before you begin, ensure you have the following installed:

*   Node.js (LTS version recommended)
*   npm or yarn
*   Firebase CLI (for deployment): `npm install -g firebase-tools`

## 1. Local Setup

First, get the project files onto your local machine.

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install Dependencies:**
    This project uses npm to manage its packages. Run the following command in the project's root directory to install all the necessary dependencies listed in `package.json`:
    ```bash
    npm install
    ```
    Alternatively, if you use yarn:
    ```bash
    yarn install
    ```

## 2. Running the Development Server

Once the setup is complete, you can start the local development server to see the app in action.

1.  **Start the server:**
    ```bash
    npm run dev
    ```

2.  **View the app:**
    Open your web browser and navigate to [http://localhost:9002](http://localhost:9002). The app will automatically reload if you make any changes to the source files.

## 3. Project Structure Overview

The project follows a standard Next.js App Router structure:

*   `src/app/`: Contains the core application pages, layouts, and global styles.
*   `src/components/`: Contains all reusable React components.
*   `src/lib/`: Houses the application's core logic, Firebase configuration, and data definitions.
*   `public/`: Stores static assets like icons and the web app manifest.

## 4. Deployment to Firebase App Hosting

This application is configured for a simple, one-step deployment to **Firebase App Hosting**. This is the recommended way to get your app live.

1.  **Login to Firebase:**
    If you haven't already, log in to your Firebase account through the command line:
    ```bash
    firebase login
    ```

2.  **Deploy the App:**
    From the root of your project directory, run the following single command:
    ```bash
    firebase deploy --only apphosting
    ```

The Firebase CLI will automatically build your Next.js application and deploy it. Once complete, it will provide you with the URL to your live application. You can share this URL and add it to your phone's home screen.
