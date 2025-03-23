
import { useState } from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
  CheckCircledIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

// Sample data based on the schema
const data = [
  {
    id: "3a7f1e9b-5c2d-4e8f-9a6b-1c3d5e7f9a8b",
    make: "Toyota",
    model: "Camry",
    year: 2022,
    license_plate: "ABC-1234",
    daily_rate: 45.99,
    is_available: true,
    image_url: "/placeholder.svg?height=80&width=120",
    created_at: "2023-01-15T08:30:00Z",
  },
  {
    id: "2b8e2f9c-6d3e-5f9g-0b7c-2d4e6f8g0h2i",
    make: "Honda",
    model: "Civic",
    year: 2021,
    license_plate: "XYZ-5678",
    daily_rate: 39.99,
    is_available: true,
    image_url: "/placeholder.svg?height=80&width=120",
    created_at: "2023-02-20T10:15:00Z",
  },
  {
    id: "4c9g3h1i-7j4k-8l5m-9n6o-3p7q9r1s3t5",
    make: "Ford",
    model: "Mustang",
    year: 2023,
    license_plate: "MUS-2023",
    daily_rate: 89.99,
    is_available: false,
    image_url: "/placeholder.svg?height=80&width=120",
    created_at: "2023-03-10T14:45:00Z",
  },
  {
    id: "5d0h4i2j-8k5l-9m6n-0o7p-4q8r0s2t4u6",
    make: "Tesla",
    model: "Model 3",
    year: 2022,
    license_plate: "EV-2022",
    daily_rate: 99.99,
    is_available: true,
    image_url: "/placeholder.svg?height=80&width=120",
    created_at: "2023-04-05T09:20:00Z",
  },
  {
    id: "6e1i5j3k-9l6m-0n7o-1p8q-5r9s1t3u5v7",
    make: "BMW",
    model: "X5",
    year: 2021,
    license_plate: "BMW-X5",
    daily_rate: 109.99,
    is_available: false,
    image_url: "/placeholder.svg?height=80&width=120",
    created_at: "2023-05-12T16:30:00Z",
  },
]

export function CarsTable() {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "image_url",
      header: "Image",
      cell: ({ row }) => (
        <div className="w-[80px]">
          <img
            src={row.getValue("image_url") || "/placeholder.svg"}
            alt={`${row.getValue("make")} ${row.getValue("model")}`}
            className="rounded-md object-cover"
            width={80}
            height={60}
          />
        </div>
      ),
    },
    {
      accessorKey: "make",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Make
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("make")}</div>,
    },
    {
      accessorKey: "model",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Model
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("model")}</div>,
    },
    {
      accessorKey: "year",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Year
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-center">{row.getValue("year")}</div>,
    },
    {
      accessorKey: "license_plate",
      header: "License Plate",
      cell: ({ row }) => <div>{row.getValue("license_plate")}</div>,
    },
    {
      accessorKey: "daily_rate",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Daily Rate
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-right">${row.getValue("daily_rate").toFixed(2)}</div>,
    },
    {
      accessorKey: "is_available",
      header: "Status",
      cell: ({ row }) => {
        const isAvailable = row.getValue("is_available")

        return (
          <div className="flex justify-center">
            {isAvailable ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                <CheckCircledIcon className="h-3.5 w-3.5" />
                Available
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
                <CrossCircledIcon className="h-3.5 w-3.5" />
                Rented
              </Badge>
            )}
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "created_at",
      header: "Added On",
      cell: ({ row }) => {
        return (
          <div className="text-sm text-muted-foreground">
            {format(new Date(row.getValue("created_at")), "MMM d, yyyy")}
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const car = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(car.id)}>Copy car ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit car</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Delete car</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filter makes..."
          value={table.getColumn("make")?.getFilterValue() ?? ""}
          onChange={(event) => table.getColumn("make")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Status <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={table.getColumn("is_available")?.getFilterValue()?.includes(true)}
                onCheckedChange={(value) => {
                  const filterValues = table.getColumn("is_available")?.getFilterValue() || []
                  if (value) {
                    table.getColumn("is_available")?.setFilterValue([...filterValues, true])
                  } else {
                    table.getColumn("is_available")?.setFilterValue(filterValues.filter((val) => val !== true))
                  }
                }}
              >
                Available
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("is_available")?.getFilterValue()?.includes(false)}
                onCheckedChange={(value) => {
                  const filterValues = table.getColumn("is_available")?.getFilterValue() || []
                  if (value) {
                    table.getColumn("is_available")?.setFilterValue([...filterValues, false])
                  } else {
                    table.getColumn("is_available")?.setFilterValue(filterValues.filter((val) => val !== false))
                  }
                }}
              >
                Rented
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id === "image_url"
                        ? "Image"
                        : column.id === "is_available"
                          ? "Status"
                          : column.id === "created_at"
                            ? "Added On"
                            : column.id.replace("_", " ")}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No cars found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

