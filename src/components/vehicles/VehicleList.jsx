import { DataTable } from "@/components/data-table/data-table"
import { carColumns } from "@/components/data-table/columns"
import { carsData } from "@/components/data-table/mock-data"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "@radix-ui/react-icons"


const VehicleList = () => {
  return (
    <div className="container mx-auto py-10">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cars Inventory</h1>
        <p className="text-muted-foreground mt-1">Manage your rental fleet and vehicle information</p>
      </div>
      <Button className="flex items-center gap-1">
        <PlusIcon className="h-4 w-4" />
        Add New Car
      </Button>
    </div>

    <div className="border rounded-lg p-4 bg-white">
      <DataTable data={carsData} columns={carColumns} filterColumn="make" filterPlaceholder="Filter makes..." />
    </div>
  </div>
  )
}

export default VehicleList