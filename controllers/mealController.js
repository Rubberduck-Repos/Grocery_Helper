function searchMeal(req, res){
    res.render("meal", {text: "This is how to make " + req.body.meal})
}

module.exports = {
    searchMeal
}