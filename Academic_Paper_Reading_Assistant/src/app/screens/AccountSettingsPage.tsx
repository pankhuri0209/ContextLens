import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, User, Shield, Link as LinkIcon, CreditCard, ArrowLeft, Camera, Check, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

export function AccountSettingsPage() {
  const { user, updateProfile, logout } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [preferences, setPreferences] = useState({
    emailNewPapers: true,
    emailProcessingComplete: true,
    emailReadingReminders: false,
    emailProductUpdates: false,
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({
        fullName: profileData.fullName,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    // Password change logic
    console.log('Change password');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/projects" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Projects</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-[#2563EB]" />
            <span className="font-semibold text-xl">PhD Reader</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <LinkIcon className="w-4 h-4 mr-2" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="preferences">
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

              <div className="space-y-6">
                {/* Avatar */}
                <div>
                  <Label className="mb-3 block">Profile Photo</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="text-xl bg-[#2563EB] text-white">
                        {getInitials(user?.fullName || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Camera className="w-4 h-4 mr-2" />
                        Change Photo
                      </Button>
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      value={profileData.email}
                      disabled
                      className="flex-1"
                    />
                    {user?.verified && (
                      <div className="flex items-center gap-1 text-green-600 text-sm">
                        <Check className="w-4 h-4" />
                        Verified
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    <button className="text-[#2563EB] hover:underline">Change email address</button>
                  </p>
                </div>

                {/* ORCID */}
                {user?.orcidId && (
                  <div className="space-y-2">
                    <Label>ORCID iD</Label>
                    <div className="flex items-center gap-2">
                      <Input value={user.orcidId} disabled />
                      <div className="flex items-center gap-1 text-green-600 text-sm whitespace-nowrap">
                        <Check className="w-4 h-4" />
                        Connected
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Disconnect</Button>
                  </div>
                )}

                {/* Research Profile */}
                <div className="space-y-2">
                  <Label>Research Profile</Label>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Field:</span>{' '}
                      <span className="font-medium">{user?.researchField || 'Not set'}</span>
                    </div>
                    {user?.researchArea && (
                      <div>
                        <span className="text-gray-600">Area:</span>{' '}
                        <span className="font-medium">{user.researchArea}</span>
                      </div>
                    )}
                    {user?.researchTopics && user.researchTopics.length > 0 && (
                      <div>
                        <span className="text-gray-600">Topics:</span>{' '}
                        <span className="font-medium">{user.researchTopics.join(', ')}</span>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm">Edit Research Profile</Button>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                  </Button>
                  {saved && (
                    <div className="flex items-center text-green-600 text-sm">
                      <Check className="w-4 h-4 mr-1" />
                      Changes saved successfully
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-xl font-semibold mb-6">Security Settings</h2>

              <div className="space-y-6">
                {/* Change Password */}
                <div>
                  <Label className="text-lg font-medium mb-4 block">Password</Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Last changed: 30 days ago
                  </p>
                  <Button variant="outline">Change Password</Button>
                </div>

                <Separator />

                {/* Two-Factor Auth */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Label className="text-lg font-medium mb-2 block">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                      <span className="text-sm text-gray-600">Disabled</span>
                    </div>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>

                <Separator />

                {/* Active Sessions */}
                <div>
                  <Label className="text-lg font-medium mb-4 block">Active Sessions</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium">Chrome on Mac</p>
                        <p className="text-sm text-gray-600">Current session</p>
                      </div>
                      <span className="text-sm text-green-600">Active now</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium">Safari on iPhone</p>
                        <p className="text-sm text-gray-600">2 hours ago</p>
                      </div>
                      <Button variant="ghost" size="sm">Revoke</Button>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-4">View All Sessions</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-xl font-semibold mb-6">Connected Services</h2>

              <div className="space-y-4">
                {/* Google Scholar */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Google Scholar</p>
                      {user?.googleScholarConnected ? (
                        <>
                          <p className="text-sm text-green-600 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Connected - Last synced 2 hours ago
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-600">Not connected</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {user?.googleScholarConnected ? (
                      <>
                        <Button variant="outline" size="sm">Sync Now</Button>
                        <Button variant="ghost" size="sm">Disconnect</Button>
                      </>
                    ) : (
                      <Button variant="outline" size="sm">Connect</Button>
                    )}
                  </div>
                </div>

                {/* ORCID */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <LinkIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">ORCID</p>
                      {user?.orcidId ? (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Connected
                        </p>
                      ) : (
                        <p className="text-sm text-gray-600">Not connected</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {user?.orcidId ? (
                      <Button variant="ghost" size="sm">Disconnect</Button>
                    ) : (
                      <Button variant="outline" size="sm">Connect</Button>
                    )}
                  </div>
                </div>

                {/* Zotero */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <LinkIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Zotero</p>
                      <p className="text-sm text-gray-600">Not connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>

                {/* Mendeley */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <LinkIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Mendeley</p>
                      <p className="text-sm text-gray-600">Not connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New relevant papers</p>
                    <p className="text-sm text-gray-600">Weekly digest of papers in your field</p>
                  </div>
                  <Switch
                    checked={preferences.emailNewPapers}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, emailNewPapers: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Paper processing complete</p>
                    <p className="text-sm text-gray-600">Get notified when papers finish processing</p>
                  </div>
                  <Switch
                    checked={preferences.emailProcessingComplete}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, emailProcessingComplete: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Reading reminders</p>
                    <p className="text-sm text-gray-600">Reminders to continue reading</p>
                  </div>
                  <Switch
                    checked={preferences.emailReadingReminders}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, emailReadingReminders: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Product updates</p>
                    <p className="text-sm text-gray-600">News about features and improvements</p>
                  </div>
                  <Switch
                    checked={preferences.emailProductUpdates}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, emailProductUpdates: checked })
                    }
                  />
                </div>

                <div className="pt-4">
                  <Button>Save Preferences</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
