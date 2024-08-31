const Events = require('../../api/v1/events/model');
const { checkingImage } = require('./images');
const { checkingCategories } = require('./categories');
const { checkingTalents } = require('./talents');


const { NotFoundError, BadRequestError} = require('../../errors');


const getAllEvents = async (req) => {
    const { keyword, category, talent, status } = req.query;

    let condition = {organizer: req.user.organizer};

    if (keyword) {
        condition = { ...condition, title: { $regex: keyword, $options: 'i' } };
    }

    if (category) {
        condition = { ...condition, category: category };
    }

    if (talent) {
        condition = { ...condition, talent: talent};
    }

    if (['Draft', 'Published'].includes(status)) {
        condition = { ...condition, status: status };
    }

    const result = await Events.find(condition)
        .populate({ 
            path: 'image', 
            select: '_id name' 
        })
        .populate({
            path: 'category',
            select: '_id name',
        })
        .populate({
            path: 'talent',
            select: '_id name role image',
            populate: { path: 'image', select: '_id name' },
        });

    return result;

};

const createEvents = async (req) => {
    const { 
        title,
        date,
        about,
        tagline,
        venueName,
        keyPoint,
        statusEvent,
        tickets,
        image,
        category,
        talent
    } = req.body;

    await checkingImage(image);
    await checkingCategories(category);
    await checkingTalents(talent);

    const check = await Events.findOne({ title });

    if (check) throw new BadRequestError('Event name is already in use.');

    const result = await Events.create({
        title,
        date,
        about,
        tagline,
        venueName,
        keyPoint,
        statusEvent,
        tickets,
        image,
        category,
        talent,
        organizer: req.user.organizer
    });

    return result;
};



const getOneEvents = async (req) => {
    const { id } = req.params;

    const result = await Events.findOne({ _id: id, organizer: req.user.organizer })
        .populate({
            path: 'image',
            select: '_id name',
        })
        .populate({
            path: 'category',
            select: '_id name',
        })
        .populate({
            path: 'talent',
            select: '_id name role image',
            populate: { path: 'image', select: '_id name'},
        });
    
    if (!result)
        throw new NotFoundError(`Event id: ${id} is not found`);

    return result;
};

const updateEvents = async (req) => {
    const { id } = req.params;
    const {
        title,
        date,
        about,
        tagline,
        venueName,
        keyPoint,
        statusEvent,
        tickets,
        image,
        category,
        talent
    } = req.body

    
    await checkingImage(image);
    await checkingCategories(category);
    await checkingTalents(talent);

    const check = await Events.findOne({
        title,
        organizer: req.user.organizer,
        _id: { $ne: id }
    });

    if (check) throw new BadRequestError('Event name is duplicate');

const result = await Events.findOneAndUpdate(
    { _id: id },
    {
        title,
        date,
        about,
        tagline,
        venueName,
        keyPoint,
        statusEvent,
        tickets,
        image,
        category,
        talent,
        organizer: req.user.organizer
    },
    { new: true, runValidators: true }
);

    if (!result) throw new NotFoundError(`Event id: ${id} is not found`);

    return result;

};

const deleteEvents = async (req) => {
    const { id } = req.params;

    const event = await Events.findOne({ _id: id, organizer: req.user.organizer });

    if (!event) {
        throw new NotFoundError(`Event id: ${id} is not found or does not belong to you`);
    }

    const result = await Events.findByIdAndDelete(id);

    if (!result) {
        throw new NotFoundError(`Event id: ${id} is not found`);
    }

    return result;
};

const changeStatusEvents = async (req) => {
    const { id } = req.params;
    const { statusEvent } = req.body;
    const checkEvent = await Events.findOne({
        _id: id,
        organizer: req.user.organizer
    });

    if(!checkEvent)
        throw new NotFoundError(`Event id: ${id} is not found`);

    checkEvent.statusEvent = statusEvent;

    await checkEvent.save();

    return checkEvent;

};


module.exports = {
    getAllEvents,
    createEvents,
    getOneEvents,
    updateEvents,
    deleteEvents,
    changeStatusEvents
}