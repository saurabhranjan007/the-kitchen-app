
import { sanityClient, urlFor, usePreviewSubscription, PortableText } from '../../lib/sanity'; 
import { useState } from 'react';
import { useRouter } from 'next/router';

// we need to query specific slug based upon the user input 
const recipeQuery = `*[_type == "recipe" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    mainImage, 
    // mainImage{
    //     asset->{
    //         _id,
    //         url
    //     }
    // },
    ingredient[]{
        unit,
        wholeNumber,
        fraction,
        ingredient->{
            name
        }
    },
    instructions,
    likes,
}`;
// here grabbing the first item from the array of slug the one that is clicked on and also grabbind other data 

// Template for individual recipe.. 
export default function OneRecipe({ data, preview }) {

    // Adding a loading tab if the page has not been generated for those scenarios (since we already have set "fallback: true")
    const router = useRouter();

    if (router.isFallback) {
        return (
            <div>Loading....</div>
        )
    }

    // enabling the preview - this will allow us to see the content on the app before it goes live 
    // It works by replacing the current content from the live app and replacing that with editing content 
    const { data: recipe } = usePreviewSubscription(recipeQuery, {
        params: { slug: data.recipe?.slug.current},
        initialData: data,
        enabled: preview, 
    }); 

    // The like button 
    const [likes, setLikes] = useState(data?.recipe?.likes); 

    const addLike = async () => {

        const res = await fetch("/api/handle-like.js", {
            method: "POST", 
            body: JSON.stringify({ _id: recipe._id }), 
        }).catch((error) => console.log(error))
        
        const data = await res.json();
        setLikes(data.likes); 
    }

    // const { recipe } = data; 

    return (
        // creating template for individual recipe items.. 
        <article className='recipe'>
            <h1> {recipe.name} </h1>
            {/* The Like Button */}
            <button className='like-button' onClick={addLike}> {likes} 💗 </button>
            <main className='content'>
                {/* <img src={recipe.mainImage} alt={recipe.name} /> */}
                <img src={urlFor(recipe?.mainImage).url()} />
                <div className='breakdown'>
                    <ul className='ingredients'>
                        {recipe.ingredient?.map((ingredient) => (
                            <li className='ingredient' key={ingredient._key}>
                                {ingredient?.wholeNumber} {"*"}
                                {ingredient?.fraction} {" "}
                                {ingredient?.unit}
                                <br />
                                {ingredient?.ingredient?.name}
                            </li>
                        ))}
                    </ul>
                    {/* <h3> Instructions here </h3> */}
                    {/* "PortableText" - maps over the blocks (instrcution blocks in our case) and then converts them into React Components */}
                    {/* It will also fetch the stylings that the block might have like strong, italic and all and renders those blocks with these stylings */}
                    <PortableText 
                        className='instructions' 
                        blocks={recipe?.instructions} 
                    />

                </div>
            </main>
        </article>
    )
}

// fetch routes (dynamic - potential dynamic)
export async function getStaticPaths() {

    const paths = await sanityClient.fetch( 
        // getting all the slugs that could be potential path (pulls out the current path for slugs - "slug": slug.current)
        `*[_type == "recipe" && defined(slug.current)] {
            "params": {
                "slug": slug.current
            }
        }`
    );

    return {
        paths,
        fallback: true  
        // >> if "false" then any path not returned in the "getStaticPaths" will result in 404, 
        // >> when "true" - it will fallback to a version of the page with the previous(or first) request of the path and if path is found 
        //                  then that path will be rendered and will also get added as a static path for future requests 
    }
}

// from "getStaticPaths" - we need to pass "params" and the "slug" here 'coz we will need these in order pull out correct content(data) 
export async function getStaticProps({ params }) {

    const { slug } = params; 
    // this declaration should match with the naming convention of the dynamic file that we have  
    // so if we have " [recipe].js " - then this should be " const { recipe } = params "
     
    const recipe = await sanityClient.fetch(recipeQuery, {slug})  // getting the recipe data from sanity

    return{ props: { data: { recipe }, preview: true } }; 
}
