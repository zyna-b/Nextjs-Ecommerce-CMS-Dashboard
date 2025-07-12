import prismadb from "@/lib/prismadb";
import CategoryForm from "./components/category-form";




const CategoryPage = async ({
  params
}:{
  params: { storeId: string; categoryId: string };
}) => {

const { categoryId, storeId } = await params;


  const category = await prismadb.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: storeId,
    }
  })

  return (
    <div className="flex-col m-10">
      <div className="flex-1 space-y-4 pt-6">
        <CategoryForm 
        initialData={category}
        billboards={billboards}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
