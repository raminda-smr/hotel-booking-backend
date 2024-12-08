import Category from '../models/Category.js'
import { authenticateAdmin } from '../helpers/Authenticate.js'
import Room from '../models/Room.js'
import config from '../config/config.js'
import { generatePagination } from '../helpers/Paginate.js'

export function postCategory(req, res) {

    const authenticated = authenticateAdmin(req, res, "You don't have permission to create category item")
    if(!authenticated){
        return // stop processing
    }

    const category = req.body

    // remove all padding spaces
    category["name"] = req.body.name.trim()

    const newCategory = new Category(category)

    newCategory.save().then(
        (result) => {
            res.json({
                "message": "Category created!",
                "result" : result
            })
        }
    ).catch(
        (err) => {
            if(err !=null){
                res.json({
                    "message": "Category creation failed",
                    "error" :err
                })
            }
        }
    )

}

export function deleteCategory(req, res){

    const authenticated = authenticateAdmin(req, res, "You don't have permission to delete category item")
    if(!authenticated){
        return // stop processing
    }

    const name = req.params.name

    Category.findOneAndDelete({name:name}).then(
        (res) => {
            if(res){
                res.json({
                    "message": "Category deleted!",
                })
            }
        }
    ).catch(
        (err) => {
            if(err != undefined){
                res.status(500).json({
                    "message": "Category deletation failed!",
                })
            }
        }
    )
}

export function updateCategory(req, res){

    const authenticated = authenticateAdmin(req, res, "You don't have permission to update category item")
    if(!authenticated){
        return // stop processing
    }

    const name = req.params.name

    const category = req.body

    // Name cannot be updated
    category.name = name


    Category.findOneAndUpdate({name:name},category ).then(
        (result) => {
            if(result){
                res.json({
                    "message": "Category updated!",
                })
            }
            
        }
    ).catch(
        (err) => {
            if(err != undefined){
                res.json({
                    "message": "Category update failed!",
                })
            }
        }
    )
}


export function getCategoryList(req, res) {

    const perPage = config.pagination.perPage || 10; // Default items per page
    const pageGap = config.pagination.pageGap || 2; // Default page gap
    const currentPage = parseInt(req.query.page) || 1; // Current page from query param

    Category.countDocuments()
        .then(totalItems => {
            const pagination = generatePagination(currentPage, totalItems, perPage, pageGap);

            return Category.find()
                .sort({ name: -1 })
                .skip((currentPage - 1) * perPage)
                .limit(perPage)
                .then(
                    (list) => {
                        res.json({
                            list,
                            pagination
                        })
                    }
                )
        })
        .catch(err => {
            res.status(500).json({ error: "Failed to get categories", details: err.message })
        })

}

export function getCategoryListWithRooms(req, res) {

    async function getData(req, res){
        try {
            const list = await Category.find() // Get all categories
            
            if (list) {
                // Use Promise.all to resolve all room queries
                const updatedList = await Promise.all(
                    list.map(async (category) => {
                        const rooms = await Room.find({ category: category.name })
                        return { ...category._doc, rooms } // Include `rooms` in the category data
                    })
                )
    
                return res.json({ list: updatedList })
            }
    
            res.json({ list: [] }) // If no categories found, return an empty list
        } catch (error) {
            // console.error("Error fetching categories with rooms:", error)
            res.status(500).json({ error: "An error occurred while fetching data." });
        }
    }

    getData(req, res)
   
}


export function getCategoryByName(req,res){

    const name = req.params.name

    Category.findOne({name:name}).then(
        (result)=>{
            if(result == null){
                res.json({
                    "message":"Category not found" 
                })
            }
            else{
                res.json({
                    category: result
                })
            }
            return
        }
    ).then(
        (err)=>{
            if(err != undefined){
                res.json({
                    "message" : "Failed to get the category"
                })
            }
            
        }
    )

}

export function getCategoryByPrice(req,res){

    
    const price = req.params.price

    Category.findOne({price:price}).then(
        (result)=>{
            if(result == null){
                res.json({
                    "message":"Category not found" 
                })
            }
            else{
                res.json({
                    category: result
                })
            }
            return
        }
    ).then(
        (err)=>{
            if(err != undefined){
                res.json({
                    "message" : "Failed to get the category"
                })
            }
            
        }
    )

}