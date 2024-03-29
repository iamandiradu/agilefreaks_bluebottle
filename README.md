## Overview

You have been hired by a company that builds an app for coffee addicts. You are responsible for taking the user’s location and displaying the three closest coffee shops.

## Functionality

The application will get the user coordinates as input and displays 4 points on an XY graph:

-   1 for the user, annotated with "User"
-   3 for the top 3 closest coffee shops, annotated with coffee shop name

The graph should allow the user to click on a point and the app will show a pin containing the distance from the user.

Read the coffee shop information from an API endpoint. API Docs can be found here: https://blue-bottle-api-test.herokuapp.com/swagger/index.html?url=/v1/docs.json#!/Coffee_shops/indexCoffeeShops

Note: The endpoint is secured with a token and the application will need to take into account and handle different API responses. (edited)

Assume all coordinates lie on a plane.

### How to build

Run `yarn install` and then `yarn build`. The compiled code will be in the `build` folder.

### How to run in debug mode

Run `yarn start`.

### How to run in production mode

Build the app, then install [serve](https://github.com/vercel/serve) and run `serve -s build`.

### How to deploy on GitHub Pages

Follow the tutorial [here](https://dev.to/yuribenjamin/how-to-deploy-react-app-in-github-pages-2a1f)
