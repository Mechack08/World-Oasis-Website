import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { Suspense } from "react";

interface CabinProps {
  params: { cabinId: string };
}

export async function generateMetadata({ params }: CabinProps) {
  const { name } = await getCabin(Number(params.cabinId));

  return { title: `Cabin ${name}` };
}

export async function generateStaticParams({ params }: CabinProps) {
  const cabins = await getCabins();

  const ids = cabins.map((cabin) => ({ cabinId: String(cabin.id) }));

  return ids;
}

// export const revalidate = 0;

export default async function Page({ params }: CabinProps) {
  const cabin = await getCabin(Number(params.cabinId));

  const { name } = cabin;

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />

      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {name} today. Pay on arrival.
        </h2>
      </div>

      <Suspense fallback={<Spinner />}>
        <Reservation cabin={cabin} />
      </Suspense>
    </div>
  );
}
