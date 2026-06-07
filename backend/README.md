# JavaScript User Input Setup

A Node.js application for taking user input from the command line.

## Files

- **input.js** - Main file with user input handling using Node's built-in `readline` module
- **package.json** - Project configuration

## How to Run

```bash
node input.js
```

Or using npm:

```bash
npm start
```

## Features

- **Async/Await**: Uses promises for clean, readable input handling
- **Built-in Module**: Uses Node.js `readline` module (no external dependencies)
- **Error Handling**: Includes try-catch for error management
- **Clean Closure**: Properly closes the readline interface when done

## Customization

You can modify the `getUserInput()` function calls in the `main()` function to ask different questions or process the input as needed.

## Alternative Approaches

### Using synchronous input (prompt-sync package):
```bash
npm install prompt-sync
```

Then use `prompt()` function for simpler synchronous input.
