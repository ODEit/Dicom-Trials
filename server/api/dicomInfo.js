const router = require('express').Router()
const { DicomInfo } = require('../db/models')
const AWS = require('aws-sdk');
const nano = require('nanoid')
const multer = require('multer')

const s3 = new AWS.S3();

const upload = multer({
    storage: multer.memoryStorage(),
    // file size limitation in bytes
    limits: { fileSize: 52428800 },
  });

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  subregion: 'us-east-1',
});


router.get('/', (req, res, next) => {
    res.json(req.user.getDicomInfos())
})

router.post('/', (req, res, next) => {
    const genKey = nano()
    console.log(req.body.image)
    let image = new Buffer(req.body.image.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    console.log(image)
    const params = {
        Bucket: 'dicom-trial',
        Key: genKey,
        Body: image,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
        ACL: 'public-read' //permissions
    }
    req.body.imageURL = `https://s3.amazonaws.com/dicom-trial/${genKey}`
    s3.putObject(params, (err, data) =>{
        if(err){
            console.log(err);
            res.status(400).send(err.message)
        }else{
            DicomInfo.create(req.body)
            .then( dicomInfo => {
                req.user.addDicomInfo(dicomInfo)
                res.json(dicomInfo)
            })
        }
    })
})



module.exports = router