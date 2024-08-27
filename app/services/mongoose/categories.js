const Categories = require('../../api/v1/categories/model');
const { BadRequestError, NotFoundError } = require('../../errors');


const getAllCategories = async () => {
    const result = await Categories.find().select('_id name');

    return result;
};

const createCategories = async (req) => {
    const { name } = req.body;
    const check = await Categories.findOne({ name });

    if (check) throw new BadRequestError('Category already exists');

    const result = await Categories.create({ name });

    return result;
}

const getOneCategories = async (req) => {
    const { id } = req.params;
    const result = await Categories.findOne({ _id: id});

    if (!result) throw new NotFoundError('');
    return result;
}

const updateCategories = async (req) => {
    const { id } = req.params;
    const { name } = req.body;

    const check = await Categories.findOne({
        name,
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
    const result = await Categories.findByIdAndDelete(id);

    if (!result) throw new NotFoundError();

    return result;
}

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