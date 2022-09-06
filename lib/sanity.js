
import  { createClient, createPreviewSubscriptionHook, createPortableTextComponent } from "next-sanity";
import createImageUrlBuilder from '@sanity/image-url' 
import { PortableText as PortableTextComponent } from '@portabletext/react'



// generic way to access some imp. information that is to be used thro-out 
const config = {
    projectId: "lc5h99um",
    dataset: "production",
    apiVersion: "2021-10-21",  
    // API keeps updating and in order to not alter our application behaviour with the new releases, we need to specify the version. 
    useCdn: false, 
    // gives the option to choose from a CDN(global cache network) or from our content lake(here Sanity)
}


// creating sanity client to integrate the application 
export const sanityClient = createClient(config); 

// preview subscription 
export const usePreviewSubscription = createPreviewSubscriptionHook(config); 

// source - here is the asset data that we're querring from the content lake 
export const urlFor = (source) => createImageUrlBuilder(config).image(source); 

// export const PortableText = createPortableTextComponent({
//     ...config, // to copy 
//     serializers: {},
// }); 

export const PortableText = (props) => <PortableTextComponent components={{}} {...props} />
