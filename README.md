# Unit test mocks for OpenRCT2 plugins

W.I.P.

A small mocking library including a set of mocks I use for writing unit tests for my OpenRCT2 plugins. The mocks try to mimic OpenRCT2 API behaviour as best as possible without actually running the game.

---

## Building the source code

Requirements: [Node](https://nodejs.org/en/), NPM.

1. Open command prompt, use `cd` to change your current directory to the root folder of this project.
2. Run `npm install`.
3. Run `npm run build` (release build) or `npm run build:dev` (develop build) to build the project.
    - The default output folder for the package is `(project directory)/dist` and can be changed in `rollup.config.js`.
