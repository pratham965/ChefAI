import { useState, useEffect, useRef } from "react"
import Recipe from "./Recipe"

export default function Main() {

    const [ingredients, setIngredients] = useState([])
    const [recipe, setRecipe] = useState("")
    const [loading, setLoading] = useState(false)
    const refSection = useRef(null)

    const ingList = ingredients.map((el, id) => {
        return (
            <div onClick={() => removeIngredient(id)} className="element-div" key={id}>
                <button>X</button>
                <li>{el}</li>
            </div>
        )
    })

    useEffect(() => {
        if (recipe && refSection.current) {
            refSection.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [recipe])

    async function recipeButton() {
        try {
            setLoading(true)
            const recipeMarkdown = await fetch("http://localhost:3000/api/recipe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ingredients: ingredients })
            })
            const recipeData = await recipeMarkdown.json()
            setRecipe(recipeData.recipe)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            setRecipe("An error occured. Please try again...")
        }

    }

    function removeIngredient(id) {
        setIngredients(ingredients.filter((_, index) => index !== id));
    }

    function submit(formData) {
        const newIngredient = formData.get("ingredient").toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
        if (newIngredient && !ingredients.includes(newIngredient)) {
            setIngredients([...ingredients, newIngredient]);
        }
    }

    return (
        <main>
            <form className="input-form" action={submit}>
                <input type="text" placeholder="e.g. cheese" name="ingredient" required />
                <button>Add Ingredient</button>
            </form>
            {ingList.length > 0 && <section>
                <h2>Ingredients on hand:</h2>
                <ul className="ingredients-list">{ingList}</ul>
                {ingList.length >= 3 && <div className="get-recipe" ref={refSection} >
                    <div>
                        <h3>Ready for a recipe?</h3>
                        <p>Generate a recipe from your list of ingredients.</p>
                    </div>
                    <button onClick={recipeButton}>Get a recipe</button>
                </div>}
            </section>}
            {loading && <div className="loading-overlay"><div className="loading-spinner"></div></div>}
            {recipe && <Recipe recipe={recipe} />}
        </main>

    )
}