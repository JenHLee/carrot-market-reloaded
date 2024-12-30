'use server'

export async function uploadProduct(formData: FormData) {
    const data ={
        title : formData.get("title"),
        photo : formData.get("photo"),
        price : formData.get("price"),
        description : formData.get("description")
    };
    console.log(data);
}
