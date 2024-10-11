import Category from '../models/Category.js'
import { authenticateAdmin } from '../helpers/Authenticate.js'

export function postCategory(req, res) {

    authenticateAdmin(req, res, "You don't have permission to creaet category item")

    const category = req.body

    // check if category name available
    const categoryAvailable = Category.findOne({'name': category.name})
    if(categoryAvailable){
        res.json({
            "message": "Category name '" + category.name + "' already exist in the database"
        })
    }
    
    const newCategory = new Category(category)

    newCategory.save().then(
        () => {
            res.json({
                "message": "Category created!"
            })
        }
    ).catch(
        () => {
            res.json({
                "message": "Category creation failed"
            })
        }
    )

}


export function getCategoryList(req, res){

    Category.find().then(
        (list) => {
            res.json({
                list: list
            })
        }
    )
}