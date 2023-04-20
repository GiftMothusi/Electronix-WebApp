import React, { useState } from "react";
import { urlFor, client } from "../../lib/client";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { Product } from "../../components";
import { useStateContext } from "../../context/StateContext";

const ProductDetails = ({ product, products }) => {
  const { image, name, details, price } = product;

  //state for selected image on product carousel
  const [indexSelected, setIndexSelected] = useState(0);

  //destructure our states
  const { increaseQty, decreaseQty, qty, onAddToCart, setShowCart } =
    useStateContext();

  //buy now button routes the item to cart and adds it to the cart
  const handleBuyNow = () => {
    onAddToCart(product, qty);
    setShowCart(true);
  };

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img
              key={indexSelected}
              src={urlFor(image && image[indexSelected])}
              className="product-detail-image"
              alt={name}
            />
          </div>
          <div className="small-images-container">
            {image?.map((item, index) => (
              <img
                key={index}
                src={urlFor(item)}
                className={
                  index === indexSelected
                    ? "small-image selected-image"
                    : "small-image"
                }
                onMouseEnter={() => setIndexSelected(index)}
              />
            ))}
          </div>
        </div>
        <div className="product-detail-desc">
          <h1 className="">{name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(16)</p>
          </div>
          <h4>Details:</h4>
          <p>{details}</p>
          <p className="price">R {price}</p>
          <div className="quantity">
            <h3>Quantity:</h3>
            <p className="quantity-desc">
              <span className="minus" onClick={decreaseQty}>
                <AiOutlineMinus />
              </span>
              <span className="num">{qty}</span>
              <span className="plus" onClick={increaseQty}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <div className="buttons">
            <button
              type="button"
              className="add-to-cart"
              onClick={() => onAddToCart(product, qty)}
            >
              Add to Cart
            </button>
            <button type="button" className="buy-now" onClick={handleBuyNow}>
              Buy now
            </button>
          </div>
        </div>
      </div>
      {/* Other recommended products section  */}
      <div className="maylike-products-wrapper">
        <h2> Shop More </h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/*This tells next js to keep paths of product images on the index page so that they 
get pre-rendered should a user click on any product image on index page: REMEMBER Slug in Sanity essentially
is just a url*/
export const getStaticPaths = async () => {
  const query = `*[_type == "product" ]{
        slug{
            current
        }
    }`;
  const products = await client.fetch(query);
  const paths = products.map((product) => ({
    params: {
      slug: product.slug.current,
    },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`; // only return the product details of the product selected in the index page
  const productsQuery = '*[_type == "product"]'; //also fetch the other products

  const product = await client.fetch(query); //fetching data from Sanity
  const products = await client.fetch(productsQuery);

  return {
    props: {
      products,
      product,
    },
  };
};

export default ProductDetails;
