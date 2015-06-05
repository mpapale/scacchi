# Scacchi
## Introduction
Scacchi is a lightweight chess server. The primary purpose is to be able to easily play games
as though you were in the same room as your opponent. Enjoy!

## Running
### Prerequisites

1. Pull the latest master branch
2. Ensure you have `brew`, `npm`, `node`, and `python` installed.
3. Install bower via npm: `npm install -g bower`.

### Start me up
There is a dual server requirement right now, we'll fix it later.

1. Get the latest dependencies: `bower install` and `npm install`.
2. Run the stream server: `node index.js`
3. Run the client server: `python -m SimpleHTTPServer 8080`
