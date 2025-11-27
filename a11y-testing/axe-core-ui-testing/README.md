# axe-core UI Testing

This project implements accessibility testing using the axe-core library in conjunction with Puppeteer. It provides two main functionalities: a command-line interface for running tests and a user interface for triggering tests via buttons.

## Project Structure

- **src/run-axe.js**: Contains the implementation for running axe-core tests using Puppeteer. It launches a browser, navigates to a specified URL, runs accessibility tests, and generates an HTML report of the results.
  
- **src/run-axe-with-ui.js**: Implements a user interface to control axe-core tests. It includes functions to trigger tests for each axe-core rule via buttons in the UI and displays the results after testing.

- **public/axe-core-control.html**: Contains the HTML structure for the user interface. It has buttons for each axe-core test and a section to display the results of the tests.

- **package.json**: Configuration file for npm, listing the dependencies required for the project, including `axe-core`, `puppeteer`, and other necessary packages.

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd axe-core-ui-testing
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the command-line tests**:
   You can run the command-line tests using the following command:
   ```
   node src/run-axe.js
   ```

4. **Open the UI for testing**:
   Open `public/axe-core-control.html` in your web browser to access the user interface. You will find buttons for each axe-core test. Click on a button to trigger the corresponding test and view the results displayed on the page.

## Usage

- Use the command-line interface for automated testing and generating reports.
- Use the UI for interactive testing, allowing you to trigger specific tests and view results in real-time.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.