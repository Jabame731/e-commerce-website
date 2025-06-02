import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Image from "next/image";
import sampleData from "@/db/sample-data";
import ProductList from "@/components/shared/products/product-list";

const Home = () => {
  return (
    <>
      <ProductList
        data={sampleData.products}
        title="Newest Arrivals"
        limit={4}
      />
    </>
  );
};

export default Home;
