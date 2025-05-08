const Category = require('../models/category.model');

const categoryController = {

    // Add category
    saveCategory: async (req, res) => {
        try {
        const {id, name, description, slug} = req.body;

        // Check if category already exists
        const existingCategory = await Category.findOne({name});
        if(existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        // Create new category
        const category = new Category({
            id,
            name,
            description,
            slug
        });

        await category.save();

        res.status(201).json({ message: 'Category saved successfully '});
        } catch (error) {
        res.status(500).json({ message: 'Error saving category', error: error.message });  
        }
    },

    // Get All Categories
    getCategories: async (req, res) => {
        try {
            const data = await Category.find();
            if(data) {
                return res.status(200).json({ message: 'Categories found!', data: data });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error getting category', error: error.message });    
        }
    }
}

module.exports = categoryController;