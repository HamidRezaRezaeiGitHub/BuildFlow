import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Shield, Palette, HelpCircle } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>Update your personal information and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" placeholder="Your company" />
            </div>
            <Button className="w-full touch-target">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Project Updates</div>
                <div className="text-sm text-muted-foreground">
                  Get notified about project changes
                </div>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Estimate Reminders</div>
                <div className="text-sm text-muted-foreground">Reminders for pending estimates</div>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full touch-target">
              Change Password
            </Button>
            <Button variant="outline" className="w-full touch-target">
              Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full touch-target">
              Active Sessions
            </Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>Customize the look and feel of the app</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm">
                  Light
                </Button>
                <Button variant="outline" size="sm">
                  Dark
                </Button>
                <Button variant="outline" size="sm">
                  Auto
                </Button>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Compact Mode</div>
                <div className="text-sm text-muted-foreground">
                  Use smaller spacing and components
                </div>
              </div>
              <Button variant="outline" size="sm">
                Toggle
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help & Support */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            <CardTitle>Help & Support</CardTitle>
          </div>
          <CardDescription>Get help and contact support</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="touch-target">
            View Documentation
          </Button>
          <Button variant="outline" className="touch-target">
            Contact Support
          </Button>
          <Button variant="outline" className="touch-target">
            Report a Bug
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
