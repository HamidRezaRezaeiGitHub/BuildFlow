import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Share, MapPin, User, Calendar, FileText } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      {/* Project header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="touch-target">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Project Details</h1>
            <p className="text-muted-foreground">Loading project information...</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="touch-target">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button className="touch-target">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Mobile layout: single column with summary and tabs */}
      <div className="md:hidden space-y-6">
        {/* Mobile summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Project Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                No address available
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 mt-1 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                No owner assigned
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                No dates available
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="estimates">Estimates</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Project overview and details</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No project data available</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="estimates">
            <Card>
              <CardHeader>
                <CardTitle>Estimates</CardTitle>
                <CardDescription>Cost estimates for this project</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No estimates available</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle>Files</CardTitle>
                <CardDescription>Documents and attachments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No files available</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop layout: two-column with sticky sidebar */}
      <div className="hidden md:flex gap-6">
        {/* Left sticky summary */}
        <div className="w-80 sticky top-4 self-start">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Project Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Address</div>
                    <div className="text-sm text-muted-foreground">
                      No address available
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Owner</div>
                    <div className="text-sm text-muted-foreground">
                      No owner assigned
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Timeline</div>
                    <div className="text-sm text-muted-foreground">
                      No dates available
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right main content with tabs */}
        <div className="flex-1">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="estimates">Estimates</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                  <CardDescription>Detailed project information and status</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No project data available</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="estimates">
              <Card>
                <CardHeader>
                  <CardTitle>Project Estimates</CardTitle>
                  <CardDescription>Cost estimates and pricing breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No estimates available</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files">
              <Card>
                <CardHeader>
                  <CardTitle>Project Files</CardTitle>
                  <CardDescription>Documents, plans, and attachments</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No files available</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
