# Contents of `/email-website/README.md`

# Email Website Project

This project is an email website that provides an interface for users to send and receive emails using their own email domain and public IPv4 address.

## Project Structure

- **src/**: Contains the front-end code.
  - **css/**: Contains styles for the HTML interface.
    - `styles.css`: Styles defining the layout, colors, fonts, and other visual aspects of the website.
  - **js/**: Contains JavaScript code for the website's functionality.
    - `main.js`: Handles user interactions and dynamic content updates.
  - `index.html`: The main HTML file serving as the entry point for the website.

- **server/**: Contains the back-end code.
  - **config/**: Contains configuration settings for the server.
    - `config.js`: Configuration settings such as environment variables and database connection details.
  - **routes/**: Defines the routes for the server.
    - `index.js`: Handles incoming requests and directs them to the appropriate controllers or middleware.
  - `server.js`: The entry point for the server application, setting up the server and middleware.

- `package.json`: Configuration file for npm, listing dependencies and scripts for the project.

## Getting Started

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Start the server with `node server/server.js`.
4. Open `src/index.html` in a web browser to view the application.

## License

This project is licensed under the MIT License.