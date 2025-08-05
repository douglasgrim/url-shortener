# url-shortener
Assignment for setting and using shortened urls
## How to Run the Application

### Requirements

- [Node.js](https://nodejs.org/) (version 20 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
  ```bash
  git clone https://github.com/your-username/url-shortener.git
  cd url-shortener
  ```

2. Install dependencies:
  ```bash
  npm install
  ```

### Running the Application

This is an exercise and will only run in development mode. To do so, 

```bash
npm run dev
```

By default, the application will run on [http://localhost:3000](http://localhost:3000). To modify this, export environment variables HOST (with http:// or https:// protocol) and/or PORT respectively.

### Usage

- Use the web interface or API to shorten URLs. Any URLs which have already been entered will return the existing shortened url provided that the path matches exactly.

### Optional Features

- An additional feature shows all shortened URLs in memory. The user can click on the url to get the shortened url.


### Assumptions

- The process for mapping the shortened url code and long url was obviously kludged in a bit after I realized that it would be pointless that have multiple shortened urls for the same url/path. Of course, in a real scenario it would be useful to track who is clicking on which shortened url, so this feature may not be desirable.

- I copied a boilerplate tailwind css form just for appearance in a short timeframe. Normally I'd be doing this in React or some other frontend framework.

- Turned out well after 2 hours - I had to look up the process for copying text to the clipboard as I hadn't done that in a while.

- It looked like the nanoid package is generally used for the path shortening, so I pulled that rather than code one from scratch.