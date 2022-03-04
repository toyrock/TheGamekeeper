const cloudinary = require('cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

// put your onw config here
cloudinary.config({ 
  cloud_name: 'dxkvhqqt8', 
  api_key: '819638587668519', 
  api_secret: '9wLocm33EY1XZj4ej9xAlponNSs' 
});
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ['jpg', 'png'],
    folder: 'testImage',
    //ressource_type: 'raw',
  },
})

module.exports = multer({ storage })