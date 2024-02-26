const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const  mime = require('mime-types');
const logger = require('../middleware/logger');


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
        logger.log('Error in get_image_data : '+ error.message, 'error');
    }
}


const shorten_image = async ( buffer  ) => {
    try {        
        const resizedBuffer = await sharp(buffer).resize(112, 112).toBuffer();
        return resizedBuffer
    } catch (error) {
        logger.log('Error in shorten_image'+error.message, 'error');
    }
}




module.exports = {
    shorten_image , get_image_data
}
