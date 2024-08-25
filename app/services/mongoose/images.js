const Images = require('../../api/images/model');
const { NotFoundError } = require('../../errors');

const createImages = async (req) => {
    const result = await Images.create({
        name: req.file
        ? `uploads/${req.file.filename}`
        : 'uploads/avatar/default.png',
    });

    return result;
}

const checkingImage = async (req) => {
    const result = await Images.findOne({ _id: id });
    console.log(result);

    if (!result) throw new NotFoundError(`Image not found by Id${id}`);

    return result;
};

module.exports = {
    createImages,
    checkingImage
}