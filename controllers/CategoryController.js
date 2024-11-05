import Category from '../models/Category.js'
import { authenticateAdmin } from '../helpers/Authenticate.js'

export function postCategory(req, res) {

    authenticateAdmin(req, res, "You don't have permission to create category item")

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

    authenticateAdmin(req, res, "You don't have permission to delete category item")

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

    authenticateAdmin(req, res, "You don't have permission to update category item")

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

    Category.find().then(
        (list) => {
            res.json({
                list: list
            })
        }
    )
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