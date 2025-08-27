import ProductCarousel from "@/components/shared/products/product-carousel";
import ProductList from "@/components/shared/products/product-list";
import ViewAllProductsButton from "@/components/view-all-products-button";

import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/actions/product.actions";

const Home = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList data={latestProducts} title="Newest Arrivals" />
      <ViewAllProductsButton />
    </>
  );
};

export default Home;
