const Talents = require('../../api/v1/talents/model');
const { checkingImage } = require('./images');
const { NotFoundError, BadRequestError } = require('../../errors');

const getAllTalents = async (req) => {
    const { keyword } = req.query;

    let condition = {organizer: req.user.organizer};

    if (keyword) {
        condition = { ...condition, name: {
            $regex: keyword, 
            $options: 'i'
        }};
    }

    const result = await Talents.find(condition)
        .populate({
            path: 'image',
            select: '_id name',
        })
        .select('_id name role image');

    return result;
};

const createTalents = async (req) => {
    const { name, role, image } = req.body;

    await checkingImage(image);

    const check = await Talents.findOne({
        name,
        organizer: req.user.organizer
    });

    if (check) throw new BadRequestError('Talents is already taken');

    const result = await Talents.create({
        name,
        image,
        role,
        organizer: req.user.organizer
    });

    return result;
};

const getOneTalents = async (req) => {
    const { id } = req.params;

    const result = await Talents.findOne({ _id: id, organizer: req.user.organizer })
        .populate({
            path: 'image',
            select: '_id name',
        })
        .select('_id name role image');

    if (!result) throw new NotFoundError(`Talents id ${id} is not found`);

    return result;
};

const updateTalents = async (req) => {
    const { id } = req.params;
    const { name, role, image } = req.body;

    await checkingImage(image);

    const check = await Talents.findOne({
        name,
        organizer: req.user.organizer,
        _id: { $ne: id },
    });

    if (check) throw new BadRequestError('Talents is duplicate');

    const result = await Talents.findOneAndUpdate(
        { _id: id },
        { name, image, role, organizer: req.user.organizer },
        { new: true, runValidators: true } 
    );

    return result;
};

const deleteTalents = async (req) => {
    const { id } = req.params;

    const talent = await Talents.findOne({
        _id: id,
        organizer: req.user.organizer
    });

    if (!talent) {
        throw new NotFoundError(`Talent with id ${id} not found or does not belong to you`);
    }

    const result = await Talents.findByIdAndDelete(id);

    if (!result) {
        throw new NotFoundError(`Talent with id ${id} is not found`);
    }

    return result;
};


const checkingTalents = async (id) => {
    const result = await Talents.findOne({ _id: id });

    if (!result) throw new NotFoundError(`Talents id: ${id} is not found`);

    return result;
};

module.exports = {
    getAllTalents,
    createTalents,
    getOneTalents,
    updateTalents,
    deleteTalents,
    checkingTalents
};
