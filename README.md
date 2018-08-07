# Coffee Shop
## CMPT470 Group 5

Coffee Shop is a democratric digital jukebox app built using ReactJS, SocketIO and ExpressJS.

##### Coffee Shop requires a Premium Spotify account for full feature access. Please contact one of the group members if you do not have a premium Spotify account and need to test the app.

## Running Coffee Shop : 

* Clone coffeeshop repository:

```
$ git clone git@csil-git1.cs.surrey.sfu.ca:tudatn/coffeeshop.git
```

* Move into the Coffe Shop folder created :

```
$ cd coffeeshop
```

* Start the VM using : 

```
$ vagrant up
```

* Access the app from your browser by visiting:

```
http://localhost:3000/
```

## Features : 
* Press the login button in the sidebar to get redirected to Spotify to login and grant Coffee Shop access.
* Create New Rooms (once logged in) using the button in the sidebar to create new rooms for your Coffee Shop.
* Use the slider in the sidebar to view rooms which are within the specified radius (in meters) of your location (must grant location access when prompted by the browser).
* Enter a room by clicking on it in the sidebar, then use the search bar to search for songs and add to the room queue. The search bar provides an autocomplete feature which suggests songs as you type characters.
* Upvote or downvote songs by clicking on the thumb icons next to the songs. Watch the queue update as votes are added/subtracted.
* Play, pause or skip songs (only visible to room owners) by using the playback controls.
* See live changes for song suggestions, upvotes, downvotes and playback across multiple browser instances (use a new Incognito instance on Chrome to simulate different user experiences).

## Things that could have been improved :
* Styling
* Restricting individual user votes to 1 to prevent misuse of the voting system.
* Displaying 'time remaining' for the current song across all client windows.
* Updating sidebars across all client windows when a new room is created (easy to implement, but low on our priority list).
* Did we mention styling?
 
## Known Bugs :
* When there is one song in the queue, the current playing song becomes unskippable. This is an easy to fix bug that requires some boolean logic checking.
* Spotify Playback API quirks : A team member reported being unable to play the song sometimes, but logging out and logging in fixed the issue. Other members were unable to replicate it. The Spotify Web Playback SDK is still in beta, so it is possibly a bug on their end.

