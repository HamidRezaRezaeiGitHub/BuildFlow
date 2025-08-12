import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Package, Search, Filter, ChevronDown, Tag, DollarSign } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Catalog() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Work Items Catalog</h1>
          <p className="text-muted-foreground">
            Browse and manage your standard work items and pricing
          </p>
        </div>
        <Button className="touch-target w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Work Item
        </Button>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden space-y-6">
        {/* Mobile search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search work items..." className="pl-9" />
        </div>

        {/* Mobile collapsible sections - placeholder for categories */}
        <div className="space-y-4">
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No work items yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first work item to build your catalog
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Work Item
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop layout: sidebar + main content */}
      <div className="hidden md:flex gap-6">
        {/* Left filters sidebar */}
        <div className="w-64">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-9" />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <label className="text-sm font-medium mb-2 block">Categories</label>
                <div className="space-y-2 text-sm">
                  <div className="text-muted-foreground">No categories available</div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <div className="space-y-2">
                  <Input placeholder="Min price" type="number" />
                  <Input placeholder="Max price" type="number" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right main content */}
        <div className="flex-1">
          <div className="space-y-4">
            {/* Desktop toolbar */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                0 work items
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Tag className="mr-2 h-4 w-4" />
                  Sort by Category
                </Button>
              </div>
            </div>

            {/* Desktop table/grid */}
            <div className="border rounded-lg">
              <div className="bg-muted/50 border-b px-4 py-3">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium">
                  <div className="col-span-4">Name</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Unit</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2">Actions</div>
                </div>
              </div>
              <div className="p-4">
                {/* Empty state */}
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No work items yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add your first work item to build your catalog
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Work Item
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
