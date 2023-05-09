ive finished my assignment, but i have some problem, the API given in the pdf you gave me, is used for server side applications,

so when i implemented it to my project which is client side application, its show CORS error here is the reference : https://stackoverflow.com/questions/42180788/how-to-use-cors-to-implement-javascript-google-places-api-request

so i made 2 method for the autocomplete, 1 is from google API, 1 is from dummy data that i made, but still for the dummy data the locate marker in the map function isnt working because of the CORS error from google API
but i found hack to resolve this, by using the chrome extension, you can download it here https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en,
the steps are
1.install it
2.activate it
3.run the project, should be fine

and here are the links for the project
github: https://github.com/seiryu17/location-map -> step to run project: 1. clone repository, 2. yarn install, 3. yarn dev
web: https://location-map-sepia.vercel.app/

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
