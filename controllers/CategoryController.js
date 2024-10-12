import Category from '../models/Category.js'
import { authenticateAdmin } from '../helpers/Authenticate.js'

export function postCategory(req, res) {

    authenticateAdmin(req, res, "You don't have permission to creaet category item")

    const category = req.body

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
            res.json({
                "message": "Category creation failed",
                "error" :err
            })
        }
    )

}

export function deleteCategory(req, res){
    authenticateAdmin(req, res, "You don't have permission to delete category item")

    const name = req.params.name

    Category.findOneAndDelete({name:name}).then(
        () => {
            res.json({
                "message": "Category deleted!",
            })
        }
    ).catch(
        () => {
            res.json({
                "message": "Category deletation failed!",
            })
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

    authenticateAdmin(req, res, "You don't have permission to get category by name")

    const name = req.params.name

    Category.findOne({name:name}).then(
        (result)=>{
            if(result == null){
                req.json({
                    "message":"Category not found" 
                })
            }
            else{
                req.json({
                    category: result
                })
            }
        }
    ).then(
        ()=>{
            req.json({
                "message" : "Failed to get the category"
            })
        }
    )

}

export function getCategoryByPrice(req,res){

    authenticateAdmin(req, res, "You don't have permission to get category by name")

    const price = req.params.price

    Category.findOne({price:price}).then(
        (result)=>{
            if(result == null){
                req.json({
                    "message":"Category not found" 
                })
            }
            else{
                req.json({
                    category: result
                })
            }
        }
    ).then(
        ()=>{
            req.json({
                "message" : "Failed to get the category"
            })
        }
    )

}