# Create MEXN App Templates (ESM-TS)

This project provides templates for creating MEXN (MongoDB, Express, Node.js) applications using ECMAScript Modules (ESM) and TypeScript (TS).

## Features

- **MongoDB**: Database integration
- **Express**: Web framework
- **Node.js**: Server environment
- **ECMAScript Modules**: Modern JavaScript module system
- **TypeScript**: Static type checking

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher) or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/create-mexn-app-templates.git
   ```
2. Navigate to the project directory:
   ```sh
   cd create-mexn-app-templates/esm-ts
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
   or
   ```sh
   yarn install
   ```

### Usage

1. Start the development server:

   ```sh
   npm run dev
   ```

   or

   ```sh
   yarn dev
   ```

2. Open your browser and navigate to `http://localhost:3000`.

## Project Structure

```
/esm-ts
├── src
|   |-- config
|   |-- constants
│   ├── controllers
|   |-- database
|   |-- middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── types
│   ├── utils
│   └── Server.ts
├── package.json
├── index.ts
├── tsconfig.json
└── README.md
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

