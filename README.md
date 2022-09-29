# iExec Task Manager

React app which allows iExec Task Managers to browse deployed Dapps, place new orders on the iExec Marketplace, and check for pending orders attached to the manager wallet.

It was developed based on https://github.com/iExecBlockchainComputing/iexec-apps/issues/103 for the iExec bounty program on [Gitcoin](https://gitcoin.co/issue/29113).

## Features

- Choose app (browse deployed app with TheGraph, check orders on the Marketplace).
- Create order (args, input files, dataset, secrets).
- Manage account:
  - Secrets.
  - Wallet/account.
- Manage tasks:
  - View requested tasks (call TheGraph).

## Screenshots

Figma proposed to the iExec team:

[https://www.figma.com/file/RuMs2qbsN2K43WWJOzc5Ic/iExec-Task-Manager](https://www.figma.com/file/RuMs2qbsN2K43WWJOzc5Ic/iExec-Task-Manager)

## Scripts

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run codegen`

Runs graphql-codegen using the `codegen.yml` config file.

### `npm run style`

Runs the prettier

## Contributions

Contributions are welcome: 
- Fork the repo and create a new branch.
- Add your awesome feature / fix.
- Run the prettier script and create a new PR.

