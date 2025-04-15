[![Website](https://img.shields.io/website?url=https%3A%2F%2Fplanning-poker.skapitao.com)](https://planning-poker.skapitao.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contribution)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)
![GitHub contributors](https://img.shields.io/github/contributors/ricardodecarvalho/planning-poker)

# [Planning Poker Agile](https://planning-poker.skapitao.com)

A Planning Poker tool to help agile teams estimate the development effort of tasks.

- [Installation](#installation)
- [Usage](#usage)
- [Firebase Emulator](#firebase-emulator)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Contribution](#contribution)
- [License](#license)

## Installation
Follow these steps to install the project locally:

```bash
# Clone the repository
git clone https://github.com/ricardodecarvalho/planning-poker.git

# Navigate to the project directory
cd planning-poker

# Install the dependencies
yarn
```

### Firebase Functions
To run Firebase Functions in development mode:

```bash
# cd into the functions folder and run:
npm run build
```

## Usage
Here are some examples of how to use Planning Poker:

```bash
# Run the application
yarn dev

# Navigate to:
http://localhost:5173/
```

## Firebase Emulator
Accurately emulate Firebase services behavior.

```bash
# Set up the emulator
firebase init emulators

# Start the emulator
firebase emulators:start
```
[Introduction to Firebase Local Emulator Suite](https://firebase.google.com/docs/emulator-suite)

## Features
* Login with Google
* Creating Planning Poker sessions.
* Real-time participation.

# Technologies Used
* React
* Vite
* TypeScript
* Firebase

## Contribution
If you want to contribute to this project, follow the steps below:

* Fork the project
* Create a branch for your feature (`git checkout -b feature/new-feature`)
* Commit your changes (`git commit -am 'Add new feature'`)
* Push to the branch (`git push origin feature/new-feature`)
* Open a Pull Request

### Good First Issues
* Tests
* Refactoring
* PWA
* Security
* Remove rooms based on inactivity period

### Doing
* Sign in anonymously
* Logint with email and password

### Backlog
* Jira Integration
* PWA to an Android App

## License
This project is licensed under the [MIT License](https://mit-license.org/).
