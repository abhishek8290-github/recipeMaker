const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const  mime = require('mime-types');



const get_image_data = async ( imageUrl ) => {
    try {
        const response = await axios({
            url: imageUrl,
            responseType: 'arraybuffer',
        })
        const fileType = response.headers['content-type'];
        const fileExtension = mime.extension(fileType);
        
        return {
            buffer : response.data,
            fileExtension : fileExtension,
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}


const shorten_image = async ( buffer  ) => {
    try {
        
        // const {buffer, fileExtension} = await get_image_data(imageUrl);
        
        const resizedBuffer = await sharp(buffer).resize(112, 112).toBuffer();
        return resizedBuffer
        // fs.writeFileSync(outputImagePath, resizedBuffer);
        // return 
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}




module.exports = {
    shorten_image , get_image_data
}
