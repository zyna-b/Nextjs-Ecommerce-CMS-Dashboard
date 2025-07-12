import prismadb from "@/lib/prismadb";
import ProductForm from "./components/product-form";

interface ProductPageProps {
  params: {
    productId: string;
    storeId: string;
  }
}


const ProductPage: React.FC<ProductPageProps> = async ({
  params,
}) => {

const {  productId, storeId } = await params;


  const product = await prismadb.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      images: true,
    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: storeId,
    },
  });
  const colors = await prismadb.color.findMany({
    where: {
      storeId: storeId,
    },
  });
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: storeId,
    },
  });

  

  return (
    <div className="flex-col m-10">
      <div className="flex-1 space-y-4 pt-6">
        <ProductForm 
        categories={categories}
        colors={colors}
        sizes={sizes}
        initialData={product} />
      </div>
    </div>
  );
};

export default ProductPage;
