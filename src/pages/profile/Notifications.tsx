
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

const Notifications = () => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [groupAlerts, setGroupAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [marketingAlerts, setMarketingAlerts] = useState(false);

  const Header = (
    <div className="p-4 flex items-center space-x-4">
      <Link to="/profile">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <h1 className="text-xl font-bold">Arifa</h1>
    </div>
  );

  return (
    <AppLayout header={Header}>
      <div className="p-4 max-w-lg mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-secondary rounded-full p-4 mb-4">
            <Bell className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Njia za Arifa</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Arifa za Programu</h3>
                <p className="text-sm text-gray-500">Pokea arifa kwenye programu</p>
              </div>
              <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Barua Pepe</h3>
                <p className="text-sm text-gray-500">Pokea arifa kupitia barua pepe</p>
              </div>
              <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">SMS</h3>
                <p className="text-sm text-gray-500">Pokea arifa kupitia ujumbe mfupi</p>
              </div>
              <Switch checked={smsEnabled} onCheckedChange={setSmsEnabled} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Aina za Arifa</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Malipo</h3>
                <p className="text-sm text-gray-500">Arifa kuhusu malipo na miamala</p>
              </div>
              <Switch checked={paymentAlerts} onCheckedChange={setPaymentAlerts} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Vikundi</h3>
                <p className="text-sm text-gray-500">Arifa kuhusu shughuli za vikundi</p>
              </div>
              <Switch checked={groupAlerts} onCheckedChange={setGroupAlerts} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Usalama</h3>
                <p className="text-sm text-gray-500">Arifa kuhusu usalama wa akaunti</p>
              </div>
              <Switch checked={securityAlerts} onCheckedChange={setSecurityAlerts} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Matangazo</h3>
                <p className="text-sm text-gray-500">Matangazo na matoleo mapya</p>
              </div>
              <Switch checked={marketingAlerts} onCheckedChange={setMarketingAlerts} />
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Notifications;
