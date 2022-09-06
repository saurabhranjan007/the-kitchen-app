
import { sanityClient } from "../../lib/sanity";

sanityClient.config({
    token: "process.env.SANITY_WRITE_TOKEN", 
    // having a write token here, so every time the button is clicked it will write to the client and update that in sanity studio 
}); 

export default async function likeButtonHandler(req, res) {

    const { _id } = JSON.parse(req.body);  // setting the "id" as request body +

    const data = await sanityClient
                        .patch(_id)
                        .setIfMissing({ likes: 0 })  // sets the likes count to zero if the like information is missing 
                        .inc({ likes: 1 })  // increment the likes by 1, everytime it is clicked 
                        .commit()  // commit the actions 
                        .catch((error) => console.log(error))

    res.status(200).json({ likes: data.likes })
}

