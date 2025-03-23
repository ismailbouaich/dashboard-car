import CarLoading from "@/components/ui/loading"

export default function LoadingDemo() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Car Rental</h1>
        <CarLoading text="Finding the best cars for you" />
      </div>
    </div>
  )
}