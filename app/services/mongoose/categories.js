const Categories = require('../../api/v1/categories/model');
const { BadRequestError, NotFoundError } = require('../../errors');


const getAllCategories = async (req) => {
    const result = await Categories.find({organizer: req.user.organizer});

    return result;
};

const createCategories = async (req) => {
    const { name } = req.body;
    
    const check = await Categories.findOne({ name, organizer: req.user.organizer });

    if (check) throw new BadRequestError('Category already exists');

    const result = await Categories.create({ 
        name, 
        organizer: req.user.organizer 
    });

    return result;
}

const getOneCategories = async (req) => {
    const { id } = req.params;
    const result = await Categories.findOne({ 
        _id: id,
        organizer: req.user.organizer 
    });

    if (!result) throw new NotFoundError(`Category id: ${id} not found`);
    return result;
}

const updateCategories = async (req) => {
    const { id } = req.params;
    const { name } = req.body;

    const check = await Categories.findOne({
        name,
        organizer: req.user.organizer,
        _id: { $ne: id }
    });

    if (check) throw new BadRequestError('This is duplicate category');

    const result = await Categories.findByIdAndUpdate(
        { _id: id }, 
        { name },
        { new: true, runValidators: true }
    );

    if (!result) throw new NotFoundError();

    return result;
}

const deleteCategories = async (req) => {
    const { id } = req.params;

    const category = await Categories.findOne({
        _id: id,
        organizer: req.user.organizer
    });

    if (!category) {
        throw new NotFoundError(`Category with id ${id} not found or does not belong to you`);
    }
    
    const result = await Categories.findByIdAndDelete(id);

    if (!result) {
        throw new NotFoundError(`Category with id ${id} not found`);
    }

    return result;
};


const checkingCategories = async (id) => {
    const result = await Categories.findOne({ _id: id });

    if (!result) throw new NotFoundError(`categories id: ${id} is not found`);

    return result;
};

module.exports = {
    getAllCategories,
    createCategories,
    getOneCategories,
    updateCategories,
    deleteCategories,
    checkingCategories
}