import ShowDurationCalculator from '@/components/show-duration-calculator';

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Show Duration Calculator</h1>
      <ShowDurationCalculator />
    </div>
  );
}