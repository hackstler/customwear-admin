const products = require ('./products.json')
console.log("🚀 ~ products:", products)
const productsInformation = require ('./productsinformation.json')
const productsImages = require ('./productimages.json')


const templateObject =  {
    "id": "id",
    "title": "nombre",
    "description": "descripcion",
    "thumbnail": "",
    "weight": 400,
    "discount": true,
    "variantTitle": "One size",
    "variantInventory": 100,
    "variantAllowBackorder": false,
    "variantManage": true,
    "priceEur": 10,
    "priceUSD": 11,
    "optionName": "size",
    "optionValue": "S",
    "imageUrl1": "url",
    "imageUrl2": "url"
  }


const generateObjectWithTemplatePorducts =(products)=>{

   const productsWithTemplate = products.map((product)=>{
        const newProductWithTemplate = {...templateObject}
        newProductWithTemplate.id = product.id
        newProductWithTemplate.weight = product.weight
        newProductWithTemplate.priceEur = product.retailPrice
        newProductWithTemplate.priceUSD = product.retailPrice
        return newProductWithTemplate
    })
    
    return productsWithTemplate
}


const addProductInformation = (productsWithTemplate, productsInformation)=>{

    return productsWithTemplate.map((product)=>{
        const productInfo = productsInformation.find((productInfo)=>productInfo.id === product.id)
        if(productInfo){
            product.title = productInfo.name
            product.description = productInfo.description
            return product
        } 
    })

}

const addProductImages =(productsWithInfo, productsImages)=>{

    return productsWithInfo.map((product)=>{
        const productImages = productsImages.find((productImages)=> product.id === productImages.id)
        if(productImages){
            product.thumbnail = productImages.images[0]?.url ? productImages.images[0]?.url : "https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png"
            product.imageUrl1 = productImages.images[1]?.url ? productImages.images[1]?.url : "https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png"
            product.imageUrl2 = productImages.images[2]?.url ? productImages.images[2]?.url : "https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png"
            return product
        }
    })

}


const productsWithTemplate = generateObjectWithTemplatePorducts(products)
const productsWithInformation = addProductInformation(productsWithTemplate, productsInformation)
const completeProducts = addProductImages(productsWithInformation, productsImages)
console.log("🚀 ~ completeProducts:", completeProducts)
