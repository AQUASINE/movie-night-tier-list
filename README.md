# Movie Night Tier List

Every week since around 2019, my friend group has gotten together and watched roughly 2 movies every Saturday night and put them on an ever-growing tier list. Because we would feel bad putting something like Christmas in New York next to Into the Spiderverse, we split it into two sides: "Regular Enjoyment" and "So Bad It's Good." Normal tier list applications don't support something like this, and so the tier list was done in a Gimp file, with every layer manually adjusted every time a new movie was added to the tier list.

Gimp doesn't let you move more than one layer at a time. The friend that runs Movie Night was having to move 70 movies and re-align them pixel-perfect in order to add something to the top of B tier. This application was made to solve this issue.

## Running
This application is a Vue app with a small proxy server to fetch movie entries and images from the Letterboxd API. The Letterboxd part of the application is there to speed up the process to add entries in a tier.

To run the application, simply run:
```bash
npm install
npm run dev
```

## To-do:
- [ ] Fix drag and drop so that you don't have to drag into a tier before moving it within the tier
- [ ] Ability to hide dock
- [ ] See ratings and reviews from Letterboxd