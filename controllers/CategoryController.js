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

export function getCategoryList(req, res) {

    Category.find().then(
        (list) => {
            res.json({
                list: list
            })
        }
    )
}