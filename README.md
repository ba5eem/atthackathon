# atthackathon
# MoodLighting
***
# About
***
Are you in denial about how crappy you're feeling? Do you never realize when you're actually feeling good about or something or life in general? MoodLighting will let you know how you're doing when you're just not sure and just want to be at home with whatever the hell kind of feelings you're having. MoodLighting will also create the ambience to match how you feel.

# Approach
***
MoodLighting was made with HTML5, JavaScript, npm Multer package, GoogleVision facial recognition and Rekognition JSON. Images are captured in intervals from video capture. XML posts will then be sent to the API which will populate the each image to Google Vision. The Google Vision image will then populate to Rekognition JSON to evaluate the user's emotion. The user's emotion will determine and change the color of their light bulb.

# MVP
***
User should be able to capture an image of their face through their browser using HTML5. The user's light bulb should change to the color associated with each mood.

# Stretch Goals
***
User will be able to customize their light preferences to reflect their matching moods. They will also have the option to further prompt the light to change to assist in adjusting their mood. For example, if the light turns red because they are angry, they have the option to change the light to their designated "calm" color such as blue. Additional prompts and APIs would allow the user to order their favorite Starbucks concoction or comfort meal, play their favorite mood associated songs, or show them some cat pics and vids.
