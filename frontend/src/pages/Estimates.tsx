import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Calculator, Search, ChevronRight, Calendar, DollarSign } from 'lucide-react';

export default function Estimates() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Estimates</h1>
          <p className="text-muted-foreground">Create and manage project cost estimates</p>
        </div>
        <Button className="touch-target w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Estimate
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search estimates..." className="pl-9" />
        </div>
      </div>

      {/* Mobile list view - hidden on desktop */}
      <div className="space-y-3 md:hidden">
        {/* Empty state for now - no mock data */}
        <div className="text-center py-8">
          <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No estimates yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first estimate to get started
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Estimate
          </Button>
        </div>
      </div>

      {/* Desktop table view - hidden on mobile */}
      <div className="hidden md:block">
        <div className="border rounded-lg">
          <div className="bg-muted/50 border-b px-4 py-3">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium">
              <div className="col-span-4">Name</div>
              <div className="col-span-2">Created</div>
              <div className="col-span-2">Lines</div>
              <div className="col-span-2">Total</div>
              <div className="col-span-2">Actions</div>
            </div>
          </div>
          <div className="p-4">
            {/* Empty state for now - no mock data */}
            <div className="text-center py-8">
              <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No estimates yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first estimate to get started
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Estimate
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
