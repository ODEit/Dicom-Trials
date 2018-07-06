const router = require('express').Router()
const { DicomInfo } = require('../db/models')
const AWS = require('aws-sdk');
const nano = require('nanoid')


const s3 = new AWS.S3();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    subregion: 'us-east-1',
});

router.get('/', (req, res, next) => {
    if (req.user) {
        req.user.getDicom()
            .then(dicoms => {
                res.json(dicoms)
            })
    } else {
        res.send('unauthorized')
    }
})

router.post('/', (req, res, next) => {
    if (req.user) {
        // res.json({
        //     studyDesc: 'hi',
        // })

        const genKey = nano()
        let image = new Buffer(req.body.image.replace(/^data:image\/\w+;base64,/, ""), 'base64')
        const params = {
            Bucket: 'dicom-trial',
            Key: genKey,
            Body: image,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg',
            ACL: 'public-read' //permissions
        }
        req.body.imageURL = `https://s3.amazonaws.com/dicom-trial/${genKey}`
        s3.putObject(params, (err, data) => {
            if (err) {
                console.log(err);
                res.status(400).send(err.message)
            } else {
                DicomInfo.create(req.body)
                    .then(dicomInfo => {
                        req.user.addDicom(dicomInfo)
                        res.json(dicomInfo)
                    })
            }
        })
    }
    else {
        res.send("Unauthorized")
    }
})



module.exports = router