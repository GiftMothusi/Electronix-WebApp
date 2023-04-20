import React from "react";
import {
  Layout,
  Product,
  FooterBanner,
  Footer,
  Navbar,
  HeroBanner,
  Cart,
} from "../components";
import { client } from "../lib/client";

const Home = ({ products, bannerData }) => {
  return (
    <>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]} />

      <div className="products-heading">
        <h2>Best Selling Products</h2>
        <p>Speakers of many variations</p>
      </div>
      <div className="products-container">
        {products?.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
      <FooterBanner footerBanner={bannerData && bannerData[0]} />
    </>
  );
};

//fetching data from Sanity
export const getServerSideProps = async () => {
  const query = `*[_type == "product"]`; // return all products from our sanity dashboard
  const products = await client.fetch(query); //fetching data from Sanity

  const bannerQuery = `*[_type == "banner"]`; // return all products from our sanity dashboard
  const bannerData = await client.fetch(bannerQuery); //fetching data from Sanity

  return {
    props: {
      products,
      bannerData,
    },
  };
};

export default Home;
