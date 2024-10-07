function searchMeal(req, res){
    input = req.body.meal
    res.render("meal", {text: "This is how to make " + input})
}

module.exports = {
    searchMeal
}