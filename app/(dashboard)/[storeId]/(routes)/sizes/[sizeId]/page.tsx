import prismadb from "@/lib/prismadb";
import SizeForm from "./components/size-form";

interface SizePageProps {
  params: {
    sizeId: string;
  }
}


const SizePage: React.FC<SizePageProps> = async ({
  params,
}) => {

const { sizeId } = await params;


  const size = await prismadb.size.findUnique({
    where: {
      id: sizeId,
    },
  });

  return (
    <div className="flex-col m-10">
      <div className="flex-1 space-y-4 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default SizePage;
