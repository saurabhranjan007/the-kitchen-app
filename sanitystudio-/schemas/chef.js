
export default {
    // general name
    name: "chef",  
    // sanity studio - name 
    title: "Chef",  
    // type of schema - based on which the studio layout will be decided everything in sanity studio starts with a parent type
    type: "document", 
    fields: [
        {
            name:"name",
            title:"Chef's name",
            type: "string", 
        },
        {
            name: "image",
            title: "Image",
            type: "image",
            options: {
                hotspot: true,
            }, 
        }, 
        {
            name: "bio",
            title: "Bio",
            type: "array", 
            of: [
                {
                    title: "Block",
                    type: "block",
                    styles: [{title: "Normal", value: "normal"}],
                    lists: [],   // will be dropdown of predefined values 
                }
            ]
            // to enable some sort of rich text editor option, we need to defien the parent type as "array" and child type as "block"
            // since based on these type Sanity will render a rich text editor block 
        }
    ]
}