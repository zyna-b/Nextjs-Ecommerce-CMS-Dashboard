import prismadb from "@/lib/prismadb";
import ColorForm from "./component/color-form";

interface ColorPageProps {
  params: {
    colorId: string;
  }
}


const ColorPage: React.FC<ColorPageProps> = async ({
  params,
}) => {

const { colorId } = await params;

  const color = await prismadb.color.findUnique({
    where: {
      id: colorId,
    },
  });

  return (
    <div className="flex-col m-10">
      <div className="flex-1 space-y-4 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorPage;
