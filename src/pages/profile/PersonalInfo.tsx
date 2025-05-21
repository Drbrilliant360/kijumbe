
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const PersonalInfo = () => {
  const { userName, userEmail, loading } = useUserProfile();

  const Header = (
    <div className="p-4 flex items-center space-x-4">
      <Link to="/profile">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <h1 className="text-xl font-bold">Taarifa Zangu</h1>
    </div>
  );

  const profileCompletionPercentage = () => {
    let complete = 0;
    let total = 3; // Name, email, phone

    if (userName) complete++;
    if (userEmail) complete++;
    if (true) complete++; // Placeholder for phone number 

    return (complete / total) * 100;
  };

  return (
    <AppLayout header={Header}>
      <div className="p-4 max-w-lg mx-auto">
        <Card className="shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${userName || 'user'}`} alt={userName} />
                <AvatarFallback>{userName?.substring(0, 2) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{userName || "User"}</h2>
                <p className="text-gray-500">{userEmail || "No email provided"}</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Ukamilishaji wa wasifu</span>
                <span>{Math.round(profileCompletionPercentage())}%</span>
              </div>
              <Progress value={profileCompletionPercentage()} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Taarifa za Msingi</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Jina kamili</span>
                <span className="font-medium">{userName || "Hajaweka"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Barua pepe</span>
                <span className="font-medium">{userEmail || "Hajaweka"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Namba ya simu</span>
                <span className="font-medium">+255 678 123456</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/mpangilio/edit-profile">Hariri Taarifa</Link>
            </Button>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Mipangilio ya Akaunti</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Lugha</span>
                <span className="font-medium">Kiswahili</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Nchi</span>
                <span className="font-medium">Tanzania</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/mpangilio/language">Badilisha Mipangilio</Link>
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PersonalInfo;
