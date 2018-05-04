# Dicom-Trails

*For a short project*

A Dicom uploader that is able to take in multiple different DICOM image types and saves them to the cloud (and send a link to our postgreSQL database)!

Big thanks to the cornerstone crew! 

The cornerstone tools: https://github.com/cornerstonejs/cornerstone

This project was made with React-Redux, Node, Express, Cornerstone's libraries, Sequelize with postgreSQL database, and AWS S3. 

*For a multiple uploader check the multiple branch*

## Setup

Clone it to your machine and put the command npm-run start-dev.

To run correctly you will need your own AWS account. If you have one, just put in your info to the AWS configuration here along with an S3 bucket. 

https://github.com/ODEit/Dicom-Trials/blob/master/server/api/dicomInfo.js

Also setup a postgreSQL database and make its name the same as the package.json's name.

After that you're good to go.

## Transfer syntax support

Supports all at the link here provided by Cornerstones wadoimageloader. 

https://github.com/cornerstonejs/cornerstoneWADOImageLoader/blob/master/docs/TransferSyntaxes.md

Configuring the config for the webworkers can boost speed and transition in the upload center.




