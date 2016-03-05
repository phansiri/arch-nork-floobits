# Architected Nork

This repository contains two versions of a simple text-based game called Nork, developed as part of a [course](http://arch-joelross.rhcloud.com/) at the UW iSchool. 

The below questions should be answered (in detail!) regarding your submission!


##### 1. Did you work with a partner? If so, who?
> I worked with Jordan Mundo on this assignment.



##### 2. Discuss how the different architectural styles affected the implementation of your program. Was one pattern easier to use or more effective _for this problem_? Why? How do the different styles influence the ability to add new features or modify existing functionality? What kind of changes would be easier or harder with each style?
##### This discussion should be a couple of paragraphs, giving a detailed analysis of how the styles work.
> We chose the client-server architecture and the event based architecture. The client server architecture ended up being rather simple by having a client (sending user input with commands) and a server (parsing those commands and modifying the game world). This allowed us to really separate the tasks when running the game. We decided on the event based architecture because we wanted to see the difference between using the socket system and the events system. We found that the event system allowed us to send objects back and fourth rather than only simple plain text messages which ended up cutting down on code which was required to stringify and parse the data in the client server implementation.

> We found that the event based system was extremely effective in solving the problem. Not only were there less issues based around the messenging system in the client server implementation, but it also required significantly less logic to run the host code (event emmitter). As mentioned above, one of the major slowdowns for the client server implementation was that the game state needed to be passed around to let the client know whether or not they could ask another question. It was nessesary to store the message and a boolean in a json string and then send all the information at once. Since the socket.write method builds up messages, there were also issues regarding invalid json objects because it was trying to send more than one at a time. In order to combat this, all data had to be compressed into one single area making for difficult passing of data in callbacks. With the event based system, this was no longer an issue. The events fired one by one and allowed the user to respond before the next event fired. 

>  Both architectures would allow for very easy additions to the game. For instance, if a new command was to be added, it would be as simple as adding an if statement. Since the client or listener does not care what it gets back, there is no need to modify the code for the new change. Both architectures are also well spread out. The inventory system and navigation system are exported in separate files. This allows for changes to be made to those files without affecting the overall function of the game. For instance, as long as the goTo method returns the room the player moved to, it does not matter how it got that solution as long as it is correct.

> The one major difference between these architectures is the ability to add multi player game modes. Since the client server architecture relies on the socket, it would be relatively easy to send the data over a network and connect multiple users to the server. On the other hand, the event based implementation relies solely on local event emmitters restricting the game to the local computer. Another limiting factor with the event based system in regards to multi player is that instance variables like the current room and the inventory are stored at the top of the file. This only allows for one player to be playing at a time. In the case of the client server implementation, each client is their own file or object and instantiates new instance variables on a connection. More or less these architectures are very similar, however it was suprising how different they were underneath.


##### 3. Did you add an extra features to either version of your game? If so, what?
> No



##### 4. Approximately how many hours did it take you to complete this assignment? #####
> 16



##### 5. Did you receive help from any other sources (classmates, etc)? If so, please list who (be specific!). #####
> No



##### 6. Did you encounter any problems in this assignment we should warn students about in the future? How can we make the assignment better? #####
> The only problem with this assignment was that architectures like the pipe and filter really didnt feel like a natural architecture for the given problem.


